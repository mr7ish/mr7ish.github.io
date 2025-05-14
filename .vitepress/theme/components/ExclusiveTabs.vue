<template>
  <div
    v-if="!!tabs.length"
    class="tabs-wrapper"
    style="filter: url('#exclusionTabsGoo')"
  >
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-item"
      :style="{
        margin:
          direction === 'vertical'
            ? `${activeTab === tab.id ? margin : 0}px 0`
            : `0 ${activeTab === tab.id ? margin : 0}px`,
        padding: `${padding}rem ${padding * 2}rem`,
        // backgroundColor: activeTab === tab.id ? 'var(--vp-c-brand-1)' : undefined,
        backgroundColor: activeTab === tab.id ? '#007AFF' : undefined,
      }"
      @click.stop="activeTab = tab.id"
    >
      <slot
        name="tab"
        :tabId="tab.id"
        :tabLabel="tab.label"
      >
        {{ tab.label }}
      </slot>
    </div>

    <svg
      style="display: none"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <filter
          id="exclusionTabsGoo"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            :stdDeviation="blurStdDeviation"
            result="blur"
          ></feGaussianBlur>
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 36 -12"
            result="goo"
          ></feColorMatrix>
          <feComposite
            in="SourceGraphic"
            in2="goo"
            operator="atop"
          ></feComposite>
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

interface Props {
  tabs: {
    id: string;
    label: string;
  }[];
  margin?: number;
  blurStdDeviation?: number;
  padding?: number;
  direction?: "horizontal" | "vertical";
}

const props = withDefaults(defineProps<Props>(), {
  margin: 20,
  blurStdDeviation: 6,
  padding: 0.5,
  direction: "horizontal",
});

const { isDark } = useData();

const activeTab = defineModel("activeTab");

const color = computed(() => (!isDark.value ? "240 5.9% 10%" : "0 0% 98%"));
const bgColor = computed(() => (!isDark.value ? "0 0% 98%" : "240 5.9% 10%"));
const flexDirection = computed(() =>
  props.direction === "horizontal" ? "row" : "column"
);
</script>

<style scoped lang="less">
.tabs-wrapper {
  display: inline-flex;
  // flex-wrap: wrap;
  flex-direction: v-bind(flexDirection);

  .tab-item {
    flex-shrink: 0;
    cursor: pointer;
    background-color: hsl(v-bind(bgColor));
    color: hsl(v-bind(color));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
  }
}
</style>
