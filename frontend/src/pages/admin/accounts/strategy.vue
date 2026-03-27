<template>
  <div class="strategy-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">策略配置</h1>
        <p class="page-subtitle">配置训练账号的有效期策略和价格策略</p>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="card-title">策略列表</span>
              <el-button type="primary" @click="showCreateDialog">
                <el-icon class="mr-2"><Plus /></el-icon>
                新建策略
              </el-button>
            </div>
          </template>
          <el-table :data="strategyList" stripe>
            <el-table-column prop="name" label="策略名称" min-width="150" />
            <el-table-column prop="stage" label="适用学段" width="100">
              <template #default="{ row }">
                {{ row.stage === 'PRIMARY' ? '小学' : '初中' }}
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="有效期" width="120">
              <template #default="{ row }">
                {{ row.duration }}天
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="120">
              <template #default="{ row }">
                ¥{{ row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'" size="small">
                  {{ row.status === 'ACTIVE' ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editStrategy(row)">编辑</el-button>
                <el-button link :type="row.status === 'ACTIVE' ? 'danger' : 'success'" @click="toggleStatus(row)">
                  {{ row.status === 'ACTIVE' ? '停用' : '启用' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span class="card-title">快速配置</span>
          </template>
          <div class="quick-config">
            <div class="config-item">
              <div class="config-label">默认激活码有效期</div>
              <el-radio-group v-model="defaultDuration">
                <el-radio-button label="3months">3个月</el-radio-button>
                <el-radio-button label="6months">半年</el-radio-button>
                <el-radio-button label="1year">1年</el-radio-button>
              </el-radio-group>
            </div>
            <el-divider />
            <div class="config-item">
              <div class="config-label">账号过期提醒</div>
              <el-switch v-model="expireReminder" active-text="开启" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建/编辑策略弹窗 -->
    <el-dialog v-model="dialogVisible" title="策略配置" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="策略名称">
          <el-input v-model="form.name" placeholder="如：小学年度会员" />
        </el-form-item>
        <el-form-item label="适用学段">
          <el-radio-group v-model="form.stage">
            <el-radio-button label="PRIMARY">小学</el-radio-button>
            <el-radio-button label="MIDDLE">初中</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-input-number v-model="form.duration" :min="1" :max="365" style="width: 150px">
            <template #append>天</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 150px">
            <template #append>元</template>
          </el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStrategy">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const strategyList = ref([
  { id: 1, name: '小学季度会员', stage: 'PRIMARY', duration: 90, price: 99.00, status: 'ACTIVE' },
  { id: 2, name: '小学年度会员', stage: 'PRIMARY', duration: 365, price: 299.00, status: 'ACTIVE' },
  { id: 3, name: '初中季度会员', stage: 'MIDDLE', duration: 90, price: 129.00, status: 'ACTIVE' },
  { id: 4, name: '初中年度会员', stage: 'MIDDLE', duration: 365, price: 399.00, status: 'ACTIVE' },
])

const defaultDuration = ref('3months')
const expireReminder = ref(true)
const dialogVisible = ref(false)
const form = reactive({
  name: '',
  stage: 'PRIMARY',
  duration: 90,
  price: 99.00
})

const showCreateDialog = () => {
  form.name = ''
  form.stage = 'PRIMARY'
  form.duration = 90
  form.price = 99.00
  dialogVisible.value = true
}

const editStrategy = (row: any) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

const toggleStatus = (row: any) => {
  row.status = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  ElMessage.success(row.status === 'ACTIVE' ? '已启用' : '已停用')
}

const saveStrategy = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.strategy-page {
  padding-bottom: 40px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
}

.quick-config {
  padding: 10px 0;
}

.config-item {
  margin-bottom: 20px;
}

.config-label {
  font-size: 14px;
  color: #64748B;
  margin-bottom: 12px;
}

.mr-2 {
  margin-right: 8px;
}
</style>
