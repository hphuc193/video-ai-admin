
---

# 2. Web Admin — `README.md`

```markdown
# 💻 AI Video Generator - Admin Dashboard

Web Admin Dashboard là hệ thống quản trị trung tâm của AI Video Generator.

Hệ thống cho phép administrator quản lý người dùng, Credit, Promo Code, các gói Credit và theo dõi trạng thái hoạt động của hệ thống AI.

Ứng dụng được xây dựng theo mô hình SPA (Single Page Application).

---

## 🚀 Tính năng

### 📊 Dashboard

- Thống kê tổng quan hệ thống.
- Theo dõi doanh thu.
- Theo dõi số lượng người dùng.
- Theo dõi Credit.
- Kiểm tra trạng thái hoạt động của AI Server.

### 👥 User Management

Administrator có thể:

- Xem danh sách người dùng.
- Xem thông tin tài khoản.
- Xem lịch sử giao dịch.
- Khóa tài khoản.
- Mở khóa tài khoản.
- Cộng Credit thủ công.
- Trừ Credit thủ công.

### 💳 Credit Package Management

- Tạo Credit Package.
- Chỉnh sửa Credit Package.
- Bật / tắt Package.
- Quản lý giá bán.
- Đồng bộ Package với Mobile App.

### 🎟 Promo Code

- Tạo Promo Code.
- Quản lý số lượng sử dụng.
- Thiết lập thời hạn.
- Bật / tắt Promo Code.
- Theo dõi trạng thái Promo Code.

### 🎨 UI / UX

- Responsive Dashboard.
- Sticky Sidebar.
- Main Content cuộn độc lập.
- Giao diện hiện đại.
- Component-based architecture.

---

## 🛠 Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Frontend | ReactJS |
| Build Tool | Vite |
| UI Framework | Ant Design |
| Routing | React Router |
| HTTP Client | Axios |
| Authentication | JWT |
| Architecture | SPA |

---

## 📁 Project Structure

```text
src/
├── components/
├── layouts/
├── pages/
├── services/
├── hooks/
├── utils/
├── routes/
├── assets/
├── App.jsx
└── main.jsx

public/

.env
package.json
vite.config.js
