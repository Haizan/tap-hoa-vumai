import { getProducts } from "@/lib/data";
import Storefront from "./storefront";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return <Storefront products={products} />;
}
