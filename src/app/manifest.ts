import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Royal Water Villa Control",
    short_name: "Royal Villa",
    description: "מערכת שליטה יוקרתית לאורחי Royal Water Villa.",
    start_url: "/",
    display: "fullscreen",
    background_color: "#070b14",
    theme_color: "#070b14",
    orientation: "landscape",
    lang: "he",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
