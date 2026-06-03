export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  image_url: string;
  description: string | null;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string | null;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  products?: {
    name: string;
  } | null;
};
