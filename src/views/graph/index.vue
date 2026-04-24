<template>
  <div class="graph-container" ref="exportTarget" v-loading="loading">


    <!-- 顶部工具栏 -->
    <div class="tool-bar">
      <div class="filter">
        <el-cascader
          v-model="selectedWorkOrderTask"
          :options="workOrderTaskTree"
          :props="cascaderProps"
          placeholder="请选择工单->任务"
          change-on-select
          filterable
          @change="handleWorkOrderTaskChange"
          clearable
        />
      </div>

      <div class="operation">
        <!-- 导出图片按钮 -->
        <el-button type="primary" @click="exportImage">
          <i class="el-icon-picture"></i>
          导出图片
        </el-button>

        <!-- 刷新按钮 -->
        <el-button @click="refreshData" :loading="loading">
          <i class="el-icon-refresh"></i>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="hasNoData" class="no-data-placeholder">
      <div class="no-data-content">
        <i class="el-icon-data-line no-data-icon"></i>
        <p class="no-data-text">暂无数据</p>
        <p class="no-data-hint">请从上方选择工单和任务</p>
      </div>
    </div>

    <!-- 控制图基本信息 -->
    <div v-else class="info-card">
      <div class="header">
        <h3>控制图基本信息</h3>
        <el-tag :type="statusBadge.type as any" effect="dark">
          {{ statusBadge.text }}
        </el-tag>
      </div>
      <div class="content">
        <div class="sub">
          <span class="label">产品编码</span>
          <span class="value">{{ basicInfo.productCode }}</span>
        </div>
        <div class="sub">
          <span class="label">产品名称</span>
          <span class="value">{{ basicInfo.productName }}</span>
        </div>
        <div class="sub">
          <span class="label">工作任务号</span>
          <span class="value">{{ basicInfo.workTaskNo }}</span>
        </div>
        <div class="sub">
          <span class="label">工单号</span>
          <span class="value">{{ basicInfo.workOrderNo }}</span>
        </div>
        <div class="sub">
          <span class="label">工序作业名称</span>
          <span class="value">{{ basicInfo.processName }}</span>
        </div>
        <div class="sub">
          <span class="label">质量特性</span>
          <span class="value">{{ basicInfo.qualityCharacteristic }}</span>
        </div>
        <div class="sub">
          <span class="label">作业设备编码</span>
          <span class="value">{{ basicInfo.equipmentCode }}</span>
        </div>
        <div class="sub">
          <span class="label">组内样本量</span>
          <span class="value">{{ basicInfo.subgroupSampleSize }}</span>
        </div>
        <div class="sub">
          <span class="label">总体样本量</span>
          <span class="value">{{ basicInfo.totalSampleSize }}</span>
        </div>
        <div class="sub">
          <span class="label">USL</span>
          <span class="value">{{ basicInfo.usl }}</span>
        </div>
        <div class="sub">
          <span class="label">LSL</span>
          <span class="value">{{ basicInfo.lsl }}</span>
        </div>
        <div class="sub">
          <span class="label">最后更新时间</span>
          <span class="value">{{ basicInfo.lastUpdateTime }}</span>
        </div>
      </div>
    </div>

    <div v-if="!hasNoData" class="divider"></div>

    <!-- 组合图表：Xbar控制图和X-R控制图 -->
    <div v-if="!hasNoData" class="info-card chart-row">
      <div class="chart-item">
        <div class="header">
          <h3>Xbar控制图 (均值图)</h3>
          <span class="label">Xbar图显示子组均值的稳定性，用于检测过程中心的偏移</span>
        </div>
        <div class="chart-content">
          <div ref="xbarChart" class="chart-container"></div>
        </div>
      </div>
      <div class="divider-vertical"></div>
      <div class="chart-item">
        <div class="header">
          <h3>R控制图 (极差图)</h3>
          <span class="label">R图显示子组内变异(极差)的稳定性，用于检测过程编译的变化</span>
        </div>
        <div class="chart-content">
          <div ref="xrChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <div v-if="!hasNoData" class="divider"></div>

    <!-- 组合图表：S控制图和样本均值偏离图表 -->
    <div v-if="!hasNoData" class="info-card chart-row">
      <div class="chart-item">
        <div class="header">
          <h3>S控制图 (标准差图)</h3>
          <span class="label">S图显示子组内标准差的变化，用于监控过程变异性的稳定性</span>
        </div>
        <div class="chart-content">
          <div ref="sChart" class="chart-container"></div>
        </div>
      </div>
      <div class="divider-vertical"></div>
      <div class="chart-item">
        <div class="header">
          <h3>样本与均值偏离表</h3>
          <span class="label">是组内均值、组内样本和整体均值的偏离记录</span>
        </div>
        <div class="chart-content">
          <div ref="deviationChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <div v-if="!hasNoData" class="divider"></div>

    <!-- 异常判断和提示 -->
    <div v-if="!hasNoData" class="info-card">
      <div class="header">
        <h3>异常判断结果</h3>
      </div>
      <div class="content">

          <p :class="['status-text', anomalyInfo.status]">
            {{ anomalyInfo.message }}
          </p>
        <div class="anomaly-status">
          <span class="last-check">最近检查: {{ anomalyInfo.lastCheckTime }}</span>
          <el-tooltip effect="light" placement="top-end">
            <template #content>
              <div class="rule-tooltip">
                <h4>判异准则:</h4>
                <p>• 单点超限: 单点超出3σ控制限</p>
                <p>• 连续偏移: 连续9个点在中心线同一侧</p>
                <p>• 递增/递减趋势: 连续6个点递增或递减</p>
                <p>• 交替波动: 连续14个点交替上升和下降</p>
              </div>
            </template>
            <span class="rule-desc">{{ anomalyInfo.enabledRule }}</span>
          </el-tooltip>
        </div>

      </div>
    </div>

    <div v-if="!hasNoData" class="divider"></div>

    <!-- 组合图表：过程能力直方图和过程能力指标 -->
    <div v-if="!hasNoData" class="info-card chart-row">
      <div class="metric-item-wrapper">
        <div class="header">
          <h3>过程能力指标</h3>
        </div>
        <div class="metric-content">
          <div class="metric-item">
            <span class="metric-label">Cp</span>
            <span class="metric-value">{{ capabilityMetrics.cp }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Cpk</span>
            <span class="metric-value">{{ capabilityMetrics.cpk }}</span>
            <span class="metric-level" :class="getCapabilityLevel(capabilityMetrics.cpk)">
              {{ getCapabilityLevelText(capabilityMetrics.cpk) }}
            </span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Pp</span>
            <span class="metric-value">{{ capabilityMetrics.pp }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Ppk</span>
            <span class="metric-value">{{ capabilityMetrics.ppk }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">不良率(PPM)</span>
            <span class="metric-value">{{ capabilityMetrics.defectRate }}%</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">西格玛水平</span>
            <span class="metric-value">{{ capabilityMetrics.sigmaLevel }}</span>
          </div>
        </div>
      </div>
      <div class="divider-vertical"></div>
      <div class="chart-item">
        <div class="header">
          <h3>过程能力直方图</h3>
          <span class="label">展示实际数据与理论正态分布的对比，用于识别数据异常点和分布偏差</span>
        </div>
        <div class="chart-content">
          <div ref="histogramChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <div v-if="!hasNoData" class="divider"></div>



    <!-- 最近数据点表格 -->
    <div v-if="!hasNoData" class="info-card">
      <div class="header">
        <h3>最近数据点 (最近25个子组)</h3>
        <el-button type="text" @click="viewAllData">查看全部数据 →</el-button>
      </div>
      <div class="table-content">
        <el-table :data="recentData" style="width: 100%; table-layout: auto;">
          <el-table-column prop="subgroupNo" label="子组编号"/>
          <el-table-column prop="sample1" label="样本1"/>
          <el-table-column prop="sample2" label="样本2"/>
          <el-table-column prop="sample3" label="样本3"/>
          <el-table-column prop="sample4" label="样本4"/>
          <el-table-column prop="sample5" label="样本5"/>
          <el-table-column prop="mean" label="均值(X̄)"/>
          <el-table-column prop="stdDev" label="标准差(σ)"/>
          <el-table-column prop="range" label="极差(R)"/>
          <el-table-column prop="inspectionTime" label="检测时间"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, SeriesOption } from 'echarts'
import { ElMessage, ElButton, ElTag, ElTooltip, ElTable, ElTableColumn, ElCascader } from 'element-plus'
import html2canvas from 'html2canvas'

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

// 导入 API模块
import { getControlChart, getCapability, getWorkOrderTree, getMeasurements } from '@/api/modules/index';

// 基本信息接口
interface BasicInfo {
  productCode: string
  productName: string
  workTaskNo: string
  workOrderNo: string
  processName: string
  qualityCharacteristic: string
  equipmentCode: string
  subgroupSampleSize: number
  totalSampleSize: number
  usl: number
  lsl: number
  lastUpdateTime: string
}

// 异常信息接口
interface AnomalyInfo {
  status: 'normal' | 'warning' | 'out-of-control'
  message: string
  enabledRule: string
  lastCheckTime: string
}

// 过程能力指标接口
interface CapabilityMetrics {
  cp: number
  cpk: number
  pp: number
  ppk: number
  defectRate: number
  sigmaLevel: number
}

// 最近数据点接口
interface RecentData {
  subgroupNo: string
  sample1: number
  sample2: number
  sample3: number
  sample4: number
  sample5: number
  mean: number
  stdDev: number
  range: number
  inspectionTime: string
}

// 子组数据接口
interface SubgroupData {
  subgroupNo: string
  samples: number[]
  mean: number
  stdDev: number
  range: number
}

// 控制图系数表接口
interface ControlChartCoefficients {
  A2: number
  A3: number
  D3: number
  D4: number
  B3: number
  B4: number
  C2: number
}

// ECharts标记点数据接口
interface MarkPointData {
  name: string
  coord: [number, number]
  value: number
  symbol: string
  symbolSize: number
  itemStyle: {
    color: string
  }
}

// 精度配置常量
const PRECISION_CONFIG = {
  SAMPLE: 2,    // 样本值保留2位小数
  MEAN: 2,      // 均值保留2位小数
  STD_DEV: 3,   // 标准差保留3位小数
  RANGE: 2      // 极差保留2位小数
}

// 格式化函数
const formatNumber = (value: number, precision: number): number => {
  return Number(value.toFixed(precision))
}

// 工单任务树相关
const selectedWorkOrderTask = ref<string[]>([])
const workOrderTaskTree = ref<any[]>([])

const cascaderProps = {
  expandTrigger: 'hover' as const,
  value: 'id',
  label: 'label',
  children: 'children',
  emitPath: true
}

// 获取工单树数据
const fetchWorkOrderTree = async (): Promise<void> => {
  try {
    const res: any = await getWorkOrderTree()
    // res 格式是 {code: number, data: [...]} 或直接是数组
    let data: any[] = []
    if (Array.isArray(res)) {
      data = res
    } else if (res && Array.isArray(res.data)) {
      data = res.data
    }

    workOrderTaskTree.value = data.map((wo: any) => ({
      id: String(wo.id || wo.orderNo),  // 优先使用id，否则使用orderNo
      label: wo.orderNo || wo.label,
      children: (wo.children || []).map((task: any) => ({
        id: String(task.id),
        label: task.taskNo ? `${task.taskNo} - ${task.processName || ''}` : task.processName || '',
        processName: task.processName,
        qualityChar: task.qualityChar
      }))
    }))
    console.log('工单树数据:', workOrderTaskTree.value)
  } catch (error) {
    console.error('获取工单树失败:', error)
  }
}

// 根据任务ID找到对应的工单任务路径
const findWorkOrderTaskPath = (taskId: number | null): string[] => {
  if (!taskId || !workOrderTaskTree.value.length) return []

  for (const wo of workOrderTaskTree.value) {
    const task = wo.children?.find((t: any) => parseInt(t.id) === taskId)
    if (task) {
      return [String(wo.id), String(task.id)]
    }
  }
  return []
}

const findWorkOrderId = (taskId: number | null): string => {
  console.log('taskId: ',taskId)
  if (!taskId || !workOrderTaskTree.value.length) return ''

  for (const wo of workOrderTaskTree.value) {
    const task = wo.children?.find((t: any) => parseInt(t.id) === taskId)
    if (task) {
      return String(wo.label)
    }
  }
  return ''
}

// 处理工单任务选择变化
const handleWorkOrderTaskChange = async (value: any) => {
  // change-on-select 模式下，只有完整选择两级（工单+任务）时才加载数据
  if (value && Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
    const taskId = value[1]
    if (taskId) {
      currentTaskId.value = parseInt(taskId, 10)
      loading.value = true
      try {
        await fetchControlChartData(currentTaskId.value)
        await fetchCapabilityData(currentTaskId.value)
        nextTick(() => {
          basicInfo.value.workOrderNo = findWorkOrderId(parseInt(selectedWorkOrderTask.value[1]||''))
          initCharts()
        })
      } catch (error) {
        console.error('获取数据失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }
  } else if (!value || (Array.isArray(value) && value.length < 2)) {
    // 只选择了工单但没选任务，或者清空了选择，不做处理
    // 注意：不清除数据，保持当前显示
  }
}

// 是否有数据
const hasNoData = computed(() => {
  return !currentTaskId.value || subgroupData.value.length === 0
})

const basicInfo = ref<BasicInfo>({
  productCode: '',
  productName: '',
  workTaskNo: '',
  workOrderNo: '',
  processName: '',
  qualityCharacteristic: '',
  equipmentCode: '',
  subgroupSampleSize: 0,
  totalSampleSize: 0,
  usl: 0,
  lsl: 0,
  lastUpdateTime: ''
})

const anomalyInfo = ref<AnomalyInfo>({
  status: 'normal',
  message: '过程受控-未发现特殊原因变异',
  enabledRule: '无异常',
  lastCheckTime: ''
})

const capabilityMetrics = ref<CapabilityMetrics>({
  cp: 0,
  cpk: 0,
  pp: 0,
  ppk: 0,
  defectRate: 0,
  sigmaLevel: 0
})

const recentData = ref<RecentData[]>([])
const subgroupData = ref<SubgroupData[]>([])

const exportTarget = ref<HTMLElement|null>(null);
const previewUrl = ref('');
const loading = ref(false);

// 当前任务ID
const currentTaskId = ref<number | null>(null);

// 获取路由参数中的任务ID
const getTaskIdFromRoute = (): number | null => {
    const taskId = route.query.taskId
    if (taskId && typeof taskId === 'string') {
        const id = parseInt(taskId, 10)
        return isNaN(id) ? null : id
    }
    return null
}

// 图表引用
const xbarChart = ref<HTMLElement>()
const xrChart = ref<HTMLElement>()
const sChart = ref<HTMLElement>()
const deviationChart = ref<HTMLElement>()
const histogramChart = ref<HTMLElement>()

// 图表实例
let xbarChartInstance: echarts.ECharts
let xrChartInstance: echarts.ECharts
let sChartInstance: echarts.ECharts
let deviationChartInstance: echarts.ECharts
let histogramChartInstance: echarts.ECharts

// 控制图系数表 (n=5)
const coefficients: ControlChartCoefficients = {
  A2: 0.577,
  A3: 1.427,
  D3: 0,
  D4: 2.114,
  B3: 0,
  B4: 2.089,
  C2: 0.94
}

// 计算状态徽章
const statusBadge = computed(() => {
  const status = anomalyInfo.value.status
  const typeMap = {
    'normal': 'success',
    'warning': 'warning',
    'out-of-control': 'danger'
  } as const

  const textMap = {
    'normal': '受控',
    'warning': '警告',
    'out-of-control': '失控'
  }

  return {
    type: typeMap[status],
    text: textMap[status]
  }
})

// 过程能力等级
const getCapabilityLevel = (cpk: number): string => {
  if (cpk >= 1.67) return 'level-a'
  if (cpk >= 1.33) return 'level-b'
  if (cpk >= 1) return 'level-c'
  if (cpk >= 0.67) return 'level-d'
  return 'level-e'
}

const getCapabilityLevelText = (cpk: number): string => {
  if (cpk >= 1.67) return 'A级'
  if (cpk >= 1.33) return 'B级'
  if (cpk >= 1) return 'C级'
  if (cpk >= 0.67) return 'D级'
  return 'E级'
}

const exportImage = async () => {
  if (!exportTarget.value) {
    alert('未找到要导出的内容');
    return;
  }

  loading.value = true;

  const element = exportTarget.value as HTMLElement;

  const originalStyles = {
    overflow: element.style.overflow,
    height: element.style.height,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
  };

  try {
    element.style.overflow = 'visible';
    element.style.height = 'auto';
    element.style.position = 'static';
    element.style.left = 'auto';
    element.style.top = 'auto';

    const fullWidth = element.scrollWidth;
    const fullHeight = element.scrollHeight;

    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
      width: fullWidth,
      height: fullHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDocument, element) => {
        const clonedElement = element as HTMLElement;
        clonedElement.style.overflow = 'visible';
        clonedElement.style.height = 'auto';
      }
    });

    const link = document.createElement('a');
    link.download = `控制图_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出失败，请查看控制台信息。');
  } finally {
    element.style.overflow = originalStyles.overflow;
    element.style.height = originalStyles.height;
    element.style.position = originalStyles.position;
    element.style.left = originalStyles.left;
    element.style.top = originalStyles.top;

    loading.value = false;
  }
};

const refreshData = async (): Promise<void> => {
  if (!currentTaskId.value) {
    ElMessage.warning('请先选择任务')
    return
  }

  loading.value = true
  try {
    await fetchControlChartData(currentTaskId.value)
    await fetchCapabilityData(currentTaskId.value)
    ElMessage.success('数据已刷新')
  } catch (error) {
    console.error('刷新数据失败:', error)
    ElMessage.error('刷新数据失败')
  } finally {
    loading.value = false
  }
}

// 获取控制图数据
const fetchControlChartData = async (taskId: number) => {
  try {
    const res: any = await getControlChart(String(taskId))
    console.log('控制图API响应:', res)

    if (res.code === 200) {
      const data = res.data

      // 更新基本信息
      basicInfo.value = {
        productCode: data.task?.productCode || '',
        productName: data.task?.productName || '',
        workTaskNo: data.task?.taskNo || '',
        workOrderNo: data.task?.orderNo || '',
        processName: data.task?.processName || '',
        qualityCharacteristic: data.task?.qualityChar || '',
        equipmentCode: data.task?.equipmentCode || '',
        subgroupSampleSize: data.task?.subgroupSize || 0,
        totalSampleSize: data.task?.totalSampleSize || 0,
        usl: data.task?.usl || 0,
        lsl: data.task?.lsl || 0,
        lastUpdateTime: data.lastCheck || ''
      }

      // 更新子组数据
      const groupNos = data.series?.groupNos || []
      const means = data.series?.means || []
      const ranges = data.series?.ranges || []
      const stdevs = data.series?.stdevs || []

      // 从 limits 中获取控制限信息
      const xbarLimit = data.limits?.xbar
      const rLimit = data.limits?.r
      const sLimit = data.limits?.s

      // 获取测量数据以获取样本值
      let measurementData: any[] = []
      try {
        const measRes: any = await getMeasurements(String(taskId))
        if (measRes.code === 200) {
          measurementData = measRes.data || []
        }
      } catch (e) {
        console.error('获取测量数据失败:', e)
      }

      subgroupData.value = groupNos.map((no: any, index: number) => {
        // 找到对应的测量数据
        const meas = measurementData.find((m: any) => String(m.groupNo) === String(no))
        const samples = meas?.sampleValues || []

        return {
          subgroupNo: String(no),
          samples: samples,
          mean: means[index] || 0,
          stdDev: stdevs[index] || 0,
          range: ranges[index] || 0
        }
      })

      // 更新recentData - 从测量数据中获取样本值
      recentData.value = subgroupData.value.map((d, index) => {
        const meas = measurementData.find((m: any) => String(m.groupNo) === String(d.subgroupNo))
        const values = meas?.sampleValues || []

        return {
          subgroupNo: d.subgroupNo,
          sample1: values[0] ?? 0,
          sample2: values[1] ?? 0,
          sample3: values[2] ?? 0,
          sample4: values[3] ?? 0,
          sample5: values[4] ?? 0,
          mean: formatNumber(d.mean, PRECISION_CONFIG.MEAN),
          stdDev: formatNumber(d.stdDev, PRECISION_CONFIG.STD_DEV),
          range: formatNumber(d.range, PRECISION_CONFIG.RANGE),
          inspectionTime: meas?.measureTime ? formatDateTime(meas.measureTime) : ''
        }
      })

      // 更新异常信息
      const ruleStatus = data.rules?.status || 'normal'
      let status: 'normal' | 'warning' | 'out-of-control' = 'normal'
      if (ruleStatus === '受控' || ruleStatus === '正常') {
        status = 'normal'
      } else if (ruleStatus === '警告') {
        status = 'warning'
      } else {
        status = 'out-of-control'
      }

      anomalyInfo.value = {
        status,
        message: data.rules?.message || '无数据',
        enabledRule: data.rules?.anomalies?.length > 0 ? `发现${data.rules.anomalies.length}处异常` : '无异常',
        lastCheckTime: data.lastCheck ? formatDate(data.lastCheck) : ''
      }

      // 保存控制限供图表使用
      controlLimitsRef.value = data.limits || { xbar: null, r: null, s: null }

      return true
    }
    return false
  } catch (error) {
    console.error('获取控制图数据失败:', error)
    throw error
  }
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}年${month}月${day}日 ${hour}:${minute}`
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${M}-${d} ${h}:${m}`
}

// 保存控制限引用
const controlLimitsRef = ref<{
  xbar: { ucl: number; cl: number; lcl: number } | null;
  r: { ucl: number; cl: number; lcl: number } | null;
  s: { ucl: number; cl: number; lcl: number } | null;
}>({ xbar: null, r: null, s: null })

// 获取过程能力数据
const fetchCapabilityData = async (taskId: number) => {
  try {
    const res = await getCapability(String(taskId))
    if (res.code === 200) {
      const data = res.data

      capabilityMetrics.value = {
        cp: data.cp || 0,
        cpk: data.cpk || 0,
        pp: data.pp || 0,
        ppk: data.ppk || 0,
        defectRate: (data.ppm || 0) / 10000,
        sigmaLevel: data.sigmaLevel || 0
      }

      return true
    }
    return false
  } catch (error) {
    console.error('获取过程能力数据失败:', error)
    throw error
  }
}

const viewAllData = (): void => {
  if (currentTaskId.value) {
    router.push({ path: '/task', query: { taskId: String(currentTaskId.value) } })
  }
}

// 计算控制限
const calculateControlLimits = (data: SubgroupData[]): {
  xbar: { ucl: number; cl: number; lcl: number };
  range: { ucl: number; cl: number; lcl: number };
  std: { ucl: number; cl: number; lcl: number };
} => {
  const means = data.map(d => d.mean)
  const ranges = data.map(d => d.range)
  const stds = data.map(d => d.stdDev)

  const meanAvg = means.reduce((a, b) => a + b, 0) / means.length
  const rangeAvg = ranges.reduce((a, b) => a + b, 0) / ranges.length
  const stdAvg = stds.reduce((a, b) => a + b, 0) / stds.length

  return {
    xbar: {
      ucl: meanAvg + coefficients.A2 * rangeAvg,
      cl: meanAvg,
      lcl: meanAvg - coefficients.A2 * rangeAvg
    },
    range: {
      ucl: coefficients.D4 * rangeAvg,
      cl: rangeAvg,
      lcl: coefficients.D3 * rangeAvg
    },
    std: {
      ucl: coefficients.B4 * stdAvg,
      cl: stdAvg,
      lcl: coefficients.B3 * stdAvg
    }
  }
}

// 初始化图表
const initCharts = (): void => {
  if (subgroupData.value.length === 0) return

  let controlLimits: {
    xbar: { ucl: number; cl: number; lcl: number };
    range: { ucl: number; cl: number; lcl: number };
    std: { ucl: number; cl: number; lcl: number };
  }

  if (controlLimitsRef.value.xbar) {
    controlLimits = {
      xbar: controlLimitsRef.value.xbar || { ucl: 0, cl: 0, lcl: 0 },
      range: controlLimitsRef.value.r || { ucl: 0, cl: 0, lcl: 0 },
      std: controlLimitsRef.value.s || { ucl: 0, cl: 0, lcl: 0 }
    }
  } else {
    controlLimits = calculateControlLimits(subgroupData.value)
  }

  // 初始化Xbar控制图
  if (xbarChart.value) {
    xbarChartInstance = echarts.init(xbarChart.value)

    const markPointData: MarkPointData[] = subgroupData.value.map((d, index) => {
      const mean = formatNumber(d.mean, PRECISION_CONFIG.MEAN)
      if (mean > controlLimits.xbar.ucl || mean < controlLimits.xbar.lcl) {
        return {
          name: '异常点',
          coord: [index, mean],
          value: mean,
          symbol: 'pin',
          symbolSize: 0 <= mean && mean < 10 ? 45 :
                        10 <= mean && mean < 100 ? 60 : 75,
          itemStyle: { color: '#ff4d4f' }
        }
      }
      return null
    }).filter(Boolean) as MarkPointData[]

    const xbarOption: EChartsOption = {
      title: { text: 'Xbar控制图 - 子组均值监控' },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0]
          return `子组: ${data.name}<br/>均值: ${data.value.toFixed(PRECISION_CONFIG.MEAN)}<br/>UCL: ${controlLimits.xbar.ucl.toFixed(PRECISION_CONFIG.MEAN)}<br/>CL: ${controlLimits.xbar.cl.toFixed(PRECISION_CONFIG.MEAN)}<br/>LCL: ${controlLimits.xbar.lcl.toFixed(PRECISION_CONFIG.MEAN)}`
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: subgroupData.value.map(d => d.subgroupNo),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '均值',
        axisLabel: {
          formatter: (value: number) => value.toFixed(PRECISION_CONFIG.MEAN)
        }
      },
      series: [
        {
          name: '子组均值',
          type: 'line',
          data: subgroupData.value.map(d => formatNumber(d.mean, PRECISION_CONFIG.MEAN)),
          lineStyle: { color: '#1890ff' },
          symbol: 'circle',
          symbolSize: 6,
          markPoint: {
            data: markPointData
          }
        } as SeriesOption,
        {
          name: 'UCL',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.xbar.ucl, PRECISION_CONFIG.MEAN)),
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          symbol: 'none'
        } as SeriesOption,
        {
          name: 'LCL',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.xbar.lcl, PRECISION_CONFIG.MEAN)),
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          symbol: 'none'
        } as SeriesOption,
        {
          name: '中心线',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.xbar.cl, PRECISION_CONFIG.MEAN)),
          lineStyle: { color: '#52c41a' },
          symbol: 'none'
        } as SeriesOption
      ]
    }
    xbarChartInstance.setOption(xbarOption)
  }

  // 初始化X-R控制图
  if (xrChart.value) {
    xrChartInstance = echarts.init(xrChart.value)
    const xrOption: EChartsOption = {
      title: { text: 'X-R控制图 - 极差监控' },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0]
          return `子组: ${data.name}<br/>极差: ${data.value.toFixed(PRECISION_CONFIG.RANGE)}<br/>UCL: ${controlLimits.range.ucl.toFixed(PRECISION_CONFIG.RANGE)}<br/>CL: ${controlLimits.range.cl.toFixed(PRECISION_CONFIG.RANGE)}`
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: subgroupData.value.map(d => d.subgroupNo),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '极差',
        axisLabel: {
          formatter: (value: number) => value.toFixed(PRECISION_CONFIG.RANGE)
        }
      },
      series: [
        {
          name: '极差(R)',
          type: 'line',
          data: subgroupData.value.map(d => formatNumber(d.range, PRECISION_CONFIG.RANGE)),
          lineStyle: { color: '#722ed1' },
          symbol: 'circle',
          symbolSize: 6
        } as SeriesOption,
        {
          name: 'UCL',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.range.ucl, PRECISION_CONFIG.RANGE)),
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          symbol: 'none'
        } as SeriesOption,
        {
          name: '中心线',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.range.cl, PRECISION_CONFIG.RANGE)),
          lineStyle: { color: '#52c41a' },
          symbol: 'none'
        } as SeriesOption
      ]
    }
    xrChartInstance.setOption(xrOption)
  }

  // 初始化S控制图
  if (sChart.value) {
    sChartInstance = echarts.init(sChart.value)
    const sOption: EChartsOption = {
      title: { text: 'S控制图 - 标准差监控' },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0]
          return `子组: ${data.name}<br/>标准差: ${data.value.toFixed(PRECISION_CONFIG.STD_DEV)}<br/>UCL: ${controlLimits.std.ucl.toFixed(PRECISION_CONFIG.STD_DEV)}<br/>CL: ${controlLimits.std.cl.toFixed(PRECISION_CONFIG.STD_DEV)}`
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: subgroupData.value.map(d => d.subgroupNo),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '标准差',
        axisLabel: {
          formatter: (value: number) => value.toFixed(PRECISION_CONFIG.STD_DEV)
        }
      },
      series: [
        {
          name: '标准差(S)',
          type: 'line',
          data: subgroupData.value.map(d => formatNumber(d.stdDev, PRECISION_CONFIG.STD_DEV)),
          lineStyle: { color: '#fa8c16' },
          symbol: 'circle',
          symbolSize: 6
        } as SeriesOption,
        {
          name: 'UCL',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.std.ucl, PRECISION_CONFIG.STD_DEV)),
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          symbol: 'none'
        } as SeriesOption,
        {
          name: '中心线',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formatNumber(controlLimits.std.cl, PRECISION_CONFIG.STD_DEV)),
          lineStyle: { color: '#52c41a' },
          symbol: 'none'
        } as SeriesOption
      ]
    }
    sChartInstance.setOption(sOption)
  }

  // 初始化样本与均值偏离表
  if (deviationChart.value) {
    deviationChartInstance = echarts.init(deviationChart.value)
    const overallMean = subgroupData.value.reduce((sum, d) => sum + d.mean, 0) / subgroupData.value.length
    const formattedOverallMean = formatNumber(overallMean, PRECISION_CONFIG.MEAN)

    const deviationOption: EChartsOption = {
      title: { text: '样本与均值偏离表' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let result = `子组: ${params[0].name}<br/>`
          params.forEach((param: any) => {
            if (param.seriesName === '组内均值') {
              result += `${param.seriesName}: ${param.value.toFixed(PRECISION_CONFIG.MEAN)}<br/>`
            } else if (param.seriesName === '整体均值') {
              result += `${param.seriesName}: ${param.value.toFixed(PRECISION_CONFIG.MEAN)}<br/>`
            } else if (param.seriesName === '样本点') {
              const sampleValue = Array.isArray(param.value) ? param.value[1] : param.value
              result += `样本值: ${sampleValue.toFixed(PRECISION_CONFIG.SAMPLE)}<br/>`
            }
          })
          return result
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: subgroupData.value.map(d => d.subgroupNo),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '样本值',
        axisLabel: {
          formatter: (value: number) => value.toFixed(PRECISION_CONFIG.SAMPLE)
        }
      },
      series: [
        {
          name: '组内均值',
          type: 'bar',
          data: subgroupData.value.map(d => formatNumber(d.mean, PRECISION_CONFIG.MEAN)),
          itemStyle: { color: '#1890ff' },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => params.value.toFixed(PRECISION_CONFIG.MEAN)
          }
        } as SeriesOption,
        {
          name: '整体均值',
          type: 'line',
          data: Array(subgroupData.value.length).fill(formattedOverallMean),
          lineStyle: { color: '#52c41a', width: 2 },
          symbol: 'none'
        } as SeriesOption,
        {
          name: '样本点',
          type: 'scatter',
          data: subgroupData.value.flatMap((d, index) =>
            d.samples.map(sample => [index, formatNumber(sample, PRECISION_CONFIG.SAMPLE)])
          ),
          symbolSize: 6,
          itemStyle: { color: '#722ed1' }
        } as SeriesOption
      ]
    }
    deviationChartInstance.setOption(deviationOption)
  }

  // 初始化过程能力直方图
  if (histogramChart.value) {
    histogramChartInstance = echarts.init(histogramChart.value)

    const allSamples = subgroupData.value.flatMap(d => d.samples)
    if (allSamples.length === 0) {
      // 如果没有样本数据，显示空图表
      histogramChartInstance.setOption({
        title: { text: '过程能力直方图' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '频数', min: 0 },
        series: []
      })
      return
    }

    const mean = allSamples.reduce((a, b) => a + b, 0) / allSamples.length
    const std = Math.sqrt(allSamples.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / allSamples.length)

    const min = Math.min(...allSamples)
    const max = Math.max(...allSamples)
    const binCount = 9
    const binWidth = (max - min) / binCount

    const histogramData: number[] = []
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binWidth
      const binEnd = binStart + binWidth
      const count = allSamples.filter(x => x >= binStart && x < binEnd).length
      histogramData.push(count)
    }

    const bins = Array.from({length: binCount}, (_, i) =>
      `${formatNumber(min + i * binWidth, PRECISION_CONFIG.SAMPLE)}-${formatNumber(min + (i + 1) * binWidth, PRECISION_CONFIG.SAMPLE)}`
    )

    const histogramOption: EChartsOption = {
      title: { text: '过程能力直方图' },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `区间: ${params[0].name}<br/>`
          params.forEach((param: any) => {
            if (param.seriesName === '实际频数') {
              result += `频数: ${param.value}<br/>`
            } else if (param.seriesName === '理论正态分布') {
              result += `理论分布: ${param.value.toFixed(1)}%<br/>`
            }
          })
          return result
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [
        {
          type: 'category',
          data: bins,
          axisPointer: { type: 'shadow' }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '频数',
          min: 0
        },
        {
          type: 'value',
          name: '百分比',
          min: 0,
          max: 100,
          axisLabel: { formatter: '{value}%' }
        }
      ],
      series: [
        {
          name: '实际频数',
          type: 'bar',
          data: histogramData,
          itemStyle: { color: '#1890ff' }
        } as SeriesOption,
        {
          name: '理论正态分布',
          type: 'line',
          yAxisIndex: 1,
          data: bins.map((_, i) => {
            const x = min + (i + 0.5) * binWidth
            return 100 * (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) * binWidth
          }),
          lineStyle: { color: '#fa8c16' },
          symbol: 'none'
        } as SeriesOption
      ]
    }
    histogramChartInstance.setOption(histogramOption)
  }
}

// 生命周期
onMounted(async () => {
  // 获取工单树数据
  await fetchWorkOrderTree()

  // 获取任务ID
  currentTaskId.value = getTaskIdFromRoute()

  if (currentTaskId.value) {
    loading.value = true
    try {
      await fetchControlChartData(currentTaskId.value)
      await fetchCapabilityData(currentTaskId.value)
      // 根据任务ID设置级联选择器的值
      selectedWorkOrderTask.value = findWorkOrderTaskPath(currentTaskId.value)
      basicInfo.value.workOrderNo = findWorkOrderId(currentTaskId.value)
    } catch (error) {
      console.error('初始化数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  nextTick(() => {
    if (subgroupData.value.length > 0) {
      initCharts()
    }
  })
})

// 监听路由参数变化
watch(() => route.query.taskId, async (newTaskId) => {
  const taskId = newTaskId ? parseInt(newTaskId as string, 10) : null
  if (taskId && !isNaN(taskId)) {
    currentTaskId.value = taskId
    loading.value = true
    try {
      await fetchControlChartData(taskId)
      await fetchCapabilityData(taskId)
      // 根据任务ID设置级联选择器的值
      selectedWorkOrderTask.value = findWorkOrderTaskPath(taskId)
      basicInfo.value.workOrderNo = findWorkOrderId(currentTaskId.value)
      nextTick(() => {
        initCharts()
      })
    } catch (error) {
      console.error('切换任务失败:', error)
    } finally {
      loading.value = false
    }
  }
})

watch(() => selectedWorkOrderTask.value, (val)=>{
  if (val) {
    console.log(111111)
    basicInfo.value.workOrderNo = findWorkOrderId(parseInt(basicInfo.value.workTaskNo))
  }
})

onUnmounted(() => {
  xbarChartInstance?.dispose()
  xrChartInstance?.dispose()
  sChartInstance?.dispose()
  deviationChartInstance?.dispose()
  histogramChartInstance?.dispose()
})

// 窗口大小变化时重绘图表
const handleResize = (): void => {
  xbarChartInstance?.resize()
  xrChartInstance?.resize()
  sChartInstance?.resize()
  deviationChartInstance?.resize()
  histogramChartInstance?.resize()
}

window.addEventListener('resize', handleResize)
</script>

<style scoped lang="scss">
.graph-container {
  width: 100%;
  height: 100%;
  padding: 80px 60px 20px;
  background-color: var(--color-model-bg);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 8px;
  padding: 8px 16px;
}
.filter {
    display: flex;
    gap: 20px;
    align-items: center;
}

.task-info {
  font-size: 14px;
  color: var(--color-dark-text);
  font-weight: 500;
}

.operation {
    display: flex;
    gap: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--color-dark-text);
    white-space: nowrap;
  }
}

.info-card {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  .header {
    color: var(--color-dark-text);
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;

    .status-text {
    font-size: 16px;
    font-weight: 500;

    &.normal { color: #52c41a; }
    &.warning { color: #faad14; }
    &.out-of-control { color: #ff4d4f; }
  }
  }
}

.sub {
  width: calc(16.666% - 16px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;

  .label {
    font-size: 12px;
    color: var(--color-dark-text);
    opacity: 0.7;
  }

  .value {
    font-size: 14px;
    color: var(--color-dark-text);
    font-weight: 500;
  }
}

.stat-card {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  .header {
    color: var(--color-dark-text);
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid var(--color-model-bg);
  }

  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  }
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--color-model-bg);
  border-radius: 6px;
  height: 128px;

  .metric-label {
    font-size: 14px;
    color: var(--color-dark-text);
    opacity: 0.7;
  }

  .metric-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--color-Hlight-text);
  }

  .metric-level {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;

    &.level-a { background: #f6ffed; color: #52c41a; }
    &.level-b { background: #f0f9ff; color: #1890ff; }
    &.level-c { background: #fff7e6; color: #fa8c16; }
    &.level-d { background: #fff2f0; color: #ff4d4f; }
    &.level-e { background: #fff2f0; color: #ff4d4f; }
  }
}

.chart-content {
  width: 100%;
  padding: 16px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.chart-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;

  .chart-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .chart-content {
      flex: 1;
    }
  }

  .metric-item-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .metric-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
      flex: 1;
      align-content: start;
    }
  }

  .divider-vertical {
    width: 1px;
    background-color: var(--color-model-bg);
    margin: 16px 0;
  }

  .header {
    color: var(--color-dark-text);
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .label {
    font-size: 13px;
    color: #000000aa;
  }
}

// 移动端响应式样式
@media (max-width: 768px) {
  // 确保info-card不限制内容
  .info-card {
    overflow: visible !important;
  }

  // 图表行垂直排列，避免重叠
  .chart-row {
    display: flex !important;
    flex-direction: column !important;
    overflow-x: visible !important;
    overflow-y: visible !important;
    width: 100% !important;
  }

  // 每个图表项占满宽度
  .chart-item,
  .metric-item-wrapper {
    width: 100% !important;
    min-width: 100% !important;
    flex: none !important;
    margin-bottom: 20px !important;
  }

  // 隐藏垂直分割线
  .divider-vertical {
    display: none !important;
  }

  // 图表内容容器
  .chart-content {
    width: 100% !important;
    overflow: visible !important;
  }

  // 图表容器必须明确尺寸
  .chart-container {
    width: 100% !important;
    height: 300px !important;
    min-height: 300px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  // 过程能力指标内容
  .metric-content {
    width: 100% !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
  }

  .metric-item {
    flex: 1 1 45% !important;
    min-width: 120px !important;
  }

  // 工具栏移动端垂直布局
  .tool-bar {
    flex-direction: column !important;
    gap: 10px !important;
  }

  .filter {
    flex-wrap: wrap !important;
    gap: 8px !important;
  }

  .filter-item {
    width: 100% !important;
  }

  .filter-item label {
    display: block !important;
    margin-bottom: 4px !important;
  }

  .filter-item .el-select {
    width: 100% !important;
  }
}

.anomaly-status {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;

  .rule-desc {
    color: var(--color-Hlight-text);
    cursor: pointer;
    font-size: 14px;
  }
}

.last-check {
  font-size: 14px;
  color: var(--color-dark-text);
  opacity: 0.7;
}

.table-content {
  padding: 16px;
  width: 100%;
}

.rule-tooltip {
  max-width: 300px;

  h4 {
    margin: 0 0 8px 0;
    color: var(--color-dark-text);
  }

  p {
    margin: 4px 0;
    font-size: 12px;
    color: var(--color-dark-text);
  }
}

.divider {
  width: 100%;
  border: solid 0.5px var(--color-model-bg);
  color: transparent;
  height: 0;
}

/* 无数据提示样式 */
.no-data-placeholder {
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 8px;
}

.no-data-content {
  text-align: center;
  padding: 60px 20px;
}

.no-data-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.no-data-text {
  font-size: 18px;
  color: #606266;
  margin: 0 0 8px 0;
}

.no-data-hint {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* ====================================
   移动端适配 (768px 以下)
   ==================================== */
@media (max-width: 768px) {
  .graph-container {
    padding: 70px 12px 12px;
  }

  // 筛选工具栏 - 垂直布局
  .tool-bar {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .filter {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .filter-item {
    width: 100%;

    label {
      width: 60px;
      font-size: 13px;
    }

    .el-select {
      width: calc(100% - 70px) !important;
    }
  }

  .operation {
    width: 100%;
    justify-content: center;
    gap: 10px;

    .el-button {
      flex: 1;
      font-size: 13px;
    }
  }

  // 信息卡片调整
  .info-card {
    .header {
      flex-direction: column;
      gap: 8px;
      padding: 12px;

      h3 {
        font-size: 16px;
        margin: 0;
      }
    }

    .content {
      padding: 12px;
      gap: 10px;
    }

    .sub {
      min-width: calc(50% - 8px);
      flex: 0 0 calc(50% - 8px);
      padding: 8px;

      .label {
        font-size: 12px;
      }

      .value {
        font-size: 13px;
      }
    }
  }

  // 图表区域
  .chart-section {
    padding: 12px;

    .chart-header {
      flex-direction: column;
      gap: 8px;
      padding: 10px;

      h4 {
        font-size: 15px;
        margin: 0;
      }
    }

    .chart-container {
      height: 300px;
    }
  }

  // 统计表格
  .stats-table {
    padding: 12px;

    table {
      font-size: 12px;

      th, td {
        padding: 8px 4px;
      }
    }
  }

  // 表格内容
  .table-content {
    padding: 10px;
    overflow-x: auto;
  }

  // 无数据提示
  .no-data-placeholder {
    min-height: 300px;
  }

  .no-data-content {
    padding: 40px 20px;
  }

  .no-data-icon {
    font-size: 48px;
  }

  .no-data-text {
    font-size: 16px;
  }
}

/* ====================================
   小屏幕设备 (480px 以下)
   ==================================== */
@media (max-width: 480px) {
  .graph-container {
    padding: 66px 8px 8px;
  }

  .tool-bar {
    padding: 10px;
  }

  .filter-item {
    label {
      width: 50px;
      font-size: 12px;
    }
  }

  .operation {
    .el-button {
      font-size: 12px;
      padding: 8px 10px;
    }
  }

  .info-card {
    .sub {
      min-width: 100%;
      flex: 0 0 100%;
    }
  }

  .chart-section .chart-container {
    height: 250px;
  }

  .stats-table table {
    font-size: 11px;
  }

  .no-data-placeholder {
    min-height: 200px;
  }

  .no-data-content {
    padding: 30px 15px;
  }

  .no-data-icon {
    font-size: 40px;
  }

  .no-data-text {
    font-size: 14px;
  }

  .no-data-hint {
    font-size: 12px;
  }
}
</style>