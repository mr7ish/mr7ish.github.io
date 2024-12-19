/// <reference types="vite/client" />

export interface SpecifiedFrontmatter extends Record<string, any> {
  id?: string;
  title?: string;
  createTime?: string;
  cover?: string;
  fileName?: string;
  tags?: string[];
  min?: number;
  text?: string;
  time?: number;
  words?: number;
  layout?: "doc" | "page" | "home";
  hidden?: boolean;
}
