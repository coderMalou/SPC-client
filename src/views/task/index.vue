<template>
    <div class="task-container">
        <div class="task-total">
            <div class="task-number">
                <div class="search-bar" style="padding: 10px 0;">
                    <div style="position: relative; width: 100%;display: flex; align-items: center; justify-content: space-between; border: solid 1.5px #15151533; border-radius: 6px; padding: 6px;">
                        <input type="text" id="taskNumber" class="form-control" placeholder="搜索工单"
                            style="font-size: 15px; border: none;display: flex; align-items: center; line-height: normal;">
                        <searchScope />
                    </div>
                </div>
                <div class="show-taskNo">
                    <downArrow />
                    <span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">工单号</span>
                </div>

                <div class="taskNo-list" v-for="item in taskNoList" :key="item.no">
                    <div class="taskNo" :class="{active: currentNo === item.no}" @click="()=>currentNo = item.no">{{ item.no }}</div>
                    <powerOff v-if="currentNo === item.no && item.status !== 1" />
                    <div class="status-badge badge-done" v-if="item.status === 1">已关闭</div>
                </div>
            </div>
            <div class="task-list">
                <div style="padding: 5px 10px; width: 100%; font-size: 21px;font-weight: bold; color: var(--color-dark-text);">任务列表</div>
                <div style="width: 100%; border: solid 0.5px var(--color-model-bg);color: transparent;height: 0;"></div>
                <div class="operate-bar">
                    <div class="operate-btn">
                        <button class="operate-btn add">
                            <plusIcon />
                            <span style="min-width: 30px;">添加</span>
                        </button>
                        <button class="operate-btn norm">
                            <exportIcon />
                            <span style="min-width: 30px;">导出</span>
                        </button>
                        <button class="operate-btn norm">
                            <copyIcon />
                            <span style="min-width: 30px;">复制</span>
                        </button>
                    </div>
                    <div class="filter-search">
                        <el-select v-model="currentType" placeholder="全部类别" style="width: 120px">
                            <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select>
                        <el-select v-model="currentStatus" placeholder="全部状态" style="width: 120px">
                            <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select>
                        <el-input placeholder="输入产品编码或名称" style="width: 210px;"></el-input>
                        <el-button type="primary">搜索</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
import searchScope from '@/components/icons/searchScope.vue';
import downArrow from '@/components/icons/downArrow.vue';
import powerOff from '@/components/icons/powerOff.vue';
import exportIcon from '@/components/icons/exportIcon.vue';
import copyIcon from '@/components/icons/copyIcon.vue';
import plusIcon from '@/components/icons/plusIcon.vue';

const isShowTaskNo = ref(true)

const taskNoList = ref([
    {no:'WO20251013001', status: 0},
    {no:'WO20251013002', status: 0},
    {no:'WO20251013003', status: 0},
    {no:'WO20251013004', status: 0},
    {no:'WO20251013005', status: 1},
    {no:'WO20251013006', status: 0},
])

const typeList = ref([
    {name: '全部类别', id: 0},
    {name:'机加工', id: 1},
    {name:'冲压', id: 2},
    {name:'热处理', id: 3}
])
const statusList = ref([
    {name: '全部状态', id: 0},
    {name: '启用', id: 1},
    {name: '停用', id: 2}
])

const currentNo = ref(taskNoList.value[0]?.no || '')
const currentType = ref(0)
const currentStatus = ref(0)
</script>

<style scoped lang="scss">
.task-container {
    width: 100%;
    height: 100%;
    padding: 20px 80px;
    background-color: var(--color-model-bg);
    overflow-y: auto;
}

.task-total {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 5px;
}

.task-number {
    flex: none;
    width: 270px;
    min-width: 120px;
    max-width: 250px;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
    background: #fff;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 0;
    padding: 0 10px;
}

.search-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.show-taskNo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.taskNo-list {
    margin-left: 12px;
    display: flex;
    align-items: center;
    padding: 2px 6px;
    gap: 16px;
}

.taskNo {
    color: var(--color-dark-text);
    padding: 4px 16px;
    border-radius: 6px;
    border: transparent;
    font-size: 14px;
}
.taskNo.active {
    color: var(--color-Hlight-text);
    background-color: #e6f7ff;
    font-weight: bold;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;

    &.status-open {
        background: rgba(24, 144, 255, 0.12);
        color: #1890ff;
    }

    &.status-done {
        background: rgba(82, 196, 26, 0.12);
        color: #52c41a;
    }

    &.status-stop {
        background: rgba(255, 77, 79, 0.12);
        color: #ff4d4f;
    }

    &.badge-done {
        background: #929690;
        color: #fff;
        white-space: nowrap;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
    }
}

.task-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
}

.operate-bar {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    padding: 10px;
}

.operate-btn {
    width: 240px;
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    gap: 8px;
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.3s;

    &.add {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1890ff;
        border: none;
        color: white;
    }
    &.norm {
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid 1px;
        color: var(--color-dark-text);
    }
}

.filter-search {
    width: 45%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>