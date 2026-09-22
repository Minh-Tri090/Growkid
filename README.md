# TCT / GrowKid Children Store

Website thương mại điện tử cho sản phẩm trẻ em, gồm:

- Frontend React + Vite
- Backend Node.js + Express
- MongoDB + Mongoose
- Đăng ký/đăng nhập, sản phẩm, giỏ hàng, checkout và quản trị

## Yêu cầu môi trường

- Node.js 18 trở lên
- npm
- MongoDB đang chạy local hoặc một MongoDB connection string

## Cài đặt

Mở PowerShell tại thư mục gốc project:

```powershell
cd "C:\Users\admin\Web Growkid\server"
npm install

cd ..\client
npm install
```

## Cấu hình server

Tạo file `server/.env` với nội dung tương tự:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/growkid
JWT_SECRET=your_secure_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Nếu dùng MongoDB Atlas, thay giá trị `MONGO_URI` bằng connection string của bạn.

## Chạy project ở chế độ phát triển

Cần mở **3 cửa sổ terminal**.

### 1. Khởi động MongoDB

Nếu dùng MongoDB local, đảm bảo MongoDB service đang chạy trên máy.

### 2. Khởi động backend

```powershell
cd "C:\Users\admin\Web Growkid\server"
npm run dev
```

Backend sẽ chạy tại:

```text
http://localhost:5000
```

### 3. Tạo dữ liệu mẫu

Chạy lệnh này một lần sau khi MongoDB đã hoạt động:

```powershell
cd "C:\Users\admin\Web Growkid\server"
npm run seed
```

### 4. Khởi động frontend

```powershell
cd "C:\Users\admin\Web Growkid\client"
npm run dev
```

Mở website tại:

```text
http://localhost:5173
```

Frontend tự động chuyển các request `/api` tới backend ở cổng `5000`.

## Kiểm tra backend

Mở URL sau trên trình duyệt hoặc dùng PowerShell:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

Kết quả hợp lệ sẽ có `status: ok`.

## Build frontend

```powershell
cd "C:\Users\admin\Web Growkid\client"
npm run build
```

Xem thử bản build:

```powershell
npm run preview
```

## Các lệnh chính

| Thư mục | Lệnh | Mục đích |
| --- | --- | --- |
| `server` | `npm run dev` | Chạy backend với watch mode |
| `server` | `npm start` | Chạy backend |
| `server` | `npm run seed` | Nạp dữ liệu mẫu |
| `client` | `npm run dev` | Chạy frontend Vite |
| `client` | `npm run build` | Build frontend production |
| `client` | `npm run preview` | Preview bản build |

## Cấu trúc chính

```text
client/   React frontend và giao diện mua sắm
server/   Express API, models, controllers và seed data
```

Không commit các giá trị bí mật thật trong `server/.env`, đặc biệt là `JWT_SECRET` và thông tin MongoDB production.
