<template>
  <div class="blogs-container">
    <div class="blogs-header blogs-wrapper">
      <div
        class="sort-operation-box"
        @click="
          () => {
            isAscending = !isAscending;
            set('blog-sort-checked', isAscending ? '0' : '1');
          }
        "
      >
        <div
          class="checked slide-enter"
          :key="isAscending.toString()"
          style="--enter-stage: 1"
        >
          <span
            class="slide-enter"
            v-if="isAscending"
            style="--enter-stage: 2"
          >
            ⭕
          </span>
          <span
            class="slide-enter"
            v-else
            style="--enter-stage: 2"
          >
            ✔️
          </span>
        </div>
        <span
          :key="isAscending.toString()"
          class="slide-enter"
          style="--enter-stage: 3"
        >
          {{ isAscending ? "Ascending" : "Descending" }}
        </span>
      </div>
      <BlogTags
        :tags="tags"
        :clicked="currentTag"
        @get-clicked-tag="getClickedTag"
        style="margin-bottom: 0.5rem"
      />
    </div>
    <article>
      <div class="blogs-wrapper">
        <BlogCard
          v-for="(sorted, index) in filteredArticles"
          :key="sorted.year + currentTag + isAscending"
          :title="sorted.year"
          :articles="sorted.articles"
          v-bind="{
            timeStageSum: calcStageSum(stageSum, index, 'time'),
            articleStageSum: calcStageSum(stageSum, index, 'article'),
          }"
        />
      </div>
    </article>
    <RouterTo
      style="max-width: 65ch"
      :key="currentTag"
      class="slide-enter"
      :style="{
        '--enter-stage': sumArray(articleSizeArr),
      }"
    >
      <template #icon> 🏡 </template>
    </RouterTo>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import getArticles from "../../utils/getArticles";
import BlogCard from "./components/BlogCard.vue";
import { deepClone } from "../../utils/deepClone";
import RouterTo from "../../components/RouterTo.vue";
import BlogTags from "./components/BlogTags.vue";
import { get, set } from "../../utils/localStorage";
import sumArray from "../../utils/sumArray";

const { sortedArticles, undefinedAticles } = getArticles();

const stageSum = {
  time: -2,
  article: 0,
};

const isAscending = ref(
  get("blog-sort-checked") && get("blog-sort-checked") === "0" ? true : false
);

const articles = computed(() => {
  if (isAscending.value) return deepClone(sortedArticles);
  return deepClone(sortedArticles).reverse();
});

const entireArticles = computed(() => [...articles.value, undefinedAticles]);
// console.log("entireArticles =>", entireArticles.value);

const tags = getTags(entireArticles.value);

const currentTag = ref(get("blog-actived-tag") ?? "All");

const filteredArticles = computed(() => {
  if (currentTag.value === "All") return entireArticles.value;
  if (currentTag.value === "Unlabeled")
    return [undefinedAticles]
      .map((a) => ({
        year: a.year,
        articles: a.articles.filter((i) => !i.tags),
      }))
      .filter((a) => a.articles.length > 0);
  return articles.value
    .map((a) => ({
      year: a.year,
      articles: a.articles.filter(
        (i) => i.tags && i.tags.includes(currentTag.value)
      ),
    }))
    .filter((a) => a.articles.length > 0);
});

// reset stage value
watch(filteredArticles, () => {
  stageSum.time = -2;
  stageSum.article = 0;
});

function getClickedTag(type: string) {
  currentTag.value = type;
  set("blog-actived-tag", type);
}

const articleSizeArr = computed(() =>
  filteredArticles.value.map((i) => i.articles.length)
);

function getTags(_entireArticles: typeof entireArticles.value) {
  const tags: string[] = [];

  _entireArticles.map((a) => {
    a.articles.map((i) => {
      if (i.tags) {
        i.tags.map((t) => {
          if (!tags.includes(t)) {
            tags.push(t);
          }
        });
      }
    });
  });

  return ["All", ...tags, "Unlabeled"];
}

function calcStageSum(
  _stageSum: typeof stageSum,
  index: number,
  key: keyof typeof stageSum
) {
  if (index > 0) {
    _stageSum[key] += articleSizeArr.value[index - 1];
  }
  return _stageSum[key];
}

onMounted(() => {
  console.log("mounted...");
});
</script>

<style scoped lang="less">
.blogs-container {
  padding: 2.5rem 1.75rem;
  overflow-x: hidden;

  .blogs-header {
    .sort-operation-box {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      align-items: center;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.5s ease;

      &:hover {
        opacity: 1;
      }
    }

    .checked {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--meta-tag-bg);
    }
  }

  .blogs-wrapper {
    max-width: 65ch;
    margin: auto;
  }
}
</style>
