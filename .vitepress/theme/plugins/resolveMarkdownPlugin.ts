import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Plugin } from "vitepress";

export default function resolveMarkdownPlugin(): Plugin {
  return {
    name: "resolve-markdown-plugin",
    transform(code, id, options) {
      console.log("code =>", code);
      console.log("id =>", id);
      console.log("options =>", options);

      if (id.endsWith(".md")) {
        const rawContent = fs.readFileSync(id, "utf-8");
        console.log("rawContent =>", rawContent);

        const { content, data } = matter(rawContent);
        console.log("content =>", content);
        console.log("data =>", data);

        data.test = "666";

        const processedContent = matter.stringify(content, data);

        return {
          // code: processedContent,
          code: `export default ${JSON.stringify(
            processedContent
          )}; export const frontmatter = ${JSON.stringify(data)};`,
          map: null,
        };
      }
    },
  };
}
