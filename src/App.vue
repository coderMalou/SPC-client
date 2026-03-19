<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue';
import TopBar from './components/TopBar.vue';
import storage from './utils/storage';
import { curUserData, userStore, type UserInfo } from './stores/user';
const userData = curUserData();
const user = userStore()
const userName = ref(userData.getUser())
const isLoggedIn = computed(()=>{
  return userName.value !== ''
})

const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'user_info' && event.storageArea === sessionStorage) {
    if (event.newValue) {
      const newUser = JSON.parse(event.newValue);
      if (newUser) {
        user.login(newUser);
      } else {
        user.logout();
      }
    } else {
      user.logout();
    }
  }
};

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
  
  // 页面加载时检查登录状态
  const savedUser = storage.get('user_info', 'session');
  if (savedUser) {
    user.login(savedUser as UserInfo);
  }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});


</script>

<template>
  <n-message-provider>
    <div class="app-container">
      <TopBar v-if="user.isLoggedIn"/>
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </n-message-provider>
</template>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-content {
  width: 100%;
  height: calc(100%);
  position: relative;
  overflow: hidden;
}

.main-content.login {
  height: 100vh !important;
  margin: 0;
}

/* ====================================
   移动端适配 (768px 以下)
   ==================================== */
@media (max-width: 768px) {
  body {
    font-size: 14px;
    -webkit-text-size-adjust: 100%;
  }

  .app-container {
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
  }

  .main-content {
    width: 100%;
    height: calc(100%);
    overflow-x: hidden;
  }
}

/* ====================================
   小屏幕设备 (480px 以下)
   ==================================== */
@media (max-width: 480px) {
  body {
    font-size: 13px;
  }

  .app-container {
    width: 100%;
  }

  .main-content {
    width: 100%;
  }
}
</style>
