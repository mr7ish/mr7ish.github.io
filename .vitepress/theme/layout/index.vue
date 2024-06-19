<template>
  <Layout>
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
      <transition
        name="scroll"
        @enter="onEnter"
        @after-enter="onAfterEnter"
      >
        <div
          v-if="isNeedBackTop"
          class="top-btn"
        >
          <img
            class="scroll-cat"
            src="/scroll-extended.png"
            alt="top"
          />
          <div
            class="hook-btn"
            @click="backTop"
            :style="{
              pointerEvents: !isStarting ? 'auto' : 'none',
            }"
          ></div>

          <!-- <img
          class="love-animation"
          src="/heart-animation.png"
        /> -->
        </div>
      </transition>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocBefore from "../components/DocBefore.vue";
import { Ref, computed, ref, watchEffect } from "vue";
import RouterTo from "../components/RouterTo.vue";
import { useData } from "vitepress";
import { SpecifiedFrontmatter } from "../../../env";

// TODO 暂停
const isStarting = ref(false);

const onEnter = () => {
  isStarting.value = true;
};
const onAfterEnter = () => {
  isStarting.value = false;
};

const { Layout } = DefaultTheme;
const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();
// console.log("frontmatter =>", frontmatter.value);

const isNeedBackTop = ref(false);

const scrollThreshold = 1600;

const layoutType = computed<"doc" | "page" | "home">(
  () => frontmatter.value.layout ?? "doc"
);

watchEffect(() => {
  fnWrapper(
    () => {
      window.addEventListener("scroll", calcScrollHeight);
    },
    () => {
      window.removeEventListener("scroll", calcScrollHeight);
    }
  );
});

const backTop = () => {
  // document.documentElement.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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
</script>

<style scoped lang="less">
.top-btn {
  position: fixed;
  right: 20px;
  width: 40px;
  height: 40px;
  height: 850px;
  background-color: lightcoral;
  border-radius: 4px;
  z-index: 30;
  user-select: none;

  // z-index: 29;
  // transform: translateY(800px) rotateZ(0deg);
  transform: translateY(0px) rotate(0deg);
  transform-origin: center 0;

  .hook-btn {
    width: 100%;
    height: 40px;
    background-color: lightblue;
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
    transform: translateY(-850px);
  }
  70% {
    transform: translateY(50px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes swing {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  10% {
    transform: translateY(0px) rotate(5deg);
  }
  20% {
    transform: translateY(0px) rotate(-5deg);
  }
  30% {
    transform: translateY(0px) rotate(4deg);
  }
  40% {
    transform: translateY(0px) rotate(-4deg);
  }
  50% {
    transform: translateY(0px) rotate(3deg);
  }
  60% {
    transform: translateY(0px) rotate(-3deg);
  }
  70% {
    transform: translateY(0px) rotate(2deg);
  }
  80% {
    transform: translateY(0px) rotate(-2deg);
  }
  90% {
    transform: translateY(0px) rotate(1deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.scroll-enter-active {
  // animation: scroll-animation 3.5s ease-in-out, swing 2s 4s infinite linear;
  animation: scroll-animation 3.5s ease-in-out,
    swing 10s 4s cubic-bezier(0.42, 0, 0.58, 1) forwards;
}

.scroll-leave-active {
  // animation: name duration timing-function delay iteration-count direction
  //   fill-mode;
  animation: scroll-animation 1s reverse cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
