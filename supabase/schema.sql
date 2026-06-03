create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  unit text not null,
  price integer not null check (price >= 0),
  image_url text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  line_total integer not null check (line_total >= 0),
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active products" on public.products;

create policy "Public can read active products"
on public.products
for select
to anon
using (status = 'active');

insert into public.products
  (id, name, category, unit, price, image_url, description, status)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Trứng gà ta',
    'Thực phẩm',
    'vỉ 10 quả',
    38000,
    'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80',
    'Trứng mới nhập mỗi ngày, phù hợp cho bữa sáng và nấu ăn.',
    'active'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Sữa tươi không đường',
    'Đồ uống',
    'hộp 1L',
    34000,
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',
    'Sữa tươi tiệt trùng, dễ dùng cho cả gia đình.',
    'active'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Mì gói Hảo Hảo',
    'Đồ khô',
    'thùng 30 gói',
    118000,
    'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=80',
    'Sản phẩm bán chạy, tiện dự trữ trong nhà.',
    'active'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Nước rửa chén hương chanh',
    'Gia dụng',
    'chai 750ml',
    29000,
    'https://images.unsplash.com/photo-1622480916113-9000ac49b79d?auto=format&fit=crop&w=900&q=80',
    'Tẩy dầu mỡ tốt, hương chanh nhẹ.',
    'active'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Gạo thơm Jasmine',
    'Gạo & gia vị',
    'túi 5kg',
    145000,
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80',
    'Gạo mềm, thơm, phù hợp bữa cơm gia đình.',
    'active'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Rau cải ngọt',
    'Rau củ',
    'bó 500g',
    18000,
    'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=900&q=80',
    'Rau tươi nhập trong ngày, nên dùng sớm.',
    'active'
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  unit = excluded.unit,
  price = excluded.price,
  image_url = excluded.image_url,
  description = excluded.description,
  status = excluded.status;
