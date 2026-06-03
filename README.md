# Tap hoa Vu Mai

Website ban hang tap hoa Vu Mai kieu GrabFood/ShopeeFood: khach xem san pham, loc theo danh muc, them vao gio hang, nhap thong tin giao hang va gui don cho tiem xac nhan.

## Tinh nang

- Trang cua hang co hero, tim kiem, danh muc va danh sach san pham.
- Gio hang client-side voi tang/giam so luong va tinh tong tien.
- Form dat hang gom ten khach, so dien thoai, dia chi giao hang va ghi chu.
- API tao don hang vao Supabase.
- Trang `/admin` xem don, san pham trong don, tong tien va cap nhat trang thai `confirmed` / `cancelled`.
- Trang `/admin` duoc bao ve bang mat khau don gian.
- Giao dien tieng Viet, responsive cho mobile va desktop.

## Cai dat local

1. Cai dependencies:

```bash
npm install
```

2. Tao file `.env.local` tu `.env.example`:

```bash
cp .env.example .env.local
```

3. Dien thong tin Supabase va mat khau admin:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-or-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
```

4. Tao database tren Supabase:

- Mo Supabase SQL Editor.
- Chay noi dung file `supabase/schema.sql`.
- File nay se bat Row Level Security. Khach chi doc duoc san pham `active`; don hang duoc ghi/doc thong qua server API.

5. Chay local:

```bash
npm run dev
```

Mo `http://localhost:3000`.

Trang quan tri don hang:

```text
http://localhost:3000/admin
```

Trinh duyet se hoi tai khoan/mat khau admin.

## Deploy Vercel

1. Push source code len GitHub.
2. Import repository vao Vercel.
3. Trong Vercel, mo **Project Settings -> Environment Variables**.
4. Them 5 bien moi truong:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
5. Deploy.

## Ghi chu van hanh

- De san pham hien tren web, cot `status` trong bang `products` phai la `active`.
- `SUPABASE_SERVICE_ROLE_KEY` la key bi mat, chi them vao `.env.local` va Vercel Environment Variables. Khong dat ten bien nay voi tien to `NEXT_PUBLIC_`.
- `ADMIN_PASSWORD` nen la mat khau rieng, khong dung mat khau email hay tai khoan ngan hang.
- Cach bao ve `/admin` hien tai phu hop giai doan dau. Khi co nhieu nhan vien, nen nang cap len dang nhap tai khoan rieng.
- Row Level Security da duoc bat trong `supabase/schema.sql` de tranh viec bang public bi doc/sua/xoa truc tiep.
