// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import CustomLayout from "./layout/index.vue";

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    console.log("app =>", app);
    console.log("router =>", router);
    console.log("siteDate =>", siteData);
  },
} satisfies Theme;
