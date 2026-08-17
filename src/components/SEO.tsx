import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const DEFAULT_TITLE = "Literal Storyboard — AI Fantasy Game Agent & Interactive Storytelling RPG";
const DEFAULT_DESC =
  "Embark on an epic quest in the kingdom of Eldoria with Literal Storyboard. Powered by Gemini 3.7 Flash AI agents and OpenRouter, featuring dynamic scene generation, procedural fantasy cartography, and real-time sentiment diplomacy mechanics.";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords,
  ogImage = "./src/assets/background.png",
  canonicalUrl = "https://literal-storyboard.vercel.app/",
}: SEOProps) {
  useEffect(() => {
    // Document title
    document.title = title;

    // Helper to update meta tag by name or property
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        const [attrName, attrVal] = selector.replace(/[[\]']/g, "").split("=");
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute(attr, value);
    };

    setMetaTag("meta[name='description']", "content", description);
    setMetaTag("meta[property='og:title']", "content", title);
    setMetaTag("meta[property='og:description']", "content", description);
    setMetaTag("meta[property='og:image']", "content", ogImage);
    setMetaTag("meta[name='twitter:title']", "content", title);
    setMetaTag("meta[name='twitter:description']", "content", description);
    setMetaTag("meta[name='twitter:image']", "content", ogImage);

    if (keywords) {
      setMetaTag("meta[name='keywords']", "content", keywords);
    }

    // Canonical link
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}
