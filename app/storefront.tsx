"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type CartItem = {
  product: Product;
  quantity: number;
};

type StorefrontProps = {
  products: Product[];
};

type SubmitState = "idle" | "loading" | "success" | "error";

const ALL_CATEGORY = "Tất cả";

export default function Storefront({ products }: StorefrontProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const categories = useMemo(
    () => [ALL_CATEGORY, ...Array.from(new Set(products.map((item) => item.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORY || product.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, products, query]);

  const cartItems = Object.values(cart);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  function addToCart(product: Product) {
    setCart((current) => ({
      ...current,
      [product.id]: {
        product,
        quantity: (current[product.id]?.quantity ?? 0) + 1
      }
    }));
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((current) => {
      const next = { ...current };

      if (quantity <= 0) {
        delete next[productId];
        return next;
      }

      next[productId] = {
        ...next[productId],
        quantity
      };

      return next;
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (cartItems.length === 0) {
      setState("error");
      setMessage("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    const form = new FormData(formElement);
    setState("loading");
    setMessage("");

    const payload = {
      customer_name: String(form.get("customer_name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      address: String(form.get("address") || "").trim(),
      note: String(form.get("note") || "").trim(),
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price
      }))
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể tạo đơn hàng.");
      }

      setState("success");
      setMessage("Đã gửi đơn hàng. Tiệm sẽ gọi xác nhận trước khi giao.");
      setCart({});
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Không thể tạo đơn hàng.");
    }
  }

  return (
    <main>
      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-6 py-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-pitch-700">
              Giao nhanh quanh khu vực
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-pitch-900 md:text-5xl">
              Đi chợ tạp hóa online, đặt món cần là có người giao.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Bán hàng theo kiểu GrabFood/ShopeeFood: khách chọn sản phẩm, thêm
              vào giỏ, nhập địa chỉ và gửi đơn để tiệm xác nhận.
            </p>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
            alt="Kệ hàng tạp hóa"
            width={1000}
            height={640}
            priority
            className="h-56 w-full rounded-lg object-cover shadow-soft lg:h-72"
          />
        </div>
      </section>

      <section className="container-page grid gap-6 py-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <div className="sticky top-16 z-30 border-b border-line bg-[#f7faf7] py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-pitch-900">
                  Hôm nay bán gì?
                </h2>
                <p className="text-sm text-slate-600">
                  {filteredProducts.length} sản phẩm đang hiển thị
                </p>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm sữa, gạo, rau..."
                className="w-full rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100 md:max-w-xs"
              />
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold",
                    activeCategory === category
                      ? "border-pitch-700 bg-pitch-700 text-white"
                      : "border-line bg-white text-pitch-900 hover:border-pitch-600"
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-lg border border-line bg-white shadow-sm"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={900}
                  height={620}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-pitch-50 px-3 py-1 text-xs font-semibold text-pitch-700">
                      {product.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {product.unit}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-pitch-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold text-pitch-700">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-md bg-pitch-700 px-4 py-2 text-sm font-semibold text-white hover:bg-pitch-900"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside
          id="cart"
          className="scroll-mt-24 rounded-lg border border-line bg-white p-5 shadow-sm lg:sticky lg:top-24"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-pitch-900">Giỏ hàng</h2>
            <span className="rounded-full bg-pitch-50 px-3 py-1 text-sm font-bold text-pitch-700">
              {totalQuantity} món
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Chưa có sản phẩm. Bấm “Thêm” ở sản phẩm để bắt đầu lên đơn.
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-line p-3"
                >
                  <div>
                    <p className="font-semibold text-pitch-900">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatCurrency(item.product.price)} / {item.product.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="h-8 w-8 rounded-md border border-line font-bold text-pitch-900 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-8 w-8 rounded-md border border-line font-bold text-pitch-900 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-5 flex items-center justify-between border-t border-line pt-4">
            <span className="font-semibold text-slate-600">Tạm tính</span>
            <span className="text-xl font-bold text-pitch-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <form onSubmit={submitOrder} className="space-y-3">
            <input
              name="customer_name"
              placeholder="Tên khách hàng"
              className="w-full rounded-md border border-line px-3 py-3 outline-none focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Số điện thoại"
              className="w-full rounded-md border border-line px-3 py-3 outline-none focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100"
              required
            />
            <textarea
              name="address"
              placeholder="Địa chỉ giao hàng"
              rows={3}
              className="w-full resize-none rounded-md border border-line px-3 py-3 outline-none focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100"
              required
            />
            <textarea
              name="note"
              placeholder="Ghi chú: giao giờ nào, gọi trước..."
              rows={3}
              className="w-full resize-none rounded-md border border-line px-3 py-3 outline-none focus:border-pitch-600 focus:ring-2 focus:ring-pitch-100"
            />

            {message ? (
              <p
                className={[
                  "rounded-md px-3 py-3 text-sm font-medium",
                  state === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-800"
                ].join(" ")}
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "loading" || cartItems.length === 0}
              className="w-full rounded-md bg-pitch-700 px-5 py-3 font-semibold text-white hover:bg-pitch-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {state === "loading" ? "Đang gửi đơn..." : "Đặt hàng"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
