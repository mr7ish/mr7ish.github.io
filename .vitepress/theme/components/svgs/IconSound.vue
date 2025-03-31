<template>
  <svg
    t="1743132521177"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7344"
    :width="size"
    :height="size"
  >
    <path
      d="M223.874 772.086c-16.568 0-30-13.432-30-30V512c0-176.448 143.552-320 320-320 85.424 0 165.726 33.25 226.128 93.624 60.376 60.35 93.718 140.678 93.894 226.192v0.136l-0.142 226.718-60-0.04 0.142-226.638C773.636 368.626 657.006 252 513.886 252c-143.376 0-260.012 116.636-260.012 260v230.086c0 16.568-13.432 30-30 30z"
      :fill="earPhoneColor"
      p-id="7346"
    ></path>
    <path
      d="M304 832h-16c-51.832 0-94-42.168-94-94v-154c0-33.084 26.916-60 60-60h50c51.832 0 94 42.168 94 94v120c0 51.832-42.168 94-94 94z m-50-248v154c0 18.748 15.252 34 34 34h16c18.748 0 34-15.252 34-34v-120c0-18.748-15.252-34-34-34h-50z"
      :fill="earPhoneColor"
      p-id="7347"
    ></path>
    <path
      d="M740 832h-16c-51.832 0-94-42.168-94-94v-120c0-51.832 42.168-94 94-94h50c33.084 0 60 26.916 60 60v154c0 51.832-42.168 94-94 94z m-16-248c-18.748 0-34 15.252-34 34v120c0 18.748 15.252 34 34 34h16c18.748 0 34-15.252 34-34v-154h-50z"
      :fill="earPhoneColor"
      p-id="7348"
    ></path>
    <path
      :class="playAnimation ? 'voice' : ''"
      d="M564 770.084c-15.464 0-28-12.536-28-28v-140.17c0-15.464 12.536-28 28-28s28 12.536 28 28v140.17c0 15.464-12.536 28-28 28zM460 741.462c-15.464 0-28-12.536-28-28V630.54c0-15.464 12.536-28 28-28s28 12.536 28 28v82.924c0 15.464-12.536 27.998-28 27.998z"
      :fill="voiceColor"
      p-id="7349"
    ></path>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    earPhoneColor?: string;
    voiceColor?: string;
    playAnimation?: boolean;
  }>(),
  {
    size: 30,
    earPhoneColor: "var( --icon-sound-color)",
    voiceColor: "var(--vp-c-brand-1)",
    playAnimation: false,
  }
);
</script>

<style scoped lang="less">
.icon {
  .voice {
    animation: voice 1.5s ease-in infinite;
    transform-origin: bottom;
  }
}

@keyframes voice {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
