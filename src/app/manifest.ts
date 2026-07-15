import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pace - food diary & meal logger",
    short_name: "Pace",
    description:
      "A calm, photo-first food diary. Snap a meal, log it in seconds, and keep a tidy record of what you eat.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: "#0d9488",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
