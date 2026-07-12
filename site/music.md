---
layout: page
sidebar: false
---

<script setup>
import { defineAsyncComponent } from 'vue'

const MusicPlayer = defineAsyncComponent(() => import('../.vitepress/theme/views/music/MusicPlayer.vue'))


</script>

<ClientOnly>
  <MusicPlayer />
</ClientOnly>
