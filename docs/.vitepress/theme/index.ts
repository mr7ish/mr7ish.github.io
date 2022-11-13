import defaultTheme from 'vitepress/theme'
import Tag from '../components/Tag.vue'
import '../styles/index.css'

export default {
    ...defaultTheme,
    enhanceApp: ({ app }) => {
        console.log(app);
        defaultTheme.enhanceApp({ app })
        app.component('Tag', Tag);
    }
}