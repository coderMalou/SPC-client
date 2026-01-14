<template>
    <div class="task-detail" v-if="isShowDetails">
        <div class="redirector">
            <div style="display: inline-flex; font-size: 16px; gap: 8px; align-items: center;">
                <el-button link type="primary" @click="$emit('close')">
                    <span style="font-size: 18px;text-align: center;">任务管理</span>
                </el-button>
                <span style="color: #ccc; font-size: 21px;">></span>
                <span style="font-size: 18px;text-align: center;color: var(--color-dark-text);">任务详情</span>
            </div>
            <el-button @click="$emit('close')">
                <el-icon><left-arrow /></el-icon>
                <span style="font-size: 18px;">返回任务管理</span>
            </el-button>
        </div>
        <div class="stat-card"><!--基本信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">任务基本信息</span></div>
            <div class="divider"></div>
            <div class="stat-card content">
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工作任务号</span>
                    <el-input disabled v-model="selectedItem.tid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工单号</span>
                    <el-input disabled v-model="selectedItem.ticket"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">行号</span>
                    <el-input disabled v-model="selectedItem.line"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">产品编码</span>
                    <el-input disabled v-model="selectedItem.pid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">产品名称</span>
                    <el-input disabled v-model="selectedItem.pname"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">规格/型号</span>
                    <el-input disabled v-model="spec"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">计量单位</span>
                    <el-input disabled v-model="unit"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工艺路线名称</span>
                    <el-input disabled v-model="technic"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">创建时间</span>
                    <el-input disabled v-model="selectedItem.ctime"></el-input>
                </div>
            </div>
        </div>
        <div class="stat-card"><!--工序信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">工序作业信息</span></div>
            <div class="divider">
            </div>
            <div class="stat-card content">
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工序序号</span>
                    <el-input disabled v-model="techList.techid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工序作业名称</span>
                    <el-input disabled v-model="techList.techname"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">质量特性</span>
                    <el-input disabled v-model="techList.ch"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">目标标准值</span>
                    <el-input disabled v-model="techList.standard"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">USL</span>
                    <el-input disabled v-model="techList.usl"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">LSL</span>
                    <el-input disabled v-model="techList.lsl"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">组内样本量</span>
                    <el-input disabled v-model="techList.set"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">总体样本量</span>
                    <el-input disabled v-model="techList.total"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">作业设备编码</span>
                    <el-input disabled v-model="selectedItem.devid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">仪器/治具编码</span>
                    <el-input disabled v-model="selectedItem.devid"></el-input>
                </div>
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
import { ref } from 'vue'
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

const spec = ref('Ø50×30')
const unit = ref('mm')
const technic = ref('车削→钻孔→热处理→磨削')
const techList = ref({
    techid: 'SW251015001',
    techname: '常规机加工',
    ch: '外径',
    standard: '50',
    usl: '50',
    lsl: '50',
    set: '5',
    total: '5',
})
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
        flex-wrap: wrap;
    }

    &.sub {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        padding: 8px;
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