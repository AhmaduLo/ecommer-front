export interface Order {
  fullName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  productIds: number[];
  items: OrderItem[];
}

export interface OrderResponse {
  id: number;
  productIds: number[];
  items: OrderItem[];
  totalPrice: number;
  status: string;
  accessToken: string;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderDetails {
  id: number;
  fullName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}