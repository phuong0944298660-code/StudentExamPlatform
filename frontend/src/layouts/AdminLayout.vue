<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  Checked,
  DataBoard,
  Document,
  FolderOpened,
  Reading,
  Ticket,
  TrendCharts,
  UploadFilled,
  User,
} from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { adminMenus } from '../mock/admin'

const route = useRoute()
const appStore = useAppStore()
const { sidebarCollapsed } = storeToRefs(appStore)

const iconMap = {
  Calendar,
  Checked,
  DataBoard,
  Document,
  FolderOpened,
  Reading,
  Ticket,
  TrendCharts,
  UploadFilled,
  User,
}

const activeRoute = computed(() => route.path)
const currentGroup = computed(() => String(route.meta.groupLabel ?? '管理员'))
const currentSection = computed(() => String(route.meta.sectionLabel ?? '看板概览'))
</script>

<template>
  <el-container class="app-shell bg-transparent">
    <aside
      class="h-screen border-r border-slate-200/70 bg-slate-950 px-3 py-4 text-slate-100 transition-all duration-200"
      :class="sidebarCollapsed ? 'w-[94px]' : 'w-[292px]'"
    >
      <div class="mb-6 flex items-center justify-between gap-3 px-2">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-semibold shadow-lg">
            管
          </div>
          <div v-if="!sidebarCollapsed" class="min-w-0">
            <div class="truncate text-base font-semibold">
              接力教育平台
            </div>
            <div class="truncate text-xs text-slate-400">
              管理员工作台 · 演示版
            </div>
          </div>
        </div>
        <el-button circle plain @click="appStore.toggleSidebar()">
          <span>{{ sidebarCollapsed ? '→' : '←' }}</span>
        </el-button>
      </div>

      <el-scrollbar height="calc(100vh - 210px)">
        <el-menu
          :default-active="activeRoute"
          :collapse="sidebarCollapsed"
          :collapse-transition="false"
          router
          background-color="transparent"
          text-color="#CBD5E1"
          active-text-color="#FFFFFF"
        >
          <el-sub-menu v-for="group in adminMenus" :key="group.key" :index="group.baseRoute">
            <template #title>
              <el-icon>
                <component :is="iconMap[group.icon as keyof typeof iconMap]" />
              </el-icon>
              <span>{{ group.label }}</span>
            </template>
            <el-menu-item v-for="child in group.children" :key="child.route" :index="child.route">
              {{ child.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>

      <div class="mt-4 rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm">
        <div class="font-semibold text-white">
          当前环境
        </div>
        <div class="mt-2 text-slate-300">
          Develop 分支演示
        </div>
        <div class="mt-3 text-xs leading-6 text-slate-400">
          管理员端已按 `architecture.md` 菜单结构重建，全部页面均可点击体验。
        </div>
      </div>
    </aside>

    <el-container class="min-w-0">
      <el-header class="h-auto border-b border-slate-200/80 bg-white/80 px-6 py-5 backdrop-blur">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div class="text-sm text-slate-500">
              平台管理员 / {{ currentGroup }} / {{ currentSection }}
            </div>
            <div class="mt-2 text-2xl font-semibold text-slate-900">
              管理员前端体验台
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <el-tag type="primary" round effect="light">
              假数据联调
            </el-tag>
            <el-tag type="success" round effect="light">
              可点击跳转
            </el-tag>
            <div class="glass-panel rounded-[22px] px-4 py-3 text-sm text-slate-600">
              <div class="font-medium text-slate-900">
                超级管理员
              </div>
              <div class="mt-1 text-xs text-slate-500">
                今日待办 6 项 · 风险 2 项
              </div>
            </div>
          </div>
        </div>
      </el-header>

      <el-main class="px-6 py-6">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
