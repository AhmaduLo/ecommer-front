export interface Order {
  fullName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  productIds: number[];
}

export interface OrderResponse {
  id: number;
  productIds: number[];
  totalPrice: number;
  status: string;
  accessToken: string;
  createdAt: string;
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
}