<template>
  <div
    ref="wrapperRef"
    class="outmost-wrapper"
    :class="!isFolded ? 'is-unfolded' : ''"
    :style="{
      transform: `translate(${moveX}px, ${moveY}px)`,
    }"
    @click="onClick"
  >
    <div
      class="food-card-wrapper animate__animated"
      :class="`animate__slideIn${index % 2 === 0 ? 'Left' : 'Right'}`"
      :style="{
        height: `${unfoldedHeight}vh`,
        pointerEvents: !isFolded ? 'auto' : 'none',
      }"
    >
      <div class="header">
        <div
          class="icon"
          @click="exportAsImg"
        >
          {{ unpackedFood.icon }}
        </div>
        <div
          class="title animate__animated animate__flipInY"
          :key="isEn + ''"
          :style="{ color: index % tones.length === 0 ? '#000' : '' }"
        >
          {{ unpackedFood.name }}
        </div>
      </div>
      <div
        v-if="!isFolded"
        class="body"
        :class="!isFolded ? 'fade' : ''"
      >
        <div
          class="material"
          :style="{ color: index % tones.length === 0 ? '#000' : '' }"
        >
          <!-- <span class="title">
            {{ isEn ? "material:" : "材料：" }}
          </span> -->
          <div class="material-wrapper">
            <div
              class="material-item"
              v-for="(material, i) in unpackedFood.material"
              :key="i"
              :style="{
                backgroundColor: isPrimaryMaterial(material)
                  ? tones[(index + 2) % tones.length]
                  : tones[(index + 3) % tones.length],
              }"
            >
              {{ material }}
            </div>
          </div>
        </div>
        <StepBar
          :gap="30"
          indicator="number"
          :steps="steps"
          :titleColor="index % tones.length === 0 ? '#000' : ''"
          :primaryColor="tones[(index + 2) % tones.length]"
        />
        <div
          v-if="imgUrl"
          class="footer"
        >
          <img :src="imgUrl" />
        </div>
      </div>
    </div>
  </div>
  <PreviewModal
    ref="previewModalRef"
    @close="whenClose"
    @afterClose="afterClose"
  />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { Food } from "../types";
import { calcElementMoveDistance } from "../../../utils/element";
import PreviewModal from "../../../components/PreviewModal.vue";
import StepBar from "./StepBar.vue";
import { captureScreen } from "../../../utils/captureScreen";
import useScrollLock from "../../../hooks/useScrollLock";

const wrapperRef = ref<HTMLElement>();

function exportAsImg() {
  captureScreen({
    isFullScreen: true,
    usage: "open_window",
  });
}

type UnpackedFood = Record<keyof Food, string | string[]>;

const props = withDefaults(
  defineProps<{
    food: Food;
    isEn?: boolean;
    index: number;
  }>(),
  {
    isEn: true,
    index: 0,
  }
);

const unpackedFood = computed(
  () =>
    Object.fromEntries(
      Object.keys(props.food).map((key) => [
        key,
        typeof props.food[key] === "string"
          ? props.food[key]
          : props.isEn
          ? props.food[key].en
          : props.food[key].zh,
      ])
    ) as UnpackedFood
);

const steps = computed(() =>
  (unpackedFood.value.cookingSteps as string[]).map((i) => ({ title: i }))
);

const imgUrl = computed(() => unpackedFood.value.finalDishImage as string);

function isPrimaryMaterial(material: string) {
  return (unpackedFood.value.name as string)
    .toLowerCase()
    .includes(material.toLowerCase());
}

const previewModalRef = ref<InstanceType<typeof PreviewModal>>();
const isFolded = ref(true);

const moveX = ref(0);
const moveY = ref(0);

const initHeight = 8;
const unfoldedHeight = ref(initHeight);

const tones = ["#F4C853", "#304A95", "#429356", "#CC4E39"];
const bgColor = computed(() => tones[props.index % tones.length]);

const { lock, unlock } = useScrollLock();

watchEffect(() => {
  if (!isFolded.value) return lock();
  unlock();
});

function whenClose() {
  unfoldedHeight.value = initHeight;

  setTimeout(() => {
    moveX.value = 0;
    moveY.value = 0;
  }, 500);
}

function afterClose() {
  isFolded.value = true;
}

function openModal() {
  previewModalRef.value?.open();

  setTimeout(() => {
    unfoldedHeight.value = 60;
  }, 500);
}

function onClick(e: Event) {
  if (!isFolded.value) return;
  isFolded.value = false;

  const [_moveX, _moveY] = calcElementMoveDistance(e.target as HTMLElement);

  moveX.value = +_moveX.toFixed(0);
  moveY.value = +(_moveY - (300 - 48)).toFixed(0);

  openModal();
}
</script>

<style scoped lang="less">
.outmost-wrapper {
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  position: relative;
}

.is-unfolded {
  z-index: calc(var(--z-i-top) + 2);
}

.food-card-wrapper {
  padding: 0.5rem 0.6rem;
  background-color: v-bind(bgColor);
  border-radius: 0.875rem;
  width: 30vw;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  .title {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.1111111;
    color: var(--default-color);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 2rem;

    .icon {
      width: 2rem;
      height: 2rem;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
  }

  .fade {
    animation: fade 0.5s ease 0.5s forwards;
  }

  .body {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    opacity: 0;

    .material {
      margin-bottom: 10px;

      .title {
        color: inherit;
      }

      .material-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .material-item {
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          color: #000;
          font-weight: bold;
        }
      }
    }
  }

  .footer {
    img {
      border-radius: 0.5rem;
    }
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// <=480
@media (max-width: 480px) {
  .food-card-wrapper {
    width: 80vw;
  }
}

// >=480 and <=992
@media (min-width: 480px) and (max-width: 992px) {
  .food-card-wrapper {
    width: 40vw;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .food-card-wrapper {
    width: 40vw;
  }
}

@media (min-width: 1600px) {
  .food-card-wrapper {
    width: 30vw;
  }
}
</style>
