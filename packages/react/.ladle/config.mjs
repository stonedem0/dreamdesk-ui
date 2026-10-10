/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/stories/**/*.stories.tsx",
  // Just the aliases: the package's own vite config also builds the library
  viteConfig: ".ladle/vite.config.ts",
  // Themes come from the switcher in components.tsx, not Ladle's light/dark
  addons: { theme: { enabled: false } },
};
