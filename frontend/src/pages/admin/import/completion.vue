<template>
  <div class="completion-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">名单补全</h1>
        <p class="page-subtitle">补充和完善导入的学生信息，配置师生关联关系</p>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span class="card-title">待补全名单</span>
          </template>
          <div class="incomplete-list">
            <div 
              v-for="item in incompleteList" 
              :key="item.id"
              class="incomplete-item"
              :class="{ active: selectedId === item.id }"
              @click="selectItem(item)"
            >
              <div class="item-name">{{ item.name }}</div>
              <div class="item-idcard">{{ item.idCard }}</div>
              <el-tag v-if="item.missingFields.includes('teacher')" type="warning" size="small">缺教师</el-tag>
              <el-tag v-if="item.missingFields.includes('school')" type="info" size="small">缺学校</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-if="selectedItem">
          <template #header>
            <span class="card-title">补全信息 - {{ selectedItem.name }}</span>
          </template>
          <el-form :model="form" label-width="100px">
            <el-form-item label="姓名">
              <el-input v-model="form.name" disabled />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="form.idCard" disabled />
            </el-form-item>
            <el-form-item label="学校">
              <el-select v-model="form.school" placeholder="选择学校" filterable style="width: 100%">
                <el-option v-for="school in schoolOptions" :key="school" :label="school" :value="school" />
              </el-select>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="form.grade" placeholder="选择年级" style="width: 100%">
                <el-option v-for="g in ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']" :key="g" :label="g" :value="g" />
              </el-select>
            </el-form-item>
            <el-form-item label="指导教师">
              <el-select v-model="form.teacherId" placeholder="选择指导教师" filterable style="width: 100%">
                <el-option v-for="t in teacherOptions" :key="t.id" :label="t.name" :value="t.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-form>
          <div class="form-actions">
            <el-button @click="selectedId = null">取消</el-button>
            <el-button type="primary" @click="saveCompletion">保存</el-button>
            <el-button type="success" @click="saveAndNext">保存并下一个</el-button>
          </div>
        </el-card>
        <el-empty v-else description="请选择左侧待补全的记录" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const incompleteList = ref([
  { id: 1, name: '张三', idCard: '450102201201011234', missingFields: ['teacher', 'school'] },
  { id: 2, name: '李四', idCard: '450102201202021234', missingFields: ['teacher'] },
  { id: 3, name: '王五', idCard: '450102201203031234', missingFields: ['school'] },
])

const selectedId = ref<number | null>(null)
const selectedItem = computed(() => incompleteList.value.find(item => item.id === selectedId.value))

const schoolOptions = ['南宁市第一小学', '南宁市第二小学', '南宁市第三小学', '南宁市第一中学初中部']
const teacherOptions = [
  { id: 1, name: '陈老师' },
  { id: 2, name: '刘老师' },
  { id: 3, name: '王老师' },
]

const form = reactive({
  name: '',
  idCard: '',
  school: '',
  grade: '',
  teacherId: null as number | null,
  contactPhone: ''
})

const selectItem = (item: any) => {
  selectedId.value = item.id
  form.name = item.name
  form.idCard = item.idCard
  form.school = ''
  form.grade = ''
  form.teacherId = null
  form.contactPhone = ''
}

const saveCompletion = () => {
  ElMessage.success('保存成功')
  incompleteList.value = incompleteList.value.filter(item => item.id !== selectedId.value)
  selectedId.value = null
}

const saveAndNext = () => {
  saveCompletion()
  if (incompleteList.value.length > 0) {
    selectItem(incompleteList.value[0])
  }
}
</script>

<style scoped>
.completion-page { padding-bottom: 40px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 600; color: #1E293B; margin: 0 0 8px 0; }
.page-subtitle { font-size: 14px; color: #64748B; margin: 0; }
.card-title { font-size: 16px; font-weight: 600; color: #1E293B; }
.incomplete-list { max-height: 600px; overflow-y: auto; }
.incomplete-item {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
}
.incomplete-item:hover, .incomplete-item.active {
  background: #eff6ff;
  border-left: 3px solid #3B82F6;
}
.item-name { font-size: 16px; font-weight: 500; color: #1E293B; margin-bottom: 4px; }
.item-idcard { font-size: 13px; color: #64748B; margin-bottom: 8px; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
</style>
