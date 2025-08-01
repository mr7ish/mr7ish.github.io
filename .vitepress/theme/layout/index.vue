<template>
  <Layout>
    <template #nav-bar-title-after>
      <IconSignature />
    </template>

    <template #doc-before>
      <DocBefore />
    </template>
    <template #doc-footer-before>
      <RouterTo
        href="/blogs"
        text="Go Blogs"
      >
        <template #icon> 📚 </template>
      </RouterTo>
    </template>
    <template #layout-bottom>
      <!-- <MagLev /> -->
      <TodoIsland />

      <MusicPlayer v-if="!['music'].includes(frontmatter.fileName ?? '')" />
      <transition name="scroll">
        <div
          v-if="isNeedBackTop"
          class="scroll-top-wrapper"
        >
          <img
            class="scroll-cat"
            src="/others/scroll-extended.png"
            alt="top"
          />
          <div
            class="hook-btn"
            @click="backTop"
          ></div>
        </div>
      </transition>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocBefore from "../components/DocBefore.vue";
import {
  Ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watchEffect,
} from "vue";
import RouterTo from "../components/RouterTo.vue";
import { useData } from "vitepress";
import { SpecifiedFrontmatter } from "../../../env";
import { createHeartByClick } from "../utils/heartBurst";
import MusicPlayer from "../views/music/MusicPlayer.vue";
import MagLev from "../components/MagLev.vue";
import TodoIsland from "../components/todo/TodoIsland.vue";
import IconSignature from "../components/svgs/IconSignature.vue";

const { Layout } = DefaultTheme;
const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();
// console.log("frontmatter =>", frontmatter.value);
const { isDark } = useData();

const isNeedBackTop = ref(false);

const scrollThreshold = 1600;

const layoutType = computed<"doc" | "page" | "home">(
  () => frontmatter.value.layout ?? "doc"
);

const backTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

watchEffect(() => {
  fnWrapper(
    () => {
      window.addEventListener("scroll", calcScrollHeight);
    },
    () => {
      backTop();
      nextTick(() => {
        calcScrollHeight();
        window.removeEventListener("scroll", calcScrollHeight);
      });
    }
  );
});

function calcScrollHeight() {
  const scrollY = window.scrollY;

  if (scrollY >= scrollThreshold) {
    isNeedBackTop.value = true;
  } else {
    isNeedBackTop.value = false;
  }
  // console.log("scrollY =>", scrollY);
}

function fnWrapper(subscribed: () => void, unsubscribed: () => void) {
  if (["doc", "page"].includes(layoutType.value)) {
    subscribed();
  } else {
    unsubscribed();
  }
}

// custom theme switch
const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await (document as any).startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});

onMounted(() => {
  document.addEventListener("click", createHeartByClick);
});

onUnmounted(() => {
  document.removeEventListener("click", createHeartByClick);
});
</script>

<style scoped lang="less">
.scroll-top-wrapper {
  position: fixed;
  right: 20px;
  width: 40px;
  height: 40px;
  height: 90vh;
  // background-color: lightcoral;
  border-radius: 4px;
  z-index: var(--z-i-30);
  user-select: none;
  transform: translateY(0px);
  // transform-origin: center 0;
  opacity: 0.2;

  &:hover {
    opacity: 0.8;
  }

  .hook-btn {
    width: 100%;
    height: 40px;
    // background-color: lightblue;
    position: absolute;
    bottom: 4px;
    cursor: pointer;
    user-select: none;
  }

  .scroll-cat {
    position: absolute;
    bottom: -12px;
    user-select: none;
    pointer-events: none;
  }
}

@keyframes scroll-animation {
  0% {
    transform: translateY(-100vh);
  }
  70% {
    transform: translateY(50px);
  }
  90% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes scroll-animation-reverse {
  0% {
    transform: translateY(-100vh);
  }
  70% {
    transform: translateY(50px);
  }
  100% {
    transform: translateY(0px);
  }
}

.scroll-enter-active {
  animation: scroll-animation 1.5s cubic-bezier(0.42, 0, 0.58, 1);
}

.scroll-leave-active {
  animation: scroll-animation-reverse 1s reverse
    cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
