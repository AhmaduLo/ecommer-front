export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  category: string;
  stock: number;
  seoTitle: string;
  shortDescription: string;
  slug: string;
}