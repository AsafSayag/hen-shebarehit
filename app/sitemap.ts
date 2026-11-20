import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { getSiteOrigin } from "@/lib/site-origin";
import { bedroomSubcategories, categories } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin) return [];

  const paths = [
    "/",
    "/about",
    "/contact",
    "/reviews",
    "/terms",
    "/privacy",
    "/returns",
    "/accessibility",
    "/catalog",
    ...categories.map(({ slug }) => `/catalog/${slug}`),
    "/catalog/bedrooms/all",
    ...bedroomSubcategories.map(({ slug }) => `/catalog/bedrooms/category/${slug}`),
    ...products.map(({ category, id }) => `/catalog/${category}/${id}`),
  ];

  return [...new Set(paths)].map((path) => ({ url: new URL(path, origin).toString() }));
}
