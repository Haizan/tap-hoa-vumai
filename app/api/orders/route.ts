import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminConfig
} from "@/lib/supabase";

type OrderPayload = {
  customer_name?: string;
  phone?: string;
  address?: string;
  note?: string;
  items?: Array<{
    product_id?: string;
    product_name?: string;
    quantity?: number;
    unit_price?: number;
  }>;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as OrderPayload;
  const customerName = payload.customer_name?.trim();
  const phone = payload.phone?.trim();
  const address = payload.address?.trim();
  const note = payload.note?.trim() || null;
  const items = payload.items ?? [];

  if (!customerName || !phone || !address || items.length === 0) {
    return NextResponse.json(
      { message: "Vui lòng nhập đầy đủ thông tin đơn hàng." },
      { status: 400 }
    );
  }

  const normalizedItems = items.map((item) => ({
    product_id: item.product_id,
    product_name: item.product_name?.trim(),
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price)
  }));

  const invalidItem = normalizedItems.some(
    (item) =>
      !item.product_id ||
      !item.product_name ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      !Number.isFinite(item.unit_price) ||
      item.unit_price < 0
  );

  if (invalidItem) {
    return NextResponse.json(
      { message: "Sản phẩm trong giỏ hàng không hợp lệ." },
      { status: 400 }
    );
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json(
      {
        message:
          "Chưa cấu hình Supabase service key. Vui lòng cập nhật biến môi trường."
      },
      { status: 503 }
    );
  }

  const totalAmount = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      phone,
      address,
      note,
      total_amount: totalAmount
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { message: "Không thể tạo đơn hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }

  const orderItems = normalizedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.quantity * item.unit_price
  }));

  const { error: itemError } = await supabase.from("order_items").insert(orderItems);

  if (itemError) {
    await supabase.from("orders").delete().eq("id", order.id);

    return NextResponse.json(
      { message: "Không thể lưu sản phẩm trong đơn hàng." },
      { status: 500 }
    );
  }

  return NextResponse.json({ order }, { status: 201 });
}
