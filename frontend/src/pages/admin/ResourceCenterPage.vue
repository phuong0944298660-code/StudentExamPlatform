<script setup lang="ts">
import { ref, computed } from 'vue'
import PanelCard from '../../components/common/PanelCard.vue'
import StatusTag from '../../components/business/StatusTag.vue'
import { useSuperAdminMockData } from '../../mock/superAdminMock'

const { resources, previewResource } = useSuperAdminMockData()
const stageFilter = ref<'ALL' | 'PRIMARY' | 'MIDDLE'>('ALL')

const filteredResources = computed(() => (stageFilter.value === 'ALL' ? resources.value : resources.value.filter((item) => item.stage === stageFilter.value)))
</script>

<template>
  <PanelCard title="资源中心管理" description="支持资源分类、在线预览与权限边界（演示）">
    <template #actions>
      <select v-model="stageFilter" class="input">
        <option value="ALL">全部学段</option>
        <option value="PRIMARY">小学组</option>
        <option value="MIDDLE">初中组</option>
      </select>
    </template>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>分类路径</th>
            <th>文件名</th>
            <th>类型</th>
            <th>学段</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredResources" :key="item.id">
            <td>{{ item.categoryPath }}</td>
            <td>{{ item.fileName }}</td>
            <td>
              <StatusTag
                :tone="item.fileType === 'VIDEO' ? 'info' : item.fileType === 'ZIP' ? 'warning' : 'success'"
                :label="item.fileType"
              />
            </td>
            <td>{{ item.stage }}</td>
            <td>{{ item.updatedAt }}</td>
            <td>
              <button class="btn" @click="previewResource(item.id)">在线预览</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PanelCard>
</template>

<style scoped>
.input {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 8px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 10px 8px;
  text-align: left;
  font-size: 13px;
}

.btn {
  border: 1px solid #6b98c0;
  background: #fff;
  color: #1e4b72;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
