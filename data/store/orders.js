var orders = [
  {
    orderId: "SPORT-88234",
    customerId: "KH-001",
    customer: "Trần Hùng Tín",
    phone: "0912345678",
    email: "hungtintran89@gmail.com",
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
    date: "2026-10-08",
    payment: "Ví MoMo",
    shippingFee: 0,
    voucherCode: "FREESHIP",
    status: "Đang giao",
    items: [
      {
        productId: 201,
        code: "SP-201",
        name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto",
        size: "42",
        color: "Trắng / Đỏ Cam Proto",
        quantity: 1,
        price: 5290000,
        total: 5290000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 5290000,
    note: "Giao giờ hành chính, gọi trước khi giao 15 phút"
  },
  {
    orderId: "SPORT-88235",
    customerId: "KH-002",
    customer: "Lê Minh Hoàng",
    phone: "0987654321",
    email: "leminhhoang@gmail.com",
    address: "105 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    date: "2026-10-08",
    payment: "Thanh toán khi nhận hàng (COD)",
    shippingFee: 25000,
    voucherCode: "",
    status: "Mới đặt",
    items: [
      {
        productId: 202,
        code: "SP-202",
        name: "Giày Đá Bóng Adidas Predator Elite FG",
        size: "41",
        color: "Đỏ Đen Predator Solar Red",
        quantity: 1,
        price: 3150000,
        total: 3150000,
        image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80"
      },
      {
        productId: 215,
        code: "SP-215",
        name: "Áo Đấu Đội Tuyển Bóng Đá Adidas Tiro 24 Match",
        size: "L",
        color: "Đỏ Scarlet",
        quantity: 1,
        price: 790000,
        total: 790000,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 3965000,
    note: "Kiểm tra kỹ size giày 41 và tem chính hãng trước khi đóng gói"
  },
  {
    orderId: "SPORT-88230",
    customerId: "KH-003",
    customer: "Nguyễn Thị Mai",
    phone: "0933221100",
    email: "nguyenmai@gmail.com",
    address: "12 Võ Văn Kiệt, Phường Cầu Ông Lãnh, Quận 1, TP.HCM",
    date: "2026-10-07",
    payment: "Chuyển khoản QR ngân hàng",
    shippingFee: 0,
    voucherCode: "SPORT50K",
    status: "Đã xử lý",
    items: [
      {
        productId: 203,
        code: "SP-203",
        name: "Vợt Cầu Lông Yonex Astrox 100ZZ Kurenai",
        size: "4U-G5 (83g)",
        color: "Kurenai Đỏ Thẫm",
        quantity: 1,
        price: 4200000,
        total: 4200000,
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80"
      },
      {
        productId: 219,
        code: "SP-219",
        name: "Quả Cầu Lông Thi Đấu Yonex Aerosensa 50 (Hộp 12 quả)",
        size: "Tốc độ 77",
        color: "Lông ngỗng trắng",
        quantity: 2,
        price: 580000,
        total: 1160000,
        image: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 5310000,
    note: "Căng cước sẵn cước BG65Ti lực căng 10.5kg giúp mình"
  },
  {
    orderId: "SPORT-88219",
    customerId: "KH-004",
    customer: "Phạm Quốc Tuấn",
    phone: "0909123456",
    email: "tuankute@gmail.com",
    address: "45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
    date: "2026-10-06",
    payment: "Thanh toán khi nhận hàng (COD)",
    shippingFee: 25000,
    voucherCode: "",
    status: "Đã giao",
    items: [
      {
        productId: 207,
        code: "SP-207",
        name: "Bộ Quần Áo Đấu Dri-FIT Pro Match Bó Cơ",
        size: "XL",
        color: "Đen Carbon Stealth",
        quantity: 1,
        price: 950000,
        total: 950000,
        image: "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=400&auto=format&fit=crop&q=80"
      },
      {
        productId: 222,
        code: "SP-222",
        name: "Đai Lưng Cứng Nâng Tạ Deadlift Harbinger Pro 6-inch",
        size: "Size L",
        color: "Đen Thể Thao",
        quantity: 1,
        price: 890000,
        total: 890000,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 1865000,
    note: "Khách đã nhận hàng và thanh toán đủ tiền mặt"
  },
  {
    orderId: "SPORT-88215",
    customerId: "KH-005",
    customer: "Đặng Hoàng Nam",
    phone: "0918765432",
    email: "namdang@gmail.com",
    address: "88 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    date: "2026-10-04",
    payment: "Thanh toán khi nhận hàng (COD)",
    shippingFee: 25000,
    voucherCode: "",
    status: "Đã hủy",
    items: [
      {
        productId: 205,
        code: "SP-205",
        name: "Giày Chạy Bộ Adidas Adizero Adios Pro 3",
        size: "43",
        color: "Trắng Phấn",
        quantity: 1,
        price: 5490000,
        total: 5490000,
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 5515000,
    note: "Khách hàng đổi ý mua phiên bản Alphafly 3 nên đã gọi hotline xin hủy đơn"
  },
  {
    orderId: "SPORT-88240",
    customerId: "KH-006",
    customer: "Vũ Thùy Trang",
    phone: "0971239876",
    email: "thuytrang@gmail.com",
    address: "18 Phố Hàng Bài, Hoàn Kiếm, Hà Nội",
    date: "2026-10-09",
    payment: "Thẻ tín dụng / Ghi nợ quốc tế (Visa/Mastercard)",
    shippingFee: 0,
    voucherCode: "VIPGOLD",
    status: "Đã giao",
    items: [
      {
        productId: 208,
        code: "SP-208",
        name: "Đồng Hồ Thông Minh Thể Thao Garmin Forerunner 265",
        size: "Bản 42mm (Forerunner 265S)",
        color: "Trắng Dây Xanh Aqua",
        quantity: 1,
        price: 8990000,
        total: 8990000,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop&q=80"
      },
      {
        productId: 225,
        code: "SP-225",
        name: "Bình Nước Giữ Nhiệt Thể Thao Titan Sport Hydro 1000ml",
        size: "1000ml",
        color: "Bạc Inox",
        quantity: 1,
        price: 420000,
        total: 420000,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 8410000,
    note: "Giao hỏa tốc 2 giờ tại Hà Nội"
  },
  {
    orderId: "SPORT-88242",
    customerId: "KH-001",
    customer: "Trần Hùng Tín",
    phone: "0912345678",
    email: "hungtintran89@gmail.com",
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
    date: "2026-10-10",
    payment: "Ví MoMo",
    shippingFee: 0,
    voucherCode: "RUNNER10",
    status: "Mới đặt",
    items: [
      {
        productId: 209,
        code: "SP-209",
        name: "Giày Chạy Bộ Nike Air Zoom Alphafly 3 Blueprint",
        size: "42",
        color: "Trắng Blueprint / Cam Neon",
        quantity: 1,
        price: 6990000,
        total: 6990000,
        image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=400&auto=format&fit=crop&q=80"
      },
      {
        productId: 212,
        code: "SP-212",
        name: "Áo Khoác Gió Nike Windrunner Repel Running",
        size: "L",
        color: "Đen Xám Chevron",
        quantity: 1,
        price: 1890000,
        total: 1890000,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80"
      }
    ],
    total: 8580000,
    note: "Hội viên Gold đặt trước phiên bản giới hạn Blueprint"
  }
];

var MOCK_ORDERS = orders;
