// Server-only — uses Node.js fs. Only call from server components.

import fs    from "fs";
import path  from "path";
import matter from "gray-matter";

const LEAD_BASE = path.join(process.cwd(), "src/content/lead-story");

/**
 * Returns the parsed lead story for the requested language, or null if no
 * file can be found.
 *
 * @param {string} language  "en" | "ru"  (defaults to "en")
 *
 * Falls back to English if the requested language file is missing.
 *
 * Shape (all fields are plain strings — JSON-serialisable):
 *   { title, subtitle, date, category, image, author, youtubeId, body }
 */
export function getLeadStory(language = "en") {
  const lang = language === "ru" ? "ru" : "en";

  function loadFile(l) {
    const filePath = path.join(LEAD_BASE, l, "current.md");
    if (!fs.existsSync(filePath)) return null;

    const raw               = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      title:     data.title     ?? "",
      subtitle:  data.subtitle  ?? "",
      date:      data.date      ?? "",
      category:  data.category  ?? "",
      image:     data.image     ?? "",
      author:    data.author    ?? "",
      youtubeId: data.youtubeId ?? "",
      body:      content.trim(),
    };
  }

  // Try requested language, fall back to English
  return loadFile(lang) ?? loadFile("en") ?? null;
}
