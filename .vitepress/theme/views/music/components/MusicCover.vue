<template>
  <div class="cover-wrapper">
    <img :src="path ?? pictures[getRangeRandom(0, pictures.length)].path" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import getPictures from "../../../utils/getPictures";
import { getRangeRandom } from "../../../utils/math";

type Props = {
  size?: number | string;
  shape?: "corner" | "circle";
  radius?: number;
  path?: string;
};

const props = withDefaults(defineProps<Props>(), {
  shape: "corner",
  size: 50,
  radius: 6,
});

const { pictures } = getPictures();

const size = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);
const radius = computed(() => `${props.radius}px`);
</script>

<style scoped lang="less">
.cover-wrapper {
  width: v-bind(size);
  height: v-bind(size);
  overflow: hidden;
  border-radius: v-bind(radius);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // object-position: center;
  }
}
</style>
