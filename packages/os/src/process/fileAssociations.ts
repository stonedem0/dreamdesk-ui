/** A file's extension, lowercased, without the dot; "" when it has none. */
export function fileExtension(path: string): string {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

/**
 * The apps that can open a file, by its extension (AppDef.extensions), in the
 * registry's order: the first is the default. Works with any registry whose
 * entries list extensions, inside an <OSProvider> or not.
 */
export function appsForFile(apps: Record<string, { extensions?: string[] }>, path: string): string[] {
  const ext = fileExtension(path);
  if (!ext) return [];
  return Object.entries(apps)
    .filter(([, def]) => def.extensions?.some((e) => e.toLowerCase() === ext))
    .map(([appId]) => appId);
}
