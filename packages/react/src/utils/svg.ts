export function sanitizeSvg(raw: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, "image/svg+xml");
    if (doc.querySelector("parsererror")) return "";
    const walk = (node: Element) => {
      if (node.tagName.toLowerCase() === "script") {
        node.parentNode?.removeChild(node);
        return;
      }
      for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith("on") || attr.value.toLowerCase().includes("javascript:")) {
          node.removeAttribute(attr.name);
        }
      }
      Array.from(node.children).forEach(walk);
    };
    walk(doc.documentElement);
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch {
    return "";
  }
}

export function resolveIconHtml(src?: string): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (trimmed.startsWith("<svg")) return sanitizeSvg(trimmed) || null;
  return null;
}
