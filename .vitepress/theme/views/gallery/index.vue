<template>
  <div class="gallery-container">
    <main>
      <div class="pictures-wrapper">
        <img
          class="picture"
          v-for="(pic, index) in shuffleds"
          :key="index"
          :src="pic.path"
          :alt="pic.name"
          loading="lazy"
          @click="handleImg"
        />
      </div>
    </main>
  </div>
  <ImgPreviewModal
    ref="imgPreviewModalRef"
    @close="closeCallback"
  />
</template>

<script setup lang="ts">
import { Ref, inject, nextTick, provide, ref } from "vue";
import BaseModal from "../../components/BaseModal.vue";
import getPictures from "../../utils/getPictures";
import ImgPreviewModal from "../../components/ImgPreviewModal.vue";

const imgPreviewModalRef = ref<InstanceType<typeof ImgPreviewModal>>();
const clickedImg = ref<HTMLImageElement>();
const isOpen = ref(false);

provide("clickedImg", clickedImg);

const { shuffleds } = getPictures();
console.log("shuffleds =>", shuffleds);

const closeCallback = () => {
  clickedImg.value?.classList.remove("clicked");
  if (clickedImg.value) {
    clickedImg.value.style.transform = `translate(0, 0) scale(1)`;
  }
  window.removeEventListener("wheel", preventScroll);
  document.documentElement.style.overflowY = "auto";
  isOpen.value = false;
};

const handleImg = (e: Event) => {
  if (isOpen.value) return;
  const img = e.target as HTMLImageElement;
  clickedImg.value = img;
  img.classList.add("clicked", "top-level");
  open();
  console.log("img =>", img.getBoundingClientRect());
  console.log("img w=>", img.width);
  console.log("img h=>", img.height);

  const originW = img.width;
  const originH = img.height;

  const clientW = document.documentElement.clientWidth;
  const clientH = document.documentElement.clientHeight;

  const scale = 2;
  const scaleW = scale * originW;
  const scaleH = scale * originH;

  const clicentCenterX = clientW / 2;
  const clicentCenterY = clientH / 2;
  console.log("clicentCenterX =>", clicentCenterX);
  console.log("clicentCenterY =>", clicentCenterY);

  const { x, y } = img.getBoundingClientRect();

  const imgCenterX = x + originW / 2;
  const imgCenterY = y + clientH / 2;
  console.log("imgCenterX =>", imgCenterX);
  console.log("imgCenterY =>", imgCenterY);

  const moveX = clicentCenterX - (x + originW / 2);
  const moveY = clicentCenterY - (y + originH / 2);

  console.log("moveX =>", moveX);
  console.log("moveY =>", moveY);

  img.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
};

const open = () => {
  // const status = imgPreviewModalRef.value?.getStatus();
  // console.log("tuo get =>", status);
  // if (!status) return;

  if (isOpen.value) return;
  isOpen.value = true;
  imgPreviewModalRef.value?.open();
  window.addEventListener("wheel", preventScroll, { passive: false });
  // document.documentElement.style.overflowY = "hidden";
};

function preventScroll(e: Event) {
  imgPreviewModalRef.value?.close();
  e.preventDefault();
}
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

      .picture {
        margin: 1rem 0;
        cursor: pointer;
        position: relative;
        transform-origin: center center;
        transform: translate(0, 0) scale(1);
        transition: all 0.5s;

        &.clicked {
          // transform: translate(100px, 100px) scale(1.5);
          // pointer-events: none;
        }

        &.top-level {
          z-index: calc(var(--z-i-top) + 1);
        }

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
