// Server-only — uses Node.js fs. Only call from server components.

import fs    from "fs";
import path  from "path";
import matter from "gray-matter";

const LEAD_FILE = path.join(process.cwd(), "src/content/lead-story/current.md");

/**
 * Returns the parsed lead story from src/content/lead-story/current.md,
 * or null if the file doesn't exist.
 *
 * Shape (all fields are plain strings — JSON-serialisable):
 *   { title, subtitle, date, category, image, author, youtubeId, body }
 */
export function getLeadStory() {
  if (!fs.existsSync(LEAD_FILE)) return null;

  const raw               = fs.readFileSync(LEAD_FILE, "utf8");
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
