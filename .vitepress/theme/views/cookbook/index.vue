<template>
  <div class="cookbook-container">
    <div
      class="lang-switch-box animate__animated animate__rubberBand"
      :key="isEn + ''"
    >
      <span @click="isEn = !isEn">
        <span :class="isEn ? 'active' : ''"> En </span>
        /
        <span :class="!isEn ? 'active' : ''"> 中文 </span>
      </span>
    </div>

    <h1>Here are some cooking case 🥰</h1>
    <CustomInput
      v-model:keywords.trim="keywords"
      v-model:isFocus="isFocus"
      placeholder="Category or Name..."
    >
      <IconSearch
        class="icon-search animate__animated"
        :class="isFocus ? 'animate__jello' : ''"
        :size="20"
        :color="isFocus ? 'var(--vp-c-brand-1)' : undefined"
      />
    </CustomInput>
    <main>
      <FoodCard
        v-for="(food, i) in filteredFoods"
        :key="food.uuid"
        :food="food"
        :isEn="isEn"
        :index="i"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CustomInput from "../../components/CustomInput.vue";
import foods from "./foods";
import { searchFoods } from "./utils";
import FoodCard from "./components/FoodCard.vue";
import IconSearch from "../../components/svgs/IconSearch.vue";

const keywords = ref("");
const isFocus = ref(false);
const isEn = ref(true);

const filteredFoods = computed(() => {
  const words = keywords.value.toLowerCase();
  if (!words) return foods;
  return searchFoods(words, foods);
});
</script>

<style scoped lang="less">
.cookbook-container {
  position: relative;
  padding: 2.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;

  .icon-search {
    position: absolute;
    top: 0.375rem;
    left: 0.375rem;
    font-size: 0.75rem;
  }

  .lang-switch-box {
    position: absolute;
    left: 0.75rem;
    top: 0.75rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;

    .active {
      color: var(--vp-c-brand-1);
    }
  }

  & > h1 {
    font-size: 2em;
    font-weight: 800;
    line-height: 1.1111111;
    text-align: center;
  }

  main {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    flex: 1;
  }
}
</style>
