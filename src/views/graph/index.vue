<template>
  <div class="graph-container" ref="exportTarget">
    <!-- 顶部筛选工具栏 -->
    <div class="tool-bar">
      <div class="filter">
        <!-- 工单号筛选 -->
        <div class="filter-item">
          <label>工单号</label>
          <el-select v-model="filter.workOrder" placeholder="请选择工单号" @change="handleFilterChange" style="width: 135px;">
            <el-option
              v-for="item in workOrderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        
        <!-- 任务筛选 -->
        <div class="filter-item">
          <label>任务</label>
          <el-select v-model="filter.task" placeholder="请选择任务" @change="handleFilterChange" style="width: 135px;">
            <el-option
              v-for="item in taskOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      
      <div class="operation">
        <!-- 导出图片按钮 -->
        <el-button type="primary" @click="exportImage">
          <i class="el-icon-picture"></i>
          导出图片
        </el-button>
        
        <!-- 刷新按钮 -->
        <el-button @click="refreshData">
          <i class="el-icon-refresh"></i>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 控制图基本信息 -->
    <div class="info-card">
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

    <div class="divider"></div>

    <!-- 组合图表：Xbar控制图和X-R控制图 -->
    <div class="info-card chart-row">
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

    <div class="divider"></div>

    <!-- 组合图表：S控制图和样本均值偏离图表 -->
    <div class="info-card chart-row">
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

    <div class="divider"></div>

    <!-- 异常判断和提示 -->
    <div class="info-card">
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

    <div class="divider"></div>

    <!-- 组合图表：过程能力直方图和过程能力指标 -->
    <div class="info-card chart-row">
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
          <span class="label">展示实际数据雨理论正态分布的对比，用于识别数据异常点和分布偏差</span>
        </div>
        <div class="chart-content">
          <div ref="histogramChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <div class="divider"></div>



    <!-- 最近数据点表格 -->
    <div class="info-card">
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
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, SeriesOption } from 'echarts'
import { ElMessage, ElSelect, ElOption, ElButton, ElTag, ElTooltip, ElTable, ElTableColumn } from 'element-plus'
import html2canvas from 'html2canvas'

import { useRouter } from 'vue-router';
const router = useRouter()

// 筛选条件接口
interface Filter {
  workOrder: string
  task: string
}

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

// 响应式数据
const filter = ref<Filter>({
  workOrder: 'WO001',
  task: 'T001'
})

const workOrderOptions = ref([
  { value: 'WO001', label: 'WO001' },
  { value: 'WO002', label: 'WO002' },
  { value: 'WO003', label: 'WO003' }
])

const taskOptions = ref([
  { value: 'T001', label: '任务001' },
  { value: 'T002', label: '任务002' },
  { value: 'T003', label: '任务003' }
])

const basicInfo = ref<BasicInfo>({
  productCode: 'P001',
  productName: '示例产品',
  workTaskNo: 'WT20240119001',
  workOrderNo: 'WO20240119001',
  processName: '加工工序',
  qualityCharacteristic: '尺寸精度',
  equipmentCode: 'EQ001',
  subgroupSampleSize: 5,
  totalSampleSize: 138,
  usl: 10.5,
  lsl: 9.5,
  lastUpdateTime: '2024-01-19 14:30:00'
})

const anomalyInfo = ref<AnomalyInfo>({
  status: 'normal',
  message: '过程受控-未发现特殊原因变异',
  enabledRule: '无异常',
  lastCheckTime: '2024年01月19日 14:30'
})

const capabilityMetrics = ref<CapabilityMetrics>({
  cp: 1.35,
  cpk: 1.28,
  pp: 1.30,
  ppk: 1.22,
  defectRate: 0.12,
  sigmaLevel: 3.85
})

const recentData = ref<RecentData[]>([])
const subgroupData = ref<SubgroupData[]>([])

const exportTarget = ref<HTMLElement|null>(null);
const previewUrl = ref('');
const loading = ref(false);

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

// 事件处理
const handleFilterChange = (): void => {
  // 筛选条件变更后刷新数据
  refreshData()
}

const exportImage = async () => {
  // 简单校验
  if (!exportTarget.value) {
    alert('未找到要导出的内容');
    return;
  }

  loading.value = true;

  // 1. 获取原生 DOM 元素并断言类型
  const element = exportTarget.value as HTMLElement;

  // 2. 保存原始样式（关键步骤）
  const originalStyles = {
    overflow: element.style.overflow,
    height: element.style.height,
    position: element.style.position, // 处理定位可能带来的影响
    left: element.style.left,
    top: element.style.top,
  };

  try {
    // 3. 临时修改样式，展开所有内容[1,7](@ref)
    // 目标是消除任何可能裁剪内容的样式
    element.style.overflow = 'visible';
    element.style.height = 'auto';
    // 确保元素在文档流中正常展开，不会被推出视口
    element.style.position = 'static';
    element.style.left = 'auto';
    element.style.top = 'auto';

    // 4. 获取展开后的完整尺寸
    const fullWidth = element.scrollWidth;
    const fullHeight = element.scrollHeight;

    // 5. 使用 html2canvas 捕获
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
      width: fullWidth,   // 使用完整宽度
      height: fullHeight, // 使用完整高度
      scrollX: 0,
      scrollY: 0,
      // 可选：如果遇到复杂样式，使用 onclone 回调在内部克隆体上做最终调整[1](@ref)
      onclone: (clonedDocument, element) => {
        const clonedElement = element as HTMLElement;
        clonedElement.style.overflow = 'visible';
        clonedElement.style.height = 'auto';
      }
    });

    // 6. 触发下载
    const link = document.createElement('a');
    link.download = `控制图_${new Date().getTime()}.png`; // 加时间戳防重名
    link.href = canvas.toDataURL('image/png');
    link.click();

  } catch (error) {
    console.error('导出图片失败:', error);
    alert('导出失败，请查看控制台信息。');
  } finally {
    // 7. 【重要】无论成功与否，恢复原始样式
    element.style.overflow = originalStyles.overflow;
    element.style.height = originalStyles.height;
    element.style.position = originalStyles.position;
    element.style.left = originalStyles.left;
    element.style.top = originalStyles.top;

    loading.value = false;
  }
};

const refreshData = (): void => {
  // 刷新数据逻辑
  ElMessage.info('数据已刷新')
  generateMockData()
  initCharts()
}

const viewAllData = (): void => {
  // 查看全部数据逻辑
  // ElMessage.info('跳转至任务详情页面')
  router.push('/task/detail')
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
  const controlLimits = calculateControlLimits(subgroupData.value)
  
  // 初始化Xbar控制图
  if (xbarChart.value) {
    xbarChartInstance = echarts.init(xbarChart.value)
    
    // 生成标记点数据
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
    
    // 格式化整体均值
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
              // 散点图的value是数组 [x, y]
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
    
    // 生成正态分布数据
    const allSamples = subgroupData.value.flatMap(d => d.samples)
    const mean = allSamples.reduce((a, b) => a + b, 0) / allSamples.length
    const std = Math.sqrt(allSamples.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / allSamples.length)
    
    // 创建直方图数据
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
              result += `频数: ${param.value}<br/>` // 整数，不保留小数
            } else if (param.seriesName === '理论正态分布') {
              result += `理论分布: ${param.value.toFixed(1)}%<br/>` // 百分比保留1位小数
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

// 生成模拟数据
const generateMockData = (): void => {
  subgroupData.value = Array.from({length: 25}, (_, index) => {
    const baseValue = 10 + Math.random() * 0.5 - 0.25
    const samples = Array.from({length: 5}, () => baseValue + Math.random() * 0.6 - 0.3)
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    const stdDev = Math.sqrt(samples.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / samples.length)
    const range = Math.max(...samples) - Math.min(...samples)
    
    return {
      subgroupNo: `SG${1000 + index}`,
      samples,
      mean: Number(mean.toFixed(3)),
      stdDev: Number(stdDev.toFixed(3)),
      range: Number(range.toFixed(3))
    }
  })

  // 修复：使用index而不是i
  recentData.value = subgroupData.value.map((d, index) => {
  const day = 19 + Math.floor(index / 12)
  const hour = (index * 2) % 24
  const minute = (index * 5) % 60
  
  return {
    subgroupNo: d.subgroupNo,
    sample1: formatNumber(d.samples[0] as number, PRECISION_CONFIG.SAMPLE),
    sample2: formatNumber(d.samples[1] as number, PRECISION_CONFIG.SAMPLE),
    sample3: formatNumber(d.samples[2] as number, PRECISION_CONFIG.SAMPLE),
    sample4: formatNumber(d.samples[3] as number, PRECISION_CONFIG.SAMPLE),
    sample5: formatNumber(d.samples[4] as number, PRECISION_CONFIG.SAMPLE),
    mean: formatNumber(d.mean, PRECISION_CONFIG.MEAN),
    stdDev: formatNumber(d.stdDev, PRECISION_CONFIG.STD_DEV),
    range: formatNumber(d.range, PRECISION_CONFIG.RANGE),
    inspectionTime: `2024-01-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
})
}

// 生命周期
onMounted(() => {
  generateMockData()
  nextTick(() => {
    initCharts()
  })
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
</style>