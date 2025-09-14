import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useTitle() {
  const route = useRoute()
  const documentTitle = ref('CRM')
  
  const setTitle = (title) => {
    documentTitle.value = title
    document.title = title
  }
  
  const updateTitleFromRoute = () => {
    const routeTitles = {
      'index': 'داشبورد',
      'customers': 'مشتریان',
      'customers_consultant': 'لیست شماره های در حال مشاوره',
      'customers_seller': 'لیست شماره های در حال فروش',
      'reports': 'گزارشات',
      'profile': 'پروفایل',
      'auth': 'ورود به سیستم'
    }
    
    const baseTitle = routeTitles[route.name] || 'CRM'
    setTitle(baseTitle)
  }
  
  const updateCustomerTitle = (customer) => {
    if (customer) {
      const customerName = customer.name || customer.phone || 'مشتری'
      setTitle(`${customerName} - پروفایل مشتری`)
    }
  }
  
  return {
    documentTitle,
    setTitle,
    updateTitleFromRoute,
    updateCustomerTitle
  }
}
