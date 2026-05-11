<template>
    <div class="top-bar">
        <span style="display: flex; gap: 10px;">
            <div class="logo">📊</div>
            <div class="system-name">SPC质量管理系统</div>
        </span>
        <nav class="main-menu">
            <div class="menu-item":class="{active:!curTab}" @click="handleGraph">控制图</div>
            <div class="menu-item" :class="{active:curTab}" @click="handleTask">任务管理</div>
        </nav>
        <span style="display: flex; width: 30%; justify-content: center;">{{ formattedTime }}</span>
        <div style="display: flex; align-items: center; gap:15px; font-weight: bold;">
            <div style="min-width: 100px;">
                <CompanySelector v-model="curCompany" :companies="companies" />
            </div>
            <div class="user-menu" ref="userMenuRef">
                <div class="user-trigger" @click="toggleUserMenu">
                    <span class="username">{{ userStore().userInfo?.username }}</span>
                    <svg
                        class="arrow-icon"
                        :class="{ 'arrow-up': isUserMenuOpen }"
                        width="16"
                        height="16"
                        viewBox="0 0 48 48"
                        fill="none"
                    >
                        <path d="M39.6 17.444L24.044 33 8.487 17.444" stroke="currentColor" stroke-width="4"/>
                    </svg>
                </div>
                <Transition name="dropdown">
                    <div v-if="isUserMenuOpen" class="user-dropdown">
                        <div class="dropdown-item logout-item" @click="handleLogout">
                            <svg class="logout-icon" width="16" height="16" viewBox="0 0 48 48" fill="none">
                                <path d="M32 8H12a4 4 0 00-4 4v8h4V14h22v20H16v-4H12v8a4 4 0 004 4h20a4 4 0 004-4V12a4 4 0 00-4-4z" stroke="currentColor" stroke-width="3"/>
                                <path d="M32 18l-8-6v6H12v4h12v6l8-6z" stroke="currentColor" stroke-width="3"/>
                            </svg>
                            <span>退出登录</span>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTime } from '@/utils/clock';
import { userStore } from '@/stores/user';
import { getCompanyList } from '@/api/modules/auth';
import CompanySelector from './CompanySelector.vue';

const router = useRouter()
const route = useRoute()
const { formattedTime } = useTime()

const isShowGraph = ref(false)
const isShowTask = ref(true)
const companies = ref([
    {name:'深圳公司1', id: 1},
    {name:'深圳公司2', id: 2},
])
const curCompany = ref('深圳公司1')

const curTab = computed(()=>{
    return route.name?.toString().includes('task') ? true : false
})

const handleGraph = () => {
    isShowGraph.value = true
    isShowTask.value = false
    router.push('/graph')
}

const handleTask = () => {
    isShowGraph.value = false
    isShowTask.value = true
    router.push('/task')
}

// 用户下拉菜单
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = () => {
    userStore().logout(router)
    isUserMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
        isUserMenuOpen.value = false
    }
}

onMounted(async () => {
    document.addEventListener('click', handleClickOutside)
    try {
        const res = await getCompanyList()
        companies.value = res.list
        userStore().setCompanyList(res.list)
    } catch (error) {
        console.error('获取公司列表失败:', error)
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-bar {
    position: fixed;
    top: 0;
    width: 100%;
    background: #001529;
    color: #fff;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    z-index: 9999;
}

.system-name {
    font-weight: 600;
}

.main-menu {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 32px;
}

.menu-item {
    min-width: 81px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    color: #d6e4ff;
    text-decoration: none;
    padding: 8px 14px;
}

.menu-item.active {
    background: #2f54eb;
    color: #fff;
}

/* 用户菜单样式 */
.user-menu {
    position: relative;
    user-select: none;
}

.user-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;
    color: #fff;
}

.user-trigger:hover {
    background: rgba(255, 255, 255, 0.2);
}

.username {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.arrow-icon {
    transition: transform 0.2s ease;
    color: #d6e4ff;
}

.arrow-icon.arrow-up {
    transform: rotate(180deg);
}

.user-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 120px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 10000;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    color: #001529;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.dropdown-item:hover {
    background: #f5f5f5;
}

.logout-item {
    color: #ff4d4f;
}

.logout-item:hover {
    background: #fff1f0;
}

.logout-icon {
    color: #ff4d4f;
}

/* Transition animations */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* ====================================
   移动端适配 (768px 以下)
   ==================================== */
@media (max-width: 768px) {
    .top-bar {
        padding: 0 12px;
        height: 50px;
    }

    .system-name {
        font-weight: 600;
        font-size: 14px;
    }

    .logo {
        font-size: 16px;
    }

    .main-menu {
        margin-left: 16px;
    }

    .menu-item {
        min-width: 60px;
        padding: 8px 10px;
        font-size: 13px;
    }

    /* 时间显示在移动端隐藏 */
    .top-bar > span:nth-child(3) {
        display: none !important;
    }

    /* 用户信息区域调整 */
    .top-bar > div:last-child {
        width: auto;
        gap: 10px;
        font-size: 12px;
    }

    .top-bar > div:last-child > div:first-child .company-selector {
        width: 100px;
    }

    /* 用户菜单调整 */
    .user-menu {
        position: relative;
    }

    .user-trigger {
        padding: 4px 8px;
        font-size: 12px;
    }

    .username {
        max-width: 60px;
    }

    .user-dropdown {
        right: 0;
        min-width: 100px;
    }

    .dropdown-item {
        font-size: 12px;
        padding: 8px 10px;
    }
}

/* ====================================
   小屏幕设备 (480px 以下)
   ==================================== */
@media (max-width: 480px) {
    .top-bar {
        padding: 0 8px;
        height: 46px;
    }

    .system-name {
        display: none;
    }

    .logo {
        font-size: 14px;
    }

    .main-menu {
        margin-left: 8px;
    }

    .menu-item {
        min-width: 50px;
        padding: 8px 8px;
        font-size: 12px;
    }

    /* 用户信息区域进一步调整 */
    .top-bar > div:last-child {
        gap: 6px;
    }

    .top-bar > div:last-child > div:first-child .company-selector {
        width: 100px;
    }

    /* 用户菜单小屏幕适配 */
    .user-menu {
        position: relative;
    }

    .user-trigger {
        padding: 4px 6px;
        font-size: 11px;
    }

    .username {
        max-width: 50px;
    }

    .user-dropdown {
        right: 0;
        min-width: 90px;
    }

    .dropdown-item {
        font-size: 11px;
        padding: 6px 8px;
    }
}
</style>