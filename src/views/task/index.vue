<template>
    <div class="task-container">
        <div class="task-total" v-if="!isShowDetails">
            <div class="task-number">
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                    padding: 10px 0;"
                >
                    <div class="search-bar">
                        <input 
                            type="text" 
                            id="taskNumber" 
                            class="form-control" 
                            placeholder="搜索工单"
                            v-model="taskNumberSearch"
                            style="font-size: 15px; border: none;display: flex; align-items: center; line-height: normal;">
                        <searchScope />
                    </div>
                </div>
                <div class="show-taskNo" @click="toggleTaskNoList">
                    <span style="font-size: 18px; font-weight: bold; color: var(--color-dark-text);">工单号</span>
                    <downArrow :class="['arrow-icon', { 'arrow-rotate': !isShowTaskNo }]" />
                </div>
                <transition name="tree-collapse">
                    <div v-if="isShowTaskNo" class="taskNo-container">
                        <div 
                            v-for="item in filteredTaskNoList" 
                            :key="item.no" 
                            class="taskNo-list" 
                            :class="{active: currentNo === item.no}"
                            @click="()=>handleTaskNoClick(item)"
                        >
                            <div 
                                class="taskNo" 
                                :class="{active: currentNo === item.no}" 
                            >
                                {{ item.no }}
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 5px; padding-right: 8px;">
                                <div class="status-badge badge-done" v-if="item.status === 0">已关闭</div>
                                <div class="status-badge status-done" v-else>已启用</div>
                                <powerOff @click="()=>{
                                    isShowDialog = true
                                    currentTicket = item
                                }" />
                                <!-- <powerOff @click="()=>item.status = item.status ===  1 ? 0 : 1" /> -->
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="task-list">
                <div style="padding: 5px 10px; width: 100%; font-size: 21px;font-weight: bold; color: var(--color-dark-text);">任务列表</div>
                <div class="divider"></div>
                <div class="operate-bar">
                    <div class="operate-btn">
                        <el-button type="primary" @click="handleAdd">
                            <el-icon><plusIcon /></el-icon>
                            <span style="min-width: 30px;">添加</span>
                        </el-button>
                        <!-- <el-button type="primary">
                            <el-icon><plusIcon /></el-icon>
                            <span style="min-width: 50px;">批量添加</span>
                        </el-button> -->
                        <el-button type="success" plain @click="handleExport">
                            <el-icon><exportIcon /></el-icon>
                            <span style="min-width: 30px;">导出</span>
                        </el-button>
                        <el-button type="success" plain @click="handleCopy">
                            <el-icon><copyIcon /></el-icon>
                            <span style="min-width: 30px;">复制</span>
                        </el-button>
                    </div>
                    <div class="filter-search">
                        <!-- <el-select v-model="currentType" placeholder="全部类别" style="width: 120px">
                            <el-option
                            v-for="item in typeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select> -->
                        <el-select v-model="currentStatus" placeholder="全部状态" style="width: 120px">
                            <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select>
                        <el-input 
                            v-model="productSearch" 
                            placeholder="输入产品编码或名称" 
                            style="width: 160px;"
                            @keyup.enter="handleSearch"
                        ></el-input>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </div>
                </div>
                <div class="table-container">
                    <el-table
                        :data="pagedTableData"
                        v-loading="loading"
                        row-key="tid"
                        style="width: 100%; table-layout: auto;"
                        @selection-change="handleMultiSelect"
                    >
                        <el-table-column type="selection" :selectable="()=>true"></el-table-column>
                        <el-table-column prop="line" label="行号" align="center"></el-table-column>
                        <el-table-column prop="ticket" label="工单号" align="center"></el-table-column>
                        <el-table-column prop="pid" label="产品编码" align="center"></el-table-column>
                        <el-table-column prop="pname" label="产品名称" align="center"></el-table-column>
                        <el-table-column prop="tid" label="工作任务号" align="center"></el-table-column>
                        <el-table-column prop="tname" label="工序作业名称" align="center"></el-table-column>
                        <el-table-column prop="devid" label="设备编号" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态"  align="center">
                            <template #default="scope">
                                <span :class="getStatusClass(scope.row.status)">
                                    {{ getStatusText(scope.row.status) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stime" label="最近启用时间" align="center"></el-table-column>
                        <el-table-column prop="ctime" label="创建时间" align="center"></el-table-column>
                        <el-table-column label="操作" width="270" align="center">
                            <template #default="scope">
                                <div class="operation-buttons">
                                    <el-button 
                                        type="primary" 
                                        size="small" 
                                        class="btn-detail"
                                        @click="handleDetail(scope.row)"
                                    >
                                        详情
                                    </el-button>
                                    <el-button 
                                        v-if="currentTicket.status !== 0"
                                        type="warning" 
                                        size="small" 
                                        class="btn-edit"
                                        @click="handleEdit(scope.row)"
                                    >
                                        编辑
                                    </el-button>
                                    <el-button 
                                        type="primary" 
                                        size="small" 
                                        class="btn-chart"
                                        @click="handleChart(scope.row)"
                                    >
                                        控制图
                                    </el-button>
                                    <el-button 
                                        v-if="currentTicket.status !== 0"
                                        type="warning" 
                                        size="small" 
                                        class="btn-delete"
                                        @click="()=>{
                                            deletDialog = true
                                            currentMission = scope.row
                                        }"
                                    >
                                        删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                
                <!-- 分页组件 -->
                <div class="pagination-container">
                    <div class="pagination-info">
                        共 {{ filteredTableData.length }} 条数据，当前显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredTableData.length) }} 条
                    </div>
                    <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :small="true"
                        :disabled="false"
                        :background="true"
                        layout="sizes, prev, pager, next, jumper"
                        :total="filteredTableData.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </div>
        <el-dialog
          v-model="isShowDialog"
          title="提示"
          :width="dialogWidth"
        >
            <span>是否{{ currentTicket.status === 0 ? "开启" : "关闭" }}当前工单:&nbsp;{{ currentNo }}?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowDialog = false">取消</el-button>
                    <el-button type="primary" @click="handleWorkOrderStatusChange">确认</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog
          v-model="deletDialog"
          title="提示"
          :width="dialogWidth"
        >
            <span>是否删除当前任务?</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="deletDialog = false">取消</el-button>
                    <el-button type="primary" @click="handleDelete(currentMission)">确认</el-button>
                </div>
            </template>
        </el-dialog>
        <detail
            ref="detailRef"
            :is-show-details="isShowDetails"
            :selected-item="selectedItem"
            :is-edit="isEdit"
            @close="handleCloseDetail"
            @change="handleStatusChange"
            @save="handleSaveTask"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { ElMessage, ElMessageBox } from 'element-plus'
import detail from './detail.vue';
import { useRouter, useRoute } from 'vue-router';
import { getWorkOrders, getTasks, enableWorkOrder, closeWorkOrder, deleteTask, updateTaskStatus, getTaskDetail } from '@/api/modules';
const router = useRouter()
const route = useRoute()

// 响应式屏幕宽度检测
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => screenWidth.value <= 768)

// 动态计算dialog宽度
const dialogWidth = computed(() => {
    return isMobile.value ? '300px' : '500px'
})

// 监听窗口大小变化
const handleResize = () => {
    screenWidth.value = window.innerWidth
}

// detail 组件引用
const detailRef = ref<InstanceType<typeof import('./detail.vue').default> | null>(null)

import searchScope from '@/components/icons/searchScope.vue';
import downArrow from '@/components/icons/downArrow.vue';
import powerOff from '@/components/icons/powerOff.vue';
import exportIcon from '@/components/icons/exportIcon.vue';
import copyIcon from '@/components/icons/copyIcon.vue';
import plusIcon from '@/components/icons/plusIcon.vue';

// 左侧工单列表显示控制
const isShowTaskNo = ref(true)

// 搜索相关
const taskNumberSearch = ref('')
const productSearch = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 详情显示
const isShowDetails = ref(false)
const isEdit = ref(false)

// 处理关闭详情弹窗
const handleCloseDetail = async () => {
    // 如果不是编辑模式，直接关闭
    if (!isEdit.value) {
        isShowDetails.value = false
        return
    }
    
    // 检查是否有未保存的修改
    const hasUnsavedChanges = detailRef.value?.checkUnsavedChanges()
    if (!hasUnsavedChanges) {
        isShowDetails.value = false
        return
    }
    
    // 弹出确认对话框
    try {
        await ElMessageBox.confirm(
            '是否保留修改并离开?',
            '确认离开',
            {
                confirmButtonText: '离开',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        // 用户确认离开
        isShowDetails.value = false
    } catch {
        // 用户取消，保持弹窗打开
    }
}
const isShowDialog = ref(false)
const deletDialog = ref(false)

// 数据类型定义
interface TaskData {
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
    _rawData?: any;
}

// 工单列表数据（从API获取）
const taskNoList = ref<{no: string, status: number, id?: number}[]>([])

// 类别列表
const typeList = ref([
    {name: '全部类别', id: 0},
    {name: '总成检外观', id: 1},
    {name: '轴套装配', id: 2},
    {name: '齿轮装配', id: 3},
])

// 状态列表
const statusList = ref([
    {name: '全部状态', id: 0},
    {name: '已启用', id: 1},
    {name: '已关闭', id: 2},
])

// 任务列表数据（从API获取）
const rawTableData = ref<any[]>([])

// 加载状态
const loading = ref(false)

// 获取工单列表
// 获取工单列表
const fetchWorkOrders = async () => {
    try {
        const res = await getWorkOrders()
        if (res.code === 200) {
            taskNoList.value = res.data.map((item: any) => ({
                no: item.orderNo,
                status: item.status,
                id: item.id
            }))
            // 默认选中第一个工单
            const firstOrder = taskNoList.value[0]
            if (firstOrder) {
                currentNo.value = firstOrder.no
                currentTicket.value = firstOrder
                // 获取第一个工单的任务列表
                fetchTasks(firstOrder.id)
            }
        }
    } catch (error) {
        console.error('获取工单列表失败:', error)
        ElMessage.error('获取工单列表失败')
    }
}

// 获取任务列表
const fetchTasks = async (workOrderId?: number) => {
    loading.value = true
    try {
        const params: any = {}
        if (workOrderId) {
            params.workOrderId = workOrderId
        }
        const res = await getTasks(params)
        if (res.code === 200) {
            // 转换后端数据为前端需要的格式
            rawTableData.value = res.data.map((item: any, index: number) => ({
                line: index + 1,
                ticket: item.orderNo,
                tid: item.taskNo,
                pid: item.productCode,
                pname: item.productName,
                tname: item.processName,
                devid: item.equipmentCode,
                status: String(item.status),
                stime: item.enabledAt ? formatDate(item.enabledAt) : '',
                ctime: item.createdAt ? formatDate(item.createdAt) : '',
                // 保留原始数据
                _rawData: item
            }))
        }
    } catch (error) {
        console.error('获取任务列表失败:', error)
        ElMessage.error('获取任务列表失败')
    } finally {
        loading.value = false
    }
}
// 格式化日期
const formatDate = (dateStr: string) => {
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

// 选中内容
const currentTicket = ref<any>({})
const currentNo = ref('')
const currentType = ref(0)
const currentStatus = ref(0)
const currentMission = ref()
const selectedData = ref([])
const selectedItem = ref<TaskData>({})

// 计算属性：过滤左侧工单列表
const filteredTaskNoList = computed(() => {
    if (!taskNumberSearch.value) {
        return taskNoList.value
    }
    return taskNoList.value.filter(item => 
        item.no.toLowerCase().includes(taskNumberSearch.value.toLowerCase())
    )
})

// 计算属性：过滤表格数据
const filteredTableData = computed(() => {
    return rawTableData.value.filter(item => {
        // 按工单号过滤
        if (currentNo.value && item.ticket !== currentNo.value) {
            return false
        }
        
        // 按类别过滤
        if (currentType.value > 0) {
            // 这里可以根据实际业务逻辑过滤，暂时使用模拟逻辑
            if (currentType.value === 1 && item.tname !== '总成检外观') return false
            if (currentType.value === 2 && item.tname !== '轴套装配') return false
            if (currentType.value === 3 && item.tname !== '齿轮装配') return false
        }
        
        // 按状态过滤
        if (currentStatus.value > 0) {
            const targetStatus = currentStatus.value === 1 ? '1' : '0'
            if (item.status !== targetStatus) {
                return false
            }
        }
        
        // 按产品编码或名称搜索
        if (productSearch.value) {
            const search = productSearch.value.toLowerCase()
            if (!item.pid?.toLowerCase().includes(search) && 
                !item.pname?.toLowerCase().includes(search)) {
                return false
            }
        }
        
        return true
    })
})

// 计算属性：分页后的表格数据
const pagedTableData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredTableData.value.slice(start, end)
})

// 状态显示格式化
const getStatusText = (status: string) => {
    switch(status) {
        case '1': return '启用'
        case '0': return '停用'
        default: return '未知'
    }
}

const getStatusClass = (status: string) => {
    switch(status) {
        case '1': return 'status-text status-open'
        case '0': return 'status-text status-stopped'
        default: return 'status-text'
    }
}

// 事件处理函数
const toggleTaskNoList = () => {
    isShowTaskNo.value = !isShowTaskNo.value
}

const handleTaskNoClick = (item: any) => {
    currentNo.value = item.no
    currentTicket.value = item
    // 切换工单时重新获取任务列表
    if (item.id) {
        fetchTasks(item.id)
    }
}

const handleMultiSelect = (val:any) => {
    selectedData.value = val
}

const handleEdit = (row: any) => {
    selectedItem.value = row
    isShowDetails.value = true
    isEdit.value = true
    console.log('编辑行:', row)
}
const handleAdd = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')
    const ctime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    
    selectedItem.value = {
        ticket: currentNo.value,
        ctime: ctime,
        workOrderId: currentTicket.value?.id
    }
    isShowDetails.value = true
    isEdit.value = true
    console.log('新增任务')
}

const handleWorkOrderStatusChange = async () => {
    try {
        const ticketId = String(currentTicket.value?.id)
        if (!ticketId || ticketId === 'undefined') {
            ElMessage.error('工单ID不存在')
            return
        }

        if (currentTicket.value.status === 0) {
            await enableWorkOrder(ticketId)
            currentTicket.value.status = 1
        } else {
            await closeWorkOrder(ticketId)
            currentTicket.value.status = 0
        }

        const index = taskNoList.value.findIndex((item: any) => item.id === currentTicket.value.id)
        if (index !== -1 && taskNoList.value[index]) {
            taskNoList.value[index].status = currentTicket.value.status
        }

        ElMessage.success(currentTicket.value.status === 1 ? '工单已开启' : '工单已关闭')
    } catch (error) {
        console.error('工单状态更新失败:', error)
        ElMessage.error('工单状态更新失败')
    } finally {
        isShowDialog.value = false
    }
}

const handleSaveTask = async (taskData: any) => {
    console.log('保存任务结果:', taskData)
    try {
        // 获取当前工单 ID，确保有效
        const workOrderId = currentTicket.value?.id || currentTicket.value?.workOrderId
        if (workOrderId) {
            await fetchTasks(workOrderId)
        } else {
            // 如果工单 ID 不存在，获取所有任务
            await fetchTasks()
        }
    } catch (error) {
        console.error('刷新任务列表失败:', error)
        ElMessage.error('刷新任务列表失败')
    } finally {
        // 关闭详情页
        isShowDetails.value = false
    }
}

const handleDetail = (row: any) => {
    selectedItem.value = row
    isShowDetails.value = true
    isEdit.value = false
    console.log('详情:', row)
}
const handleChart = (row: any) => {
    // 从原始数据中获取任务ID
    const taskId = row._rawData?.id
    const orderId = row.ticket
    if (taskId) {
        router.push(`/graph/?taskId=${taskId}&orderId=${orderId}`)
    } else {
        router.push('/graph')
    }
    console.log('控制图:', row)
}
const handleDelete = async (row: any) => {
    try {
        const taskId = row._rawData?.id
        if (!taskId) {
            ElMessage.error('任务ID不存在，无法删除')
            return
        }
        await deleteTask(String(taskId))
        // 刷新当前工单下的任务列表
        const workOrderId = currentTicket.value?.id || currentTicket.value?.workOrderId
        if (workOrderId) {
            await fetchTasks(workOrderId)
        } else {
            await fetchTasks()
        }
        ElMessage.success('任务已删除')
    } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
    } finally {
        deletDialog.value = false
    }
}


const handleSearch = () => {
    // 搜索时重置到第一页
    currentPage.value = 1
    console.log('搜索条件:', { 
        taskNumberSearch: taskNumberSearch.value, 
        productSearch: productSearch.value,
        currentType: currentType.value,
        currentStatus: currentStatus.value
    })
}

// 分页相关事件
const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
    currentPage.value = page
}

// 导出
const handleExport = () => {
    if (selectedData.value.length === 0) {
        ElMessage.warning('请先选择要导出的数据')
        return
    }
    
    try {
        // 准备Excel数据
        const worksheetData = [
            // 表头
            ['行号', '工单号', '产品编码', '产品名称', '工作任务号', '工序作业名称', '设备编号', '状态', '最近启用时间', '创建时间']
        ]
        
        // 添加选中行的数据
        selectedData.value.forEach((item:any) => {
            worksheetData.push([
                item.line,
                item.ticket,
                item.pid,
                item.pname,
                item.tid,
                item.tname,
                item.devid,
                getStatusText(item.status), // 转换状态为可读文本
                item.stime,
                item.ctime
            ])
        })
        
        // 创建工作簿和工作表
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
        
        // 设置列宽
        const colWidths = [
            { wch: 8 },   // 行号
            { wch: 15 },  // 工单号
            { wch: 12 },  // 产品编码
            { wch: 20 },  // 产品名称
            { wch: 15 },  // 工作任务号
            { wch: 15 },  // 工序作业名称
            { wch: 12 },  // 设备编号
            { wch: 8 },   // 状态
            { wch: 20 },  // 最近启用时间
            { wch: 20 }   // 创建时间
        ]
        worksheet['!cols'] = colWidths
        
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, '任务列表')
        
        // 生成Excel文件并下载
        const timestamp = new Date().getTime()
        const fileName = `任务列表_${timestamp}.xlsx`
        XLSX.writeFile(workbook, fileName)
        
        ElMessage.success(`成功导出 ${selectedData.value.length} 条数据`)
        
    } catch (error) {
        console.error('导出Excel失败:', error)
        ElMessage.error('导出失败，请重试')
    }
}

// 复制
const handleCopy = async () => {
    if (selectedData.value.length === 0) {
        ElMessage.warning('请先选择要复制的数据')
        return
    }
    
    try {
        // 准备表格格式的文本
        let clipboardText = '行号\t工单号\t产品编码\t产品名称\t工作任务号\t工序作业名称\t设备编号\t状态\t最近启用时间\t创建时间\n'
        
        // 添加选中行的数据
        selectedData.value.forEach((item:any) => {
            clipboardText += `${item.line}\t${item.ticket}\t${item.pid}\t${item.pname}\t${item.tid}\t${item.tname}\t${item.devid}\t${getStatusText(item.status)}\t${item.stime}\t${item.ctime}\n`
        })
        
        // 使用现代Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            // 在HTTPS环境下使用现代API
            await navigator.clipboard.writeText(clipboardText)
        } else {
            // 回退方案：使用textArea
            const textArea = document.createElement('textarea')
            textArea.value = clipboardText
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            
            try {
                document.execCommand('copy')
            } catch (err) {
                console.error('复制失败:', err)
                ElMessage.error('复制失败，请重试')
                return
            }
            
            document.body.removeChild(textArea)
        }
        
        ElMessage.success(`成功复制 ${selectedData.value.length} 条数据到剪切板`)
        
    } catch (error) {
        console.error('复制到剪切板失败:', error)
        ElMessage.error('复制失败，请重试')
    }
}

const handleStatusChange = async () => {
    try {
        const taskId = selectedItem.value?._rawData?.id
        if (!taskId) {
            ElMessage.error('任务ID不存在，无法切换状态')
            return
        }
        const curStatus = selectedItem.value?.status
        const newStatus = curStatus === '1' ? 0 : 1
        await updateTaskStatus(String(taskId), newStatus as 0 | 1)
        // 刷新任务列表
        const workOrderId = currentTicket.value?.id || currentTicket.value?.workOrderId
        if (workOrderId) {
            await fetchTasks(workOrderId)
        } else {
            await fetchTasks()
        }
        ElMessage.success(newStatus === 1 ? '任务已启用' : '任务已停用')
    } catch (error) {
        console.error('状态切换失败:', error)
        ElMessage.error('状态切换失败')
    }
}

// 初始化
onMounted(async () => {
    console.log('组件已加载')
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    // 获取工单列表和任务列表
    fetchWorkOrders()

    // 检查路由参数，自动打开指定任务详情
    const taskId = route.query.taskId as string
    if (taskId) {
        try {
            const res = await getTaskDetail(taskId)
            if (res.code === 200 && res.data) {
                const task = res.data
                selectedItem.value = {
                    tid: task.taskNo,
                    ticket: task.orderNo,
                    pid: task.productCode,
                    pname: task.productName,
                    workOrderId: task.workOrderId ? Number(task.workOrderId) : undefined,
                    _rawData: task
                }
                isShowDetails.value = true
                isEdit.value = false
            }
        } catch (e) {
            console.error('自动打开任务详情失败:', e)
        }
    }
})

// 组件卸载时移除监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.task-container {
    width: 100%;
    height: 100%;
    padding: 80px 60px 20px;
    background-color: var(--color-model-bg);
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
}

.task-total {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 5px;
    transition: transform 0.3s ease;    
}

.task-total.hide {
    transform: translateX(-120%);
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

// 移动端响应式样式
@media (max-width: 768px) {
    .task-number {
        position: relative !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        display: flex !important;
        flex-direction: column !important;
    }
    
    // 确保父容器不隐藏
    .task-total {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
    }
}

.search-bar {
    position: relative;
    width: 100%;
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    border: solid 1.5px #15151533; 
    border-radius: 6px; 
    padding: 6px;
}

.search-bar:focus-within {
    border-color: #1890ff !important;
}

.show-taskNo {
    margin-left: 12px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    padding: 8px 0;
    transition: all 0.3s ease;
}

.show-taskNo:hover {
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 8px 12px;
    margin-left: 0;
}

/* 箭头旋转动画 */
.arrow-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(0deg);
}

.arrow-icon.arrow-rotate {
    transform: rotate(-180deg);
}

/* 树形结构展开收起动画 */
.tree-collapse-enter-active,
.tree-collapse-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}

.tree-collapse-enter-from,
.tree-collapse-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.taskNo-container {
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 10px;
}

.taskNo-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.taskNo-list.active {
    background-color: #e6f7ff;
}

.taskNo-list:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}

.taskNo {
    width: 125px;
    color: var(--color-dark-text);
    padding: 4px 8px;
    border-radius: 6px;
    border: transparent;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
}
.taskNo.active {
    color: var(--color-Hlight-text);
    font-weight: bold;
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

// 状态文本样式
.status-text {
    font-weight: 600;
    
    &.status-open {
        color: #52c41a;
    }
    
    &.status-closed {
        color: #929690;
    }
    
    &.status-stopped {
        color: #ff4d4f;
    }
}

.task-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
}

.divider {
    width: 100%; 
    border: solid 0.5px var(--color-model-bg);
    color: transparent;
    height: 0;
}

.operate-bar {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    gap: 16px;
    padding: 10px;
}

.operate-btn {
    width: 380px;
    display: flex;
    padding: 8px 0;
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
    display: flex;
    align-items: center;
    gap: 5px;
}

.form-control:focus {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

.table-container {
    flex: 1;
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden; 
    border: 1px solid #ebeef5;
    border-radius: 4px;
}

// 分页样式
.pagination-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid #f0f0f0;
    margin-top: auto;
}

.pagination-info {
    font-size: 14px;
    color: #666;
}

// Element Plus 分页器自定义样式
:deep(.el-pagination) {
    .el-pagination__total {
        font-size: 14px;
    }
    
    .el-pagination__jump {
        font-size: 14px;
    }
    
    .el-select .el-input__inner {
        font-size: 14px;
    }
}

/* ====================================
   移动端适配 (768px 以下)
   ==================================== */
@media (max-width: 768px) {
    .task-container {
        padding: 70px 12px 12px;
    }

    // 隐藏工单号侧边栏
    .task-number {
        display: none;
    }

    .task-total {
        gap: 0;
    }

    // 操作栏垂直布局
    .operate-bar {
        flex-direction: column;
        gap: 12px;
        padding: 12px 8px;
    }

    .operate-btn {
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }

    // 筛选搜索区域垂直布局
    .filter-search {
        flex-wrap: wrap;
        width: 100%;
        
        .el-select {
            width: 48% !important;
        }
        
        .el-input {
            width: 48% !important;
        }
        
        .el-button {
            width: 100%;
            margin-top: 8px;
        }
    }

    // 表格容器
    .table-container {
        overflow-x: auto;
        
        .el-table {
            font-size: 12px;
        }
    }

    // 操作按钮调整
    .operation-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 4px;
        
        .el-button {
            padding: 4px 8px;
            font-size: 11px;
        }
    }

    // 分页调整
    .pagination-container {
        flex-direction: column;
        gap: 12px;
        padding: 12px;
    }

    // 标题调整
    .task-list > div:first-child {
        font-size: 16px !important;
        padding: 8px !important;
    }
}

/* ====================================
   小屏幕设备 (480px 以下)
   ==================================== */
@media (max-width: 480px) {
    .task-container {
        padding: 66px 8px 8px;
    }

    .operate-btn {
        .el-button {
            padding: 6px 10px;
            font-size: 12px;
        }
    }

    .filter-search {
        .el-select, .el-input {
            width: 100% !important;
            margin-bottom: 4px;
        }
        
        .el-button {
            margin-top: 4px;
        }
    }

    .table-container {
        .el-table {
            font-size: 11px;
            
            .cell {
                padding: 4px;
            }
        }
    }

    // 隐藏部分列
    .el-table {
        .el-table_column {
            &-3, &-4, &-5, &-6 {
                display: none;
            }
        }
    }

    .task-list > div:first-child {
        font-size: 14px !important;
    }
}
</style>