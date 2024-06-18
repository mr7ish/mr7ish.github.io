<template>
  <div>
    <MetaTime
      :customTime="{
        createTime: $attrs.createTime as string,
        min: $attrs.min as number,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import MetaTime from "../../../components/MetaTime.vue";
</script>

<style scoped></style>
