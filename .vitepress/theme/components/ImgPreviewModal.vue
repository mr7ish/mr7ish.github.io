<template>
  <BaseModal
    ref="baseModalRef"
    is-transition
    @getStatus="getStatus"
  >
  </BaseModal>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import BaseModal from "./BaseModal.vue";

const baseModalRef = ref<InstanceType<typeof BaseModal>>();

const status = ref(true);

const getStatus = (_s: boolean) => {
  console.log("_s =>", _s);
  status.value = _s;
};

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
  getStatus: () => status.value,
});
</script>

<style scoped></style>
