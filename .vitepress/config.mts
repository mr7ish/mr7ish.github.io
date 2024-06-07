import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "bigfish's blog",
  titleTemplate: false,
  description: "a blog site based on vitepress",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  lang: "en",
  base: "/",
  cleanUrls: true,
  // (源目录) 相对于项目根目录解析
  srcDir: "./site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
