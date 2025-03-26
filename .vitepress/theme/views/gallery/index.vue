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
          @click="throttleClick"
        />
      </div>
    </main>
  </div>
  <ImgPreviewModal
    ref="imgPreviewModalRef"
    @close="whenClose"
    @afterClose="afterClose"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import getPictures from "../../utils/getPictures";
import ImgPreviewModal from "../../components/PreviewModal.vue";
import {
  calcMoveDistance,
  calcScale,
  getClientInfo,
  getPicInfo,
} from "../../utils/element";
import { debounce, throttle, throttle2 } from "../../utils/_";
import { isMobile } from "../../utils/isMobile";

type PicStyleParams = {
  pic: HTMLImageElement;
  x?: number;
  y?: number;
  scale?: number;
};

const { shuffleds } = getPictures();

const imgPreviewModalRef = ref<InstanceType<typeof ImgPreviewModal>>();
const isOpen = ref(false);
const activeImg = ref<HTMLImageElement>();

const scale = ref(1);
const moveX = ref(0);
const moveY = ref(0);

const whenClose = () => {
  if (!activeImg.value) return;
  activeImg.value?.removeEventListener("wheel", throttleScale);
  changePicStyle({ pic: activeImg.value });
};

const afterClose = () => {
  changeRootStyle(false);
  activeImg.value?.classList.remove("z-index-top");
  activeImg.value = undefined;
  changeStatus(false);
};

const onClickPic = (e: Event) => {
  if (isOpen.value) return;

  if (!open()) return;

  const img = e.target as HTMLImageElement;
  activeImg.value = img;

  img.classList.add("z-index-top");

  const [_moveX, _moveY] = calcMoveDistance(img);

  const _scale = calcScale(img, isMobile() ? 0.9 : 0.5);

  scale.value = _scale;
  moveX.value = _moveX;
  moveY.value = _moveY;

  const { y, height } = getPicInfo(img);
  const { clientH } = getClientInfo();

  if (y < 80) {
    const scrollY = window.scrollY;
    window.scrollTo({ top: scrollY - Math.abs(y) - 80, behavior: "smooth" });
    moveY.value -= Math.abs(y) + 80;
  } else if (clientH - height < y) {
    const scrollY = window.scrollY;
    window.scrollTo({ top: scrollY + height, behavior: "smooth" });
    moveY.value += height;
  }

  changeRootStyle(true);

  changePicStyle({
    pic: img,
    x: moveX.value,
    y: moveY.value,
    scale: scale.value,
  });

  activeImg.value?.addEventListener("wheel", throttleScale);
};

const throttleScale = throttle2(onScale, 200);

function onScale(e: WheelEvent) {
  if (!activeImg.value) return;

  // 向下
  if (e.deltaY > 0) {
    if (scale.value - 1 > 1) {
      scale.value--;
    }
  }

  // 向上
  if (e.deltaY < 0) {
    if (scale.value < 10) {
      scale.value++;
    }
  }

  changePicStyle({
    pic: activeImg.value,
    x: moveX.value,
    y: moveY.value,
    scale: scale.value,
  });
}

const throttleClick = debounce(onClickPic, 200);

const open = () => {
  return imgPreviewModalRef.value?.open() && changeStatus(true);
};

function changeStatus(_status: boolean) {
  isOpen.value = _status;
  return _status;
}

function changePicStyle({ pic, x, y, scale }: PicStyleParams) {
  pic.style.transform = `translate(${x ?? 0}px, ${y ?? 0}px) scale(${
    scale ?? 1
  })`;
}

function changeRootStyle(isHidden: boolean) {
  document.documentElement.style.overflowY = isHidden ? "hidden" : "auto";
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
        transition: all 0.35s;
        user-select: none !important;
        -webkit-user-select: none !important;

        &.z-index-top {
          z-index: calc(var(--z-i-top) + 2);
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
