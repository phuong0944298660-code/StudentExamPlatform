<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SectionPanel from '../common/SectionPanel.vue'
import StatCard from '../common/StatCard.vue'
import StatusTag from '../common/StatusTag.vue'
import type { ActionItem, AdminSectionView, HighlightItem, TableColumn, TableRow, Tone } from '../../types/admin'

const props = defineProps<{
  view: AdminSectionView
}>()

const router = useRouter()

const actionTypeMap: Record<Tone, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

const toneStyleMap: Record<Tone, string> = {
  primary: 'border-blue-100 bg-blue-50 text-blue-700',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-100 bg-amber-50 text-amber-700',
  danger: 'border-rose-100 bg-rose-50 text-rose-700',
  info: 'border-slate-100 bg-slate-50 text-slate-700',
}

const handleAction = async (action: ActionItem) => {
  if (action.route) {
    await router.push(action.route)
    return
  }

  ElMessage.success(action.message ?? `已执行：${action.label}`)
}

const handleHighlight = async (item: HighlightItem) => {
  if (!item.route) return
  await router.push(item.route)
}

const resolveTagTone = (column: TableColumn, row: TableRow): Tone => {
  const value = String(row[column.key] ?? '')
  return column.tones?.[value] ?? 'info'
}

const emphasisTone = computed(() => {
  if (props.view.badge.includes('发布') || props.view.badge.includes('待办')) return 'warning'
  return 'primary'
})
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-6 text-white shadow-[0_22px_60px_rgba(37,99,235,0.28)]">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-3xl">
          <div class="mb-3 flex flex-wrap items-center gap-3">
            <el-tag type="primary" effect="dark" round>
              {{ view.badge }}
            </el-tag>
            <span class="text-sm text-blue-100">
              {{ view.groupLabel }} / {{ view.sectionLabel }}
            </span>
          </div>
          <h1 class="text-2xl font-semibold leading-tight md:text-[30px]">
            {{ view.title }}
          </h1>
          <p class="mt-3 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
            {{ view.description }}
          </p>
          <div
            v-if="view.emphasis"
            class="mt-4 inline-flex max-w-3xl rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-sm leading-6 text-white/95"
            :class="toneStyleMap[emphasisTone]"
          >
            {{ view.emphasis }}
          </div>
        </div>

        <div class="flex flex-wrap gap-3 xl:justify-end">
          <el-button
            v-for="action in view.actions"
            :key="action.label"
            :type="actionTypeMap[action.tone ?? 'info']"
            size="large"
            @click="handleAction(action)"
          >
            {{ action.label }}
          </el-button>
        </div>
      </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard v-for="metric in view.metrics" :key="metric.label" :metric="metric" />
    </div>

    <div class="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <SectionPanel title="业务亮点" description="根据需求与架构文档整理的演示重点。">
        <div class="grid gap-3">
          <button
            v-for="highlight in view.highlights"
            :key="highlight.title"
            type="button"
            class="w-full rounded-[20px] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            :class="toneStyleMap[highlight.tone ?? 'info']"
            @click="handleHighlight(highlight)"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="text-base font-semibold text-slate-900">
                {{ highlight.title }}
              </div>
              <StatusTag :label="highlight.tag" :tone="highlight.tone" />
            </div>
            <div class="mt-2 text-sm leading-6 text-slate-600">
              {{ highlight.content }}
            </div>
          </button>
        </div>
      </SectionPanel>

      <SectionPanel
        v-if="view.list"
        :title="view.list.title"
        :description="view.list.description"
      >
        <div class="space-y-3">
          <button
            v-for="item in view.list.items"
            :key="item.title"
            type="button"
            class="surface-muted w-full rounded-[20px] border border-slate-200 px-4 py-4 text-left transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            @click="item.route ? router.push(item.route) : undefined"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="text-base font-semibold text-slate-900">
                {{ item.title }}
              </div>
              <StatusTag :label="item.meta" :tone="item.tone" />
            </div>
            <div class="mt-2 text-sm leading-6 text-slate-600">
              {{ item.description }}
            </div>
          </button>
        </div>
      </SectionPanel>

      <SectionPanel
        v-else-if="view.details"
        title="规则摘要"
        description="便于你快速讲解当前模块的业务边界。"
      >
        <el-descriptions :column="1" border>
          <el-descriptions-item v-for="detail in view.details" :key="detail.label" :label="detail.label">
            <StatusTag v-if="detail.tone" :label="detail.value" :tone="detail.tone" />
            <span v-else>{{ detail.value }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </SectionPanel>
    </div>

    <div class="grid gap-4" :class="view.table && (view.progress || view.timeline) ? 'xl:grid-cols-[1.5fr_1fr]' : 'grid-cols-1'">
      <SectionPanel
        v-if="view.table"
        :title="view.table.title"
        :description="view.table.description"
      >
        <el-table :data="view.table.rows" stripe>
          <el-table-column
            v-for="column in view.table.columns"
            :key="column.key"
            :prop="column.key"
            :label="column.label"
            :min-width="column.width ?? 120"
          >
            <template #default="{ row }">
              <StatusTag
                v-if="column.kind === 'tag'"
                :label="String(row[column.key])"
                :tone="resolveTagTone(column, row)"
              />
              <span v-else>{{ row[column.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </SectionPanel>

      <div class="space-y-4">
        <SectionPanel
          v-if="view.progress?.length"
          title="进度追踪"
          description="支持演示核心完成度和风险余量。"
        >
          <div class="space-y-4">
            <div v-for="item in view.progress" :key="item.label" class="rounded-[20px] border border-slate-200 p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-slate-800">{{ item.label }}</span>
                <StatusTag
                  :label="`${Math.round((item.value / item.total) * 100)}%`"
                  :tone="item.tone"
                />
              </div>
              <el-progress
                :percentage="Math.round((item.value / item.total) * 100)"
                :status="item.tone === 'success' ? 'success' : item.tone === 'danger' ? 'exception' : undefined"
                :stroke-width="14"
              />
              <div class="mt-2 text-sm leading-6 text-slate-500">
                {{ item.note }}
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          v-if="view.details && view.list"
          title="规则摘要"
          description="便于你快速讲解当前模块的业务边界。"
        >
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="detail in view.details" :key="detail.label" :label="detail.label">
              <StatusTag v-if="detail.tone" :label="detail.value" :tone="detail.tone" />
              <span v-else>{{ detail.value }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </SectionPanel>

        <SectionPanel
          v-if="view.related.length"
          title="体验跳转"
          description="点击即可在当前模块内继续体验其他二级菜单。"
        >
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="item in view.related"
              :key="item.route"
              :to="item.route"
              class="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100"
            >
              {{ item.label }}
            </router-link>
          </div>
          <div class="mt-4 space-y-2 text-sm text-slate-500">
            <div v-for="item in view.related" :key="item.label">
              {{ item.label }}：{{ item.description }}
            </div>
          </div>
        </SectionPanel>
      </div>
    </div>

    <SectionPanel
      v-if="view.timeline"
      :title="view.timeline.title"
      :description="view.timeline.description"
    >
      <el-timeline>
        <el-timeline-item
          v-for="item in view.timeline.items"
          :key="`${item.time}-${item.title}`"
          :timestamp="item.time"
          placement="top"
        >
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div class="text-base font-semibold text-slate-900">
              {{ item.title }}
            </div>
            <div class="mt-1 text-sm leading-6 text-slate-600">
              {{ item.description }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </SectionPanel>
  </div>
</template>
