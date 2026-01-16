<template>
    <div class="top-bar">
        <span style="display: flex; gap: 10px;">
            <div class="logo">📊</div>
            <div class="system-name">SPC统计过程控制系统</div>
        </span>
        <nav class="main-menu">
            <div class="menu-item":class="{active:isShowGraph}" @click="handleGraph">控制图</div>
            <div class="menu-item" :class="{active:isShowTask}" @click="handleTask">任务管理</div>
        </nav>
        <span style="display: flex; width: 30%; justify-content: center;">{{ formattedTime }}</span>
        <div style="display: flex; align-items: center; gap:15px; font-weight: bold;">
            <div>
                <select id="company-select"
                    style="width: 100px;height: 32px;text-align: center;border-radius: 4px; border: none; padding: 4px; background: #fff; color: #001529;">
                    <!-- <option value="深圳公司1">深圳公司1</option>
                    <option value="深圳公司2">深圳公司2</option> -->
                    <option v-for="item in companies" :value="item.name" @click="()=>curCompany = item.name">{{ item.name }}</option>
                </select>
            </div>
            <div style="margin-left:auto">张三 (质量工程师)</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTime } from '@/utils/clock';

const router = useRouter()
const { formattedTime } = useTime()

const isShowGraph = ref(false)
const isShowTask = ref(true)
const companies = ref([
    {name:'深圳公司1', id: 1},
    {name:'深圳公司2', id: 2},
])
const curCompany = ref('深圳公司1')

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
</style>