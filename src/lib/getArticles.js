// Server-only utility — uses Node.js `fs` so it must only be called from
// server components (page.js, layout.js, etc.).  Never import this in a
// "use client" module.

import fs   from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_BASE = path.join(process.cwd(), "src/content/articles");
const MAX_ARTICLES  = 10;

/**
 * Reads every .md file from src/content/articles/<language>/, parses YAML
 * frontmatter with gray-matter, sorts articles newest-first by `date`, and
 * returns the top MAX_ARTICLES entries.
 *
 * @param {string} language  "en" | "ru"  (defaults to "en")
 *
 * Falls back to English if the requested language folder is missing or empty.
 *
 * Each returned object is plain and JSON-serialisable so it can be passed
 * across the server → client component boundary without issue.
 *
 * Shape:
 *   {
 *     slug:      string   // filename without .md
 *     title:     string
 *     subtitle:  string
 *     date:      string   // "YYYY-MM-DD"
 *     category:  string
 *     source:    string
 *     image:     string   // path (SVG placeholder)
 *     youtubeId: string   // YouTube video ID, or "" if none
 *     body:      string   // full article text (Markdown, stripped of frontmatter)
 *   }
 */
export function getArticles(language = "en") {
  const lang = language === "ru" ? "ru" : "en";

  function loadFromDir(dir) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    if (files.length === 0) return null;

    const articles = files.map((file) => {
      const raw            = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);

      return {
        slug:      file.replace(/\.md$/, ""),
        title:     data.title     ?? "",
        subtitle:  data.subtitle  ?? "",
        date:      data.date      ?? "1970-01-01",
        category:  data.category  ?? "General",
        source:    data.source    ?? "Now You Know",
        image:     data.image     ?? "",
        youtubeId: data.youtubeId ?? "",
        body:      content.trim(),
      };
    });

    return articles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, MAX_ARTICLES);
  }

  // Try requested language first, fall back to English
  return (
    loadFromDir(path.join(CONTENT_BASE, lang)) ??
    loadFromDir(path.join(CONTENT_BASE, "en")) ??
    []
  );
}
