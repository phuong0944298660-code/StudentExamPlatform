<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ModulePage from '../../../components/admin/ModulePage.vue'
import { getAdminSectionView } from '../../../mock/admin'

const route = useRoute()
const view = computed(() => getAdminSectionView('resources', String(route.meta.sectionKey ?? 'center')))
</script>

<template>
  <ModulePage :view="view" />
</template>
