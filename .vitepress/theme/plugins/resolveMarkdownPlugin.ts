import fs from "fs";
import path from "path";
import { Plugin } from "vitepress";
import readingTime from "reading-time";

const includeFrontmatterRegex = /^---\s*[\r\n]+(.*?)\s*[\r\n]+---/s;
const excludeFrontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)\s*[\r\n]+---/;

export default function resolveMarkdownPlugin(): Plugin {
  return {
    name: "resolve-markdown-plugin",
    enforce: "pre",
    transform(code, id) {
      // id like this C:/Users/37734/Desktop/code/mr7ish.github.io/site/articles/ES6+.md
      // if (!id.endsWith(".md") || !/\/articles\//.test(id)) return;
      if (!id.endsWith(".md")) return;

      const rawContent = fs.readFileSync(id, "utf-8");
      // console.log("rawContent =>", rawContent);

      const text = removeMarkdown(
        rawContent.replace(includeFrontmatterRegex, "")
      );

      const stats = readingTime(text);

      return appendFrontmatter(code, {
        words: stats.words,
        time: stats.time,
        text: stats.text,
        _min: stats.minutes,
        id,
        fileName: path.basename(id, ".md"),
      });
    },
  };
}

function removeMarkdown(text: string) {
  return (
    text
      // Remove headers
      .replace(/^#+\s+/gm, "")
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Remove links
      .replace(/\[.*?\]\(.*?\)/g, "")
      // Remove bold and italic
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove blockquotes
      .replace(/^\s*>+\s?/gm, "")
      // Remove horizontal rules
      .replace(/^-{3,}\s*$/gm, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove strikethrough
      .replace(/~~(.*?)~~/g, "$1")
      // Remove tables (optional, depending on your Markdown flavor)
      .replace(/\|.*?\|/g, "")
      // Remove extra whitespace
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s+/g, " ")
  );
}

function appendFrontmatter(code: string, data: Record<string, any>) {
  const res = code.match(excludeFrontmatterRegex);
  const frontmatterStartIndex = 0;
  let frontmatterEndIndex = 0;
  let frontmatterOpenContent = "";
  if (res && res[0]) {
    frontmatterOpenContent = res[0].replace(/\n---[\s\n]*$/, "");
    frontmatterEndIndex = res[0].length;
  }
  const dataEntry = Object.entries(data);
  const dataFrontmatter = dataEntry
    .reduce<string[]>((frontmatterArr, [key, value]) => {
      const hasSameKeyFrontMatter = frontmatterOpenContent.indexOf(key) !== -1;
      const notEmptyArray = Array.isArray(value) && value.length;
      if (!hasSameKeyFrontMatter) {
        typeof value !== "object" &&
          frontmatterArr.push([key, value].join(": "));
        if (notEmptyArray) {
          value.unshift("");
          const _value = value.join("\n  - ");
          frontmatterArr.push(`${key}: ${_value}`);
        }
      } else {
        if (notEmptyArray) {
          const reg = new RegExp(key + "\\s*:\\s*(\\n\\s\\s\\-\\s+(.+))+", "g");
          value.unshift("");
          const _value = value.join("\n  - ");
          frontmatterOpenContent = frontmatterOpenContent.replace(
            reg,
            (str) => {
              return str + _value;
            }
          );
        }
      }
      return frontmatterArr;
    }, [])
    .join("\n");
  if (frontmatterStartIndex === 0 && frontmatterEndIndex !== 0) {
    return (
      [frontmatterOpenContent, dataFrontmatter, "---"].join("\n") +
      code.slice(frontmatterEndIndex)
    );
  } else {
    return [
      "---",
      dataFrontmatter,
      "---",
      code.slice(frontmatterEndIndex),
      "",
    ].join("\n");
  }
}
