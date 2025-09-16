import { useCallback, useState } from "react";
import { parseAiSocial } from "@/utils/parseAiSocial";
import type { PostItem } from "@/types/social";

export function useSocialComposer() {
  const [post, setPost] = useState<PostItem | null>(null);

  const buildFromMarkdown = useCallback((markdown: string) => {
    const p = parseAiSocial(markdown);
    // Optional: set client id to enable immediate local edit/route before DB writes
    if (!p.id && typeof crypto !== "undefined" && "randomUUID" in crypto) {
      p.id = crypto.randomUUID();
    }
    setPost(p);
    return p;
  }, []);

  return { post, buildFromMarkdown };
}
