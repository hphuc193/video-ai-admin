# 💻 AI Video Generator - Admin Dashboard
 
Cổng thông tin quản trị trung tâm (Web Admin Portal) dành cho người điều hành hệ thống AI Video Generator. Được xây dựng dưới dạng ứng dụng SPA (Single Page Application) hiện đại.
 
## 🚀 Tính năng cốt lõi
- **Bảng điều khiển (Dashboard):** Thống kê doanh thu, số lượng người dùng mới và giám sát tình trạng (Health Check) của AI Server.
- **Quản lý Khách hàng:** Theo dõi lịch sử giao dịch, khóa/mở khóa tài khoản (Ban/Unban) và cộng/trừ Credit thủ công.
- **Chiến dịch Kinh doanh:** Khởi tạo, bật/tắt (Toggle) các gói nạp Credit theo thời gian thực (Real-time sync to Mobile).
- **Mã Khuyến mãi:** Quản lý số lượng và thời hạn sử dụng của Promo Code.
- **Thiết kế Chuyên nghiệp:** Layout chia tách chuẩn (Sticky Sidebar không cuộn, Main Content cuộn độc lập) đem lại trải nghiệm cao cấp.
## 🛠 Ngăn xếp công nghệ (Tech Stack)
- **Core:** ReactJS, Vite (Build Tool)
- **UI Framework:** Ant Design (AntD)
- **Routing:** React Router v6
- **Networking:** Axios (với cơ chế Interceptors gắn JWT Token)
## ⚙️ Hướng dẫn cài đặt
 
1. Clone dự án:
```bash
   git clone <repo_url>
```
 
2. Cài đặt các gói phụ thuộc (Dependencies):
```bash
   npm install
```
 
3. Tạo file `.env` ở thư mục gốc để trỏ API về Backend Node.js:
```env
   VITE_API_BASE_URL=http://localhost:3000/api
```
 
4. Chạy môi trường phát triển:
```bash
   npm run dev
```
 
---
 
*Dự án thuộc Hệ sinh thái AI Video Generator.*
