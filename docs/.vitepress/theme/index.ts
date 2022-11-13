import defaultTheme from "vitepress/theme";
import { EnhanceAppContext } from "vitepress";
import Tag from "../components/Tag.vue";
import "../styles/index.css";

export default {
  ...defaultTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    defaultTheme.enhanceApp(ctx);
    ctx.app.component("Tag", Tag);
  }
};
