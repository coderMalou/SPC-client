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
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text); display: inline-flex;gap:5px;">任务状态
                        <div class="status-badge status-done" v-if="selectedItem.status==='0'">启用</div>
                        <div class="status-badge badge-done" v-if="selectedItem.status!=='0'">停止</div>
                    </span>
                    <el-switch
                        v-model="curStatus"
                        @change="$emit('change')"
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
            <div class="control-chart-data">
                <el-table
                    :data="pagedData"
                    style="width: 100%;"
                    row-key="id"
                    :row-class-name="getRowClass"
                    :header-row-class-name="'header-row'"
                >
                    <el-table-column prop="subgroupId" label="样本组" width="100" align="center"></el-table-column>
                    <el-table-column prop="datetime" label="日期时间" width="120" align="center"></el-table-column>
                    <el-table-column prop="value1" label="值1" width="85" align="center">
                    <template #default="scope">
                        <span :class="getDataPointClass(scope.row, 0)">{{ scope.row.value1 }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="value2" label="值2" width="85" align="center">
                    <template #default="scope">
                        <span :class="getDataPointClass(scope.row, 1)">{{ scope.row.value2 }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="value3" label="值3" width="85" align="center">
                    <template #default="scope">
                        <span :class="getDataPointClass(scope.row, 2)">{{ scope.row.value3 }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="value4" label="值4" width="85" align="center">
                    <template #default="scope">
                        <span :class="getDataPointClass(scope.row, 3)">{{ scope.row.value4 }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="value5" label="值5" width="85" align="center">
                    <template #default="scope">
                        <span :class="getDataPointClass(scope.row, 4)">{{ scope.row.value5 }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="mean" label="均值" width="85" align="center">
                    <template #default="scope">
                        <span :class="getMeanStatusClass(scope.row.mean)">{{ scope.row.mean }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="range" label="极差" width="85" align="center">
                    <template #default="scope">
                        {{ scope.row.range }}
                    </template>
                    </el-table-column>
                    <el-table-column prop="overallMean" label="整体均值" width="85" align="center">
                    <template #default>
                        {{ overallMean }}
                    </template>
                    </el-table-column>
                    <el-table-column prop="overallRange" label="整体极差" width="85" align="center">
                    <template #default>
                        {{ overallRange }}
                    </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag
                        :type="getStatusTagType(scope.row.status)"
                        size="small"
                        class="status-tag"
                        >
                        {{ scope.row.status }}
                        </el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column prop="operator" label="操作员" width="100" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" width="120" align="center"></el-table-column>
                    <el-table-column prop="switch" label="启用状态" width="100" align="center" fixed="right">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.enabled"
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
                        :page-sizes="[10, 20, 50, 100]"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
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

defineEmits(['close','change'])

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

interface SampleData {
  id: string
  subgroupId: string
  datetime: string
  value1: number
  value2: number
  value3: number
  value4: number
  value5: number
  mean: number
  range: number
  status: '正常' | '警告' | '异常'
  operator: string
  remark: string
  enabled: boolean
  overallMean?: number
  overallRange?: number
}

// 响应式数据
const sampleData = ref<SampleData[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const overallMean = ref(0)
const overallRange = ref(0)

// 计算属性：分页后的数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sampleData.value.slice(start, end)
})

const curStatus = computed(() => {
    return prop.selectedItem.status === '0'
})

// 加载数据
const loadData = () => {
  // 固定示例数据
  const sampleGroups = [
    { id: '样本组1', values: [42.64, 48.02, 54.06, 57.82, 62.40] },
    { id: '样本组2', values: [57.82, 59.28, 40.00, 47.00, 49.92] },
    { id: '样本组3', values: [50.96, 45.12, 59.28, 43.00, 38.40] },
    { id: '样本组4', values: [41.82, 40.00, 62.40, 59.28, 53.00] },
    { id: '样本组5', values: [38.40, 43.00, 61.20, 41.82, 62.40] },
    { id: '样本组6', values: [48.02, 53.00, 41.00, 48.00, 60.00] },
    { id: '样本组7', values: [49.00, 55.12, 41.00, 53.76, 55.00] },
    { id: '样本组8', values: [62.40, 60.00, 41.82, 59.28, 62.40] },
    { id: '样本组9', values: [57.20, 47.04, 53.04, 57.82, 41.82] },
    { id: '样本组10', values: [57.12, 46.80, 54.06, 38.40, 53.04] }
  ]

  const groupMeans: number[] = [] // 组内均值
  const groupRanges: number[] = [] // 组内极差

  // 处理每个样本组
  sampleGroups.forEach((group, index) => {
    const subgroupId = `SG${100 + (index + 1)}`
    const date = `2025-09-${20 + (index + 1)}`
    const time = `08:${(10 + (index + 1) * 2).toString().padStart(2, '0')}:00`
    
    const values = group.values
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const range = Math.max(...values) - Math.min(...values)
    
    groupMeans.push(mean)
    groupRanges.push(range)
    
    // 确定状态
    let status: '正常' | '警告' | '异常' = '正常'
    if (mean > 50.06 || mean < 49.98) {
      status = '异常'
    } else if (mean > 50.04 || mean < 50.00) {
      status = '警告'
    }
    
    const operator = index % 3 === 0 ? '王五' : (index % 3 === 1 ? '李四' : '赵六')
    const remark = status === '正常' ? '' : '需关注'
    
    // 创建样本数据对象
    const sample: SampleData = {
      id: `sample-${index + 1}`,
      subgroupId,
      datetime: `${date} ${time}`,
      value1: parseFloat(values[0].toFixed(2)),
      value2: parseFloat(values[1].toFixed(2)),
      value3: parseFloat(values[2].toFixed(2)),
      value4: parseFloat(values[3].toFixed(2)),
      value5: parseFloat(values[4].toFixed(2)),
      mean: parseFloat(mean.toFixed(2)),
      range: parseFloat(range.toFixed(2)),
      status,
      operator,
      remark,
      enabled: true
    }
    
    sampleData.value.push(sample)
  })
  
  // 计算整体均值和极差
  overallMean.value = parseFloat((groupMeans.reduce((sum, val) => sum + val, 0) / groupMeans.length).toFixed(2))
  overallRange.value = parseFloat((groupRanges.reduce((sum, val) => sum + val, 0) / groupRanges.length).toFixed(2))
}

// 获取行样式类
const getRowClass = ({ row }: { row: SampleData }) => {
  if (row.status === '异常') return 'data-point-error'
  if (row.status === '警告') return 'data-point-warning'
  return 'data-point-normal'
}

// 获取数据点样式类
const getDataPointClass = (row: SampleData, valueIndex: number) => {
  const value = row[`value${valueIndex + 1}` as keyof SampleData] as number
  
  // 简单的数据点状态判断（可以根据实际业务逻辑调整）
  if (value > 60 || value < 40) {
    return 'data-point-error'
  } else if (value > 55 || value < 45) {
    return 'data-point-warning'
  }
  return 'data-point-normal'
}

// 获取均值状态样式类
const getMeanStatusClass = (mean: number) => {
  if (mean > 50.06 || mean < 49.98) {
    return 'data-point-error'
  } else if (mean > 50.04 || mean < 50.00) {
    return 'data-point-warning'
  }
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
  ElMessage.info(`${row.subgroupId} 状态已${row.enabled ? '启用' : '禁用'}`)
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

// 初始化
onMounted(() => {
  loadData()
})
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
  width: calc(100vw - 120px);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.table-container {
  width: calc(100vw - 120px);
  overflow-x: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  
  :deep(.el-table) {
    max-width: calc(100vw - 120px);
    
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
</style>