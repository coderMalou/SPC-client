import { ElMessage } from 'element-plus'

// Warm up ElMessage on module load to prevent "first call doesn't show" issue.
// ElMessage lazily initializes its internal app + DOM on the first call;
// that first instantiation can fail to render due to init timing.
;(() => {
  try {
    const inst = ElMessage({ type: 'info', message: '', duration: 0 })
    inst.close()
  } catch {
    // warm-up failure is non-critical
  }
})()

function show(msg: string, type: 'success' | 'error' | 'warning' | 'info') {
  return ElMessage({
    type,
    message: msg,
    duration: type === 'error' ? 4000 : 3000,
    offset: 70,
    showClose: true,
  })
}

export function showSuccess(msg: string) {
  return show(msg, 'success')
}

export function showError(msg: string) {
  return show(msg, 'error')
}

export function showWarning(msg: string) {
  return show(msg, 'warning')
}

export function showInfo(msg: string) {
  return show(msg, 'info')
}
