<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="panel-card">
    <header class="panel-card__header">
      <div>
        <h3 class="panel-card__title">{{ title }}</h3>
        <p v-if="description" class="panel-card__description">{{ description }}</p>
      </div>
      <div class="panel-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="panel-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel-bg);
  box-shadow: var(--panel-shadow);
}

.panel-card__header {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
}

.panel-card__title {
  margin: 0;
  font-size: 16px;
  color: var(--text-main);
}

.panel-card__description {
  margin: 6px 0 0 0;
  font-size: 12px;
  color: var(--text-sub);
}

.panel-card__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.panel-card__body {
  padding: 14px 16px;
}
</style>
