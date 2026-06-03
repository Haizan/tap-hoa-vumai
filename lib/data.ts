import type { Order, Product } from "@/lib/types";
import {
  createSupabaseAdminClient,
  createSupabaseClient,
  hasSupabaseAdminConfig,
  hasSupabaseConfig
} from "@/lib/supabase";

export const fallbackProducts: Product[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Trứng gà ta",
    category: "Thực phẩm",
    unit: "vỉ 10 quả",
    price: 38000,
    image_url:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80",
    description: "Trứng mới nhập mỗi ngày, phù hợp cho bữa sáng và nấu ăn.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Sữa tươi không đường",
    category: "Đồ uống",
    unit: "hộp 1L",
    price: 34000,
    image_url:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80",
    description: "Sữa tươi tiệt trùng, dễ dùng cho cả gia đình.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Mì gói Hảo Hảo",
    category: "Đồ khô",
    unit: "thùng 30 gói",
    price: 118000,
    image_url:
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=80",
    description: "Sản phẩm bán chạy, tiện dự trữ trong nhà.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Nước rửa chén hương chanh",
    category: "Gia dụng",
    unit: "chai 750ml",
    price: 29000,
    image_url:
      "https://images.unsplash.com/photo-1622480916113-9000ac49b79d?auto=format&fit=crop&w=900&q=80",
    description: "Tẩy dầu mỡ tốt, hương chanh nhẹ.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Gạo thơm Jasmine",
    category: "Gạo & gia vị",
    unit: "túi 5kg",
    price: 145000,
    image_url:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
    description: "Gạo mềm, thơm, phù hợp bữa cơm gia đình.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Rau cải ngọt",
    category: "Rau củ",
    unit: "bó 500g",
    price: 18000,
    image_url:
      "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=900&q=80",
    description: "Rau tươi nhập trong ngày, nên dùng sớm.",
    status: "active",
    created_at: new Date().toISOString()
  }
];

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig()) {
    return fallbackProducts;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return fallbackProducts;
  }

  return data ?? [];
}

export async function getOrders(): Promise<Order[]> {
  if (!hasSupabaseAdminConfig()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
