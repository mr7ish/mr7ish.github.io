<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'preview-modal-container',
        {
          'fade-in': visible && !startFadeOut,
          'fade-out': startFadeOut,
        },
      ]"
      @click.self="close"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const startFadeOut = ref(false);

const open = () => {
  visible.value = true;
  return visible.value;
};

const close = () => {
  startFadeOut.value = true;
  emit("close");

  setTimeout(() => {
    visible.value = false;
    startFadeOut.value = false;
    emit("afterClose");
  }, 350);
};

const emit = defineEmits<{
  close: [];
  afterClose: [];
}>();

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="less">
.preview-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--z-i-top) + 1);
  background-color: rgba(0, 0, 0, 0.5);

  &.fade-in {
    animation: fade-in 0.35s ease-out forwards;
  }

  &.fade-out {
    animation: fade-out 0.35s ease-out forwards;
  }
}

@keyframes fade-in {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.5);
  }
}

@keyframes fade-out {
  0% {
    background-color: rgba(0, 0, 0, 0.5);
  }
  100% {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
