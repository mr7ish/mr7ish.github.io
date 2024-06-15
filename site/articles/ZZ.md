---
cover: /beauty.jpg
---

```ts
<script setup>
import { onMounted } from "vue";
 
onMounted(async () => {
  const res = await (await fetch(window.location.href)).text();
  console.log("res =>", res);
});

</script>
```

# Markdown Extension Exampless

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).

::: details
This is a details block.
:::