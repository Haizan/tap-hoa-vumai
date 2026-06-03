"use server";

import { revalidatePath } from "next/cache";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminConfig
} from "@/lib/supabase";

export async function updateOrderStatus(formData: FormData) {
  const orderId = String(formData.get("order_id") || "");
  const status = String(formData.get("status") || "");

  if (!orderId || !["confirmed", "cancelled"].includes(status)) {
    return;
  }

  if (!hasSupabaseAdminConfig()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);

  revalidatePath("/admin");
}
