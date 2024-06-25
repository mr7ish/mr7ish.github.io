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
import { Ref, inject, onBeforeMount, onMounted, ref } from "vue";

type Props = {
  isTransition?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isTransition: false,
});

const closeCallback = inject<() => void>("close");
const clickedImg = inject<Ref<HTMLImageElement>>("clickedImg");

const visible = ref(false);

const onAfterLeave = () => {
  clickedImg?.value.classList.remove("top-level");
};

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
  closeCallback?.();
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

function preventScroll(e) {
  console.log("e =>", e);
  e.preventDefault();
}

onMounted(() => {
  window.addEventListener("wheel", preventScroll, { passive: false });
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
