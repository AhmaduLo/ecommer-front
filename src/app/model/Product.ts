export interface Image {
  id: number;
  imageUrl: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  seoTitle: string;
  shortDescription: string;
  slug: string;
  imageUrls: string[];
  images: Image[];
}
