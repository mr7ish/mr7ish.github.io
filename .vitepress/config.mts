import { defineConfig } from "vitepress";
import { navConfigs } from "../default-theme-configs";

// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  title: "bigfish's records",
  titleTemplate: false,
  description: "a personal record site based on vitepress",
  // TODO fix icon path
  head: [["link", { rel: "icon", href: "./favicon.ico" }]],
  lang: "en",
  base: "/",
  cleanUrls: true,
  // (源目录) 相对于项目根目录解析
  srcDir: "./site",
  appearance: "dark",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/zh/reference/default-theme-config
    logo: "/favicon.ico",
    // logo: "/favicon.svg",
    nav: navConfigs,
    outline: [1, 5],
    sidebar: [
      {
        text: "Examples",
        // collapsed: true,
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          {
            text: "Markdown Examples",
            items: [{ text: "Markdown Examples", link: "/markdown-examples" }],
          },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/mr7ish" }],
  },
});
