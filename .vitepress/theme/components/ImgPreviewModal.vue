<template>
  <BaseModal
    ref="baseModalRef"
    is-transition
  >
  </BaseModal>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import BaseModal from "./BaseModal.vue";

const baseModalRef = ref<InstanceType<typeof BaseModal>>();

const emit = defineEmits<{
  close: [];
}>();

provide("close", () => emit("close"));

const open = () => {
  baseModalRef.value?.open();
};

const close = () => {
  baseModalRef.value?.close();
};

defineExpose({
  open,
  close,
});
</script>

<style scoped></style>
