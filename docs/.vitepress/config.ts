import { defineConfig } from "vitepress";
export default defineConfig({
    title: 'Mr7ish',
    description: 'Just playing around.',
    // outline: 0,
    themeConfig: {
        socialLinks: [
            { icon: 'github', link: 'https://github.com/mr7ish' },
        ],
        nav: [
            { text: '首页', link: '/' },
            { text: 'Gitee', link: 'https://gitee.com/chengguanmo' },
        ],
    },
    head: [
        ['script', { src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js', crossorigin: '', onload:'initCanvas()' }]
    ]
    
    // base:'/mr7ish'
    // outDir: '../'
})
// 