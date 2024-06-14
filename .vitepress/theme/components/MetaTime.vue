<template>
  <div></div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";

const { page } = useData();
console.log("page =>", page.value);
</script>

<style scoped lang="less"></style>
