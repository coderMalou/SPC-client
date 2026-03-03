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
                    <el-input :disabled="!isEdit" v-model="selectedItem.tid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工单号</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.ticket"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">行号</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.line"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">产品编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.pid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">产品名称</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.pname"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">规格/型号</span>
                    <el-input :disabled="!isEdit" v-model="spec"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">计量单位</span>
                    <el-input :disabled="!isEdit" v-model="unit"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工艺路线名称</span>
                    <el-input :disabled="!isEdit" v-model="technic"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">创建时间</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.ctime"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text); display: inline-flex;gap:5px;">任务状态
                        <div class="status-badge status-done" v-if="selectedItem.status==='0'">启用</div>
                        <div class="status-badge badge-done" v-if="selectedItem.status!=='0'">停止</div>
                    </span>
                    <el-switch
                        v-model="curStatus"
                        :disabled="!isEdit"
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
                    <el-input :disabled="!isEdit" v-model="techList.techid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">工序作业名称</span>
                    <el-input :disabled="!isEdit" v-model="techList.techname"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">质量特性</span>
                    <el-input :disabled="!isEdit" v-model="techList.ch"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">目标标准值</span>
                    <el-input :disabled="!isEdit" v-model="techList.standard"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">USL</span>
                    <el-input :disabled="!isEdit" v-model="techList.usl"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">LSL</span>
                    <el-input :disabled="!isEdit" v-model="techList.lsl"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">组内样本量</span>
                    <el-input :disabled="!isEdit" v-model="techList.set"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">总体样本量</span>
                    <el-input :disabled="!isEdit" v-model="techList.total"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">作业设备编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.devid"></el-input>
                </div>
                <div class="stat-card sub">
                    <span style="color: var(--color-dark-text);">仪器/治具编码</span>
                    <el-input :disabled="!isEdit" v-model="selectedItem.devid"></el-input>
                </div>
            </div>
        </div>
        <div class="measure-table">
            <div class="stat-card header">
                <span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">{{ "测量数据表-"+selectedItem.pid+`-${selectedItem.pname}` }}</span>
                <div style="display: flex; align-items: center;">
                     <el-button type="primary" plain @click="addNewRow">
                        <el-icon><list-icon /></el-icon> 新增数据
                    </el-button>

                    <el-button type="primary" plain @click="exportTemplate">
                        <el-icon><excel-icon /></el-icon> 导出导入模板
                    </el-button>

                    <el-button type="success" plain @click="importExcel">
                        <el-icon><excel-icon /></el-icon> 导入Excel
                    </el-button>

                    <el-button type="success" plain @click="exportExcel">
                        <el-icon><excel-icon /></el-icon> 导出Excel
                    </el-button>
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

                    <!-- 五个样本值 -->
                    <el-table-column prop="value1" label="值1" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.value1"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, 0)">
                        {{ scope.row.value1 }}
                        </span>
                    </template>
                    </el-table-column>

                    <el-table-column prop="value2" label="值2" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.value2"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, 1)">
                        {{ scope.row.value2 }}
                        </span>
                    </template>
                    </el-table-column>

                    <el-table-column prop="value3" label="值3" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.value3"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, 2)">
                        {{ scope.row.value3 }}
                        </span>
                    </template>
                    </el-table-column>

                    <el-table-column prop="value4" label="值4" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.value4"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, 3)">
                        {{ scope.row.value4 }}
                        </span>
                    </template>
                    </el-table-column>

                    <el-table-column prop="value5" label="值5" align="center">
                    <template #default="scope">
                        <el-input
                        v-if="scope.row.isNew"
                        v-model.number="scope.row.value5"
                        size="small"
                        @input="calcNewRow(scope.row)"
                        />
                        <span v-else :class="getDataPointClass(scope.row, 4)">
                        {{ scope.row.value5 }}
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
                        <el-input v-if="scope.row.isNew" v-model="scope.row.operator" size="small" />
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
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useTime } from '@/utils/clock';
import { formatTimeStamp } from '@/utils/functions';

const { formattedTime } = useTime(1000, 'full', 'zh-CN', '-')

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
    isEdit: boolean;
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
  isNew?: boolean
}

// 响应式数据
const sampleData = ref<SampleData[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const overallMean = ref(0)
const overallRange = ref(0)

const editingRows = ref<SampleData[]>([])

const tableData = computed(() => [
  ...editingRows.value,
  ...sampleData.value
])

// 计算属性：分页后的数据
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sampleData.value.slice(start, end)
})

const curStatus = ref(() => {
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
      value1: parseFloat(values[0]!.toFixed(2)),
      value2: parseFloat(values[1]!.toFixed(2)),
      value3: parseFloat(values[2]!.toFixed(2)),
      value4: parseFloat(values[3]!.toFixed(2)),
      value5: parseFloat(values[4]!.toFixed(2)),
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

/* ================= 新增数据 ================= */

const addNewRow = () => {
  editingRows.value.unshift({
    id: `new-${Date.now()}`,
    subgroupId: '',
    datetime: '',
    value1: null as any,
    value2: null as any,
    value3: null as any,
    value4: null as any,
    value5: null as any,
    mean: null as any,
    range: null as any,
    status: '正常',
    operator: '',
    remark: '',
    enabled: true,
    isNew: true
  })
}

/* 自动算 X̄ / R */
const calcNewRow = (row: SampleData) => {
  const values = [row.value1, row.value2, row.value3, row.value4, row.value5]
    .filter(v => typeof v === 'number') as number[]

  if (values.length === 5) {
    row.mean = +(values.reduce((a, b) => a + b, 0) / 5).toFixed(2)
    row.range = +(Math.max(...values) - Math.min(...values)).toFixed(2)
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
  if (
    row.value1 == null ||
    row.value2 == null ||
    row.value3 == null ||
    row.value4 == null ||
    row.value5 == null
  ) {
    ElMessage.warning('请填写完整 5 个样本值')
    return
  }

  row.status =
    row.mean > 50.06 || row.mean < 49.98
      ? '异常'
      : row.mean > 50.04 || row.mean < 50.0
      ? '警告'
      : '正常'

  row.isNew = false
  row.datetime = formattedTime.value
  sampleData.value.unshift(row)
  editingRows.value = editingRows.value.filter(r => r.id !== row.id)

  recalcOverall()
  ElMessage.success('新增成功')
}

const cancelNewRow = (id: string) => {
  editingRows.value = editingRows.value.filter(r => r.id !== id)
}

/* ================= Excel 模板 ================= */

const exportTemplate = () => {
  const headers = [
    ['样本组', '时间', '值1', '值2', '值3', '值4', '值5', '操作员', '备注']
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
        ElMessage.error("Excel 中未找到工作表")
        return
    }
    const sheet = wb.Sheets[name]
    if (!sheet) {
        ElMessage.error("Excel 中未找到工作表")
        return
    }
    const rows: any[] = XLSX.utils.sheet_to_json(sheet)

    rows.forEach((r, i) => {
      const values = [r['值1'], r['值2'], r['值3'], r['值4'], r['值5']]
      const mean = values.reduce((a, b) => a + b, 0) / 5
      const range = Math.max(...values) - Math.min(...values)
      let status: '正常' | '警告' | '异常' = '正常'
      if (mean > 50.06 || mean < 49.98) {
        status = '异常'
      } else if (mean > 50.04 || mean < 50.00) {
        status = '警告'
      }
      
      const remark = status === '正常' ? '' : '需关注'

      sampleData.value = [
        {
        id: `import-${Date.now()}-${i}`,
        subgroupId: r['样本组'],
        datetime: formatTimeStamp(r['时间']),
        value1: r['值1'],
        value2: r['值2'],
        value3: r['值3'],
        value4: r['值4'],
        value5: r['值5'],
        mean: +mean.toFixed(2),
        range: +range.toFixed(2),
        status: r['状态'] ?? status,
        operator: r['操作员'],
        remark: r['备注'] ?? remark
      } as SampleData,
      ...sampleData.value
      ]
    })

    ElMessage.success('导入成功')
  }
  reader.readAsBinaryString(file)
}

/* ================= Excel 导出 ================= */

const exportExcel = () => {
  const rows = sampleData.value.map(r => ({
    样本组: r.subgroupId,
    时间: r.datetime,
    值1: r.value1,
    值2: r.value2,
    值3: r.value3,
    值4: r.value4,
    值5: r.value5,
    均值: r.mean,
    极差: r.range,
    状态: r.status,
    操作员: r.operator,
    备注: r.remark
  }))

  const sheet = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, '测量数据')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buffer]), '测量数据表.xlsx')
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
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.table-container {
  width: 100%;
  overflow-x: hidden;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  
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
</style>