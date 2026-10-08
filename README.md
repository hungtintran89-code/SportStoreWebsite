# SportStore Website - Decoupled Frontend Architecture

Dự án phát triển website thương mại điện tử chuyên dụng cụ & trang phục thể thao chuẩn thi đấu, áp dụng kiến trúc **Decoupled Vanilla Architecture** triệt tiêu 100% nguy cơ xung đột mã nguồn (Zero Merge Conflicts) cho nhóm 5 lập trình viên Frontend.

---

## 1. Cấu Trúc Thư Mục Chuẩn (Directory Tree)

```text
SportStoreWebsite/
│
├── index.html                   # [Trang Chủ Cửa Hàng] Trang chủ thương mại điện tử chính thức (Hero, Flash Sale, Trending, Auth Modal)
├── generate_spec_docx.py        # [Python Tool] Kịch bản xuất tài liệu Word (.docx) đặc tả
├── SportStore_Frontend_Architecture_Spec.docx # File Word tài liệu đặc tả kiến trúc hoàn chỉnh
│
├── css/                         # Thư mục stylesheet CSS độc lập
│   ├── common.css               # Design tokens dùng chung, typography, navbar, footer, auth modal
│   ├── admin.css                # CSS Bảng điều khiển quản trị Admin
│   ├── dev1_home.css            # Scope: .dev1-home-wrapper (Hero Carousel, Flash Sale, Trending)
│   ├── dev2_products.css        # Scope: .dev2-products-wrapper (Live Search, Multi-Filter, Grid/List)
│   ├── dev3_details.css         # Scope: .dev3-details-wrapper (Gallery Zoom, Size Modal, Tool So Sánh)
│   ├── dev4_checkout.css        # Scope: .dev4-checkout-wrapper (Cart Table, Voucher, Form Đặt Hàng)
│   └── dev5_user.css            # Scope: .dev5-user-wrapper (Tabs, Sổ địa chỉ, Orders Timeline, FAQ)
│
├── js/                          # Thư mục JavaScript độc lập (IIFE khép kín)
│   ├── auth_modal.js            # [Dev 5] Module Đăng nhập / Đăng ký Modal & Khách vãng lai toàn website
│   ├── admin.js                 # [Dev 1 & Dev 2] Bảng điều khiển KPI & CRUD Sản phẩm Admin
│   ├── dev1_home.js             # [Dev 1] Logic Slider 4s, Countdown Timer, Newsletter Form
│   ├── dev2_products.js         # [Dev 2] Logic Live Search, Filter 4 tiêu chí, Sort, Phân trang
│   ├── dev3_details.js          # [Dev 3] Logic Thumbnail Zoom, Size Guide Modal, Tool So Sánh
│   ├── dev4_checkout.js         # [Dev 4] Logic Giỏ hàng tính động, Engine Voucher, Form Validation
│   └── dev5_user.js             # [Dev 5] Logic Tab Switching, Sổ địa chỉ, Timeline Vận đơn, Accordion FAQ
│
├── data/                        # Mock JSON dữ liệu tĩnh độc lập
│   ├── dev1_home.json           # Dữ liệu Banners, Flash Sale, Trending Tabs
│   ├── dev2_products.json       # Dữ liệu 12+ sản phẩm & danh mục bộ môn, thương hiệu
│   ├── dev3_details.json        # Thông số kỹ thuật chi tiết sản phẩm chính & 3 đối thủ
│   ├── dev4_checkout.json       # Giỏ hàng mẫu, danh sách voucher, bảng cước vận chuyển
│   └── dev5_user.json           # Hồ sơ hội viên Gold, địa chỉ giao hàng, lịch sử mua hàng, FAQ
│
├── pages/                       # Các trang HTML độc lập của từng Dev
│   ├── dev1_home.html           # Trang Chủ (Dev 1 - Leader)
│   ├── dev2_products.html       # Danh Mục & Bộ Lọc (Dev 2)
│   ├── dev3_details.html        # Chi Tiết & So Sánh (Dev 3)
│   ├── dev4_checkout.html       # Giỏ Hàng & Thanh Toán (Dev 4)
│   ├── dev5_user.html           # Tài Khoản & FAQ (Dev 5)
│   └── admin.html               # Trang Quản Trị Hệ Thống Toàn Diện (Leader - Dev 1 đảm nhận 100%)
│
└── images/                      # Thư mục tài nguyên ảnh phân cấp
    ├── common/                  # Logo, icons, badges
    ├── dev1/                    # Banners, flash sale
    ├── dev2/                    # Catalog thumbnails
    ├── dev3/                    # Gallery multi-angle
    ├── dev4/                    # QR payment, shipping
    └── dev5/                    # Avatar, tracking icons
```

---

## 2. Ma Trận Phân Chia Nhiệm Vụ 5 Dev (Đều Nhau Tuyệt Đối 20% Mỗi Người)

| Thành viên | Vai trò & Phân Hệ Phụ Trách | Tài Nguyên Phụ Trách (HTML / CSS / JS / JSON) | Trọng Số Rubric |
| :--- | :--- | :--- | :---: |
| **Dev 1 (Leader)** | **Toàn Bộ Trang Quản Trị Admin & Trang Chủ Cửa Hàng**<br>• Quản trị hệ thống toàn diện: 4 KPI Cards, Biểu đồ doanh thu, Quản lý đơn hàng, Quản lý kho sản phẩm CRUD, Modal thêm/sửa/xóa sản phẩm<br>• Trang chủ: Hero Banner Carousel 4s tự động, Countdown Flash Sale, Newsletter | • `pages/admin.html`<br>• `css/admin.css`<br>• `js/admin.js` (100% logic Admin)<br>• `index.html` & `pages/dev1_home.html`<br>• `css/dev1_home.css`<br>• `js/dev1_home.js`<br>• `data/dev1_home.json` | **2.0 / 10.0 (20%)** |
| **Dev 2** | **Danh Mục Sản Phẩm & Bộ Lọc Đa Tiêu Chí**<br>• Bộ lọc đa tiêu chí 4 điều kiện (Môn thể thao, Brand, Khoảng giá slider, Đánh giá sao)<br>• Live Search tức thì & Chuyển đổi Grid/List, Phân trang tự động thích ứng<br>• Toàn bộ giao diện thẻ sản phẩm catalog & huy hiệu Hot/New | • `pages/dev2_products.html`<br>• `css/dev2_products.css`<br>• `js/dev2_products.js`<br>• `data/dev2_products.json` | **2.0 / 10.0 (20%)** |
| **Dev 3** | **Chi Tiết Sản Phẩm & So Sánh Trang Bị**<br>• Thư viện ảnh sản phẩm đa góc nhìn & Zoom Lens<br>• Bộ chọn biến thể (Size, Color, Qty) & Modal Hướng dẫn chọn Size<br>• Công cụ so sánh đối kháng 3 sản phẩm thể thao (Dropdown & Bảng đối chiếu) | • `pages/dev3_details.html`<br>• `css/dev3_details.css`<br>• `js/dev3_details.js`<br>• `data/dev3_details.json` | **2.0 / 10.0 (20%)** |
| **Dev 4** | **Giỏ Hàng Tương Tác & Thanh Toán Đặt Mua**<br>• Bảng giỏ hàng tăng giảm số lượng & tính tiền động<br>• Voucher Engine (% / Tiền mặt / Freeship)<br>• Đồng bộ địa chỉ nhận hàng từ Tài khoản & Validate Form đặt hàng thành công | • `pages/dev4_checkout.html`<br>• `css/dev4_checkout.css`<br>• `js/dev4_checkout.js`<br>• `data/dev4_checkout.json` | **2.0 / 10.0 (20%)** |
| **Dev 5** | **Xác Thực, Sổ Địa Chỉ & Cổng Khách Hàng**<br>• Auth Modal Đăng nhập / Đăng ký & Trạng thái Khách vãng lai toàn site<br>• Sổ địa chỉ giao hàng 1 lần (Lưu localStorage, tự động nạp sang Checkout)<br>• Timeline theo dõi đơn hàng, Wishlist & Accordion FAQ bảo hành | • `pages/dev5_user.html`<br>• `css/dev5_user.css` & `css/common.css` (Auth modal)<br>• `js/dev5_user.js` & `js/auth_modal.js`<br>• `data/dev5_user.json` | **2.0 / 10.0 (20%)** |

---

## 3. Quy Ước Kỹ Thuật Bắt Buộc (Technical Contract)

1. **CSS Scope 100%**: Mọi style trong `devX_module.css` phải bắt đầu bằng `.devX-module-wrapper`. Tuyệt đối không viết CSS toàn cục lên `div`, `button`, `h1`.
2. **JS Encapsulation**: Toàn bộ logic JS phải đặt trong IIFE `(function() { 'use strict'; ... })();`. Tuyệt đối không gán biến lên `window`.
3. **Data Autonomy**: Tự nạp dữ liệu từ `../data/devX_*.json` bằng `fetch()`. Không gọi hàm chéo giữa các Dev.
4. **Relative Path**: Sử dụng `../css/`, `../js/`, `../data/`, `../images/` khi liên kết từ các file trong `pages/`.

---

## 4. Hướng Dẫn Chạy & Xuất File Báo Cáo

- **Xem trực tiếp**: Mở trực tiếp file `index.html` trên trình duyệt (hoặc dùng tiện ích Live Server trong VS Code).
- **Xuất lại file Word đặc tả**:
  ```bash
  py generate_spec_docx.py
  ```
  File Word `SportStore_Frontend_Architecture_Spec.docx` sẽ được tạo ra với đầy đủ bảng biểu, màu sắc và Wireframe ASCII.
