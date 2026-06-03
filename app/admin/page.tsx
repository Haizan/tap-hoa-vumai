import { getOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/lib/types";
import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<Order["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy"
};

const statusClassNames: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600"
};

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <main className="container-page py-8 md:py-12">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pitch-600">
            Quản trị
          </p>
          <h1 className="mt-2 text-3xl font-bold text-pitch-900">
            Đơn hàng tạp hóa
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Trang này chưa có đăng nhập. Khi dùng thật, nên bảo vệ route `/admin`
          bằng đăng nhập hoặc middleware.
        </p>
      </div>

      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-600">
            Chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {orders.map((order) => (
              <article key={order.id} className="p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr_0.9fr_0.8fr_auto] lg:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Khách hàng
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-pitch-900">
                      {order.customer_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">{order.phone}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {order.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Sản phẩm
                    </p>
                    <div className="mt-2 space-y-2 text-sm text-slate-700">
                      {(order.order_items ?? []).map((item) => (
                        <p key={item.id}>
                          {item.quantity} x {item.product_name} -{" "}
                          {formatCurrency(item.line_total)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Ghi chú
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {order.note || "Không có"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Tổng tiền
                    </p>
                    <p className="mt-2 text-lg font-bold text-pitch-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <span
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClassNames[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <form action={updateOrderStatus}>
                      <input type="hidden" name="order_id" value={order.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button
                        type="submit"
                        disabled={order.status === "confirmed"}
                        className="rounded-md bg-pitch-700 px-3 py-2 text-xs font-semibold text-white hover:bg-pitch-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        Xác nhận
                      </button>
                    </form>
                    <form action={updateOrderStatus}>
                      <input type="hidden" name="order_id" value={order.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button
                        type="submit"
                        disabled={order.status === "cancelled"}
                        className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-pitch-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        Hủy
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
