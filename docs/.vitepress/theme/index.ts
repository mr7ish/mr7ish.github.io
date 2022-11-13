import defaultTheme from 'vitepress/theme'
import { EnhanceAppContext } from 'vitepress'
import Tag from '../components/Tag.vue'
import '../styles/index.css'

import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../constants'


export default {
    ...defaultTheme,
    enhanceApp: (ctx: EnhanceAppContext) => {
        defaultTheme.enhanceApp(ctx)
        ctx.app.component('Tag', Tag);
        if (window && typeof window !== undefined) {
            const div = document.createElement('div')
            div.style.cssText = `
                position: fixed;
                top:0;
                left:0;
                width: 100vw;
                height: 100vh;
                z-index: 0;
            `
            div.id = 'particlesJS_canvas'
            document.body.append(div)
            const init = () => {
                if (window.particlesJS) {
                    console.log(DARK_THEME_CONFIG);
                    window.particlesJS('particlesJS_canvas', document.querySelector('html.dark') ? DARK_THEME_CONFIG : LIGHT_THEME_CONFIG);
                }
            }
            window.initCanvas = init

            const originFn = window.localStorage.setItem
            window.localStorage.setItem = (key, value) => {
                init()
                originFn.apply(window.localStorage, [key, value])
            }
            // const targetNode = document.getElementsByTagName('html')[0]
            // const observer = new MutationObserver(init)
            // const config = { attributes: true };
            // observer.observe(targetNode, config)
        }
    }
}
