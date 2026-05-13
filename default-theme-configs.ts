import { DefaultTheme } from "vitepress";

export const navConfigs = [
  // { text: "Home", link: "/" },
  { text: "Blog", link: "/blog.md" },
  { text: "Gallery", link: "/gallery.md" },
  { text: "Music", link: "/music.md" },
  { text: "Cookbook", link: "/cookbook.md" },
  { 
    text: "Playground", 
    items: [
      { text: "lyrics-scrolling", link: "/playground/lyrics-scrolling.md" },
    ]
  },
  // { text: "Todo", link: "/todo.md" },
  // { text: "Resume", link: "/resume.md" },
  // { text: "3d", link: "/3d.md" },
] as DefaultTheme.NavItem[];
