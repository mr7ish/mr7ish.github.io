<template>
    <div class="tag">#{{props.text}}</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
type Props = {
    text: string
}
const props = defineProps<Props>()
</script>
<style>
.tag {
    display: inline-block;
    padding-right: 10px;
    /* border-radius: 999px; */
    /* border: 1px solid #ccc; */
    font-size: 14px;
    line-height: 24px;
    margin: 15px 5px 6px 1px;
}
</style>