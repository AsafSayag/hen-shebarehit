import productData from "@/data/products.json";
import mattressData from "@/data/mattresses.json";
import zvzMattressData from "@/data/zvz-mattresses.json";
import driveFurnitureData from "@/data/drive-furniture.json";
import nammalBedsData from "@/data/nammal-beds.json";
import guberProductsData from "@/data/guber-products.json";
import photoOverrides from "@/data/photo-overrides.json";
import textOverrides from "@/data/text-overrides.json";

export type Product = {
  id: number;
  category: string;
  name: string;
  sku?: string;
  details: string[];
  images: string[];
  collection?: "sofas" | "armchairs" | "sideboards";
  bedType?: "double" | "jewish";
  bedVariants?: { label: string; image: string }[];
  bedroomGroups?: string[];
  imageVariants?: Record<string, { src: string; width: number; height: number }[]>;
  imageFocus?: Record<string, [number, number, number, number]>;
  sizes?: string[];
};

const sourceProducts = [...productData, ...mattressData, ...zvzMattressData, ...driveFurnitureData, ...nammalBedsData, ...guberProductsData] as Product[];
const editedPhotos = photoOverrides as unknown as Record<string, Partial<Product>>;
// Cleaner names and details (no supplier promotions, colors in otherwise identical names). Kept apart from the imported data so re-imports do not undo them.
const editedText = textOverrides as Record<string, Pick<Partial<Product>, "name" | "details">>;

export const products = sourceProducts.map((product) => {
  const override = editedPhotos[String(product.id)];
  // Only these fields may reach rendered pages or client components.
  const publicProduct: Product = {
    id: product.id,
    category: product.category,
    name: product.name,
    sku: product.sku,
    details: product.details,
    images: product.images,
    collection: product.collection,
    bedType: product.bedType,
    bedVariants: product.bedVariants,
    bedroomGroups: product.bedroomGroups,
    imageVariants: product.imageVariants,
    imageFocus: product.imageFocus,
    sizes: product.sizes,
  };
  return {
    ...publicProduct,
    ...editedText[String(product.id)],
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
