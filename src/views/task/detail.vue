<template>
    <div class="task-detail" v-if="isShowDetails">
        <div class="redirector">
            <div style="display: inline-flex; font-size: 16px; gap: 8px; align-items: center;">
                <el-button link type="primary"><span style="font-size: 16px;text-align: center;">任务管理</span></el-button>
                <span style="color: #ccc; font-size: 21px;">></span>
                <span style="font-size: 16px;text-align: center;color: var(--color-dark-text);">任务详情</span>
            </div>
            <el-button @click="$emit('close')">
                <el-icon><left-arrow /></el-icon>
                <span style="font-size: 16px;">返回任务管理</span>
            </el-button>
        </div>
        <div class="stat-card"><!--基本信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">任务基本信息</span></div>
            <div class="divider"></div>
            <div class="stat-card content">
            </div>
        </div>
        <div class="stat-card"><!--工序信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">工序作业信息</span></div>
            <div class="divider"></div>
            <div class="stat-card content">
            </div>
        </div>
        <div class="measure-table">
            <div class="stat-card header">
                <span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">{{ "测量数据表-"+selectedItem.pid+`-${selectedItem.pname}` }}</span>
                <div style="display: flex; align-items: center;">
                    <el-button type="primary" plain>
                        <el-icon><list-icon/></el-icon>
                        <span style="text-align: center;">新增数据</span>
                    </el-button>
                    <el-button type="primary" plain>
                        <el-icon><excel-icon/></el-icon>
                        <span style="text-align: center;">导出导入模板</span>
                    </el-button>
                    <el-button type="success" plain>
                        <el-icon><excel-icon/></el-icon>
                        <span style="text-align: center;">导入Excel</span>
                    </el-button>
                    <el-button type="success" plain>
                        <el-icon><excel-icon/></el-icon>
                        <span style="text-align: center;">导出Excel</span>
                    </el-button>
                </div>
            </div>
            <div class="divider"></div>
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import leftArrow from '@/components/icons/leftArrow.vue';
import listIcon from '@/components/icons/listIcon.vue';
import excelIcon from '@/components/icons/excelIcon.vue';

interface data {
    line?: number;
    ticket?: string;
    pid?: string;
    pname?: string;
    tid?: string;
    tname?: string;
    devid?: string;
    status?: string;
    stime?: string;
    ctime?: string;
}

const prop = defineProps<{
    isShowDetails: boolean;
    selectedItem: data;
}>()

defineEmits(['close'])
</script>

<style scoped lang="scss">
.task-detail {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.redirector {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: white;
    border-radius: 8px;
    padding: 8px 16px;
}
.stat-card {
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;

    &.header {
        width: 100%;
        padding: 8px 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    &.content {
        width: 100%;
        padding: 8px 16px;
        display: flex;
        flex-direction: row;
        flex-wrap: 1;
    }

    &.sub {
        flex: auto;
        width: 25%;
    }
}
.measure-table {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border-radius: 8px;
}
.divider {
    width: 100%; 
    border: solid 0.5px var(--color-model-bg);
    color: transparent;
    height: 0;
}
</style>