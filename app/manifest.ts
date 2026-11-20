import type { MetadataRoute } from "next";
import { business } from "@/lib/site";

// Lets phones show the lamp icon and the business name when the site is added to the home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: business.name,
    description: "ריהוט בוטיק לבית ואולם תצוגה בנתניה",
    lang: "he",
    dir: "rtl",
    start_url: "/",
    display: "browser",
    background_color: "#f6f2eb",
    theme_color: "#f6f2eb",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
