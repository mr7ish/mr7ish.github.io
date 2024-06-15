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
        top
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocBefore from "../components/DocBefore.vue";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const { Layout } = DefaultTheme;

const content = ref("");

const isNeedBackTop = ref(false);

const getArticles = async () => {
  const modules = import.meta.glob("../../../site/articles/*.md", {
    // load modules immediately
    eager: true,
  });
  console.log("modules =>", modules);

  const articles = Object.values(modules);
  console.log("articles =>", articles);
};

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
  getArticles();
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
</style>
