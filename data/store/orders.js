var orders = [
  {
    orderId: "SPORT-88201", customerId: "KH-001", customer: "Trần Hùng Tín", phone: "0912345678", email: "hungtintran89@gmail.com",
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM", date: "2026-10-24", payment: "Ví MoMo", shippingFee: 0, voucherCode: "FREESHIP", status: "Đang giao",
    items: [{ productId: 201, code: "SP-201", name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto", size: "42", color: "Trắng / Đỏ Cam Proto", quantity: 1, price: 5290000, total: 5290000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" }],
    total: 5290000, note: "Giao trong giờ hành chính"
  },
  {
    orderId: "SPORT-88202", customerId: "KH-002", customer: "Lê Minh Hoàng", phone: "0987654321", email: "leminhhoang@gmail.com",
    address: "105 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP.HCM", date: "2026-10-24", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 25000, voucherCode: "", status: "Mới đặt",
    items: [{ productId: 202, code: "SP-202", name: "Giày Đá Bóng Adidas Predator Elite FG", size: "41", color: "Đỏ Đen Predator Solar Red", quantity: 1, price: 3150000, total: 3150000, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80" }],
    total: 3175000, note: "Gọi trước khi giao 15 phút"
  },
  {
    orderId: "SPORT-88203", customerId: "KH-003", customer: "Nguyễn Thị Mai", phone: "0933221100", email: "nguyenmai@gmail.com",
    address: "12 Võ Văn Kiệt, Phường Cầu Ông Lãnh, Quận 1, TP.HCM", date: "2026-10-23", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "VIPGOLD", status: "Đã xử lý",
    items: [{ productId: 203, code: "SP-203", name: "Vợt Cầu Lông Yonex Astrox 100ZZ Kurenai", size: "4U-G5", color: "Kurenai Đỏ Thẫm", quantity: 1, price: 4250000, total: 4250000, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80" }],
    total: 4250000, note: "Căng cước 11kg giúp mình nhé"
  },
  {
    orderId: "SPORT-88204", customerId: "KH-004", customer: "Phạm Quốc Tuấn", phone: "0909123456", email: "tuankute@gmail.com",
    address: "88 Hoàng Diệu, Phường 12, Quận 4, TP.HCM", date: "2026-10-23", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 30000, voucherCode: "", status: "Đang giao",
    items: [{ productId: 204, code: "SP-204", name: "Áo Thun Tập Gym Nam Under Armour HeatGear Compression", size: "L", color: "Đen Carbon", quantity: 2, price: 750000, total: 1500000, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&auto=format&fit=crop&q=80" }],
    total: 1530000, note: ""
  },
  {
    orderId: "SPORT-88205", customerId: "KH-005", customer: "Võ Thị Bích Trâm", phone: "0977889900", email: "bichtram.vo@gmail.com",
    address: "45 Lê Văn Sỹ, Phường 13, Quận Phú Nhuận, TP.HCM", date: "2026-10-22", payment: "Thẻ Visa / Mastercard", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 205, code: "SP-205", name: "Giày Chạy Bộ Adidas Adizero Adios Pro 3", size: "40", color: "Trắng Sọc Đen Solar Red", quantity: 1, price: 5490000, total: 5490000, image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80" }],
    total: 5490000, note: "Gửi lễ tân tòa nhà"
  },
  {
    orderId: "SPORT-88206", customerId: "KH-006", customer: "Đặng Đình Khang", phone: "0944556677", email: "khangdang@gmail.com",
    address: "78 Nguyễn Thị Minh Khai, Phường Bến Nghé, Quận 1, TP.HCM", date: "2026-10-22", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 206, code: "SP-206", name: "Bóng Thi Đấu Cúp C1 Adidas UCL Pro 2026", size: "Size 5 Tiêu chuẩn", color: "Trắng Sao Vàng Xanh", quantity: 1, price: 2400000, total: 2400000, image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bf?w=400&auto=format&fit=crop&q=80" }],
    total: 2400000, note: "Bơm căng bóng giúp"
  },
  {
    orderId: "SPORT-88207", customerId: "KH-007", customer: "Hoàng Đức Huy", phone: "0918765432", email: "duchuy.hoang@gmail.com",
    address: "15 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM", date: "2026-10-21", payment: "Ví MoMo", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 207, code: "SP-207", name: "Vợt Tennis Wilson Pro Staff 97 v14", size: "Grip 2 (4 1/4)", color: "Nâu Đồng Ánh Kim Braid 45", quantity: 1, price: 4900000, total: 4900000, image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&auto=format&fit=crop&q=80" }],
    total: 4900000, note: "Giao hỏa tốc"
  },
  {
    orderId: "SPORT-88208", customerId: "KH-008", customer: "Ngô Mỹ Duyên", phone: "0923456789", email: "myduyen.ngo@gmail.com",
    address: "230 Hai Bà Trưng, Phường Tân Định, Quận 1, TP.HCM", date: "2026-10-21", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 25000, voucherCode: "", status: "Mới đặt",
    items: [{ productId: 208, code: "SP-208", name: "Đai Lưng Tập Gym Da Bò Thật Harbinger Pro 4 Inch", size: "S (65-75cm)", color: "Nâu Da Bò Tự Nhiên", quantity: 1, price: 890000, total: 890000, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80" }],
    total: 915000, note: ""
  },
  {
    orderId: "SPORT-88209", customerId: "KH-009", customer: "Bùi Anh Tuấn", phone: "0934567890", email: "anhtuan.bui@gmail.com",
    address: "64 Phan Xích Long, Phường 2, Quận Phú Nhuận, TP.HCM", date: "2026-10-20", payment: "Thẻ Visa / Mastercard", shippingFee: 0, voucherCode: "VIPGOLD", status: "Đã giao",
    items: [{ productId: 209, code: "SP-209", name: "Giày Chạy Bộ Asics Gel-Kayano 30", size: "42", color: "Xanh Dương / Cam", quantity: 1, price: 3990000, total: 3990000, image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80" }],
    total: 3990000, note: "Giao chiều từ 14h - 17h"
  },
  {
    orderId: "SPORT-88210", customerId: "KH-010", customer: "Phan Thị Thu Hà", phone: "0945678901", email: "thuha.phan@gmail.com",
    address: "91 Trần Hưng Đạo, Phường 5, Quận 5, TP.HCM", date: "2026-10-20", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 210, code: "SP-210", name: "Giày Đá Bóng Nike Mercurial Superfly 10 Elite FG", size: "41", color: "Xanh Glacier Blue", quantity: 1, price: 5790000, total: 5790000, image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&auto=format&fit=crop&q=80" }],
    total: 5790000, note: "Hàng giá trị cao đóng gói cẩn thận"
  },
  {
    orderId: "SPORT-88211", customerId: "KH-011", customer: "Trương Quang Hải", phone: "0956789012", email: "quanghai.truong@gmail.com",
    address: "112 Cách Mạng Tháng 8, Phường 7, Quận 3, TP.HCM", date: "2026-10-19", payment: "Ví MoMo", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 211, code: "SP-211", name: "Vợt Cầu Lông Lining Axforce 90 Max Hổ Ma", size: "4U-G5", color: "Đen Đỏ Hổ Ma Max", quantity: 1, price: 4100000, total: 4100000, image: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=400&auto=format&fit=crop&q=80" }],
    total: 4100000, note: "Đan cước BG65 Ti 11.5kg"
  },
  {
    orderId: "SPORT-88212", customerId: "KH-012", customer: "Đỗ Kim Ngân", phone: "0967890123", email: "kimngan.do@gmail.com",
    address: "55 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM", date: "2026-10-19", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã hủy",
    items: [{ productId: 212, code: "SP-212", name: "Bình Nước Giữ Nhiệt Thể Thao Nike Recharge 950ml", size: "950ml (32oz)", color: "Đen Nhám Chống Trượt", quantity: 1, price: 580000, total: 580000, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=80" }],
    total: 600000, note: "Khách đổi ý đặt mẫu khác"
  },
  {
    orderId: "SPORT-88213", customerId: "KH-013", customer: "Nguyễn Gia Bảo", phone: "0978901234", email: "giabao.nguyen@gmail.com",
    address: "33 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM", date: "2026-10-18", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 213, code: "SP-213", name: "Giày Bóng Rổ Nike LeBron XXI Akoya", size: "43", color: "Trắng Ngọc Trai Akoya", quantity: 1, price: 4990000, total: 4990000, image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&auto=format&fit=crop&q=80" }],
    total: 4990000, note: ""
  },
  {
    orderId: "SPORT-88214", customerId: "KH-014", customer: "Hồ Phương Linh", phone: "0989012345", email: "phuonglinh.ho@gmail.com",
    address: "182 Xô Viết Nghệ Tĩnh, Phường 21, Quận Bình Thạnh, TP.HCM", date: "2026-10-18", payment: "Ví MoMo", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 214, code: "SP-214", name: "Giày Chạy Trail Salomon Speedcross 6 Gore-Tex", size: "41", color: "Đen Xám Bùn Đất", quantity: 1, price: 3590000, total: 3590000, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&auto=format&fit=crop&q=80" }],
    total: 3590000, note: "Giao trước 18h"
  },
  {
    orderId: "SPORT-88215", customerId: "KH-015", customer: "Lý Thế Dân", phone: "0990123456", email: "thedan.ly@gmail.com",
    address: "77 Nguyễn Văn Cừ, Phường 2, Quận 5, TP.HCM", date: "2026-10-17", payment: "Thẻ Visa / Mastercard", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 215, code: "SP-215", name: "Găng Tay Thủ Môn Adidas Predator Pro Có Xương", size: "Size 9", color: "Đen Đỏ Solar Red", quantity: 1, price: 2500000, total: 2500000, image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&auto=format&fit=crop&q=80" }],
    total: 2500000, note: ""
  },
  {
    orderId: "SPORT-88216", customerId: "KH-016", customer: "Dương Thùy Chi", phone: "0901234567", email: "thuychi.duong@gmail.com",
    address: "40 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM", date: "2026-10-17", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 216, code: "SP-216", name: "Ống Cầu Lông Ba Sao Yonex Aerosensa 50 (12 Quả)", size: "Tốc độ 77", color: "Trắng Lông Ngỗng", quantity: 3, price: 780000, total: 2340000, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80" }],
    total: 2360000, note: "Giao tại văn phòng"
  },
  {
    orderId: "SPORT-88217", customerId: "KH-017", customer: "Mai Trọng Tấn", phone: "0913456780", email: "trongtan.mai@gmail.com",
    address: "89 Lý Thường Kiệt, Phường 7, Quận 10, TP.HCM", date: "2026-10-16", payment: "Chuyển khoản QR", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 217, code: "SP-217", name: "Dây Nhảy Thể Lực Tốc Độ Cao Rogue SR-1 Bearing", size: "Dài 3m", color: "Đen Nhám", quantity: 1, price: 390000, total: 390000, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80" }],
    total: 410000, note: ""
  },
  {
    orderId: "SPORT-88218", customerId: "KH-018", customer: "Vũ Bảo Ngọc", phone: "0924567891", email: "baongoc.vu@gmail.com",
    address: "14 Tô Hiến Thành, Phường 15, Quận 10, TP.HCM", date: "2026-10-16", payment: "Thẻ Visa / Mastercard", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 218, code: "SP-218", name: "Đồng Hồ Thể Thao GPS Garmin Forerunner 265", size: "Size 46mm Tiêu chuẩn", color: "Đen Viền Xám", quantity: 1, price: 11600000, total: 11600000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80" }],
    total: 11600000, note: "Kiểm tra kỹ hóa đơn bảo hành chính hãng"
  },
  {
    orderId: "SPORT-88219", customerId: "KH-019", customer: "Tạ Đình Phong", phone: "0935678902", email: "dinhphong.ta@gmail.com",
    address: "68 Ba Tháng Hai, Phường 12, Quận 10, TP.HCM", date: "2026-10-15", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 219, code: "SP-219", name: "Giày Đá Bóng Cỏ Nhân Tạo Nike Phantom GX 2 Pro TF", size: "42", color: "Đen Bạc Metallic", quantity: 1, price: 2700000, total: 2700000, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80" }],
    total: 2700000, note: ""
  },
  {
    orderId: "SPORT-88220", customerId: "KH-020", customer: "Cao Thanh Hằng", phone: "0946789013", email: "thanhhang.cao@gmail.com",
    address: "205 Nguyễn Tri Phương, Phường 9, Quận 5, TP.HCM", date: "2026-10-15", payment: "Ví MoMo", shippingFee: 0, voucherCode: "VIPGOLD", status: "Đã giao",
    items: [{ productId: 220, code: "SP-220", name: "Quần Bó Cơ Thể Thao Nam 2 Trong 1 Nike Dri-FIT Stride", size: "M", color: "Đen Tuyền", quantity: 2, price: 990000, total: 1980000, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=80" }],
    total: 1980000, note: ""
  },
  {
    orderId: "SPORT-88221", customerId: "KH-021", customer: "Phùng Vĩnh Thụy", phone: "0957890124", email: "vinhthuy.phung@gmail.com",
    address: "52 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM", date: "2026-10-14", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 221, code: "SP-221", name: "Túi Vợt Cầu Lông Yonex Pro Tournament Bag 9 Cây", size: "Kích thước lớn", color: "Xanh Navy Ánh Bạc", quantity: 1, price: 1990000, total: 1990000, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80" }],
    total: 1990000, note: "Giao giờ hành chính"
  },
  {
    orderId: "SPORT-88222", customerId: "KH-022", customer: "Trịnh Thảo Ly", phone: "0968901235", email: "thaoly.trinh@gmail.com",
    address: "135 Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM", date: "2026-10-14", payment: "Thẻ Visa / Mastercard", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 222, code: "SP-222", name: "Đệm Lót Tập Yoga Cao Su Tự Nhiên Lululemon 5mm", size: "5mm", color: "Đen Marble Đá Hoa Cương", quantity: 1, price: 1850000, total: 1850000, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&auto=format&fit=crop&q=80" }],
    total: 1850000, note: "Để tại bảo vệ nếu không có nhà"
  },
  {
    orderId: "SPORT-88223", customerId: "KH-023", customer: "Hà Minh Trí", phone: "0979012346", email: "minhtri.ha@gmail.com",
    address: "80 Lê Lai, Phường Bến Thành, Quận 1, TP.HCM", date: "2026-10-13", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 223, code: "SP-223", name: "Kính Bơi Thi Đấu Chống Đọng Sương Speedo Fastskin Pure Focus", size: "Freesize", color: "Tráng Gương Bạc Cầu Vồng", quantity: 1, price: 1600000, total: 1600000, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop&q=80" }],
    total: 1620000, note: ""
  },
  {
    orderId: "SPORT-88224", customerId: "KH-024", customer: "Đoàn Diệp Chi", phone: "0980123457", email: "diepchi.doan@gmail.com",
    address: "24 Trương Định, Phường Bến Thành, Quận 1, TP.HCM", date: "2026-10-13", payment: "Ví MoMo", shippingFee: 0, voucherCode: "", status: "Đã giao",
    items: [{ productId: 224, code: "SP-224", name: "Con Lăn Giãn Cơ Massage Bọt Xốp TriggerPoint GRID 1.0", size: "33cm", color: "Cam Rực Rỡ", quantity: 1, price: 820000, total: 820000, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80" }],
    total: 820000, note: ""
  },
  {
    orderId: "SPORT-88225", customerId: "KH-025", customer: "Nghiêm Xuân Mạnh", phone: "0991234568", email: "xuanmanh.nghiem@gmail.com",
    address: "115 Nguyễn Văn Trỗi, Phường 11, Quận Phú Nhuận, TP.HCM", date: "2026-10-12", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 225, code: "SP-225", name: "Giày Chạy Bộ Nam Puma Deviate Nitro 2", size: "42", color: "Xanh Lá Dạ Quang Puma", quantity: 1, price: 3700000, total: 3700000, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&auto=format&fit=crop&q=80" }],
    total: 3700000, note: "Giao sáng thứ 7"
  },
  {
    orderId: "SPORT-88226", customerId: "KH-026", customer: "Tô Kim Oanh", phone: "0902345678", email: "kimoanh.to@gmail.com",
    address: "42 Mạc Đĩnh Chi, Phường Đa Kao, Quận 1, TP.HCM", date: "2026-10-12", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 226, code: "SP-226", name: "Quần Bó Cơ Nữ Nâng Mông Gymshark Vital Seamless 2.0", size: "S", color: "Xám Khói Đốm", quantity: 1, price: 970000, total: 970000, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=80" }],
    total: 990000, note: ""
  },
  {
    orderId: "SPORT-88227", customerId: "KH-027", customer: "Lâm Hoàng Phúc", phone: "0914567892", email: "hoangphuc.lam@gmail.com",
    address: "98 Huỳnh Thúc Kháng, Phường Bến Nghé, Quận 1, TP.HCM", date: "2026-10-11", payment: "Ví MoMo", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 227, code: "SP-227", name: "Đai Đeo Hông Chạy Bộ Đựng Nước Aonijie W8101", size: "M/L", color: "Đen Phản Quang", quantity: 1, price: 390000, total: 390000, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80" }],
    total: 410000, note: ""
  },
  {
    orderId: "SPORT-88228", customerId: "KH-028", customer: "Khổng Tú Quỳnh", phone: "0925678903", email: "tuquynh.khong@gmail.com",
    address: "17 Phùng Khắc Khoan, Phường Đa Kao, Quận 1, TP.HCM", date: "2026-10-11", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 228, code: "SP-228", name: "Bọc Ống Đồng Bóng Đá Carbon Siêu Nhẹ Nike Mercurial Lite", size: "M", color: "Đen Bạc Mercurial", quantity: 1, price: 580000, total: 580000, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80" }],
    total: 600000, note: ""
  },
  {
    orderId: "SPORT-88229", customerId: "KH-029", customer: "Châu Vĩnh Phú", phone: "0936789014", email: "vinhphu.chau@gmail.com",
    address: "63 Trần Quang Khải, Phường Tân Định, Quận 1, TP.HCM", date: "2026-10-10", payment: "Chuyển khoản QR", shippingFee: 0, voucherCode: "FREESHIP", status: "Đã giao",
    items: [{ productId: 229, code: "SP-229", name: "Bóng Rổ Da Thi Đấu Trong Nhà & Ngoài Trời Molten GG7X", size: "Size 7", color: "Cam Nâu Viền Vàng 12 Mảnh", quantity: 1, price: 1150000, total: 1150000, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80" }],
    total: 1150000, note: "Bơm đủ áp suất giúp em"
  },
  {
    orderId: "SPORT-88230", customerId: "KH-030", customer: "Đặng Thùy Trang", phone: "0947890125", email: "thuytrang.dang@gmail.com",
    address: "190 Cô Bắc, Phường Cô Giang, Quận 1, TP.HCM", date: "2026-10-10", payment: "Thanh toán khi nhận hàng (COD)", shippingFee: 20000, voucherCode: "", status: "Đã giao",
    items: [{ productId: 230, code: "SP-230", name: "Quả Cầu Mây Thi Đấu Marathon MT.908", size: "Tiêu chuẩn thi đấu", color: "Vàng Nâu Marathon", quantity: 2, price: 300000, total: 600000, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80" }],
    total: 620000, note: ""
  }
];