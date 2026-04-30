<template>
    <div class="task-detail" v-if="isShowDetails">
        <div class="redirector">
            <div style="display: inline-flex; font-size: 16px; gap: 8px; align-items: center;">
                <el-button link type="primary" @click="$emit('close')">
                    <span style="font-size: 18px;text-align: center;">任务管理</span>
                </el-button>
                <span style="color: #ccc; font-size: 21px;">></span>
                <span style="font-size: 18px;text-align: center;color: var(--color-dark-text);">{{ isAddMode ? '新增任务' : '任务详情' }}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <el-button type="primary" v-if="isEdit" :loading="saving" @click="handleSaveDebounced">
                    <span style="font-size: 18px;">保存任务</span>
                </el-button>
                <el-button @click="$emit('close')">
                    <el-icon><left-arrow /></el-icon>
                    <span style="font-size: 18px;">返回任务管理</span>
                </el-button>
            </div>
        </div>
        <div class="stat-card"><!--基本信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">任务基本信息</span></div>
            <div class="divider"></div>
            <div class="stat-card content">
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>工作任务号</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.tid" placeholder="请输入工作任务号"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>工单号</span>
                    <el-input :disabled="!isEdit || isAddMode" v-model="selectedItem.ticket" placeholder="请输入工单号"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>行号</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.line" placeholder="请输入行号"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>产品编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.pid" placeholder="请输入产品编码"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>产品名称</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.pname" placeholder="请输入产品名称"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>规格/型号</span>
                    <el-input :disabled="!isEdit" v-model="spec" placeholder="请输入规格/型号"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>计量单位</span>
                    <el-input :disabled="!isEdit" v-model="unit" placeholder="请输入计量单位"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>工艺路线名称</span>
                    <el-input :disabled="!isEdit" v-model="technic" placeholder="请输入工艺路线名称"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">创建时间</span>
                    <el-input disabled v-model="selectedItem.ctime"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text); display: inline-flex;gap:5px;">任务状态
                        <div class="status-badge status-done" v-if="selectedItem.status==='1'">启用</div>
                        <div class="status-badge badge-done" v-if="selectedItem.status!=='1'">停止</div>
                    </span>
                    <el-switch
                        v-model="curStatus"
                        :disabled="!isEdit"
                        @change="handleTaskStatusChange"
                    />
                </div>
            </div>
        </div>
        <div class="stat-card"><!--工序信息-->
            <div class="stat-card header"><span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">工序作业信息</span></div>
            <div class="divider">
            </div>
            <div class="stat-card content">
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>工序序号</span>
                    <el-input :disabled="!isEdit" v-model="techList.techid" type="number" step="1" placeholder="请输入工序序号"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>工序作业名称</span>
                    <el-input :disabled="!isEdit" v-model="techList.techname" placeholder="请输入工序作业名称" maxlength="100"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>质量特性</span>
                    <el-input :disabled="!isEdit" v-model="techList.ch" placeholder="请输入质量特性" maxlength="100"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>目标标准值</span>
                    <el-input :disabled="!isEdit" v-model="techList.standard" type="number" step="0.000001" placeholder="请输入目标标准值"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>USL</span>
                    <el-input :disabled="!isEdit" v-model="techList.usl" type="number" step="0.000001" placeholder="请输入USL"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>LSL</span>
                    <el-input :disabled="!isEdit" v-model="techList.lsl" type="number" step="0.000001" placeholder="请输入LSL"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>组内样本量</span>
                    <el-input :disabled="!isEdit" v-model="techList.set" type="number" min="5" max="25" step="1" placeholder="5-25" />
                    <span v-if="subgroupSizeError && isEdit" class="validation-error">{{ subgroupSizeError }}</span>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);"><span class="required">*</span>总体样本量</span>
                    <el-input :disabled="!isEdit" v-model="techList.total" type="number" min="5" step="1" placeholder="组内样本量的整倍数" />
                    <span v-if="totalSampleSizeError && isEdit" class="validation-error">{{ totalSampleSizeError }}</span>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">作业设备编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.devid"></el-input>
                </div>
                <!-- <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">仪器/治具编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.devid"></el-input>
                </div> -->
            </div>
        </div>
        <div class="measure-table">
            <div class="stat-card header">
                <span v-if="!isAddMode" style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">{{ "测量数据表-"+selectedItem.pid || ""+`-${selectedItem.pname ?? ""}` }}</span>
                <span v-else style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">测量数据表</span> 
                <!-- PC端按钮布局 -->
                <div v-if="!isMobile" style="display: flex; align-items: center; gap: 8px;">
                     <el-button type="primary" plain :disabled="!isEdit" @click="addNewRow">
                        <el-icon><list-icon /></el-icon> 新增数据
                    </el-button>

                    <el-button type="primary" plain @click="exportTemplate">
                        <el-icon><excel-icon /></el-icon> 导出导入模板
                    </el-button>

                    <el-button type="success" plain :disabled="!isEdit" @click="importExcel">
                        <el-icon><excel-icon /></el-icon> 导入Excel
                      
                    </el-button>

                    <el-button type="success" plain @click="exportExcel">
                        <el-icon><excel-icon /></el-icon> 导出Excel
                    </el-button>
                </div>
                <!-- 移动端下拉菜单 -->
                <div v-else class="mobile-actions">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <el-button type="primary">
                            <el-icon><more-filled /></el-icon> 更多操作
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="'add'">
                                    <el-icon><list-icon /></el-icon> 新增数据
                                </el-dropdown-item>
                                <el-dropdown-item :command="'exportTemplate'">
                                    <el-icon><excel-icon /></el-icon> 导出导入模板
                                </el-dropdown-item>
                                <el-dropdown-item :command="'import'">
                                    <el-icon><excel-icon /></el-icon> 导入Excel
                                </el-dropdown-item>
                                <el-dropdown-item :command="'export'">
                                    <el-icon><excel-icon /></el-icon> 导出Excel
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="divider"></div>
            <div class="control-chart-data">
                <el-table
                    :data="tableData"
                    style="width: 100%; table-layout: auto;"
                    row-key="id"
                    :row-class-name="getRowClass"
                    :header-row-class-name="'header-row'"
                >
                    <el-table-column prop="subgroupId" label="样本组" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model="scope.row.subgroupId"
                        size="small"
                        />
                        <span v-else>{{ scope.row.subgroupId }}</span>
                    </template>
                    </el-table-column>

                    <el-table-column prop="datetime" label="日期时间" align="center">
                    <template #default="scope">
                        <el-input
                          v-if="scope.row.isNew"
                          v-model="formattedTime"
                          size="small"
                        />
                        <span v-else>{{ scope.row.datetime }}</span>
                    </template>
                    </el-table-column>

                    <!-- 动态样本值列 (根据组内样本量) -->
                    <el-table-column v-for="colIdx in valueColumnIndexes" :key="colIdx" :label="'值' + (colIdx + 1)" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.values[colIdx]"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, colIdx)">
                        {{ scope.row.values[colIdx] }}
                        </span>
                    </template>
                    </el-table-column>

                    <!-- 均值 -->
                    <el-table-column prop="mean" label="均值" align="center">
                    <template #default="scope">
                        <span v-if="!scope.row.isNew" :class="getMeanStatusClass(scope.row.mean)">
                        {{ scope.row.mean }}
                        </span>
                        <span v-else>{{ scope.row.mean ?? '--' }}</span>
                    </template>
                    </el-table-column>

                    <!-- 极差 -->
                    <el-table-column prop="range" label="极差" align="center">
                    <template #default="scope">
                        {{ scope.row.isNew ? (scope.row.range ?? '--') : scope.row.range }}
                    </template>
                    </el-table-column>

                    <!-- 整体均值 / 极差（原逻辑） -->
                    <el-table-column prop="overallMean" label="整体均值" align="center">
                    <template #default>{{ overallMean }}</template>
                    </el-table-column>

                    <el-table-column prop="overallRange" label="整体极差" align="center">
                    <template #default>{{ overallRange }}</template>
                    </el-table-column>

                    <!-- 状态 -->
                    <el-table-column prop="status" label="状态" align="center">
                    <template #default="scope">
                        <el-tag
                        v-if="!scope.row.isNew"
                        :type="getStatusTagType(scope.row.status)"
                        size="small"
                        class="status-tag"
                        >
                        {{ scope.row.status }}
                        </el-tag>
                        <span v-else>--</span>
                    </template>
                    </el-table-column>

                    <!-- 操作员 -->
                    <el-table-column prop="operator" label="操作员" align="center">
                    <template #default="scope">
                        <el-input v-if="scope.row.isNew" v-model="scope.row.operator" size="small" />
                        <span v-else>{{ scope.row.operator }}</span>
                    </template>
                    </el-table-column>

                    <!-- 备注 + 确认取消 -->
                    <el-table-column prop="remark" label="备注" width="120" align="center">
                    <template #default="scope">
                        <!-- <template v-if="scope.row.isNew">
                        <el-button size="small" type="success" @click="confirmNewRow(scope.row)">
                            确认
                        </el-button>
                        <el-button size="small" type="danger" @click="cancelNewRow(scope.row.id)">
                            取消
                        </el-button>
                        </template> -->
                        <el-input v-if="scope.row.isNew" v-model="scope.row.remark" size="small" />
                        <span v-else>{{ scope.row.remark }}</span>
                    </template>
                    </el-table-column>

                    <!-- 启用状态 -->
                    <el-table-column prop="switch" label="启用状态" align="center" fixed="right" width="120">
                    <template #default="scope">
                      <template v-if="scope.row.isNew">
                        <el-button size="small" type="success" @click="confirmNewRow(scope.row)">
                            确认
                        </el-button>
                        <el-button size="small" type="danger" @click="cancelNewRow(scope.row.id)">
                            取消
                        </el-button>
                        </template>
                        <el-switch
                        v-else
                        v-model="scope.row.enabled"
                        :disabled="!isEdit"
                        @change="handleSwitchChange(scope.row)"
                        />
                    </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 -->
                <div class="pagination-container">
                    <div class="pagination-info">
                        共 {{ sampleData.length }} 条数据，当前显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, sampleData.length) }} 条
                    </div>
                    <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :small="true"
                        :disabled="false"
                        :background="true"
                        layout="sizes, prev, pager, next, jumper"
                        :total="sampleData.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>            
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, reactive, nextTick } from 'vue'
import { showSuccess, showError, showWarning, showInfo } from '@/utils/message';
import { MoreFilled } from '@element-plus/icons-vue';
import leftArrow from '@/components/icons/leftArrow.vue';
import listIcon from '@/components/icons/listIcon.vue';
import excelIcon from '@/components/icons/excelIcon.vue';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTime } from '@/utils/clock';
import { formatTimeStamp } from '@/utils/functions';
import { useDebounceFn } from '@/utils/functions';
import { getTaskDetail, getMeasurements, createTask, createMeasurementBatch, updateTask, updateMeasurement, updateTaskStatus, getControlChart, getCapability } from '@/api/modules';

const { formattedTime } = useTime(1000, 'full', 'zh-CN', '-')

// 移动端检测
const isMobile = ref(window.innerWidth <= 768)

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 下拉菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'add':
      addNewRow()
      break
    case 'exportTemplate':
      exportTemplate()
      break
    case 'import':
      importExcel()
      break
    case 'export':
      exportExcel()
      break
  }
}

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
    workOrderId?: number;
    _rawData?: {
        id?: number;
    };
}

const prop = defineProps<{
    isShowDetails: boolean;
    selectedItem: data;
    isEdit: boolean; //true：编辑模式 false：只读模式
}>()

// 计算属性：判断是否为新增模式
const isAddMode = computed(() => {
    return prop.isEdit && (!prop.selectedItem?._rawData?.id)
})
// 必填字段验证（除作业设备编码外均为必填）
const validateRequired = () => {
    const fields: { label: string; value: any }[] = [
        { label: '工作任务号', value: prop.selectedItem.tid },
        { label: '工单号', value: prop.selectedItem.ticket },
        { label: '行号', value: prop.selectedItem.line },
        { label: '产品编码', value: prop.selectedItem.pid },
        { label: '产品名称', value: prop.selectedItem.pname },
        { label: '规格/型号', value: spec.value },
        { label: '计量单位', value: unit.value },
        { label: '工艺路线名称', value: technic.value },
        { label: '工序序号', value: techList.value.techid },
        { label: '工序作业名称', value: techList.value.techname },
        { label: '质量特性', value: techList.value.ch },
        { label: '目标标准值', value: techList.value.standard },
        { label: '组内样本量', value: techList.value.set },
        { label: '总体样本量', value: techList.value.total },
        { label: 'USL', value: techList.value.usl },
        { label: 'LSL', value: techList.value.lsl },
    ]
    for (const field of fields) {
        if (field.value === '' || field.value == null || field.value === undefined) {
            showError(`请填写必填字段：${field.label}`)
            return false
        }
    }
    return true
}

const saving = ref(false)

// 保存任务处理函数（防抖包装）
const handleSave = async () => {
    // 必填字段验证
    if (!validateRequired()) return
    saving.value = true
    try {

        // 验证组内样本量
        const ss = parseInt(techList.value.set)
        if (techList.value.set !== '' && techList.value.set != null) {
            if (isNaN(ss) || ss < 5 || ss > 25) {
                showError('组内样本量需在 5-25 之间')
                return
            }
        }
        // 验证总体样本量
        const ts = parseInt(techList.value.total)
        if (techList.value.total !== '' && techList.value.total != null) {
            const effectiveSs = ss || 5
            if (isNaN(ts) || ts < effectiveSs) {
                showError(`总体样本量不能小于组内样本量 (${effectiveSs})`)
                return
            }
            if (ts % effectiveSs !== 0) {
                showError(`总体样本量必须是组内样本量 (${effectiveSs}) 的整倍数`)
                return
            }
        }
        if (isAddMode.value) {
            // ===== 新增模式 =====
            const taskData: any = {
                workOrderId: prop.selectedItem.workOrderId,
                taskNo: prop.selectedItem.tid,
                lineNo: prop.selectedItem.line != null ? parseInt(String(prop.selectedItem.line)) : undefined,
                productCode: prop.selectedItem.pid,
                productName: prop.selectedItem.pname,
                processName: techList.value.techname,
                processSequence: techList.value.techid,
                spec: spec.value,
                unit: unit.value,
                processRouteName: technic.value,
                qualityChar: techList.value.ch,
                targetValue: techList.value.standard ? parseFloat(techList.value.standard) : undefined,
                usl: techList.value.usl ? parseFloat(techList.value.usl) : undefined,
                lsl: techList.value.lsl ? parseFloat(techList.value.lsl) : undefined,
                subgroupSize: techList.value.set ? parseInt(techList.value.set) : undefined,
                totalSampleSize: techList.value.total ? parseInt(techList.value.total) : undefined,
                equipmentCode: prop.selectedItem.devid || null,
                instrumentCode: prop.selectedItem.devid || null,
            }

            const result = await createTask(taskData)
            if (result.code >= 400) {
                showError(result.message || result.msg || '创建任务失败')
                return
            }
            const newTaskId = result.data?.id

            // 若有测量数据，批量创建
            if (sampleData.value.length > 0) {
                const measurementItems = sampleData.value.map(row => ({
                    sampleValues: row.values,
                    groupNo: parseInt(row.subgroupId) || undefined,
                    measureTime: row.datetime || undefined,
                    operator: row.operator || undefined,
                    remark: row.remark || undefined,
                }))
                const batchRes = await createMeasurementBatch(String(newTaskId), measurementItems)
                if (batchRes.code >= 400) {
                    showError(batchRes.message || batchRes.msg || '创建测量数据失败')
                    return
                }
                if (batchRes.data?.errors?.length > 0) {
                    showError('数据创建失败: ' + batchRes.data.errors.join('; '))
                    return
                }
            }

            // 刷新页面数据（新增模式无法用 taskId computed 刷新，直接跳过）
            // 通知父组件
            emit('save', { mode: 'create', taskId: newTaskId })
            showSuccess(result.msg || '任务创建成功')
        } else {
            // ===== 编辑模式 =====
            const taskId = prop.selectedItem._rawData?.id
            if (!taskId) {
                showError('缺少任务ID，无法更新')
                return
            }

            const updateData: any = {
                taskNo: prop.selectedItem.tid,
                lineNo: prop.selectedItem.line != null ? parseInt(String(prop.selectedItem.line)) : undefined,
                productCode: prop.selectedItem.pid,
                productName: prop.selectedItem.pname,
                processName: techList.value.techname,
                processSequence: techList.value.techid,
                spec: spec.value,
                unit: unit.value,
                processRouteName: technic.value,
                qualityChar: techList.value.ch,
                targetValue: techList.value.standard ? parseFloat(techList.value.standard) : undefined,
                usl: techList.value.usl ? parseFloat(techList.value.usl) : undefined,
                lsl: techList.value.lsl ? parseFloat(techList.value.lsl) : undefined,
                subgroupSize: techList.value.set ? parseInt(techList.value.set) : undefined,
                totalSampleSize: techList.value.total ? parseInt(techList.value.total) : undefined,
                equipmentCode: prop.selectedItem.devid || null,
                instrumentCode: prop.selectedItem.devid || null,
            }

            // 更新任务基本信息
            const res = await updateTask(String(taskId), updateData)
            if (res.code >= 400) {
                showError(res.message || res.msg || '更新任务失败')
                return
            }

            // 测量数据差异处理
            const newMeasurementItems: any[] = []
            for (const row of sampleData.value) {
                if (row.id && !row.id.startsWith('sample-') && !row.id.startsWith('new-')) {
                    // 已有行：与原始数据对比，有差异则更新
                    const originalRow = originalData.value?.sampleData?.find((r: any) => r.id === row.id)
                    if (originalRow) {
                        const currentForCompare = {
                            sampleValues: row.values,
                            measureTime: row.datetime,
                            operator: row.operator,
                            remark: row.remark,
                            enabled: row.enabled ? 1 : 0,
                        }
                        const originalForCompare = {
                            sampleValues: originalRow.values,
                            measureTime: originalRow.datetime,
                            operator: originalRow.operator,
                            remark: originalRow.remark,
                            enabled: originalRow.enabled ? 1 : 0,
                        }
                        if (JSON.stringify(currentForCompare) !== JSON.stringify(originalForCompare)) {
                            const updateRes = await updateMeasurement(String(row.id), {
                                sampleValues: row.values,
                                measureTime: row.datetime || undefined,
                                operator: row.operator || undefined,
                                remark: row.remark || undefined,
                                enabled: row.enabled ? 1 : 0,
                            })
                            if (updateRes.code >= 400) {
                                showError(updateRes.message || updateRes.msg || '更新测量数据失败')
                                return
                            }
                        }
                    }
                } else {
                    // 新增行：收集到数组中
                    newMeasurementItems.push({
                        sampleValues: row.values,
                        groupNo: parseInt(row.subgroupId) || undefined,
                        measureTime: row.datetime || undefined,
                        operator: row.operator || undefined,
                        remark: row.remark || undefined,
                        enabled: row.enabled ? 1 : 0,
                    })
                }
            }

            // 批量创建新增的测量数据
            if (newMeasurementItems.length > 0) {
                const batchRes = await createMeasurementBatch(String(taskId), newMeasurementItems)
                if (batchRes.code >= 400) {
                    showError(batchRes.message || batchRes.msg || '创建测量数据失败')
                    return
                }
                if (batchRes.data?.errors?.length > 0) {
                    showError('数据创建失败: ' + batchRes.data.errors.join('; '))
                    return
                }
            }

            // 刷新页面数据
            await fetchTaskDetail()
            await fetchMeasurements()

            // 更新原始数据副本
            saveOriginalData()

            // 通知父组件
            emit('save', { mode: 'update', taskId })
            showSuccess(res.msg || '任务更新成功')
        }
    } catch (error: any) {
        console.error('保存失败:', error)
        const status = error.response?.status
        const apiMsg = error.response?.data?.msg || error.response?.data?.message
        if (apiMsg) {
            showError(apiMsg)
        } else if (status === 400) {
            showError('请求参数有误，请检查必填字段')
        } else if (status === 404) {
            showError('任务不存在，请刷新后重试')
        } else if (status === 500) {
            showError('服务器内部错误，请稍后重试')
        } else if (error.message?.includes('timeout')) {
            showError('请求超时，请检查网络连接')
        } else {
            showError('保存失败: ' + (error.message || '未知错误'))
        }
    } finally {
        saving.value = false
    }
}
const emit = defineEmits(['close','change', 'save'])

// 防抖保存
const handleSaveDebounced = useDebounceFn(handleSave, 500)

const spec = ref('')
const unit = ref('')
const technic = ref('')
const techList = ref({
    techid: '',
    techname: '',
    ch: '',
    standard: '',
    usl: '',
    lsl: '',
    set: '',
    total: '',
})

// 控制限数据（用于状态判断）
const controlLimits = ref<{ ucl: number; cl: number; lcl: number } | null>(null)
const sigmaValue = ref<number>(0)

// 任务ID
const taskId = computed(() => prop.selectedItem?._rawData?.id)

// 获取任务详情
const fetchTaskDetail = async () => {
    if (!taskId.value) return
    try {
        const res = await getTaskDetail(String(taskId.value))
        if (res.code === 200 && res.data) {
            const data = res.data
            spec.value = data.spec || ''
            unit.value = data.unit || ''
            technic.value = data.processRouteName || ''
            techList.value = {
                techid: data.processSequence || '',
                techname: data.processName || '',
                ch: data.qualityChar || '',
                standard: data.targetValue?.toString() || '',
                usl: data.usl?.toString() || '',
                lsl: data.lsl?.toString() || '',
                set: data.subgroupSize?.toString() || '',
                total: data.totalSampleSize?.toString() || '',
            }
        }
    } catch (error) {
        console.error('获取任务详情失败:', error)
        showError('获取任务详情失败')
    }
}

// 获取控制限和sigma数据
const fetchControlLimitsAndSigma = async () => {
    if (!taskId.value) return
    try {
        const [controlRes, capabilityRes] = await Promise.all([
            getControlChart(String(taskId.value)),
            getCapability(String(taskId.value))
        ])
        if (controlRes.code === 200 && controlRes.data?.limits?.xbar) {
            controlLimits.value = {
                ucl: controlRes.data.limits.xbar.ucl,
                cl: controlRes.data.limits.xbar.cl,
                lcl: controlRes.data.limits.xbar.lcl
            }
        } else {
            controlLimits.value = null
        }
        if (capabilityRes.code === 200 && capabilityRes.data) {
            sigmaValue.value = capabilityRes.data.sigma || 0
        } else {
            sigmaValue.value = 0
        }
    } catch (error) {
        console.error('获取控制限和sigma数据失败:', error)
        controlLimits.value = null
        sigmaValue.value = 0
    }
}

const judgeStatus = (value: number): '正常' | '警告' | '异常' => {
    if (!controlLimits.value || sigmaValue.value === 0) return '正常'
    const { ucl, cl, lcl } = controlLimits.value
    const sigma = sigmaValue.value
    if (value > ucl || value < lcl) return '异常'
    if (value > cl + sigma || value < cl - sigma) return '警告'
    return '正常'
}

// 获取测量数据
const fetchMeasurements = async () => {
    if (!taskId.value) return
    try {
        const res = await getMeasurements(String(taskId.value))
        if (res.code === 200 && res.data) {
            const groupMeans: number[] = []
            const groupRanges: number[] = []
            
            sampleData.value = res.data.map((item: any, index: number) => {
                const rawValues = item.sampleValues || []
                const n = subgroupSizeNum.value
                // 根据组内样本量调整数组长度
                const values: (number | null)[] = []
                for (let i = 0; i < n; i++) {
                    values.push(rawValues[i] != null ? rawValues[i] : null)
                }
                const validValues = values.filter((v: number | null): v is number => v != null)
                const mean = validValues.length > 0
                    ? validValues.reduce((a: number, b: number) => a + b, 0) / validValues.length
                    : 0
                const range = validValues.length > 1
                    ? Math.max(...validValues) - Math.min(...validValues)
                    : 0

                groupMeans.push(mean)
                groupRanges.push(range)

                const status = judgeStatus(mean)

                return {
                    id: item.id?.toString() || `sample-${index + 1}`,
                    subgroupId: item.groupNo?.toString() || `SG${100 + index + 1}`,
                    datetime: item.measureTime ? formatDateTime(item.measureTime) : '',
                    values,
                    mean: parseFloat(mean.toFixed(2)),
                    range: parseFloat(range.toFixed(2)),
                    status,
                    operator: item.operator || '',
                    remark: item.remark || '',
                    enabled: item.enabled === 1
                }
            })
            
            // 计算整体均值和极差
            if (groupMeans.length > 0) {
                overallMean.value = parseFloat((groupMeans.reduce((sum, val) => sum + val, 0) / groupMeans.length).toFixed(2))
                overallRange.value = parseFloat((groupRanges.reduce((sum, val) => sum + val, 0) / groupRanges.length).toFixed(2))
            }
        }
    } catch (error) {
        console.error('获取测量数据失败:', error)
        showError('获取测量数据失败')
    }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 监听任务切换，获取任务详情和测量数据
watch(()=>prop.selectedItem, async (val)=> {
  if (val && val._rawData?.id) {
    // 获取任务详情和测量数据
    await fetchTaskDetail()
    await fetchControlLimitsAndSigma()
    await fetchMeasurements()
    saveOriginalData()
  } else if (isAddMode.value) {
    // 新增模式
    spec.value = ''
    unit.value = ''
    technic.value = ''
    techList.value = {
      techid: '',
      techname: '',
      ch: '',
      standard: '',
      usl: '',
      lsl: '',
      set: '',
      total: '',
    }
    sampleData.value = []
    overallMean.value = 0
    overallRange.value = 0
  }
}, { immediate: true })

interface SampleData {
  id: string
  subgroupId: string
  datetime: string
  values: (number | null)[]
  mean: number | null
  range: number | null
  status: '正常' | '警告' | '异常'
  operator: string
  remark: string
  enabled: boolean
  isNew?: boolean
}

// 组内样本量数字计算属性
const subgroupSizeNum = computed(() => {
  const val = parseInt(techList.value.set)
  if (isNaN(val) || val < 5) return 5
  if (val > 25) return 25
  return val
})

// 总体样本量数字计算属性
const totalSampleSizeNum = computed(() => {
  const val = parseInt(techList.value.total)
  if (isNaN(val)) return Math.max(200, subgroupSizeNum.value)
  return val
})

// 动态值列索引
const valueColumnIndexes = computed(() => {
  return Array.from({ length: subgroupSizeNum.value }, (_, i) => i)
})

// 组内样本量错误提示
const subgroupSizeError = computed(() => {
  const val = techList.value.set
  if (val === '' || val == null) return ''
  const num = parseInt(val)
  if (isNaN(num)) return '请输入有效整数'
  if (num < 5 || num > 25) return '组内样本量需在 5-25 之间'
  return ''
})

// 总体样本量错误提示
const totalSampleSizeError = computed(() => {
  const val = techList.value.total
  if (val === '' || val == null) return ''
  const num = parseInt(val)
  if (isNaN(num)) return '请输入有效整数'
  const ss = parseInt(techList.value.set) || 5
  if (num < ss) return `总体样本量不能小于组内样本量 (${ss})`
  if (num % ss !== 0) return `总体样本量必须是组内样本量 (${ss}) 的整倍数`
  return ''
})


// 响应式数据
const sampleData = ref<SampleData[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const overallMean = ref(0)
const overallRange = ref(0)

const editingRows = ref<SampleData[]>([])

// 原始数据副本，用于检测未保存的修改
const originalData = ref<any>(null)

// 保存原始数据副本
const saveOriginalData = () => {
  originalData.value = {
    editingRows: JSON.parse(JSON.stringify(editingRows.value)),
    sampleData: JSON.parse(JSON.stringify(sampleData.value)),
    techList: JSON.parse(JSON.stringify(techList.value)),
    spec: spec.value,
    unit: unit.value,
    technic: technic.value
  }
}

// 计算属性：检测是否有未保存的修改
const hasUnsavedChanges = computed(() => {
  if (!prop.isEdit || !originalData.value) {
    return false
  }

  // 检查是否有正在编辑的新增行
  if (editingRows.value.length > 0) {
    return true
  }

  // 检查样本数据是否发生变化
  if (JSON.stringify(sampleData.value) !== JSON.stringify(originalData.value.sampleData)) {
    return true
  }

  // 检查工序信息是否发生变化
  if (JSON.stringify(techList.value) !== JSON.stringify(originalData.value.techList)) {
    return true
  }

  // 检查其他表单字段是否发生变化
  if (spec.value !== originalData.value.spec) {
    return true
  }
  if (unit.value !== originalData.value.unit) {
    return true
  }
  if (technic.value !== originalData.value.technic) {
    return true
  }

  return false
})

// beforeunload 事件处理函数
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (prop.isEdit && hasUnsavedChanges.value) {
    event.returnValue = '您有未保存的修改，确定要离开吗？'
    return event.returnValue
  }
}

// 检查未保存修改的方法（供父组件调用）
const checkUnsavedChanges = () => {
  return hasUnsavedChanges.value
}

// 计算属性：分页后的数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  console.log("测量数据表：",sampleData.value.slice(start, end))
  return sampleData.value.slice(start, end)
})

// 计算属性：表格显示的数据
const tableData = computed(() => [
  ...editingRows.value,
  ...pagedData.value
])

const curStatus = computed({
    get: () => prop.selectedItem.status === '1',
    set: (val: boolean) => {
        prop.selectedItem.status = val ? '1' : '0'
    }
})

const handleTaskStatusChange = async () => {
    try {
        const taskId = prop.selectedItem._rawData?.id
        if (!taskId) {
            showError('任务ID不存在')
            prop.selectedItem.status = prop.selectedItem.status === '1' ? '0' : '1'
            return
        }

        const newStatus = prop.selectedItem.status === '1' ? 1 : 0

        const res = await updateTaskStatus(String(taskId), newStatus as 0 | 1)

        if (res.code === 200) showSuccess(newStatus === 1 ? '任务已启用' : '任务已停用')
        else showError('状态切换失败')

        // emit('change')
    } catch (error) {
        console.error('状态切换失败:', error)
        prop.selectedItem.status = prop.selectedItem.status === '1' ? '0' : '1'
        showError('状态切换失败')
    }
}

// 获取行样式类
const getRowClass = ({ row }: { row: SampleData }) => {
  if (row.status === '异常') return 'data-point-error'
  if (row.status === '警告') return 'data-point-warning'
  return 'data-point-normal'
}

// 获取数据点样式类
const getDataPointClass = (row: SampleData, valueIndex: number) => {
  const value = row.values[valueIndex] as number
  if (value === null || value === undefined) return ''

  if (!controlLimits.value || sigmaValue.value === 0) return ''

  const status = judgeStatus(value)
  if (status === '异常') return 'data-point-error'
  if (status === '警告') return 'data-point-warning'
  return 'data-point-normal'
}

// 获取均值状态样式类
const getMeanStatusClass = (mean: number) => {
  if (mean === null || mean === undefined) return ''

  if (!controlLimits.value || sigmaValue.value === 0) return ''

  const status = judgeStatus(mean)
  if (status === '异常') return 'data-point-error'
  if (status === '警告') return 'data-point-warning'
  return 'data-point-normal'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case '正常': return 'success'
    case '警告': return 'warning'
    case '异常': return 'danger'
    default: return 'info'
  }
}

// 开关变化处理
const handleSwitchChange = (row: SampleData) => {
  showInfo(`${row.subgroupId} 状态已${row.enabled ? '启用' : '禁用'}`)
  console.log('开关状态变化:', row)
}

// 分页事件处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

/* ================= 新增数据 ================= */

const addNewRow = () => {
  editingRows.value.unshift({
    id: `new-${Date.now()}`,
    subgroupId: String(
        sampleData.value.length > 0
            ? Math.max(...sampleData.value.map((r: any) => parseInt(r.subgroupId) || 0)) + 1
            : 1
    ),
    datetime: '',
    values: new Array(subgroupSizeNum.value).fill(null),
    mean: null,
    range: null,
    status: '正常',
    operator: '',
    remark: '',
    enabled: true,
    isNew: true
  })
}

/* 自动算 X̄ / R */
const calcNewRow = (row: SampleData) => {
  const values = row.values.filter(v => typeof v === 'number') as number[]
  const n = subgroupSizeNum.value

  if (values.length === n && n > 0) {
    row.mean = +(values.reduce((a, b) => a + b, 0) / n).toFixed(2)
    row.range = +(Math.max(...values) - Math.min(...values)).toFixed(2)
  } else {
    row.mean = null
    row.range = null
  }
}

const recalcOverall = () => {
  const means = sampleData.value.map(i => i.mean!).filter(Boolean)
  const ranges = sampleData.value.map(i => i.range!).filter(Boolean)

  overallMean.value = +(means.reduce((a, b) => a + b, 0) / means.length).toFixed(2)
  overallRange.value = +(ranges.reduce((a, b) => a + b, 0) / ranges.length).toFixed(2)
}


/* 确认新增 */
const confirmNewRow = (row: SampleData) => {
  const n = subgroupSizeNum.value
  const hasAllValues = row.values.slice(0, n).every(v => v != null)
  if (!hasAllValues) {
    showWarning(`请填写完整 ${n} 个样本值`)
    return
  }

  row.status = judgeStatus(row.mean ?? 0)

  row.isNew = false
  row.datetime = formattedTime.value
  sampleData.value.unshift(row)
  editingRows.value = editingRows.value.filter(r => r.id !== row.id)

  recalcOverall()
  showSuccess('新增成功')
}

const cancelNewRow = (id: string) => {
  editingRows.value = editingRows.value.filter(r => r.id !== id)
}

/* ================= Excel 模板 ================= */

const exportTemplate = () => {
  const n = subgroupSizeNum.value
  const valueHeaders = Array.from({ length: n }, (_, i) => `值${i + 1}`)
  const headers = [
    ['样本组', '时间', ...valueHeaders, '操作员', '备注']
  ]
  const sheet = XLSX.utils.aoa_to_sheet(headers)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, '模板')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer]), '测量数据模板.xlsx')
}

/* ================= Excel 导入 ================= */

const importExcel = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.csv'
  input.onchange = handleFile
  input.click()
}

const handleFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = evt => {
    const wb = XLSX.read(evt.target?.result, { type: 'binary', cellDates: true, cellNF: false })
    const name = wb.SheetNames[0]
    if (!name) {
        showError("Excel 中未找到工作表")
        return
    }
    const sheet = wb.Sheets[name]
    if (!sheet) {
        showError("Excel 中未找到工作表")
        return
    }
    const rows: any[] = XLSX.utils.sheet_to_json(sheet)

    rows.forEach((r, i) => {
      const n = subgroupSizeNum.value
      const values: (number | null)[] = []
      for (let j = 0; j < n; j++) {
        const v = r[`值${j + 1}`]
        values.push(v != null ? v : null)
      }
      const validValues = values.filter((v): v is number => v != null)
      const mean = validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0
      const range = validValues.length > 1 ? Math.max(...validValues) - Math.min(...validValues) : 0

      sampleData.value = [
        {
        id: `import-${Date.now()}-${i}`,
        subgroupId: r['样本组'],
        datetime: formatTimeStamp(r['时间']),
        values,
        mean: +mean.toFixed(2),
        range: +range.toFixed(2),
        status: r['状态'] ?? '正常',
        operator: r['操作员'],
        remark: r['备注'] ?? ''
      } as SampleData,
      ...sampleData.value
      ]
    })

    showSuccess('导入成功')
  }
  reader.readAsBinaryString(file)
}

/* ================= Excel 导出 ================= */

const exportExcel = () => {
  const rows = sampleData.value.map(r => {
    const row: any = {
      样本组: r.subgroupId,
      时间: r.datetime,
    }
    const n = subgroupSizeNum.value
    for (let i = 0; i < n; i++) {
      row[`值${i + 1}`] = r.values[i]
    }
    row.均值 = r.mean
    row.极差 = r.range
    row.状态 = r.status
    row.操作员 = r.operator
    row.备注 = r.remark
    return row
  })

  const sheet = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, '测量数据')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer]), '测量数据表.xlsx')
}

// 监听组内样本量变化，调整已有数据
watch(() => techList.value.set, (newVal, oldVal) => {
  if (newVal && oldVal && newVal !== oldVal && !isAddMode.value) {
    const newSize = parseInt(newVal)
    if (newSize >= 5 && newSize <= 25 && sampleData.value.length > 0) {
      sampleData.value.forEach(row => {
        if (row.values.length < newSize) {
          row.values = [...row.values, ...new Array(newSize - row.values.length).fill(null)]
        } else if (row.values.length > newSize) {
          row.values = row.values.slice(0, newSize)
        }
      })
      // 重新计算均值和极差
      sampleData.value.forEach(row => {
        const validValues = row.values.filter((v): v is number => v != null)
        if (validValues.length > 0) {
          const mean = validValues.reduce((a, b) => a + b, 0) / validValues.length
          row.mean = parseFloat(mean.toFixed(2))
          row.range = validValues.length > 1
            ? parseFloat((Math.max(...validValues) - Math.min(...validValues)).toFixed(2))
            : 0
          row.status = judgeStatus(mean)
        }
      })
      recalcOverall()
    }
  }
}, { immediate: false })
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 暴露方法供父组件调用
defineExpose({ checkUnsavedChanges })
</script>

<style scoped lang="scss">
.task-detail {
    position: inherit;
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

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;

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

.control-chart-data {
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  overflow-x: hidden;
  border: 1px solid #ebeef5;
  
  :deep(.el-table) {
    width: 100%;
    
    .header-row {
      background-color: #f5f7fa;
      
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
        border-bottom: 1px solid #ebeef5;
      }
    }
    
    .data-point-error {
      --el-table-tr-bg-color: #fff2f0;
      
      &:hover > td {
        background-color: #fff2f0 !important;
      }
    }
    
    .data-point-warning {
      --el-table-tr-bg-color: #fffbe6;
      
      &:hover > td {
        background-color: #fffbe6 !important;
      }
    }
    
    .data-point-normal {
      --el-table-tr-bg-color: #fff;
      
      &:hover > td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

:deep(.el-table td.el-table__cell div) {
  display: flex !important;
  justify-content: center !important;
}

// 数据点样式
.data-point-error {
  color: #ff4d4f;
  font-weight: 600;
}

.data-point-warning {
  color: #fa8c16;
  font-weight: 600;
}

.data-point-normal {
  color: #52c41a;
  font-weight: 600;
}

// 状态标签样式
.status-tag {
  font-weight: 600;
  letter-spacing: 1px;
}

// 分页容器样式
.pagination-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
  padding: 16px;
}

.pagination-info {
    font-size: 14px;
    color: #666;
}

// 响应式调整
@media screen and (max-width: 1200px) {
  .table-container {
    font-size: 12px;
  }
  
  .status-tag {
    font-size: 10px;
  }
}

/* ====================================
   移动端适配 (768px 以下)
   ==================================== */
@media (max-width: 768px) {
  .task-detail {
    padding: 70px 12px 12px;
  }

  // 顶部导航区域
  .redirector {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    
    > div:first-child {
      font-size: 14px !important;
      gap: 6px !important;
      
      span {
        font-size: 14px !important;
      }
    }
    
    > div:last-child {
      flex-wrap: wrap;
      justify-content: center;
      
      .el-button {
        font-size: 12px;
        padding: 8px 12px;
        
        span {
          font-size: 14px !important;
        }
      }
    }
  }

  // 卡片标题调整
  .stat-card.header {
    padding: 12px;
    
    span {
      font-size: 16px !important;
    }
  }

  // 表单内容区域 - 改为两列
  .stat-card.content {
    padding: 12px;
    gap: 12px;
  }

  .stat-card.sub {
    min-width: calc(50% - 8px);
    flex: 0 0 calc(50% - 8px);
    
    span {
      font-size: 13px;
    }
  }

  // 输入框调整
  .el-input {
    font-size: 13px;
  }

  // 按钮区域
  .button-group {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    
    .el-button {
      width: 100%;
    }
  }

  // 表格区域
  .table-container {
    overflow-x: auto;
    
    .el-table {
      font-size: 12px;
    }
  }

  // 分页调整
  .pagination-container {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }
}

/* ====================================
   小屏幕设备 (480px 以下)
   ==================================== */
@media (max-width: 480px) {
  .task-detail {
    padding: 0 8px 8px;
  }

  .redirector {
    padding: 10px;
    
    > div:first-child {
      font-size: 13px !important;
      flex-wrap: wrap;
      
      span {
        font-size: 13px !important;
      }
    }
  }

  .stat-card.header {
    padding: 10px;
    
    span {
      font-size: 14px !important;
    }
  }

  .stat-card.content {
    padding: 10px;
    gap: 10px;
  }

  .stat-card.sub {
    min-width: 100%;
    flex: 0 0 100%;
    
    span {
      font-size: 12px;
    }
  }

  .el-input {
    font-size: 12px;
  }

  .button-group {
    .el-button {
      font-size: 12px;
      padding: 6px 10px;
    }
  }
}

// 验证错误提示
.validation-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 2px;
  line-height: 1.2;
}

// 必填字段标记
.required {
  color: #ff4d4f;
  margin-right: 2px;
  font-weight: bold;
}
</style>