<template>
    <div class="top-bar">
        <span style="display: flex; gap: 10px;">
            <div class="logo">📊</div>
            <div class="system-name">SPC统计过程控制系统</div>
        </span>
        <nav class="main-menu">
            <button class="menu-item" >控制图</button>
            <button class="menu-item active">任务管理</button>
        </nav>
        <span style="display: flex; width: 30%; justify-content: center;">{{ formattedTime }}</span>
        <div style="display: flex; align-items: center; gap:15px; font-weight: bold;">
            <div>
                <select id="company-select"
                    style="width: 100px;height: 32px;text-align: center;border-radius: 4px; border: none; padding: 4px; background: #fff; color: #001529;">
                    <option value="深圳公司1">深圳公司1</option>
                    <option value="深圳公司2">深圳公司2</option>
                </select>
            </div>
            <div style="margin-left:auto">张三 (质量工程师)</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useTime } from '@/utils/clock';

const { formattedTime } = useTime()
</script>

<style scoped>
.top-bar {
    width: 100%;
    background: #001529;
    color: #fff;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
}

.system-name {
    font-weight: 600;
}

.main-menu {
    display: flex;
    gap: 24px;
    margin-left: 32px;
}

.menu-item {
    background-color: transparent;
    border: none;
    color: #d6e4ff;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 4px;
}

.menu-item.active {
    background: #2f54eb;
    color: #fff;
}
</style>