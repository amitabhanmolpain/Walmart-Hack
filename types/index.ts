export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
  category: string;
  description: string;
  brand: string;
  offers: string[];
  margin: number;
  inStock: boolean;
  weight?: string;
  flavor?: string;
  packType?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}