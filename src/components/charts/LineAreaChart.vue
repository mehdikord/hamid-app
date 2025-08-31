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
  mounted() {
    this.setChartHeight();
    window.addEventListener('resize', this.setChartHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setChartHeight);
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
          data: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 12,
          interval: 4,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            formatter: function(value) {
              return value + ' م';
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
            name: 'فروش',
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
            data: [2, 4, 6, 8, 10, 12, 9]
          }
        ]
      }
    }
  },
  methods: {
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
      this.chartOption.grid.bottom = '15%';
      this.chartOption.grid.top = '8%';
      this.chartOption.xAxis.axisLabel.rotate = 45;
    },
    updateGridForTablet() {
      this.chartOption.grid.left = '6%';
      this.chartOption.grid.right = '6%';
      this.chartOption.grid.bottom = '12%';
      this.chartOption.grid.top = '6%';
      this.chartOption.xAxis.axisLabel.rotate = 30;
    },
    updateGridForDesktop() {
      this.chartOption.grid.left = '5%';
      this.chartOption.grid.right = '5%';
      this.chartOption.grid.bottom = '10%';
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
