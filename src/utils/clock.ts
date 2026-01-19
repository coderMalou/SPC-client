import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useTime(
    interval = 1000,
    format = 'full',
    locale = 'zh-CN',
    dateSeparator?: string  // 新增可选参数，用于自定义日期分隔符
) {
    const time = ref(new Date())
    let timer: number | null = null  // 明确类型为 number | null

    const updateTime = () => {
        time.value = new Date()
    }

    const formattedTime = computed(() => {
        const date = time.value
        
        // 时间格式化选项
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
        
        // 日期格式化选项
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }

        // 自定义日期格式化函数
        const formatDateWithSeparator = (
            date: Date, 
            locale: string, 
            options: Intl.DateTimeFormatOptions, 
            separator: string
        ): string => {
            const formatter = new Intl.DateTimeFormat(locale, options)
            const parts = formatter.formatToParts(date)
            // 过滤掉文字部分（如分隔符），只保留年、月、日等部分
            const nonLiteralParts = parts.filter(part => part.type !== 'literal')
            const values = nonLiteralParts.map(part => part.value)
            // 使用自定义分隔符拼接
            return values.join(separator)
        }

        switch (format) {
            case 'time-only':
                // 仅时间格式，不涉及日期分隔符
                return date.toLocaleTimeString(locale, timeOptions)
                
            case 'date-only':
                // 仅日期格式
                if (dateSeparator) {
                    // 使用自定义分隔符格式化日期
                    return formatDateWithSeparator(date, locale, dateOptions, dateSeparator)
                } else {
                    // 使用默认本地化日期格式
                    return date.toLocaleDateString(locale)
                }
                
            default:
                // 完整日期时间格式
                if (dateSeparator) {
                    // 分别格式化日期和时间部分
                    const dateStr = formatDateWithSeparator(date, locale, dateOptions, dateSeparator)
                    const timeStr = date.toLocaleTimeString(locale, timeOptions)
                    return `${dateStr} ${timeStr}`
                } else {
                    // 使用默认本地化日期时间格式
                    return date.toLocaleString(locale, {
                        ...dateOptions,
                        ...timeOptions
                    })
                }
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