<template>
  <form
    class="form-wrapper"
    @submit.prevent="handleSubmit"
  >
    <!-- Canvas Element -->
    <canvas
      ref="canvasRef"
      class="canvas"
      :class="[animating ? 'opacity-100' : 'opacity-0']"
    />

    <!-- Text Input -->
    <input
      ref="inputRef"
      v-model="vanishingText"
      :disabled="animating"
      type="text"
      class="input"
      @keydown.enter="handleKeyDown"
    />

    <!-- Submit Button -->
    <button
      v-if="showSubmitButton"
      :disabled="!vanishingText"
      type="submit"
      class="submit-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="svg"
      >
        <path
          stroke="none"
          d="M0 0h24v24H0z"
          fill="none"
        />
        <path
          d="M5 12l14 0"
          :style="{
            strokeDasharray: '50%',
            strokeDashoffset: vanishingText ? '0' : '50%',
            transition: 'stroke-dashoffset 0.3s linear',
          }"
        />
        <path d="M13 18l6 -6" />
        <path d="M13 6l6 6" />
      </svg>
    </button>

    <!-- Placeholder Text -->
    <div class="placeholder-text">
      <Transition
        v-show="!vanishingText"
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        leave-active-class="transition duration-300 ease-in"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <p
          :key="currentPlaceholder"
          class="text"
        >
          {{ placeholders[currentPlaceholder] }}
        </p>
      </Transition>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from "vue";
import { templateRef } from "@vueuse/core";
import { useData } from "vitepress";

interface PixelData {
  x: number;
  y: number;
  color: string;
}

interface AnimatedPixel extends PixelData {
  r: number;
}

// Define interfaces for props and data structures
interface Props {
  placeholders?: string[];
  borderRadius?: number;
  showSubmitButton?: boolean;
}

// props
const props = withDefaults(defineProps<Props>(), {
  placeholders: () => ["Placeholder 1", "Placeholder 2", "Placeholder 3"],
  borderRadius: 9999,
  showSubmitButton: true,
});

const emit = defineEmits(["submit", "change"]);

defineExpose({
  handleSubmit,
});

const vanishingText = defineModel<string>({
  default: "",
});

const canvasRef = templateRef<HTMLCanvasElement>("canvasRef");
const inputRef = templateRef<HTMLInputElement>("inputRef");

// normal refs
const currentPlaceholder = ref(0);
const animating = ref(false);
const intervalRef = ref<number | null>(null);
const newDataRef = ref<AnimatedPixel[]>([]);
const animationFrame = ref<number | null>(null);

// Focus on input when mounted
onMounted(() => {
  if (!inputRef.value) return;
  inputRef.value.focus();
});

function changePlaceholder(): void {
  intervalRef.value = window.setInterval(() => {
    currentPlaceholder.value =
      (currentPlaceholder.value + 1) % props.placeholders.length;
  }, 3000);
}

function handleVisibilityChange(): void {
  if (document.visibilityState !== "visible" && intervalRef.value) {
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  } else if (document.visibilityState === "visible") {
    changePlaceholder();
  }
}

function draw(): void {
  if (!inputRef.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const computedStyles = getComputedStyle(inputRef.value);

  canvas.width = 800;
  canvas.height = 800;
  ctx.clearRect(0, 0, 800, 800);

  const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
  ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
  ctx.fillStyle = "#FFF";
  ctx.fillText(vanishingText.value, 16, 40);

  const imageData = ctx.getImageData(0, 0, 800, 800);
  const pixelData = imageData.data;
  const newData: PixelData[] = [];

  for (let t = 0; t < 800; t++) {
    let i = 4 * t * 800;
    for (let n = 0; n < 800; n++) {
      let e = i + 4 * n;
      if (
        pixelData[e] !== 0 &&
        pixelData[e + 1] !== 0 &&
        pixelData[e + 2] !== 0
      ) {
        newData.push({
          x: n,
          y: t,
          color: `rgba(${pixelData[e]}, ${pixelData[e + 1]}, ${
            pixelData[e + 2]
          }, ${pixelData[e + 3]})`,
        });
      }
    }
  }
  newDataRef.value = newData.map(({ x, y, color }) => ({ x, y, r: 1, color }));
}

function animate(start: number = 0): void {
  animationFrame.value = requestAnimationFrame(() => {
    const newArr: AnimatedPixel[] = [];
    for (const current of newDataRef.value) {
      if (current.x < start) {
        newArr.push(current);
      } else {
        if (current.r <= 0) {
          current.r = 0;
          continue;
        }
        current.x += Math.random() > 0.5 ? 1 : -1;
        current.y += Math.random() > 0.5 ? 1 : -1;
        current.r -= 0.05 * Math.random();
        newArr.push(current);
      }
    }
    newDataRef.value = newArr;
    const ctx = canvasRef.value?.getContext("2d");
    if (ctx) {
      ctx.clearRect(start, 0, 800, 800);
      newDataRef.value.forEach(({ x, y, r, color }) => {
        if (x > start) {
          ctx.beginPath();
          ctx.rect(x, y, r, r);
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      });
    }
    if (newDataRef.value.length > 0) {
      animate(start - 8);
    } else {
      vanishingText.value = "";
      animating.value = false;
      setTimeout(() => {
        // regain focus after animation
        inputRef.value.focus();
      }, 100);
    }
  });
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Enter" && !animating.value) {
    vanishAndSubmit();
  }
}

function vanishAndSubmit(): void {
  animating.value = true;
  draw();
  if (vanishingText.value) {
    const maxX = Math.max(...newDataRef.value.map(({ x }) => x));
    animate(maxX);
    emit("submit", vanishingText.value);
  }
}

function handleSubmit(): void {
  vanishAndSubmit();
}

// Watch for value changes
watch(vanishingText, (newVal: string) => {
  if (!animating.value) {
    emit("change", { target: { value: newVal } });
  }
});

onMounted(() => {
  changePlaceholder();
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value);
  }
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});

const { isDark } = useData();

const bgColor = computed(() =>
  isDark.value
    ? "rgb(39 39 42/var(--tw-bg-opacity,1))"
    : "rgb(255 255 255 / var(--tw-bg-opacity, 1))"
);

const invert = computed(() => (isDark.value ? "invert(0)" : "invert(100%)"));
const borderRadius = computed(() => `${props.borderRadius}px`);
</script>
<style scoped lang="less">
.form-wrapper {
  --tw-bg-opacity: 1;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);

  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 3rem;
  max-width: 36rem;
  border-radius: v-bind(borderRadius);
  overflow: hidden;
  background-color: v-bind(bgColor);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;

  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  transition-duration: 0.2s;

  .canvas {
    pointer-events: none;
    position: absolute;
    top: 20%;
    left: 0.5rem;
    transform-origin: top left;
    padding-right: 5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    filter: v-bind(invert);
    transform: scale(0.5);
  }

  .input {
    position: relative;
    z-index: 50;
    width: 100%;
    height: 100%;
    border-radius: v-bind(borderRadius);
    border: none;
    background-color: transparent;
    padding-left: 1rem;
    padding-right: 5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--default-color);

    &:focus {
      outline: none;
    }
  }

  .submit-button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    z-index: 50;
    display: flex;
    width: 2rem;
    height: 2rem;
    transform: translateY(-50%);
    justify-content: center;
    align-items: center;
    border-radius: v-bind(borderRadius);
    // border-radius: 50%;
    background-color: rgb(24 24 27 / var(--tw-bg-opacity, 1));
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke, opacity, box-shadow, transform,
      filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.2s;

    &:disabled {
      background-color: rgb(63 63 70 / var(--tw-bg-opacity, 1));
    }

    .svg {
      --tw-text-opacity: 1;
      color: rgb(209 213 219 / var(--tw-text-opacity, 1));
      width: 1rem;
      height: 1rem;
    }
  }

  .placeholder-text {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    border-radius: v-bind(borderRadius);

    .text {
      width: calc(100% - 2rem);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 1rem;
      text-align: left;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 400;
      color: #737373;
    }
  }
}

.opacity-100 {
  opacity: 1;
}

.opacity-0 {
  opacity: 0;
}

.transition {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;
}

.duration-300 {
  transition-duration: 0.5s;
}

.ease-out {
  transition-timing-function: ease-out;
}

.ease-in {
  transition-timing-function: ease-in;
}

.translate-y-4 {
  transform: translateY(1rem);
}

.translate-y-0 {
  transform: translateY(0);
}

.-translate-y-4 {
  transform: translateY(-1rem);
}

@media (min-width: 640px) {
  .canvas {
    left: 2rem !important;
  }

  .input {
    padding-left: 2.5rem !important;
    font-size: 1rem !important;
    line-height: 1.5rem !important;
  }

  .text {
    padding-left: 2.5rem !important ;
    font-size: 1rem !important;
    line-height: 1.5rem !important;
  }
}

@media (prefers-color-scheme: dark) {
  color: #71717a !important;
}
</style>
