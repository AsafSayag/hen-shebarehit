import productData from "@/data/products.json";
import mattressData from "@/data/mattresses.json";
import zvzMattressData from "@/data/zvz-mattresses.json";
import driveFurnitureData from "@/data/drive-furniture.json";
import photoOverrides from "@/data/photo-overrides.json";

export type Product = {
  id: number;
  category: string;
  name: string;
  sku?: string;
  details: string[];
  images: string[];
  collection?: "sofas" | "armchairs" | "sideboards";
  imageVariants?: Record<string, { src: string; width: number; height: number }[]>;
  imageFocus?: Record<string, [number, number, number, number]>;
  sizes?: string[];
  sourceUrl: string;
  supplierPriceIls?: string;
  supplierInStock?: boolean;
};

const sourceProducts = [...productData, ...mattressData, ...zvzMattressData, ...driveFurnitureData] as Product[];
const editedPhotos = photoOverrides as unknown as Record<string, Partial<Product>>;

export const products = sourceProducts.map((product) => {
  const override = editedPhotos[String(product.id)];
  return {
    ...product,
    ...override,
    imageFocus: override?.images ? override.imageFocus : override?.imageFocus ?? product.imageFocus,
  };
});

export function productsForCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getProduct(category: string, id: string) {
  return products.find((product) => product.category === category && String(product.id) === id);
}
