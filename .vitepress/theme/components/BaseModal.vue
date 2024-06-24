<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="base-modal-container"
    >
      <div
        :class="['modal-content-wrapper']"
        @click.self="close"
      >
        <slot name="default"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Props = {
  test?: string;
};

const visible = ref(false);

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<style scoped lang="less">
.base-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-i-top);
  background-color: rgba(0, 0, 0, 0.5);

  .modal-content-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.fade-enter-active {
  animation: fade-in 0.5s;
}

.fade-leave-active {
  animation: fade-in 0.5s reverse;
}

@keyframes fade-in {
  0% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
