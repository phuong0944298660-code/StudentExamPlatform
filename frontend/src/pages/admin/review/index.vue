<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ModulePage from '../../../components/admin/ModulePage.vue'
import { getAdminSectionView } from '../../../mock/admin'

const route = useRoute()
const view = computed(() => getAdminSectionView('review', String(route.meta.sectionKey ?? 'tasks')))
</script>

<template>
  <ModulePage :view="view" />
</template>
