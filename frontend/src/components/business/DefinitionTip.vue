<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="definition-tip" tabindex="0">
    <span class="definition-tip__icon">!</span>
    <span class="definition-tip__content">{{ text }}</span>
  </span>
</template>

<style scoped>
.definition-tip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.definition-tip__icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #114273;
  background: #d8ebff;
  border: 1px solid #9ec6f8;
  cursor: help;
}

.definition-tip__content {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 320px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #0f1f35;
  color: #f7fafc;
  font-size: 12px;
  line-height: 1.45;
  box-shadow: 0 8px 24px rgba(8, 18, 33, 0.35);
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease;
  z-index: 5;
}

.definition-tip:hover .definition-tip__content,
.definition-tip:focus-within .definition-tip__content {
  opacity: 1;
  visibility: visible;
}
</style>
