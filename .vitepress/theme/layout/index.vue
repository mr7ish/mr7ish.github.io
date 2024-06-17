<template>
  <Layout>
    <template #doc-before>
      <DocBefore />
    </template>
    <template #doc-after>
      <div
        v-if="isNeedBackTop"
        @click="backTop"
        class="top"
      >
        <!-- top -->
        <img
          class="love"
          src="/heart-animation.png"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocBefore from "../components/DocBefore.vue";
import { onMounted, onUnmounted, ref } from "vue";

const { Layout } = DefaultTheme;

const isNeedBackTop = ref(false);

const backTop = () => {
  // document.documentElement.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const calcScrollHeight = () => {
  const scrollY = window.scrollY;

  if (scrollY >= 1600) {
    isNeedBackTop.value = true;
  } else {
    isNeedBackTop.value = false;
  }
  // console.log("scrollY =>", scrollY);
};

onMounted(() => {
  window.addEventListener("scroll", calcScrollHeight);
});

onUnmounted(() => {
  window.addEventListener("scroll", calcScrollHeight);
});
</script>

<style scoped>
.top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: lightcoral;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 11;
}

.love {
  width: 100%;
  height: 100%;
  /* width: 100px;
  height: 100px; */
  object-fit: cover;
  animation: heart-burst steps(28) 0.8s infinite both;
}
@keyframes heart-burst {
  0% {
    object-position: 0%;
  }
  100% {
    object-position: 100%;
  }
}
</style>
