<template>
  <transition
    name="fade"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="visible"
      class="base-modal-container"
    >
      <div
        class="modal-content-wrapper"
        @click.self="close"
      >
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Ref, inject, onBeforeMount, provide, ref } from "vue";

type Props = {
  isTransition?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isTransition: false,
});

const closeCallback = inject<() => void>("close");
const clickedImg = inject<Ref<HTMLImageElement>>("clickedImg");

const visible = ref(false);

const isOver = ref(true);

const emit = defineEmits<{
  getStatus: [_s: boolean];
}>();

const onAfterLeave = () => {
  // 如果点了关闭, 过渡钩子还未执行完, 又立刻点击打开就跳过
  if (visible.value) return;
  clickedImg?.value.classList.remove("top-level");
  isOver.value = true;
  emit("getStatus", isOver.value);
};

const open = () => {
  visible.value = true;
  isOver.value = false;
  emit("getStatus", isOver.value);
};

const close = () => {
  setTimeout(() => {
    visible.value = false;
    isOver.value = false;
    emit("getStatus", isOver.value);
    closeCallback?.();
  }, 500);
};

defineExpose({
  open,
  close,
});

onBeforeMount(() => {
  if (!props.isTransition) return;
  // 动态插入css
  const css = `
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
  `;
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
});
</script>

<style scoped lang="less">
.base-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
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
</style>
