import { defineConfig } from "vitepress";
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from "./constants";
export default defineConfig({
  title: "Mr7ish",
  description: "Just playing around.",
  // outline: 0,
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/mr7ish" }],
    nav: [
      { text: "首页", link: "/" },
      { text: "Gitee", link: "https://gitee.com/chengguanmo" },
    ],
  },
  head: [
    [
        "script",
        {
          src: "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js",
          crossorigin: "",
        //   onload: "initCanvas && initCanvas()",
        },
      ],
    [
      "script",
      {},
      `window.onload = function(){
        const div = document.createElement("div");
    div.style.cssText = 'position: fixed; top:0; left:0; width: 100vw; height: 100vh; z-index: 0;';
    div.id = "particlesJS_canvas";
    document.body.append(div);
    const init = () => {
      if (window.particlesJS) {
        window.particlesJS(
          "particlesJS_canvas",
          
          JSON.parse(
            document.querySelector("html.dark") ? '${JSON.stringify(DARK_THEME_CONFIG)}'
            : '${JSON.stringify(LIGHT_THEME_CONFIG)}')
        ); 
      }
    };
    if (window.particlesJS) init()
    window.initCanvas = init;

    const originFn = window.localStorage.setItem;
    window.localStorage.setItem = (key, value) => {
      init();
      originFn.apply(window.localStorage, [key, value]);
    };
      }`,
    ]
  ],

  // base:'/mr7ish'
  // outDir: '../'
});
//
