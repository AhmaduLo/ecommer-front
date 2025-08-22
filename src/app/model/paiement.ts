export interface PaiementRequest {
  accessToken: string;
  amount: number;
}

export interface PaiementResponse {
  clientSecret: string;
  accessToken: string;
  paymentIntentId: string;
  status: string;
}
