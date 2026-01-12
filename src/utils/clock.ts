
import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useTime(
    interval = 1000,
    format = 'full',
    locale = 'zh-CN') {
  
  const time = ref(new Date())
  let timer = null

  const updateTime = () => {
    time.value = new Date()
  }

  const formattedTime = computed(() => {
    const date = time.value
    switch (format) {
      case 'time-only':
        return date.toLocaleTimeString(locale, { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      case 'date-only':
        return date.toLocaleDateString(locale)
      default:
        return date.toLocaleString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
    }
  })

  onMounted(() => {
    timer = setInterval(updateTime, interval)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { time, formattedTime }
}