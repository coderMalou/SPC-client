<template>
  <div class="login-page">
    <!-- Canvas 粒子背景 -->
    <canvas ref="canvasRef" class="canvas-background"></canvas>

    <div class="login-dialog">
      <n-card class="login-card" :bordered="false">
        <template #header>
          <div class="login-header">
            <h3>系统登录</h3>
            <p class="subtitle">欢迎使用 SPC 质量管理系统</p>
          </div>
        </template>

        <n-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          @keyup.enter="handleLogin"
        >
          <n-form-item path="username">
            <n-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              clearable
            >
              <template #prefix>
                <!-- 用户图标 SVG -->
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="password">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
              size="large"
              clearable
            >
              <template #prefix>
                <!-- 锁图标 SVG -->
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="captcha">
            <div class="captcha-container">
              <n-input
                v-model:value="loginForm.captcha"
                placeholder="请输入验证码"
                class="captcha-input"
                size="large"
                maxlength="4"
                clearable
              />
              <div class="captcha-image" @click="refreshCaptcha">
                <canvas ref="captchaCanvasRef" width="120" height="44" class="captcha-canvas" />
              </div>
            </div>
          </n-form-item>

          <n-form-item>
            <n-button
              type="primary"
              class="login-btn"
              size="large"
              :loading="loading"
              attr-type="button"
              @click="handleLoginDebounced"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage, NCard, NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { curUserData, userStore } from '@/stores/user'
import storage from '@/utils/storage'
import { useRouter } from 'vue-router'
import { login } from '@/api/modules/auth.ts'
import { showWarning } from '@/utils/message'
import { useDebounceFn } from '@/utils/functions'

const router = useRouter()
const message = useMessage()

// Pinia store
const { setUser, setCompany } = curUserData()
const user = userStore()

// ==================== Canvas 粒子背景相关 ====================
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.radius = Math.random() * 3 + 2
    this.color = this.getRandomColor()
  }

  getRandomColor(): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
    return colors[Math.floor(Math.random() * colors.length)] || '#667eea'
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx
    this.y += this.vy

    // 边界碰撞检测（弹性反弹）
    if (this.x < 0 || this.x > canvasWidth) {
      this.vx = -this.vx
      this.x = Math.max(0, Math.min(this.x, canvasWidth))
    }
    if (this.y < 0 || this.y > canvasHeight) {
      this.vy = -this.vy
      this.y = Math.max(0, Math.min(this.y, canvasHeight))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = 0.6
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.closePath()
  }
}

// 绘制渐变背景
function drawGradientBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

// 绘制粒子连线
function drawParticleLines(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]
      if (!p1 || !p2) continue

      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / 150)})`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
      }
    }
  }
}

// 动画循环
function animate() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // 清空画布并绘制渐变背景
  drawGradientBackground(ctx, width, height)

  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.update(width, height)
    particle.draw(ctx)
  })

  // 绘制粒子连线
  drawParticleLines(ctx, particles)

  animationId = requestAnimationFrame(animate)
}

// 初始化 Canvas
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  // 设置 canvas 尺寸为窗口大小
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 初始化粒子（50-80个）
  const particleCount = Math.floor(Math.random() * 31) + 50 // 50-80
  particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height))
  }

  // 启动动画
  animate()
}

// 处理窗口大小变化
function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 重新初始化粒子
  particles = []
  const particleCount = Math.floor(Math.random() * 31) + 50
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height))
  }
}

// ==================== 登录相关 ====================
// 表单引用
const loginFormRef = ref<FormInst | null>(null)

// 响应式数据
const loading = ref(false)
const captchaCanvasRef = ref<HTMLCanvasElement | null>(null)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

// 验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4个字符', trigger: 'blur' }
  ]
}

// 登录响应类型
interface LoginResponse {
  success: boolean
  data?: {
    user: string
    company: string
    token: string
  }
  message?: string
}

// ==================== Canvas 验证码生成 ====================
// 生成随机数
const randomNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 生成随机颜色
const randomColor = (min: number, max: number): string => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

// 绘制单个字符（带随机颜色、大小、旋转和位置）
const drawText = (ctx: CanvasRenderingContext2D, txt: string, i: number, contentWidth: number, contentHeight: number, codeLen: number) => {
  ctx.fillStyle = randomColor(50, 160)
  const fontSize = randomNum(28, 38)
  ctx.font = `${fontSize}px SimHei`
  const x = (i + 1) * (contentWidth / (codeLen + 1))
  const y = randomNum(fontSize, contentHeight - 5)
  const deg = randomNum(-15, 15)

  ctx.translate(x, y)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.fillText(txt, 0, 0)
  ctx.rotate((-deg * Math.PI) / 180)
  ctx.translate(-x, -y)
}

// 绘制干扰线
const drawLine = (ctx: CanvasRenderingContext2D, contentWidth: number, contentHeight: number) => {
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = randomColor(100, 200)
    ctx.beginPath()
    ctx.moveTo(randomNum(0, contentWidth), randomNum(0, contentHeight))
    ctx.lineTo(randomNum(0, contentWidth), randomNum(0, contentHeight))
    ctx.stroke()
  }
}

// 绘制干扰点
const drawDot = (ctx: CanvasRenderingContext2D, contentWidth: number, contentHeight: number) => {
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = randomColor(0, 255)
    ctx.beginPath()
    ctx.arc(randomNum(0, contentWidth), randomNum(0, contentHeight), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}

// 生成验证码（Canvas 绘制）
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let captcha = ''
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  const canvas = captchaCanvasRef.value
  if (!canvas) return captcha

  const ctx = canvas.getContext('2d')
  if (!ctx) return captcha

  const contentWidth = canvas.width
  const contentHeight = canvas.height

  // 清空画布（透明背景）
  ctx.clearRect(0, 0, contentWidth, contentHeight)
  ctx.textBaseline = 'bottom'

  // 绘制文字（每个字符随机颜色、大小、旋转角度）
  for (let i = 0; i < captcha.length; i++) {
    drawText(ctx, captcha[i]||'', i, contentWidth, contentHeight, captcha.length)
  }

  // 绘制干扰线和干扰点
  drawLine(ctx, contentWidth, contentHeight)
  drawDot(ctx, contentWidth, contentHeight)

  return captcha
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha()
}

// 登录API响应类型
interface LoginAPIResponse {
  code: number
  msg: string
  data: {
    token: string
    username: string
    role: string
    company: string
  }
}

// 登录API调用
// 登录API调用（使用模块化API）
const loginAPI = async (credentials: typeof loginForm): Promise<LoginAPIResponse> => {
    console.log('[Login] 正在调用登录API:', { username: credentials.username })
    const res = await login(credentials)
    console.log('[Login] 登录API响应:', res)
    return res as unknown as LoginAPIResponse
}

// 处理登录
const handleLogin = async () => {
    if (!loginFormRef.value) return

    if (loginForm.username === '') {
      showWarning('请输入用户名')
      return 
    }
    else if (loginForm.password === '') {
      showWarning('请输入密码')
      return
    }
    else if (loginForm.captcha === '') {
      showWarning('请输入验证码')
      return 
    }

    try {
        // 表单验证
        const valid = await loginFormRef.value.validate()
        if (!valid) return

        loading.value = true
        console.log('[Login] 开始登录，用户名:', loginForm.username)

        // 调用登录API
        const response = await loginAPI(loginForm)

        if (response.code === 200) {
            const { token, username, role, company } = response.data
            console.log('[Login] 登录成功:', { username, role, company, token })

            // 存储token
            storage.set('token', token, 'session')

            console.log("got token:", storage.get('token','session'))

            // 设置用户信息到Pinia store
            setUser(username)
            setCompany(company)
            storage.set('user', username, 'session')
            user.login({
                username,
                role,
                company
            })

            message.success('登录成功')

            // 跳转到任务页面
            router.push('/task')
        } else {
            console.warn('[Login] 登录失败:', response.msg)
            message.error(response.msg || '登录失败')
            refreshCaptcha()
        }
    } catch (error: any) {
        console.error('[Login] 登录请求异常:', error)
        if (error.response) {
            console.error('[Login] 响应状态:', error.response.status)
            console.error('[Login] 响应数据:', error.response.data)
            message.error(error.response.data?.msg || '登录失败')
        } else if (error.request) {
            console.error('[Login] 请求未收到响应')
            message.error('网络错误：无法连接到服务器，请检查后端服务是否启动')
        } else {
            message.error(error.message || '登录失败，请重试')
        }
        refreshCaptcha()
    } finally {
        loading.value = false
    }
}

// 防抖登录
const handleLoginDebounced = useDebounceFn(handleLogin, 500)

// 组件挂载时初始化
onMounted(() => {
  refreshCaptcha()
  initCanvas()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  // Canvas 背景层
  .canvas-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  // 登录对话框容器
  .login-dialog {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  // 输入框图标
  .input-icon {
    width: 18px;
    height: 18px;
    color: #999;
  }

  // 登录卡片
  .login-card {
    background: rgba(255, 255, 255, 0.95) !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2) !important;
    }

    // 登录头部
    .login-header {
      text-align: center;
      padding: 10px 0 0;

      h3 {
        margin: 0 0 8px 0;
        font-size: 28px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    // 调整卡片内容区域
    :deep(.n-card__content) {
      padding: 30px;
    }

    :deep(.n-card__header) {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  // 验证码容器
  .captcha-container {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .captcha-input {
      flex: 1;
    }

    .captcha-image {
      width: 120px;
      height: 44px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #f8f9fa;
      overflow: hidden;
      transition: all 0.3s ease;

      canvas {
        width: 100%;
        height: 44px;
        border-radius: 6px;
      }

      .refresh-hint {
        font-size: 10px;
        color: #999;
        margin-top: 2px;
        display: none;
      }

      &:hover {
        border-color: #667eea;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);

        .refresh-hint {
          display: block;
        }
      }
    }
  }

  // 登录按钮
  .login-btn {
    width: 100%;
    height: 44px;
    margin-top: 10px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    background:  #667eea !important;
    border: transparent !important;
    transition: all 0.3s ease;

    &:hover {
      background:  #5a6fd6 !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

// ====================================
// 移动端适配 (768px 以下)
// ====================================
@media (max-width: 768px) {
  .login-page {
    // 登录对话框移动端宽度
    .login-dialog {
      width: 90%;
      max-width: 90%;
      padding: 0 10px;
    }

    // 登录卡片移动端调整
    .login-card {
      border-radius: 12px !important;
      
      // 移动端头部标题调整
      .login-header {
        padding: 8px 0 0;

        h3 {
          margin: 0 0 6px 0;
          font-size: 22px;
        }

        .subtitle {
          font-size: 12px;
        }
      }

      // 卡片内容区域移动端内边距
      :deep(.n-card__content) {
        padding: 20px 16px;
      }
    }

    // 表单元素间距调整
    :deep(.n-form-item) {
      margin-bottom: 16px;
    }

    // 验证码容器移动端垂直排列
    .captcha-container {
      flex-direction: column;
      gap: 10px;

      .captcha-input {
        width: 100%;
      }

      .captcha-image {
        width: 100%;
        height: 40px;
        
        canvas {
          height: 40px;
        }
      }
    }

    // 登录按钮移动端调整
    .login-btn {
      height: 40px;
      font-size: 15px;
      margin-top: 8px;
    }

    // 输入框图标移动端调整
    .input-icon {
      width: 16px;
      height: 16px;
    }
  }
}

// ====================================
// 小屏幕设备 (480px 以下)
// ====================================
@media (max-width: 480px) {
  .login-page {
    .login-card {
      .login-header {
        h3 {
          font-size: 20px;
        }

        .subtitle {
          font-size: 11px;
        }
      }

      :deep(.n-card__content) {
        padding: 16px 12px;
      }
    }

    .captcha-container {
      gap: 8px;

      .captcha-image {
        height: 36px;

        canvas {
          height: 36px;
        }
      }
    }

    .login-btn {
      height: 38px;
      font-size: 14px;
    }

    :deep(.n-form-item) {
      margin-bottom: 14px;
    }
  }
}
</style>
