import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { storage } from '@/utils/storage';

export interface UserInfo {
  id?: number | string;
  username?: string;
  nickname?: string;
  avatar?: string;
  [key: string]: any; // 其他可能的字段
}

const curUser = ref('')
const curCompany = ref('')

export const curUserData = defineStore('userData',()=>{
    const setUser = (userName: string) => {
        curUser.value = userName
    }
    const setCompany = (comName: string) => {
        curCompany.value = comName
    }

    const getUser = () => {return curUser.value}
    const getCompany = () => {return curCompany.value}

    return {setUser, setCompany, getUser, getCompany}
})

export const userStore = defineStore('user', () => {
  // 响应式用户信息
  const userInfo = ref<UserInfo | null>(
    storage.get<UserInfo>('user_info', 'session')
  );

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => !!userInfo.value);

  // 登录方法
  const login = (userData: UserInfo) => {
    userInfo.value = userData;
    storage.set('user_info', userData, 'session');
  };

  // 登出方法
  const logout = () => {
    userInfo.value = null;
    storage.set('user_info', null, 'session');
  };

  // 更新用户信息
  const updateUserInfo = (data: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data };
      storage.set('user_info', userInfo.value, 'session');
    }
  };

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUserInfo
  };
});