<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="soft-card rounded-[28px] p-5">
    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="panel-title">
          {{ title }}
        </h3>
        <p v-if="description" class="panel-desc">
          {{ description }}
        </p>
      </div>
      <slot name="extra" />
    </div>
    <slot />
  </section>
</template>
