<template>
  <div
    v-if="isSupported"
    class="speech-sensor-wrapper"
  >
    <IconSound
      :play-animation="isPlaying"
      style="cursor: pointer"
      @click="onClick"
      :class="isPlaying ? 'icon-sound' : ''"
    />
  </div>
</template>

<script setup lang="ts">
import { useSpeechSynthesis } from "@vueuse/core";
import {
  computed,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  shallowRef,
  watch,
} from "vue";
import IconSound from "./svgs/IconSound.vue";
import { useData } from "vitepress";
import { SpecifiedFrontmatter } from "../../../env";

const { frontmatter }: { frontmatter: Ref<SpecifiedFrontmatter> } = useData();

const isEnArticle = computed(() => !!frontmatter.value.isEn);

const paragraphs = shallowRef(["抱歉，没有找到内容"]);
const speechIndex = shallowRef(0);

const voice = ref<SpeechSynthesisVoice>();
const voices = shallowRef<SpeechSynthesisVoice[]>([]);

const { isPlaying, isSupported, status, utterance, speak, stop, toggle } =
  useSpeechSynthesis(() => paragraphs.value[speechIndex.value], {
    lang: isEnArticle.value ? "en-US" : "zh-CN",
    voice: voice.value,
  });

onMounted(() => {
  if (isSupported.value) {
    setTimeout(() => {
      const synth = window.speechSynthesis;
      voices.value = synth.getVoices();
      voice.value =
        voices.value.find((v) => v.name.includes("普通话")) || voices.value[0];

      const text = document.querySelector(".main")?.textContent;

      if (text) {
        paragraphs.value = text.match(
          isEnArticle.value ? /[^.?]+[.?]/g : /[^。，？]+[。，？]/g
        ) || ["抱歉，没有找到内容"];
      }
    }, 500);
  }
});

watch(
  () => status.value,
  (curStatus) => {
    if (curStatus === "end") {
      speechIndex.value = speechIndex.value + 1;
      if (speechIndex.value <= paragraphs.value.length) {
        play();
        return;
      }
      speechIndex.value = 0;
    }
  }
);

function play() {
  speak();
}

function pause() {
  window.speechSynthesis.pause();
  status.value = "pause";
  toggle();
}

function resume() {
  window.speechSynthesis.resume();
  status.value = "play";
  toggle();
}

function onClick() {
  // console.log("click status => ", status.value);
  if (["init", "end"].includes(status.value)) return play();
  if (status.value === "play") return pause();
  if (status.value === "pause") return resume();
}

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="less">
.speech-sensor-wrapper {
  .icon-sound {
    animation: heartBeat infinite;
    animation-duration: 2s;
  }
}
</style>
