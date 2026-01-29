<template>
  <div class="login-page">
    <div class="login-dialog">
      <el-card class="login-card">
        <template #header>
          <div class="login-header">
            <h3>系统登录</h3>
          </div>
        </template>

        <el-form 
          :model="loginForm" 
          :rules="loginRules" 
          ref="loginFormRef"
          label-width="80px"
          @keyup.enter="handleLogin"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <div class="captcha-container">
              <el-input 
                v-model="loginForm.captcha" 
                placeholder="请输入验证码"
                class="captcha-input"
                maxlength="4"
                clearable
              />
              <div class="captcha-image" @click="refreshCaptcha">
                <img :src="captchaImage" alt="验证码" v-if="captchaImage" />
                <span v-else>点击刷新</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              class="login-btn" 
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { curUserData } from '@/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter()

// Pinia store
const { setUser, setCompany } = curUserData()

// 设置公司信息
setCompany('深圳公司1')

// 表单引用
const loginFormRef = ref<FormInstance>()

// 响应式数据
const loading = ref(false)
const captchaImage = ref('')

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

// 生成验证码（模拟实现）
const generateCaptcha = () => {
  // 实际项目中这里应该调用后端API获取验证码图片
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let captcha = ''
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // 模拟生成验证码图片URL（实际项目中应为后端返回的图片数据）
  captchaImage.value = `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f7fa"/>
      <text x="60" y="25" font-family="Arial" font-size="18" text-anchor="middle" fill="#333">${captcha}</text>
    </svg>
  `)}`
  
  return captcha
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha()
}

// 模拟登录API
const mockLogin = (credentials: typeof loginForm) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟登录验证
      if (credentials.username === 'admin' && credentials.password === '123456') {
        resolve({
          success: true,
          data: {
            user: credentials.username,
            company: '深圳公司1',
            token: 'mock-jwt-token-' + Date.now()
          }
        })
      } else {
        reject({
          success: false,
          message: '用户名或密码错误'
        })
      }
    }, 1000)
  })
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 调用登录API
    const response = await mockLogin(loginForm)
    
    if (response.success) {
      // 设置用户信息到Pinia store
      setUser(loginForm.username)
      
      ElMessage.success('登录成功')
      
      // 实际项目中这里应该进行路由跳转
      console.log('登录成功，跳转到首页')
    }
    
    router.push('/task')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败，请重试')
    refreshCaptcha() // 登录失败刷新验证码
  } finally {
    loading.value = false
  }
}

// 组件挂载时初始化验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100vh;
  background-color: var(--color-model-bg);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-dialog {
    width: 100%;
    max-width: 420px;
    padding: 20px;
  }

  .login-card {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;

      h3 {
        margin: 0;
        color: #333;
        font-size: 24px;
      }

      .company-info {
        margin-top: 8px;
        color: #666;
        font-size: 14px;
      }
    }

    :deep(.el-card__body) {
      padding: 30px;
    }
  }

  .captcha-container {
    display: flex;
    align-items: center;
    gap: 10px;

    .captcha-input {
      flex: 1;
    }

    .captcha-image {
      width: 100px;
      height: 40px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #f5f7fa;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        border-color: #c0c4cc;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 40px;
    margin-top: 10px;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-page {
    .login-dialog {
      padding: 10px;
    }

    .login-card {
      :deep(.el-card__body) {
        padding: 20px;
      }
    }
  }
}
</style>