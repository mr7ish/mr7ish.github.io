<template>
  <div class="gallery-container">
    <main>
      <div class="pictures-wrapper">
        <img
          v-for="(pic, index) in shuffleds"
          :key="index"
          :src="pic.path"
          :alt="pic.name"
          loading="lazy"
          @click="open"
        />
      </div>
    </main>
    <BaseModal ref="baseModalRef">
      <div
        style="
          background-color: lightblue;
          width: 50%;
          height: 50%;
          color: #000;
        "
      >
        <div style="height: 110%">aaasdasd</div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../../components/BaseModal.vue";
import getPictures from "../../utils/getPictures";

const baseModalRef = ref<InstanceType<typeof BaseModal>>();

const { shuffleds } = getPictures();
console.log("shuffleds =>", shuffleds);

const open = () => {
  baseModalRef.value?.open();
};
</script>

<style scoped lang="less">
.gallery-container {
  padding: 2.5rem 1.75rem;

  main {
    max-width: 65vw;
    margin: auto;

    .pictures-wrapper {
      width: 100%;
      column-count: 3;
      column-gap: 1rem;

      img {
        margin: 1rem 0;
        cursor: pointer;

        &:first-child {
          margin-top: 0;
        }
      }
    }

    // 如果要响应多个尺寸, 每个尺寸区间的零界点应该连续, 不连续的区间会应用原有的样式
    // eg. 第三个媒体查询区间是 992-1199, 然后是 >1600, 1199-1600 这段区间缺失, 则应用原有的 column-count: 3;

    // <=480
    @media (max-width: 480px) {
      .pictures-wrapper {
        column-count: 1;
      }
    }

    // >=480 and <=992
    @media (min-width: 480px) and (max-width: 992px) {
      .pictures-wrapper {
        column-count: 2;
      }
    }

    @media (min-width: 992px) and (max-width: 1199px) {
      .pictures-wrapper {
        column-count: 3;
      }
    }

    @media (min-width: 1600px) {
      .pictures-wrapper {
        column-count: 4;
      }
    }
  }
}
</style>
