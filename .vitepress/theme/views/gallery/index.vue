<template>
  <div class="gallery-container">
    <main>
      <div class="pictures-wrapper">
        <img
          v-for="(pic, index) in shuffleds"
          :key="index"
          :src="pic.path"
          :alt="pic.name"
          :style="{
            // marginTop: index === 0 ? '0' : '16px',
          }"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import getPictures from "../../utils/getPictures";

const { shuffleds } = getPictures();
console.log("shuffleds =>", shuffleds);
</script>

<style scoped lang="less">
.gallery-container {
  padding: 2.5rem 1.75rem;

  main {
    max-width: 65vw;
    margin: auto;

    .pictures-wrapper {
      width: 100%;
      column-count: 4;
      column-gap: 16px;

      img {
        // margin: 16px 0;
      }
    }
  }
}
</style>
