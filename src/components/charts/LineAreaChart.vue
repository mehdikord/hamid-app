<template>
  <div class="chart-container">
    <v-chart 
      :option="chartOption" 
      :style="{ height: chartHeight, width: '100%' }"
      autoresize
    />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  name: 'LineAreaChart',
  components: {
    VChart
  },
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.setChartHeight();
    window.addEventListener('resize', this.setChartHeight);
    this.updateChart();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setChartHeight);
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart();
      },
      deep: true
    }
  },
  data() {
    return {
      chartHeight: '400px',
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            if (params && params.length > 0) {
              const param = params[0];
              return `${param.axisValue}<br/>${param.seriesName}: ${this.formatAmount(param.value)} تومان`;
            }
            return '';
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '12%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            interval: 'auto',
            rotate: 0,
            formatter: (value) => {
              // Truncate long dates if needed
              if (value && value.length > 10) {
                return value.substring(0, 10);
              }
              return value;
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: (value) => {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
              return value.toString();
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [
          {
            name: 'مبلغ فروش',
            type: 'line',
            areaStyle: {
              opacity: 0.3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#64B5F6' },
                  { offset: 1, color: 'rgba(100, 181, 246, 0.1)' }
                ]
              }
            },
            lineStyle: {
              color: '#64B5F6',
              width: 3
            },
            itemStyle: {
              color: '#64B5F6'
            },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    formatAmount(amount) {
      if (!amount) return '0';
      return this.$filters ? this.$filters.number_format(amount) : amount.toLocaleString('fa-IR');
    },
    updateChart() {
      if (!this.chartData || this.chartData.length === 0) {
        this.chartOption.xAxis.data = [];
        this.chartOption.series[0].data = [];
        return;
      }

      // Extract dates and amounts from chartData
      // Convert dates to Jalali format
      const dates = this.chartData.map(item => {
        if (!item.date) return '';
        // Parse the date (format: "2025/11/10" or similar)
        // Convert to Jalali using the helper
        try {
          // The date from API is in Gregorian format, parse it with moment
          const dateObj = moment(item.date, 'YYYY/MM/DD');
          // Format to Jalali using the helper
          return this.$filters ? this.$filters.date_jalali(dateObj, 'jYYYY/jM/jD') : item.date;
        } catch (e) {
          // If parsing fails, return original date
          return item.date;
        }
      });
      const amounts = this.chartData.map(item => item.amount || 0);

      // Update chart data
      this.chartOption.xAxis.data = dates;
      this.chartOption.series[0].data = amounts;
      
      // Adjust x-axis interval based on data count to prevent stacking
      const dataCount = dates.length;
      if (dataCount > 30) {
        // For monthly data (30+ points), show every 5th label
        this.chartOption.xAxis.axisLabel.interval = Math.floor(dataCount / 15);
      } else if (dataCount > 15) {
        // For 15-30 points, show every 3rd label
        this.chartOption.xAxis.axisLabel.interval = Math.floor(dataCount / 10);
      } else {
        // For fewer points, show all labels
        this.chartOption.xAxis.axisLabel.interval = 0;
      }

      // Calculate max value for y-axis (add 20% padding)
      const maxAmount = Math.max(...amounts, 0);
      const maxValue = maxAmount > 0 ? Math.ceil(maxAmount * 1.2) : 1000000;
      
      // Set reasonable intervals
      let interval = maxValue / 5;
      if (interval > 10000000) {
        interval = Math.ceil(interval / 10000000) * 10000000;
      } else if (interval > 1000000) {
        interval = Math.ceil(interval / 1000000) * 1000000;
      } else if (interval > 100000) {
        interval = Math.ceil(interval / 100000) * 100000;
      } else {
        interval = Math.ceil(interval / 10000) * 10000;
      }

      this.chartOption.yAxis.max = maxValue;
      this.chartOption.yAxis.interval = interval;
    },
    setChartHeight() {
      if (window.innerWidth <= 768) {
        this.chartHeight = '300px';
        this.updateGridForMobile();
      } else if (window.innerWidth <= 1024) {
        this.chartHeight = '350px';
        this.updateGridForTablet();
      } else {
        this.chartHeight = '400px';
        this.updateGridForDesktop();
      }
    },
    updateGridForMobile() {
      this.chartOption.grid.left = '8%';
      this.chartOption.grid.right = '8%';
      this.chartOption.grid.bottom = '20%';
      this.chartOption.grid.top = '8%';
      this.chartOption.xAxis.axisLabel.rotate = 45;
    },
    updateGridForTablet() {
      this.chartOption.grid.left = '6%';
      this.chartOption.grid.right = '6%';
      this.chartOption.grid.bottom = '15%';
      this.chartOption.grid.top = '6%';
      this.chartOption.xAxis.axisLabel.rotate = 30;
    },
    updateGridForDesktop() {
      this.chartOption.grid.left = '5%';
      this.chartOption.grid.right = '5%';
      this.chartOption.grid.bottom = '12%';
      this.chartOption.grid.top = '5%';
      this.chartOption.xAxis.axisLabel.rotate = 0;
    }
  }
}
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 8px;
    margin-bottom: 8px;
  }
}

@media (min-width: 1025px) {
  .chart-container {
    padding: 15px;
    margin-bottom: 15px;
  }
}
</style>
