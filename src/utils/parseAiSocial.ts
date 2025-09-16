import { PostItem } from "@/types/social";

const stripMd = (s: string) =>
  s
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*-\s+/gm, "")
    .trim();

const pick = (src: string, label: string) => {
  // finds a single-line "Label: value"
  const re = new RegExp(`^\\s*\\**${label}\\**\\s*:\\s*(.+)$`, "im");
  const m = src.match(re);
  return m ? m[1].trim() : "";
};

const between = (src: string, startHead: string, nextHeads: string[]) => {
  // get content after a heading until next heading or end
  const startRe = new RegExp(`^#\\s*${startHead}\\s*$`, "im");
  const start = src.search(startRe);
  if (start === -1) return "";
  const rest = src.slice(start + src.match(startRe)![0].length);
  let endIdx = rest.length;
  for (const h of nextHeads) {
    const r = new RegExp(`^#\\s*${h}\\s*$`, "im");
    const i = rest.search(r);
    if (i !== -1) endIdx = Math.min(endIdx, i);
  }
  return rest.slice(0, endIdx).replace(/^[-\s]*\n?/m, "").trim();
};

const parseHashtags = (s: string) =>
  (s || "")
    .replace(/^#Hashtags:\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map(t => t.replace(/^#/, ""))
    .filter(Boolean);

export function parseAiSocial(md: string): PostItem {
  const nextHeads = ["LinkedIn", "Twitter\\/X", "Twitter/X", "Threads", "Official"];

  // LinkedIn
  const liRaw = between(md, "LinkedIn", nextHeads);
  const liHeader = pick(liRaw, "Header");
  const liTagsLine = (liRaw.match(/^#Hashtags:.*$/im) || [""])[0];
  const liHashtags = parseHashtags(liTagsLine);
  const liBodyMd = liRaw
    .replace(/^.*\bHeader\b.*$/im, "")
    .replace(/^#Hashtags:.*$/im, "")
    .trim();

  // Twitter/X
  const twRaw = between(md, "Twitter\\/X", nextHeads) || between(md, "Twitter/X", nextHeads);
  const twTextMd = twRaw.trim();
  const twPlain = stripMd(twTextMd).replace(/\s+/g, " ").trim();

  // Threads
  const thRaw = between(md, "Threads", nextHeads);
  const thTextMd = thRaw.trim();

  // Official
  const ofRaw = between(md, "Official", nextHeads);
  const ofSubject = pick(ofRaw, "Subject");
  const ofBodyMd = ofRaw.replace(/^.*\bSubject\b.*$/im, "").trim();

  const post: PostItem = {
    // id omitted to allow DB trigger to generate (or set: crypto.randomUUID())
    linkedin: liRaw
      ? {
          header: liHeader || undefined,
          body: { plain: stripMd(liBodyMd), markdown: liBodyMd || undefined },
          hashtags: liHashtags.length ? liHashtags : undefined,
        }
      : undefined,
    twitter: twRaw
      ? {
          text: { plain: twPlain, markdown: twTextMd || undefined },
          chars: twPlain.length,
        }
      : undefined,
    threads: thRaw ? { text: { plain: stripMd(thTextMd), markdown: thTextMd || undefined } } : undefined,
    official: ofRaw
      ? {
          subject: ofSubject || undefined,
          body: { plain: stripMd(ofBodyMd), markdown: ofBodyMd || undefined },
        }
      : undefined,
  };

  return post;
}
