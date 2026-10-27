/**
 * ==============================================================================
 * SPORTSTORE - BỘ CƠ SỞ DỮ LIỆU CHUẨN THỰC TẾ & TƯƠNG TÁC TOÀN HỆ THỐNG
 * File: data/sportstore_data.js
 * ==============================================================================
 * ĐẶC ĐIỂM KỸ THUẬT:
 *  - 100% Chạy trực tiếp trên trình duyệt (file:///), không phát sinh lỗi CORS.
 *  - Đồng bộ tự động 2 chiều với LocalStorage theo chuẩn Bareme đồ án môn học SGU.
 *  - Cung cấp dữ liệu thể thao THẬT từ các thương hiệu chính hãng hàng đầu:
 *    Nike, Adidas, Puma, Yonex, Wilson, Garmin, Under Armour, Harbinger.
 *  - Tương thích 100% với 5 phân hệ sinh viên (Dev 1, 2, 3, 4, 5) & Admin Dashboard:
 *    + Dev 1: Hero Banners, Flash Sale Giờ Vàng, Top Trending Tabs
 *    + Dev 2: Danh mục môn thể thao, Catalog 28+ sản phẩm, Bộ lọc 4 tiêu chí, Live Search
 *    + Dev 3: Thư viện ảnh zoom đa góc nhìn, Thông số kỹ thuật đối kháng so sánh 3 sản phẩm
 *    + Dev 4: Giỏ hàng tính tiền động, Hệ thống Voucher giảm giá & Bảng cước vận chuyển
 *    + Dev 5: Hồ sơ hội viên, Sổ địa chỉ nhận hàng, Timeline đơn hàng, Accordion FAQ
 *    + Admin: 4 Thẻ KPI, Quản lý sản phẩm CRUD, Quản lý nhập hàng, Quản lý đơn hàng,
 *             Quản lý khách hàng, Quản lý giá bán, Quản lý tồn kho & Báo cáo NXT.
 * ==============================================================================
 */

// ============================================================================
// 1. DANH MỤC CÁC BỘ MÔN THỂ THAO (CATEGORIES)
// ============================================================================
var categories = [
  {
    id: "CAT-RUN",
    code: "RUN",
    icon: "👟",
    name: "Chạy Bộ",
    slug: "chay-bo",
    desc: "Giày chạy marathon đệm carbon siêu nhẹ, quần áo thoáng khí Dri-FIT, đai nước và phụ kiện chạy bộ đường dài",
    profitPercent: 30, // % lợi nhuận chuẩn phục vụ Tab Quản lý giá bán
    itemCount: 8,
    status: "active",
    banner:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "CAT-FOOTBALL",
    code: "FOOTBALL",
    icon: "⚽",
    name: "Bóng Đá",
    slug: "bong-da",
    desc: "Giày đinh thi đấu sân tự nhiên FG / cỏ nhân tạo TF, bóng tiêu chuẩn FIFA Quality Pro, găng tay thủ môn và bọc ống đồng",
    profitPercent: 25,
    itemCount: 6,
    status: "active",
    banner:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "CAT-RACKET",
    code: "RACKET",
    icon: "🏸",
    name: "Cầu Lông - Tennis",
    slug: "cau-long-tennis",
    desc: "Vợt carbon trợ lực siêu nảy, quả cầu lông ba sao tiêu chuẩn quốc tế, bóng tennis chịu áp lực và túi đựng vợt chuyên dụng",
    profitPercent: 25,
    itemCount: 6,
    status: "active",
    banner:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "CAT-GYM",
    code: "GYM",
    icon: "🏋️",
    name: "Gym & Fitness",
    slug: "gym-fitness",
    desc: "Trang phục bó cơ thể hình Pro Compression, đai lưng deadlift, găng tay hỗ trợ cổ tay, con lăn giãn cơ và phụ kiện tập gym",
    profitPercent: 35,
    itemCount: 4,
    status: "active",
    banner:
      "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "CAT-ACCESSORY",
    code: "ACCESSORY",
    icon: "⌚",
    name: "Phụ Kiện Thể Thao",
    slug: "phu-kien-the-thao",
    desc: "Đồng hồ GPS thể thao đa băng tần đo VO2 Max, bình nước giữ nhiệt titan, balo chống nước và băng cuốn khớp thể thao",
    profitPercent: 40,
    itemCount: 4,
    status: "active",
    banner:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&auto=format&fit=crop&q=80",
  },
];

// ============================================================================
// 2. DANH SÁCH 28+ SẢN PHẨM THỂ THAO THẬT CHI TIẾT (PRODUCTS)
// Gồm đầy đủ thông số cho cả 5 Dev:
// - Giá vốn, % Lợi nhuận, Giá niêm yết (Admin CRUD & Quản lý giá)
// - Số lượng tồn kho (Có sản phẩm <= 5 món để kích hoạt cảnh báo tồn kho đỏ)
// - Gallery ảnh đa góc nhìn & Specs đối kháng (Dev 3 Chi tiết & So sánh)
// - Sizes, Colors, Tùy chọn (Dev 4 Giỏ hàng)
// ============================================================================
var products = [
  // --------------------------------------------------------------------------
  // MÔN: CHẠY BỘ (CAT-RUN)
  // --------------------------------------------------------------------------
  {
    id: 201,
    code: "SP-201",
    name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 4000000,
    profitPercent: 32.25,
    price: 5290000,
    salePrice: 4890000,
    discount: "-8%",
    stock: 18,
    sold: 142,
    rating: 4.9,
    reviewCount: 98,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43", "44"],
    colors: ["Trắng / Đỏ Cam Proto", "Xanh Neon / Đen", "Hồng Hyper Pink"],
    desc: "Siêu phẩm giày chạy marathon hàng đầu thế giới với đệm ZoomX toàn phần kết hợp đĩa đệm sợi carbon Flyplate tạo lực đẩy bứt phá trên từng bước chạy.",
    features: [
      "Đệm bọt ZoomX hoàn trả năng lượng lên tới 85%",
      "Đĩa đệm sợi carbon Flyplate nguyên khối gia tăng độ ổn định",
      "Thân giày Flyknit dạng lưới siêu thoáng khí thoát mồ hôi tối đa",
      "Trọng lượng siêu nhẹ chỉ 198g (Size 42)",
    ],
    specs: {
      weight: "198g",
      cushion: "Bọt ZoomX siêu nhẹ",
      plate: "Đĩa sợi carbon Flyplate toàn phần",
      surface: "Đường chạy nhựa Road / Marathon",
      drop: "8mm (38mm gót / 30mm mũi)",
      level: "Vận động viên thi đấu chuyên nghiệp",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 205,
    code: "SP-205",
    name: "Giày Chạy Bộ Adidas Adizero Adios Pro 3",
    brand: "Adidas",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 4200000,
    profitPercent: 30.71,
    price: 5490000,
    salePrice: 4990000,
    discount: "-9%",
    stock: 15,
    sold: 118,
    rating: 4.9,
    reviewCount: 76,
    image:
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["40", "40.5", "41", "42", "42.5", "43", "44"],
    colors: [
      "Trắng Phấn / Xanh Core Black",
      "Xanh Solar Green",
      "Đỏ Flash Red",
    ],
    desc: "Trang bị đệm 2 lớp bọt Lightstrike Pro kết hợp hệ thống thanh carbon Energyrods 2.0 tối ưu hóa chuyển động chân trên cự ly bán marathon và full marathon.",
    features: [
      "Hệ thống thanh carbon Energyrods 2.0 mô phỏng cấu trúc xương bàn chân",
      "Đệm 2 tầng Lightstrike Pro nảy tối đa",
      "Đế ngoài cao su Continental bám đường tuyệt đối kể cả khi trời mưa",
      "Upper Celermesh 2.0 siêu mỏng dẻo dai",
    ],
    specs: {
      weight: "215g",
      cushion: "Đệm kép Lightstrike Pro",
      plate: "Thanh Carbon Energyrods 2.0",
      surface: "Đường nhựa Road / Marathon 42km",
      drop: "6.5mm (39.5mm gót / 33mm mũi)",
      level: "Thi đấu Elite & Sub-3 Marathon",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 209,
    code: "SP-209",
    name: "Giày Chạy Bộ Nike Air Zoom Alphafly 3 Blueprint",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 5300000,
    profitPercent: 31.89,
    price: 6990000,
    salePrice: 6590000,
    discount: "-6%",
    stock: 8,
    sold: 84,
    rating: 5.0,
    reviewCount: 62,
    image:
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43"],
    colors: ["Trắng Blueprint / Cam Neon", "Đen Huyền Bí Volt"],
    desc: "Đỉnh cao công nghệ marathon thế kỷ 21 do kỷ lục gia Kelvin Kiptum từng thiết lập kỷ lục thế giới. Túi đệm khí kép Zoom Air phía trước mũi giày cho lực bật vô tiền khoáng hậu.",
    features: [
      "2 túi đệm khí Zoom Air pods độc lập tăng tốc độ phóng chân",
      "Đế đệm ZoomX đúc liền khối nguyên bản hỗ trợ chuyển tiếp mượt mà",
      "Thân dệt Atomknit 3.0 ôm chân hoàn hảo",
      "Trọng lượng nhẹ hơn thế hệ Alphafly 2 tới 15%",
    ],
    specs: {
      weight: "204g",
      cushion: "Đệm ZoomX đúc khối + Kép Zoom Air Pods",
      plate: "Đĩa Carbon Flyplate uốn cong hình học",
      surface: "Đường chạy bằng phẳng tiêu chuẩn Olympic",
      drop: "8mm (40mm gót / 32mm mũi)",
      level: "Siêu sao tốc độ & Chinh phục kỷ lục",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 210,
    code: "SP-210",
    name: "Giày Chạy Bộ Nam Nike Pegasus 41 ReactX",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 2800000,
    profitPercent: 35.36,
    price: 3790000,
    salePrice: 3290000,
    discount: "-13%",
    stock: 28,
    sold: 215,
    rating: 4.8,
    reviewCount: 140,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43", "44", "45"],
    colors: ["Xanh Glacier Blue", "Đen Trắng Classic", "Xám Wolf Grey"],
    desc: "Chiến mã luyện tập hàng ngày (Daily Trainer) bền bỉ số 1 thế giới với công nghệ đệm bọt mới ReactX giảm 43% lượng khí thải carbon và tăng 13% độ hoàn trả lực.",
    features: [
      "Bọt ReactX mới kết hợp túi đệm Air Zoom ở cả gót và mũi chân",
      "Vải lưới kỹ thuật thoáng khí đa vùng",
      "Đế ngoài Waffle bền bỉ trên 1000km luyện tập",
      "Cổ giày đệm êm ái bảo vệ gân Achilles",
    ],
    specs: {
      weight: "272g",
      cushion: "Đệm ReactX bọt thân thiện môi trường + Air Zoom",
      plate: "Không sử dụng đĩa carbon (Êm ái tự nhiên)",
      surface: "Đường nhựa, Máy chạy bộ gym, Công viên",
      drop: "10mm (37mm gót / 27mm mũi)",
      level: "Luyện tập hàng ngày từ 5km đến 21km",
    },
    status: "active",
    featured: false,
    isNew: true,
    isHot: false,
  },
  {
    id: 211,
    code: "SP-211",
    name: "Giày Chạy Bộ Nike Invincible 3 Max Cushion",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 3400000,
    profitPercent: 32.06,
    price: 4490000,
    salePrice: 3990000,
    discount: "-11%",
    stock: 22,
    sold: 95,
    rating: 4.8,
    reviewCount: 52,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["40", "41", "42", "42.5", "43", "44"],
    colors: ["Trắng Tinh Khôi / Đế Xanh", "Đen Nhám Triple Black"],
    desc: "Dòng giày siêu đệm dày dặn êm ái nhất của Nike với khối bọt ZoomX khổng lồ, bảo vệ khớp gối và cơ bắp sau các bài chạy dài mệt mỏi.",
    features: [
      "Khối đệm bọt ZoomX cực dày hấp thụ xung lực tuyệt hảo",
      "Thân Flyknit cải tiến ôm chắc mu bàn chân",
      "Đế bè rộng chống lật cổ chân khi tiếp đất",
      "Giảm tải đau mỏi cơ sau các buổi chạy nặng",
    ],
    specs: {
      weight: "295g",
      cushion: "ZoomX Max Cushioning độ nảy cao",
      plate: "Đế bè ổn định",
      surface: "Đường nhựa Road / Chạy phục hồi Recovery",
      drop: "9mm (40mm gót / 31mm mũi)",
      level: "Chạy phục hồi & Người mới bắt đầu bảo vệ khớp",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 212,
    code: "SP-212",
    name: "Áo Khoác Gió Nike Windrunner Repel Running",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 1350000,
    profitPercent: 40.0,
    price: 1890000,
    salePrice: 1490000,
    discount: "-21%",
    stock: 35,
    sold: 178,
    rating: 4.8,
    reviewCount: 64,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Đen Xám Chevron", "Xanh Rêu Olive", "Trắng Bạc Phản Quang"],
    desc: "Áo khoác chạy bộ huyền thoại hình chữ V Chevron với chất liệu vải dệt phủ lớp chống thấm nước Repel và cản gió siêu việt, gấp gọn thành túi tiện lợi.",
    features: [
      "Vải tái chế 100% kháng nước Repel và cản gió lạnh",
      "Khe thông gió phía sau lưng thoát hơi nhiệt",
      "Họa tiết phản quang 3M phát sáng trong đêm bảo vệ runner",
      "Có thể xếp gọn gàng vào túi áo trong",
    ],
    specs: {
      weight: "140g",
      material: "100% Polyester tái chế",
      waterproof: "Kháng mưa phùn & Cản gió bão",
      ventilation: "Khe đối lưu luồng khí lưng áo",
      level: "Tất cả cự ly đường chạy ngoài trời",
    },
    status: "active",
    featured: false,
    isNew: true,
    isHot: false,
  },
  {
    id: 228,
    code: "SP-228",
    name: "Giày Chạy Địa Hình Nike Wildhorse 8 Trail",
    brand: "Nike",
    categoryId: "CAT-RUN",
    category: "Chạy Bộ",
    costPrice: 2600000,
    profitPercent: 34.23,
    price: 3490000,
    salePrice: 2990000,
    discount: "-14%",
    stock: 10,
    sold: 34,
    rating: 4.7,
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["40", "41", "42", "43"],
    colors: ["Nâu Đất Cam Địa Hình", "Xanh Rừng Khói"],
    desc: "Giày chạy đường mòn việt dã (Trail Running) với đệm Nike React đàn hồi và đinh đế cao su chống trượt trên bùn lầy, đá sỏi hiểm trở.",
    features: [
      "Đệm Nike React nhạy bén trên nền địa hình không bằng phẳng",
      "Đế gai đinh đa hướng chống trượt dốc",
      "Mũi giày bọc bảo vệ ngón chân chống va đập đá sỏi",
      "Cổ giày co giãn ngăn đất cát lọt vào trong",
    ],
    specs: {
      weight: "320g",
      cushion: "Nike React đàn hồi cao",
      plate: "Tấm chắn đá Rock Plate bảo vệ lòng bàn chân",
      surface: "Đường mòn Trail / Bùn đất / Leo núi dốc",
      drop: "8mm",
      level: "Chạy Trail việt dã 21km - 70km",
    },
    status: "hidden", // Test trạng thái ẩn/hiện sản phẩm trong Admin
    featured: false,
    isNew: false,
    isHot: false,
  },

  // --------------------------------------------------------------------------
  // MÔN: BÓNG ĐÁ (CAT-FOOTBALL)
  // --------------------------------------------------------------------------
  {
    id: 202,
    code: "SP-202",
    name: "Giày Đá Bóng Adidas Predator Elite FG",
    brand: "Adidas",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 2400000,
    profitPercent: 31.25,
    price: 3150000,
    salePrice: 2850000,
    discount: "-10%",
    stock: 25,
    sold: 165,
    rating: 4.8,
    reviewCount: 112,
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43"],
    colors: [
      "Đỏ Đen Predator Solar Red",
      "Trắng Bạch Kim Pearl",
      "Đen Core Black",
    ],
    desc: "Trang bị gai cao su công nghệ vân nổi Strikeskin ở mu giày giúp tạo độ xoáy và kiểm soát bóng chính xác đến từng milimet, đế Controlframe 2.0 bám sân cỏ tự nhiên.",
    features: [
      "Vân cao su Strikeskin gia tăng ma sát tạo quỹ đạo bóng hiểm hóc",
      "Cổ thun Primeknit ôm sát không gây cọ xát mắt cá",
      "Khung đế Controlframe 2.0 trọng lượng nhẹ chuyển hướng linh hoạt",
      "Đinh tán chuyên dụng cho sân cỏ tự nhiên 11 người",
    ],
    specs: {
      weight: "205g",
      upper: "Chất liệu sợi tổng hợp dệt HybridTouch 2.0",
      sole: "Khung Controlframe 2.0",
      studs: "Đinh FG (Firm Ground) cỏ tự nhiên",
      player: "Tiền vệ kiến thiết & Tiền đạo dứt điểm",
    },
    status: "active",
    featured: true,
    isNew: false,
    isHot: true,
  },
  {
    id: 206,
    code: "SP-206",
    name: "Quả Bóng Đá Chuẩn Thi Đấu Puma Orbita FIFA Quality Pro",
    brand: "Puma",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 600000,
    profitPercent: 41.67,
    price: 850000,
    salePrice: 665000,
    discount: "-22%",
    stock: 40,
    sold: 230,
    rating: 4.9,
    reviewCount: 88,
    image:
      "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Size 5 (Tiêu chuẩn FIFA)"],
    colors: ["Trắng / Đỏ Cam La Liga", "Vàng Chanh Mùa Đông"],
    desc: "Quả bóng thi đấu chính thức của giải bóng đá vô địch quốc gia Tây Ban Nha La Liga, bề mặt PU 1.2mm dập nổi 3D kết dính không đường may (THB) cho quỹ đạo bay ổn định chuẩn xác.",
    features: [
      "Đạt chứng chỉ cao nhất FIFA Quality Pro",
      "Cấu trúc 12 tấm đồng đều giảm thiểu lực cản không khí",
      "Lớp bọt xốp POE mật độ cao giữ hình dạng tròn tuyệt hảo",
      "Ruột cao su với van Air Lock giữ hơi gấp 3 lần bóng thông thường",
    ],
    specs: {
      weight: "430g ± 10g",
      circumference: "68.5 - 69.5 cm",
      pressure: "0.8 - 1.0 bar (Chuẩn thi đấu)",
      material: "3D textured PU 1.2mm dập nhiệt",
      level: "Thi đấu chuyên nghiệp & Giải đấu chính thức",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 213,
    code: "SP-213",
    name: "Giày Đá Bóng Adidas F50 Elite FG Fast Reborn",
    brand: "Adidas",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 2700000,
    profitPercent: 32.96,
    price: 3590000,
    salePrice: 3190000,
    discount: "-11%",
    stock: 16,
    sold: 72,
    rating: 4.9,
    reviewCount: 45,
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43"],
    colors: ["Vàng Tắc Kè Solar Yellow", "Trắng Cam Tốc Độ"],
    desc: "Sự trở lại của dòng giày huyền thoại F50 dành riêng cho những sát thủ chạy cánh và tiền đạo tốc độ như Lionel Messi với thân giày Fibertouch siêu mỏng nhẹ.",
    features: [
      "Vải thân Fibertouch nhẹ tựa lông hồng",
      "Lưỡi gà liền nén co giãn Tunnel Tongue khóa chặt bàn chân",
      "Đế ngoài Sprintframe 360 bứt tốc xé gió trong tích tắc",
      "Hỗ trợ tăng tốc ở cự ly ngắn bứt phá hậu vệ",
    ],
    specs: {
      weight: "182g (Cực nhẹ)",
      upper: "Fibertouch với kết cấu Sprintweb 3D",
      sole: "Sprintframe 360 đinh vát hình học",
      studs: "Đinh FG sân cỏ tự nhiên",
      player: "Cầu thủ tốc độ chạy cánh & Tiền đạo",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 214,
    code: "SP-214",
    name: "Giày Đá Bóng Sân Cỏ Nhân Tạo Adidas Copa Pure 2 Pro TF",
    brand: "Adidas",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 1800000,
    profitPercent: 32.78,
    price: 2390000,
    salePrice: 1990000,
    discount: "-17%",
    stock: 30,
    sold: 188,
    rating: 4.8,
    reviewCount: 94,
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43", "44"],
    colors: ["Trắng Tinh Khôi Mạ Bạc", "Đen Da Bò Cổ Điển"],
    desc: "Da bò thật cao cấp êm mềm cho cảm giác bóng chân thật tuyệt đối, đế đinh dăm cao su TF chuyên dụng bám sân cỏ nhân tạo Việt Nam chống trơn trượt.",
    features: [
      "Mũi giày da bê Fusionskin thật siêu êm mềm",
      "Bộ đệm xốp EVA giảm lực chấn thương mắt cá và đầu gối",
      "Đinh dăm cao su TF bám chặt mặt cỏ nhân tạo 5-7 người",
      "Độ bền cực cao phù hợp bóng đá phong trào",
    ],
    specs: {
      weight: "250g",
      upper: "Da bò Fusionskin tự nhiên cao cấp",
      cushion: "Đệm EVA hấp thụ phản lực",
      studs: "Đinh dăm cao su TF (Turf)",
      player: "Sân cỏ nhân tạo 5 người và 7 người",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: true,
  },
  {
    id: 215,
    code: "SP-215",
    name: "Áo Đấu Đội Tuyển Bóng Đá Adidas Tiro 24 Match",
    brand: "Adidas",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 550000,
    profitPercent: 43.64,
    price: 790000,
    salePrice: 590000,
    discount: "-25%",
    stock: 45,
    sold: 140,
    rating: 4.7,
    reviewCount: 42,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Xanh Dương Hoàng Gia", "Đỏ Scarlet", "Trắng Tinh"],
    desc: "Áo thi đấu bóng đá chuyên nghiệp với công nghệ AEROREADY kiểm soát độ ẩm, giữ cho cầu thủ luôn khô ráo và nhẹ nhàng suốt 90 phút căng thẳng trên sân.",
    features: [
      "Công nghệ thấm hút mồ hôi độc quyền AEROREADY",
      "Mảng lưới đối lưu bên sườn giải phóng nhiệt lượng",
      "Cổ chữ V hiện đại không gây cản trở khi thi đấu",
      "Chống phai màu khi giặt máy nhiều lần",
    ],
    specs: {
      weight: "135g",
      material: "100% Interlock Polyester tái chế",
      technology: "AEROREADY Moisture Wicking",
      level: "Tập luyện và thi đấu giải phong trào",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 216,
    code: "SP-216",
    name: "Giày Đá Bóng Puma Future 7 Ultimate FG/AG",
    brand: "Puma",
    categoryId: "CAT-FOOTBALL",
    category: "Bóng Đá",
    costPrice: 2150000,
    profitPercent: 34.42,
    price: 2890000,
    salePrice: 2490000,
    discount: "-14%",
    stock: 19,
    sold: 86,
    rating: 4.8,
    reviewCount: 38,
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["40", "41", "42", "42.5", "43"],
    colors: ["Hồng Bột Neon Pink", "Trắng Xanh Mint"],
    desc: "Vũ khí của siêu sao Neymar Jr với dải băng nén FUZIONFIT360 thích ứng thông minh ôm trọn bàn chân, cho phép đá có dây hoặc không dây tùy ý.",
    features: [
      "Công nghệ dải đàn hồi kép FUZIONFIT360 ôm khít mu bàn chân",
      "Gân dập nổi 3D PWRTAPE gia cường lực sút xa",
      "Đế Dynamic Motion System siêu linh hoạt khi đảo người ngoặt bóng",
      "Đinh lai FG/AG đa năng chơi được cả cỏ tự nhiên và nhân tạo dày",
    ],
    specs: {
      weight: "210g",
      upper: "Lưới dệt FUZIONFIT360 + PWRTAPE",
      sole: "Dynamic Motion System",
      studs: "Đinh đa năng FG/AG",
      player: "Kỹ thuật đi bóng lắt léo & Rê dắt sáng tạo",
    },
    status: "active",
    featured: false,
    isNew: true,
    isHot: false,
  },

  // --------------------------------------------------------------------------
  // MÔN: CẦU LÔNG - TENNIS (CAT-RACKET)
  // --------------------------------------------------------------------------
  {
    id: 203,
    code: "SP-203",
    name: "Vợt Cầu Lông Yonex Astrox 100ZZ Kurenai",
    brand: "Yonex",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 3300000,
    profitPercent: 27.27,
    price: 4200000,
    salePrice: 3890000,
    discount: "-7%",
    stock: 12,
    sold: 145,
    rating: 5.0,
    reviewCount: 104,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["3U-G5 (88g)", "4U-G5 (83g)"],
    colors: ["Kurenai Đỏ Thẫm", "Xanh Rêu Dark Navy"],
    desc: "Cây vợt tấn công đỉnh cao thế giới do tay vợt Viktor Axelsen sử dụng, thân vợt siêu mỏng Hyper Slim Shaft và khung Isometric mở rộng điểm ngọt cho cú smash uy lực sấm sét.",
    features: [
      "Trục vợt đặc Hyper Slim Shaft mỏng nhất lịch sử Yonex",
      "Hệ thống phân bổ trọng lực Rotational Generator System chuyển thế công thủ thần tốc",
      "Vật liệu carbon Namd thế hệ mới tăng độ uốn và lưu giữ lực smash",
      "Chụp mũ vợt E.B. CAP PLUS tối đa hóa hiệu suất vung vợt",
    ],
    specs: {
      weight: "4U (83g) / 3U (88g)",
      balance: "Nặng đầu (Head Heavy) chuyên công",
      stiffness: "Rất cứng (Extra Stiff)",
      tension: "20 - 28 lbs (Căng tối đa 12.5kg)",
      level: "Người chơi khá giỏi & VĐV thi đấu chuyên nghiệp",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 204,
    code: "SP-204",
    name: "Vợt Tennis Wilson Pro Staff 97 v14 Roger Federer",
    brand: "Wilson",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 3800000,
    profitPercent: 31.31,
    price: 4990000,
    salePrice: 4590000,
    discount: "-8%",
    stock: 3, // CẢNH BÁO TỒN KHO <= 5 (ĐỂ TEST ADMIN TAB 8)
    sold: 58,
    rating: 4.9,
    reviewCount: 36,
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Cán 2 (4 1/4)", "Cán 3 (4 3/8)"],
    colors: ["Đồng Ánh Kim Bronze / Đen Nhám"],
    desc: "Kiệt tác thiết kế mang tính biểu tượng đồng hành cùng huyền thoại Roger Federer, cấu trúc đan sợi Braid 45 chuẩn xác mang lại cảm giác bóng vượt trội và kiểm soát đường bóng chuẩn xác.",
    features: [
      "Cấu trúc sợi Braid 45 định hướng góc 45 độ cải thiện độ uốn và cảm giác bóng",
      "Mật độ dây Paradigm Bending tăng cường độ dẻo dai thân vợt",
      "Cán vợt công nghệ Ergonomic End Cap cầm nắm tự nhiên",
      "Sơn đổi màu ánh đồng sang trọng huyền bí",
    ],
    specs: {
      weight: "315g (Chưa căng cước)",
      headSize: "97 sq in (626 cm²)",
      pattern: "16x19 (Dây dọc x Dây ngang)",
      balance: "31cm (10 pts HL đầu nhẹ kiểm soát)",
      level: "Tay vợt trung cấp đến chuyên nghiệp",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: true,
  },
  {
    id: 217,
    code: "SP-217",
    name: "Vợt Cầu Lông Yonex Nanoflare 1000Z Speed",
    brand: "Yonex",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 3500000,
    profitPercent: 27.14,
    price: 4450000,
    salePrice: 4190000,
    discount: "-6%",
    stock: 14,
    sold: 96,
    rating: 4.9,
    reviewCount: 68,
    image:
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["4U-G5 (83g)", "3U-G5 (88g)"],
    colors: ["Vàng Tia Chớp Lightning Yellow"],
    desc: "Kỷ lục vung vợt đạt tốc độ đập cầu 565 km/h nhanh nhất thế giới. Cấu hình khí động học AERO Frame giảm tối đa lực cản gió, phản tạt và thủ cầu không có đối thủ.",
    features: [
      "Thiết kế khung AERO Frame vung vợt xé gió",
      "Vật liệu M40X carbon gia tăng độ đàn hồi và chịu lực nén",
      "Đầu vợt cân bằng công thủ toàn diện",
      "Tốc độ vung vợt nhanh kỷ lục Guinness",
    ],
    specs: {
      weight: "4U (83g)",
      balance: "Cân bằng hơi đầm đầu nhẹ (Even Balance)",
      stiffness: "Cứng (Stiff)",
      tension: "20 - 28 lbs",
      level: "Lối đánh tốc độ phản tạt và ép cầu lưới",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: false,
  },
  {
    id: 218,
    code: "SP-218",
    name: "Vợt Cầu Lông Yonex ArcSaber 11 Pro Tour",
    brand: "Yonex",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 3100000,
    profitPercent: 27.42,
    price: 3950000,
    salePrice: 3650000,
    discount: "-8%",
    stock: 20,
    sold: 110,
    rating: 4.8,
    reviewCount: 55,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["4U-G5 (83g)", "3U-G5 (88g)"],
    colors: ["Đỏ Xám Grayish Pearl"],
    desc: "Ông vua điều cầu và kiểm soát điểm rơi cầu lông. Khung vợt giữ cầu lâu hơn thêm 0.02 giây giúp tay vợt điều hướng cầu vào các góc chết hiểm hóc trên sân đối phương.",
    features: [
      "Công nghệ Pocketing Booster giữ cầu chính xác tuyệt đối",
      "Khung hộp Box Frame gia cố độ ổn định chống rung lắc",
      "Cân bằng chuẩn xác giữa công phá và phòng ngự",
      "Rất êm tay không gây đau mỏi cổ tay",
    ],
    specs: {
      weight: "4U (83g)",
      balance: "Cân bằng (Even Balance)",
      stiffness: "Cứng vừa (Medium Stiff)",
      tension: "19 - 27 lbs",
      level: "Người chơi phong trào khá, đánh đôi kiểm soát",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 219,
    code: "SP-219",
    name: "Quả Cầu Lông Thi Đấu Yonex Aerosensa 50 (Hộp 12 quả)",
    brand: "Yonex",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 420000,
    profitPercent: 38.1,
    price: 580000,
    salePrice: 520000,
    discount: "-10%",
    stock: 60,
    sold: 340,
    rating: 5.0,
    reviewCount: 160,
    image:
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Tốc độ 77 (Khí hậu Việt Nam)"],
    colors: ["Lông ngỗng trắng tự nhiên"],
    desc: "Ống cầu lông tiêu chuẩn thi đấu tại Olympic và các giải Super 1000. Lông ngỗng cao cấp tuyển chọn 100% cùng đế gỗ bần tự nhiên cho quỹ đạo bay chuẩn xác ổn định nhất.",
    features: [
      "Lông ngỗng cao cấp chịu lực đập mạnh không gãy rụng",
      "Đế gỗ bần 3 lớp độ nảy đàn hồi chuẩn quốc tế",
      "Quỹ đạo xoay tròn ổn định không bị lắc đảo gió",
      "Hộp nhôm ép kín bảo quản độ ẩm tiêu chuẩn",
    ],
    specs: {
      quantity: "12 quả / hộp",
      material: "Lông ngỗng hạng A + Gỗ bần",
      speed: "Tốc độ 77",
      level: "Thi đấu quốc tế và câu lạc bộ chuyên nghiệp",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: true,
  },
  {
    id: 220,
    code: "SP-220",
    name: "Vợt Tennis Wilson Blade 98 v8 16x19",
    brand: "Wilson",
    categoryId: "CAT-RACKET",
    category: "Cầu Lông - Tennis",
    costPrice: 3550000,
    profitPercent: 30.99,
    price: 4650000,
    salePrice: 4290000,
    discount: "-8%",
    stock: 9,
    sold: 67,
    rating: 4.8,
    reviewCount: 41,
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Cán 2 (4 1/4)"],
    colors: ["Xanh Rêu Đổi Màu Metallic Chameleon"],
    desc: "Cây vợt tennis được các tay vợt chuyên nghiệp trong top 100 ATP tin dùng nhiều nhất. Công nghệ sơn đổi màu ngọc bích cùng cảm giác bóng đầm tay tuyệt hảo.",
    features: [
      "Công nghệ FORTYFIVE tăng độ uốn dọc và uốn ngang",
      "Cảm giác bóng kết nối sâu sắc giữa tay cầm và mặt vợt",
      "Mật độ dây 16x19 cho độ xoáy topspin cực mạnh",
      "Cán thuôn nhỏ gọn dễ dàng thực hiện cú trái tay 2 tay",
    ],
    specs: {
      weight: "305g",
      headSize: "98 sq in",
      pattern: "16x19",
      balance: "32cm",
      level: "Lối đánh hiện đại tấn công cuối sân Baselines",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },

  // --------------------------------------------------------------------------
  // MÔN: GYM & FITNESS (CAT-GYM)
  // --------------------------------------------------------------------------
  {
    id: 207,
    code: "SP-207",
    name: "Bộ Quần Áo Đấu Dri-FIT Pro Match Bó Cơ",
    brand: "Nike",
    categoryId: "CAT-GYM",
    category: "Gym & Fitness",
    costPrice: 650000,
    profitPercent: 46.15,
    price: 950000,
    salePrice: 750000,
    discount: "-21%",
    stock: 50,
    sold: 290,
    rating: 4.8,
    reviewCount: 135,
    image:
      "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Đen Carbon Stealth", "Xám Khói Titan", "Xanh Rêu"],
    desc: "Chất vải dệt sợi tổng hợp công nghệ Pro Dri-FIT ôm sát từng khối cơ, co giãn 4 chiều hỗ trợ lưu thông máu và giảm tối đa ma sát trong các buổi tập tạ cường độ cao.",
    features: [
      "Vải nén cơ bắp hạn chế rung lắc cơ bắp giảm chấn thương",
      "Thoát ẩm siêu tốc trong 3 giây tiếp xúc",
      "Đường may phẳng Flat-seam không gây cọ rát da",
      "Kháng khuẩn và khử mùi mồ hôi bằng ion bạc",
    ],
    specs: {
      weight: "220g (Cả bộ áo + quần)",
      material: "88% Polyester / 12% Spandex co giãn 4 chiều",
      compression: "Trung bình (Medium Compression)",
      usage: "Gym thể hình, Chạy bộ, CrossFit, Bơi lội",
    },
    status: "active",
    featured: false,
    isNew: true,
    isHot: true,
  },
  {
    id: 222,
    code: "SP-222",
    name: "Đai Lưng Cứng Nâng Tạ Deadlift Harbinger Pro 6-inch",
    brand: "Harbinger",
    categoryId: "CAT-GYM",
    category: "Gym & Fitness",
    costPrice: 620000,
    profitPercent: 43.55,
    price: 890000,
    salePrice: 790000,
    discount: "-11%",
    stock: 26,
    sold: 88,
    rating: 4.9,
    reviewCount: 48,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Size M (Vòng eo 75-88cm)", "Size L (Vòng eo 88-100cm)"],
    colors: ["Đen Thể Thao / Khóa Thép Bạc"],
    desc: "Bản rộng 6 inch gia cố cột sống thắt lưng chống thoát vị đĩa đệm khi thực hiện các bài nâng tạ nặng như Squat, Deadlift, Overhead Press.",
    features: [
      "Lõi đệm xốp nén mật độ cao bao quanh tấm lót dày",
      "Khóa con lăn bằng thép không gỉ siết chặt an toàn",
      "Khóa dán Velcro bản to chịu lực kéo trên 300kg",
      "Thiết kế vát ôm sát theo đường cong sinh học thắt lưng",
    ],
    specs: {
      width: "6 inch (15.2 cm)",
      material: "Nylon dệt chịu lực + Khóa thép không gỉ",
      capacity: "Hỗ trợ mức tạ nâng lên tới 350kg",
      level: "Gymer tập tạ nặng, VĐV Powerlifting",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 223,
    code: "SP-223",
    name: "Găng Tay Tập Gym Thoáng Khí Under Armour Weightlifting",
    brand: "Under Armour",
    categoryId: "CAT-GYM",
    category: "Gym & Fitness",
    costPrice: 380000,
    profitPercent: 44.74,
    price: 550000,
    salePrice: 450000,
    discount: "-18%",
    stock: 32,
    sold: 160,
    rating: 4.7,
    reviewCount: 72,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["M (Lòng bàn tay 19-21cm)", "L (Lòng bàn tay 21-23cm)"],
    colors: ["Đen Nhám Stealth", "Đỏ Đen Under Armour"],
    desc: "Lòng bàn tay bọc da thật kết hợp gel chống chai tay và chống trượt đòn tạ, mu bàn tay dệt vải lưới HeatGear giải phóng nhiệt mát mẻ.",
    features: [
      "Lớp đệm da thật êm ái chống phồng rộp chai sạn tay",
      "Vải HeatGear co giãn làm mát thông thoáng",
      "Băng dính cổ tay điều chỉnh linh hoạt bảo vệ khớp",
      "Vạt kéo ngón tay tháo găng nhanh trong 1 giây",
    ],
    specs: {
      material: "Da thuộc thật + Vải lưới HeatGear",
      cushion: "Đệm Gel phân bổ áp lực lòng bàn tay",
      wristSupport: "Đai quấn cổ tay hỗ trợ giữ khớp",
      gender: "Nam và Nữ (Unisex)",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
  {
    id: 224,
    code: "SP-224",
    name: "Con Lăn Massage Giãn Cơ Bắp Foam Roller TriggerPoint GRID",
    brand: "TriggerPoint",
    categoryId: "CAT-GYM",
    category: "Gym & Fitness",
    costPrice: 500000,
    profitPercent: 50.0,
    price: 750000,
    salePrice: 620000,
    discount: "-17%",
    stock: 21,
    sold: 105,
    rating: 4.9,
    reviewCount: 56,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Chiều dài 33cm x Đường kính 14cm"],
    colors: ["Cam Năng Động", "Đen Huyền Bí", "Xanh Lục"],
    desc: "Bề mặt đa tầng mô phỏng ngón tay, bàn tay và đốt ngón tay của chuyên viên vật lý trị liệu giúp giải phóng các điểm căng cứng cơ Myofascial, tăng độ dẻo dai.",
    features: [
      "Lõi rỗng siêu bền chịu tải trọng lượng người dùng lên tới 225kg",
      "Bề mặt xốp EVA đa vùng mô phỏng động tác xoa bóp trị liệu",
      "Kích thước gọn nhẹ bỏ vừa balo túi gym",
      "Hỗ trợ phục hồi nhanh sau khi tập chân và lưng",
    ],
    specs: {
      dimensions: "Dài 33 cm x Đường kính 14 cm",
      weight: "650g",
      maxWeight: "225kg (Không bị bẹp lõm qua thời gian)",
      material: "Bọt xốp EVA cao cấp + Lõi nhựa cứng ABS",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },

  // --------------------------------------------------------------------------
  // MÔN: PHỤ KIỆN THỂ THAO & CÔNG NGHỆ (CAT-ACCESSORY)
  // --------------------------------------------------------------------------
  {
    id: 208,
    code: "SP-208",
    name: "Đồng Hồ Thông Minh Thể Thao Garmin Forerunner 265",
    brand: "Garmin",
    categoryId: "CAT-ACCESSORY",
    category: "Phụ Kiện Thể Thao",
    costPrice: 6800000,
    profitPercent: 32.2,
    price: 8990000,
    salePrice: 8490000,
    discount: "-6%",
    stock: 4, // CẢNH BÁO TỒN KHO <= 5 (ĐỂ TEST ADMIN TAB 8)
    sold: 92,
    rating: 4.9,
    reviewCount: 78,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Bản 46mm Tiêu chuẩn", "Bản 42mm (Forerunner 265S)"],
    colors: ["Đen Dây Xám Slate", "Trắng Dây Xanh Aqua", "Vàng Chanh"],
    desc: "Màn hình cảm ứng AMOLED rực rỡ, GPS đa băng tần định vị chuẩn xác dưới hẻm phố và bóng râm, đo chỉ số hồi phục thể lực Training Readiness và VO2 Max chính xác hàng đầu.",
    features: [
      "Màn hình cảm ứng AMOLED siêu nét nhìn rõ dưới trời nắng gắt",
      "Pin trâu dùng liên tục 13 ngày ở chế độ Smartwatch",
      "Chỉ số đo mức độ sẵn sàng luyện tập Training Readiness",
      "Lưu trữ bài hát nghe nhạc trực tiếp qua tai nghe Bluetooth không cần điện thoại",
    ],
    specs: {
      screen: "AMOLED 1.3 inch (416 x 416 pixels)",
      battery: "13 ngày (Smartwatch) / 20 giờ (Chế độ GPS liên tục)",
      sensors: "GPS đa băng tần, Nhịp tim cổ tay Elevate Gen 4, Pulse Ox",
      waterproof: "5 ATM (Chống nước áp suất 50 mét, bơi lội an toàn)",
    },
    status: "active",
    featured: true,
    isNew: true,
    isHot: true,
  },
  {
    id: 225,
    code: "SP-225",
    name: "Bình Nước Giữ Nhiệt Thể Thao Titan Sport Hydro 1000ml",
    brand: "Titan",
    categoryId: "CAT-ACCESSORY",
    category: "Phụ Kiện Thể Thao",
    costPrice: 280000,
    profitPercent: 50.0,
    price: 420000,
    salePrice: 350000,
    discount: "-17%",
    stock: 75,
    sold: 380,
    rating: 4.8,
    reviewCount: 142,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["1000ml (1 Lít Khủng)", "750ml"],
    colors: ["Đen Mờ Nhám Matte Black", "Xanh Quân Đội Army", "Bạc Inox"],
    desc: "Chất liệu inox 304 hai lớp chân không cách nhiệt, giữ nước lạnh mát lạnh suốt 24 giờ và giữ ấm 12 giờ, nắp bật vòi hút thể thao tiện lợi khi đang chạy bộ hoặc đạp xe.",
    features: [
      "Giữ lạnh 24 giờ / Giữ nóng 12 giờ không đọng sương bề mặt",
      "Thép không gỉ 304 cao cấp an toàn thực phẩm không chứa BPA",
      "Vòi hút silicon thông minh uống nước bằng một tay khi đang di chuyển",
      "Quai xách kim loại bọc cao su chịu lực kéo bền bỉ",
    ],
    specs: {
      capacity: "1000ml",
      material: "Inox 304 (Thép không gỉ 18/8) cách nhiệt chân không",
      weight: "420g",
      insulation: "Lạnh 24h / Nóng 12h",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: true,
  },
  {
    id: 226,
    code: "SP-226",
    name: "Túi Trống Thể Thao Chống Nước Gym Pro Duffel 45L",
    brand: "GymPro",
    categoryId: "CAT-ACCESSORY",
    category: "Phụ Kiện Thể Thao",
    costPrice: 450000,
    profitPercent: 51.11,
    price: 680000,
    salePrice: 550000,
    discount: "-19%",
    stock: 38,
    sold: 210,
    rating: 4.7,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Dung tích 45 Lít (Dài 55cm x Rộng 28cm x Cao 28cm)"],
    colors: ["Đen Carbon Phối Xanh", "Xám Thể Thao Heather"],
    desc: "Thiết kế ngăn riêng biệt đựng giày cách ly có lỗ thoáng khí, ngăn chống thấm nước đựng đồ ướt sau khi tập và quai đeo đệm êm ái trợ lực vai khi mang vác nặng.",
    features: [
      "Ngăn chứa giày độc lập có van thông hơi khử mùi hôi",
      "Túi phụ chống thấm tuyệt đối đựng quần áo ướt và khăn tắm",
      "Vải Oxford 900D phủ PU trượt nước kháng bụi",
      "Dây đeo vai có đệm mút dày giảm 50% áp lực vai",
    ],
    specs: {
      capacity: "45 Lít",
      dimensions: "55 x 28 x 28 cm",
      material: "Vải Polyester Oxford 900D chống thấm",
      compartments: "Ngăn chính, Ngăn giày, Ngăn đồ ướt, 3 ngăn phụ",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: true,
  },
  {
    id: 227,
    code: "SP-227",
    name: "Băng Cuốn Cổ Chân Bảo Vệ Khớp Thể Thao LP Support",
    brand: "LP Support",
    categoryId: "CAT-ACCESSORY",
    category: "Phụ Kiện Thể Thao",
    costPrice: 190000,
    profitPercent: 52.63,
    price: 290000,
    salePrice: 220000,
    discount: "-24%",
    stock: 2, // CẢNH BÁO TỒN KHO <= 5 (ĐỂ TEST ADMIN TAB 8)
    sold: 190,
    rating: 4.8,
    reviewCount: 65,
    image:
      "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["Free Size (Dây đai quấn điều chỉnh mọi kích thước chân)"],
    colors: ["Đen Viền Xanh Dương"],
    desc: "Bảo vệ khớp mắt cá chân, chống lật sơ mi khi đổi hướng đột ngột trong bóng đá, cầu lông, bóng rổ hoặc chạy bộ địa hình gồ ghề.",
    features: [
      "Chất liệu cao su tổng hợp Neoprene giữ ấm và ổn định khớp",
      "Thiết kế gót mở tạo sự linh hoạt tự nhiên khi di chuyển",
      "Dải đai quấn hình số 8 cố định vững chãi",
      "Giảm sưng đau và hỗ trợ phục hồi sau chấn thương",
    ],
    specs: {
      material: "75% Xốp cao su Neoprene / 25% Nylon dệt co giãn",
      design: "Quấn số 8 ôm sát mắt cá",
      level: "Bảo vệ chấn thương và phòng ngừa lật sơ mi",
      gender: "Dùng cho cả chân trái và chân phải",
    },
    status: "active",
    featured: false,
    isNew: false,
    isHot: false,
  },
];

// ============================================================================
// 3. DANH SÁCH PHIẾU NHẬP HÀNG KHO VẬT TƯ (IMPORTS)
// Quản lý theo chuẩn kế toán:
// - "Hoàn thành": đã nhập kho, đã cộng số lượng vào tồn kho, khóa sửa
// - "Tạm lưu": phiếu dự thảo, cho phép bấm "Sửa" cập nhật thông tin
// Khớp 100% productId với bảng sản phẩm để Tab 8 tính toán Nhập - Xuất - Tồn (NXT)
// ============================================================================
var imports = [
  {
    importId: "PN-2026-001",
    supplier: "Nike Việt Nam Distribution",
    date: "2026-10-15",
    creator: "Quản Trị Viên",
    status: "Hoàn thành",
    note: "Nhập bổ sung giày marathon ZoomX Vaporfly 3 phục vụ giải chạy VnExpress Marathon",
    items: [
      {
        productId: 201,
        code: "SP-201",
        name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto",
        quantity: 20,
        importPrice: 4000000,
        total: 80000000,
      },
    ],
    totalQuantity: 20,
    totalCost: 80000000,
  },
  {
    importId: "PN-2026-002",
    supplier: "Adidas Sài Gòn Sport",
    date: "2026-10-12",
    creator: "Quản Trị Viên",
    status: "Hoàn thành",
    note: "Nhập lô giày bóng đá Predator Elite và giày thi đấu F50 thế hệ mới",
    items: [
      {
        productId: 202,
        code: "SP-202",
        name: "Giày Đá Bóng Adidas Predator Elite FG",
        quantity: 30,
        importPrice: 2400000,
        total: 72000000,
      },
      {
        productId: 213,
        code: "SP-213",
        name: "Giày Đá Bóng Adidas F50 Elite FG Fast Reborn",
        quantity: 15,
        importPrice: 2700000,
        total: 40500000,
      },
    ],
    totalQuantity: 45,
    totalCost: 112500000,
  },
  {
    importId: "PN-2026-003",
    supplier: "Yonex Sunrise Vietnam",
    date: "2026-10-05",
    creator: "Quản Trị Viên",
    status: "Hoàn thành",
    note: "Vợt cầu lông thi đấu cao cấp chuyên nghiệp và hộp cầu lông thi đấu quốc tế",
    items: [
      {
        productId: 203,
        code: "SP-203",
        name: "Vợt Cầu Lông Yonex Astrox 100ZZ Kurenai",
        quantity: 15,
        importPrice: 3300000,
        total: 49500000,
      },
      {
        productId: 219,
        code: "SP-219",
        name: "Quả Cầu Lông Thi Đấu Yonex Aerosensa 50 (Hộp 12 quả)",
        quantity: 50,
        importPrice: 420000,
        total: 21000000,
      },
    ],
    totalQuantity: 65,
    totalCost: 70500000,
  },
  {
    importId: "PN-2026-004",
    supplier: "Wilson Sports Asia",
    date: "2026-10-20",
    creator: "Quản Trị Viên",
    status: "Tạm lưu", // Trạng thái Tạm lưu: cho phép bấm "Sửa" trên bảng Admin Tab 5
    note: "Dự kiến nhập thêm vợt tennis Wilson Pro Staff v14 và Blade 98 chuẩn bị giải Grand Slam",
    items: [
      {
        productId: 204,
        code: "SP-204",
        name: "Vợt Tennis Wilson Pro Staff 97 v14 Roger Federer",
        quantity: 10,
        importPrice: 3800000,
        total: 38000000,
      },
      {
        productId: 220,
        code: "SP-220",
        name: "Vợt Tennis Wilson Blade 98 v8 16x19",
        quantity: 10,
        importPrice: 3550000,
        total: 35500000,
      },
    ],
    totalQuantity: 20,
    totalCost: 73500000,
  },
  {
    importId: "PN-2026-005",
    supplier: "Garmin Vietnam Official",
    date: "2026-10-22",
    creator: "Quản Trị Viên",
    status: "Tạm lưu",
    note: "Phiếu nhập dự kiến cho lô đồng hồ thể thao chuyên sâu Garmin Forerunner 265",
    items: [
      {
        productId: 208,
        code: "SP-208",
        name: "Đồng Hồ Thông Minh Thể Thao Garmin Forerunner 265",
        quantity: 8,
        importPrice: 6800000,
        total: 54400000,
      },
    ],
    totalQuantity: 8,
    totalCost: 54400000,
  },
  {
    importId: "PN-2026-006",
    supplier: "Puma Official Distributor",
    date: "2026-10-18",
    creator: "Quản Trị Viên",
    status: "Hoàn thành",
    note: "Nhập lô bóng thi đấu La Liga Puma Orbita đạt chuẩn FIFA Quality Pro",
    items: [
      {
        productId: 206,
        code: "SP-206",
        name: "Quả Bóng Đá Chuẩn Thi Đấu Puma Orbita FIFA Quality Pro",
        quantity: 40,
        importPrice: 600000,
        total: 24000000,
      },
    ],
    totalQuantity: 40,
    totalCost: 24000000,
  },
  {
    importId: "PN-2026-007",
    supplier: "Titan Sports Manufacturing",
    date: "2026-10-21",
    creator: "Quản Trị Viên",
    status: "Hoàn thành",
    note: "Nhập bình nước giữ nhiệt titan 1000ml phục vụ giải marathon mùa thu",
    items: [
      {
        productId: 225,
        code: "SP-225",
        name: "Bình Nước Giữ Nhiệt Thể Thao Titan Sport Hydro 1000ml",
        quantity: 80,
        importPrice: 280000,
        total: 22400000,
      },
    ],
    totalQuantity: 80,
    totalCost: 22400000,
  },
];

// ============================================================================
// 4. DANH SÁCH ĐƠN HÀNG THỰC TẾ (ORDERS)
// Quản lý đầy đủ 5 trạng thái theo Bareme SGU:
// - "Mới đặt"
// - "Đã xử lý"
// - "Đang giao"
// - "Đã giao"
// - "Đã hủy"
// ============================================================================
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
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 5290000,
    note: "Giao giờ hành chính, gọi trước khi giao 15 phút",
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
        image:
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80",
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
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 3965000,
    note: "Kiểm tra kỹ size giày 41 và tem chính hãng trước khi đóng gói",
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
        image:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80",
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
        image:
          "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 5310000,
    note: "Căng cước sẵn cước BG65Ti lực căng 10.5kg giúp mình",
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
        image:
          "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=400&auto=format&fit=crop&q=80",
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
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 1865000,
    note: "Khách đã nhận hàng và thanh toán đủ tiền mặt",
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
        image:
          "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 5515000,
    note: "Khách hàng đổi ý mua phiên bản Alphafly 3 nên đã gọi hotline xin hủy đơn",
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
        image:
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop&q=80",
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
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 8410000, // Đã trừ voucher VIPGOLD 1.000.000đ
    note: "Giao hỏa tốc 2 giờ tại Hà Nội",
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
        image:
          "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=400&auto=format&fit=crop&q=80",
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
        image:
          "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80",
      },
    ],
    total: 8580000,
    note: "Hội viên Gold đặt trước phiên bản giới hạn Blueprint",
  },
];

// ============================================================================
// 5. DANH SÁCH KHÁCH HÀNG & HỘI VIÊN (CUSTOMERS)
// Quản lý theo chuẩn Bareme SGU:
// - "active" (Đang hoạt động) | "locked" (Bị khóa để test nút toggle Khóa/Mở)
// - Nút Reset Mật Khẩu đưa mật khẩu về "123456"
// ============================================================================
var customers = [
  {
    id: "KH-001",
    name: "Trần Hùng Tín",
    phone: "0912345678",
    email: "hungtintran89@gmail.com",
    password: "secure_pass_999", // Test resetPassword sẽ đặt về 123456
    tier: "Gold Elite",
    points: 860,
    spent: 18450000,
    joinDate: "2024-01-15",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
  },
  {
    id: "KH-002",
    name: "Lê Minh Hoàng",
    phone: "0987654321",
    email: "leminhhoang@gmail.com",
    password: "pass_hoang_2025",
    tier: "Silver",
    points: 340,
    spent: 6850000,
    joinDate: "2025-05-10",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    address: "105 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP.HCM",
  },
  {
    id: "KH-003",
    name: "Nguyễn Thị Mai",
    phone: "0933221100",
    email: "nguyenmai@gmail.com",
    password: "mai_sport_lover",
    tier: "Gold Elite",
    points: 620,
    spent: 12300000,
    joinDate: "2024-03-02",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    address: "12 Võ Văn Kiệt, Phường Cầu Ông Lãnh, Quận 1, TP.HCM",
  },
  {
    id: "KH-004",
    name: "Phạm Quốc Tuấn",
    phone: "0909123456",
    email: "tuankute@gmail.com",
    password: "123456_tuankute",
    tier: "Standard",
    points: 120,
    spent: 2400000,
    joinDate: "2026-09-20",
    status: "locked", // Khách hàng này đang bị khóa để kiểm tra giao diện và nút Mở Khóa
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    address: "45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM",
  },
  {
    id: "KH-005",
    name: "Đặng Hoàng Nam",
    phone: "0918765432",
    email: "namdang@gmail.com",
    password: "nam_secret_pass",
    tier: "Standard",
    points: 80,
    spent: 1650000,
    joinDate: "2026-10-01",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    address: "88 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
  },
  {
    id: "KH-006",
    name: "Vũ Thùy Trang",
    phone: "0971239876",
    email: "thuytrang@gmail.com",
    password: "trang_marathon_runner",
    tier: "Platinum VIP",
    points: 1450,
    spent: 32800000,
    joinDate: "2023-11-18",
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    address: "18 Phố Hàng Bài, Hoàn Kiếm, Hà Nội",
  },
];

// ============================================================================
// 6. DANH SÁCH MÃ GIẢM GIÁ VÀ VOUCHER KHUYẾN MÃI (VOUCHERS)
// Phục vụ Dev 4 Giỏ hàng & Thanh toán
// ============================================================================
var vouchers = [
  {
    code: "SPORT50K",
    title: "Giảm ngay 50.000 ₫",
    desc: "Áp dụng cho mọi đơn hàng trang bị thể thao từ 500.000 ₫ trở lên",
    type: "cash", // "cash" (tiền mặt) | "percent" (phần trăm) | "freeship" (miễn phí vận chuyển)
    discountValue: 50000,
    minOrder: 500000,
    maxDiscount: 50000,
    expiryDate: "2026-12-31",
    status: "active",
  },
  {
    code: "RUNNER10",
    title: "Ưu đãi Runner 10%",
    desc: "Giảm 10% tối đa 300.000 ₫ cho các dòng giày chạy bộ marathon chuyên nghiệp",
    type: "percent",
    discountValue: 10,
    minOrder: 2000000,
    maxDiscount: 300000,
    expiryDate: "2026-11-30",
    status: "active",
  },
  {
    code: "FREESHIP",
    title: "Miễn Phí Giao Hàng Toàn Quốc",
    desc: "Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1.000.000 ₫",
    type: "freeship",
    discountValue: 35000,
    minOrder: 1000000,
    maxDiscount: 35000,
    expiryDate: "2026-12-31",
    status: "active",
  },
  {
    code: "VIPGOLD",
    title: "Đặc quyền Hội viên Vàng 15%",
    desc: "Giảm ngay 15% tối đa 1.000.000 ₫ dành riêng cho khách hàng hạng Gold Elite",
    type: "percent",
    discountValue: 15,
    minOrder: 3000000,
    maxDiscount: 1000000,
    expiryDate: "2026-12-31",
    status: "active",
  },
  {
    code: "FLASH20",
    title: "Flash Sale Giờ Vàng 20%",
    desc: "Mã giảm giá chớp nhoáng 20% trong khung giờ vàng thể thao",
    type: "percent",
    discountValue: 20,
    minOrder: 1500000,
    maxDiscount: 500000,
    expiryDate: "2026-10-31",
    status: "active",
  },
];

// ============================================================================
// 7. DỮ LIỆU TRÌNH DIỄN TRANG CHỦ (BANNERS & FLASH SALE)
// Phục vụ Dev 1 Trang chủ
// ============================================================================
var banners = [
  {
    id: 1,
    tag: "SIÊU PHẨM MÙA HÈ 2026",
    title: "BỨT PHÁ MỌI GIỚI HẠN TỐC ĐỘ",
    subtitle:
      "Bộ sưu tập giày marathon công nghệ đệm sợi Carbon mới nhất từ Nike & Adidas. Giảm ngay 30% cho hội viên.",
    btnText: "Khám Phá Bộ Sưu Tập",
    link: "pages/dev2_products.html?category=Running",
    badge: "NEW RELEASE",
    bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    tag: "CHINH PHỤC SÂN CỎ",
    title: "ĐỈNH CAO BÓNG ĐÁ CHUYÊN NGHIỆP",
    subtitle:
      "Trang bị thi đấu đẳng cấp thế giới: Giày đinh FG thế hệ mới, bóng chuẩn FIFA Quality Pro.",
    btnText: "Mua Sắm Ngay",
    link: "pages/dev2_products.html?category=Football",
    badge: "HOT TREND",
    bg: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    tag: "QUẦN VỢT & CẦU LÔNG",
    title: "CÔNG PHÁ MỌI ĐƯỜNG CẦU",
    subtitle:
      "Vợt trợ lực carbon mật độ cao, độ cân bằng hoàn hảo cho từng cú đập smash uy lực.",
    btnText: "Xem Chi Tiết",
    link: "pages/dev2_products.html?category=Racket",
    badge: "EXCLUSIVE",
    bg: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&auto=format&fit=crop&q=80",
  },
];

var flashSale = {
  title: "⚡ FLASH SALE GIỜ VÀNG THỂ THAO",
  endTimeOffsetHours: 12,
  items: [
    {
      id: 201,
      name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto",
      category: "Chạy Bộ",
      price: 5290000,
      salePrice: 4890000,
      discount: "-8%",
      rating: 4.9,
      sold: 68,
      stock: 100,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 204,
      name: "Vợt Tennis Wilson Pro Staff 97 v14",
      category: "Cầu Lông - Tennis",
      price: 4990000,
      salePrice: 4590000,
      discount: "-8%",
      rating: 4.9,
      sold: 32,
      stock: 50,
      image:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 207,
      name: "Bộ Quần Áo Đấu Dri-FIT Pro Match Bó Cơ",
      category: "Gym & Fitness",
      price: 950000,
      salePrice: 750000,
      discount: "-21%",
      rating: 4.8,
      sold: 115,
      stock: 150,
      image:
        "https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 206,
      name: "Quả Bóng Đá Chuẩn Thi Đấu Puma Orbita FIFA Quality Pro",
      category: "Bóng Đá",
      price: 850000,
      salePrice: 665000,
      discount: "-22%",
      rating: 4.9,
      sold: 89,
      stock: 120,
      image:
        "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600&auto=format&fit=crop&q=80",
    },
  ],
};

// ============================================================================
// 8. BỘ CÂU HỎI THƯỜNG GẶP FAQ (FREQUENTLY ASKED QUESTIONS)
// Phục vụ Dev 5 Khách hàng & Hỗ trợ
// ============================================================================
var faqs = [
  {
    id: "faq-1",
    question: "SportStore cam kết sản phẩm thể thao chính hãng như thế nào?",
    answer:
      "100% trang bị thể thao tại SportStore được nhập khẩu chính ngạch từ các nhà phân phối chính thức của Nike, Adidas, Puma, Yonex, Wilson và Garmin. Mỗi sản phẩm đều có tem bảo hành điện tử, mã vạch truy xuất nguồn gốc và hóa đơn VAT đầy đủ.",
  },
  {
    id: "faq-2",
    question: "Chính sách đổi size giày và vợt thể thao trong bao lâu?",
    answer:
      "Quý khách được hỗ trợ đổi size miễn phí trong vòng 30 ngày kể từ khi nhận hàng. Điều kiện sản phẩm còn nguyên hộp, nguyên tem mác và chưa qua thi đấu thực tế trên sân.",
  },
  {
    id: "faq-3",
    question:
      "Thời gian giao hàng tại TP.HCM, Hà Nội và các tỉnh khác mất bao lâu?",
    answer:
      "Đối với khu vực nội thành TP.HCM và Hà Nội, SportStore hỗ trợ giao hàng hỏa tốc trong 2 giờ hoặc trong ngày. Đối với các tỉnh thành khác, thời gian giao hàng tiêu chuẩn từ 1 đến 3 ngày làm việc qua đối tác Viettel Post / GHTK.",
  },
  {
    id: "faq-4",
    question: "Cách kích hoạt chế độ bảo hành khung vợt và đế giày marathon?",
    answer:
      "Sau khi nhận hàng thành công, hệ thống SportStore sẽ tự động kích hoạt bảo hành điện tử theo số điện thoại của quý khách. Thời hạn bảo hành là 12 tháng đối với khung vợt và 6 tháng đối với keo đế giày.",
  },
];

// ============================================================================
// 9. BẢNG CƯỚC VẬN CHUYỂN & SỔ ĐỊA CHỈ MẪU
// Phục vụ Dev 4 Giỏ hàng & Dev 5 Tài khoản
// ============================================================================
var shippingZones = [
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh (Nội thành - Hỏa tốc 2h)",
    fee: 25000,
    estimatedTime: "2 - 4 Giờ",
  },
  {
    id: "hanoi",
    name: "Hà Nội (Nội thành - Giao trong ngày)",
    fee: 25000,
    estimatedTime: "Trong ngày",
  },
  {
    id: "other_province",
    name: "Các tỉnh thành khác (Chuyển phát nhanh Viettel Post)",
    fee: 35000,
    estimatedTime: "2 - 3 Ngày",
  },
];

// ============================================================================
// 10. HỆ THỐNG TIỆN ÍCH TƯƠNG TÁC DỮ LIỆU & ĐỒNG BỘ LOCALSTORAGE
// ============================================================================
var STORAGE_KEYS = {
  CATEGORIES: "sport_categories",
  PRODUCTS: "sport_products",
  IMPORTS: "sport_imports",
  ORDERS: "sport_orders",
  CUSTOMERS: "sport_customers",
  ADMIN_LOGGED: "admin_logged_in",
  VOUCHERS: "sport_vouchers",
  CART: "sport_cart",
  USER: "sport_user",
  AUTH_USER: "sportstore_auth_user",
  ADDRESS: "sportstore_user_address",
};

/**
 * Đọc dữ liệu an toàn từ LocalStorage
 */
function readStorage(key, fallback) {
  if (typeof localStorage === "undefined") return fallback;
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("Lỗi đọc LocalStorage key: " + key, e);
    return fallback;
  }
}

/**
 * Ghi dữ liệu an toàn vào LocalStorage
 */
function writeStorage(key, value) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Lỗi ghi LocalStorage key: " + key, e);
  }
}

/**
 * Khởi tạo đồng bộ toàn bộ dữ liệu mẫu vào LocalStorage nếu máy chưa có
 */
function syncStorage(forceReset) {
  if (typeof localStorage === "undefined") return;

  if (forceReset || !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    writeStorage(STORAGE_KEYS.CATEGORIES, categories);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.IMPORTS)) {
    writeStorage(STORAGE_KEYS.IMPORTS, imports);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    writeStorage(STORAGE_KEYS.ORDERS, orders);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    writeStorage(STORAGE_KEYS.CUSTOMERS, customers);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.VOUCHERS)) {
    writeStorage(STORAGE_KEYS.VOUCHERS, vouchers);
  }

  // Đặt cờ admin mặc định để test
  if (localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED) === null) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, "true");
  }
}

/**
 * Tìm kiếm sản phẩm theo ID
 */
function getProductById(id) {
  var list = readStorage(STORAGE_KEYS.PRODUCTS, products);
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === Number(id)) return list[i];
  }
  return null;
}

/**
 * Lọc sản phẩm theo danh mục
 */
function getProductsByCategory(categoryNameOrId) {
  var list = readStorage(STORAGE_KEYS.PRODUCTS, products);
  if (!categoryNameOrId || categoryNameOrId === "ALL") return list;
  return list.filter(function (p) {
    return p.category === categoryNameOrId || p.categoryId === categoryNameOrId;
  });
}

/**
 * Tìm kiếm sản phẩm theo từ khóa (Tên, Mã sản phẩm hoặc Thương hiệu)
 */
function searchProducts(keyword) {
  var list = readStorage(STORAGE_KEYS.PRODUCTS, products);
  if (!keyword) return list;
  var q = keyword.trim().toLowerCase();
  return list.filter(function (p) {
    var matchName = p.name && p.name.toLowerCase().indexOf(q) !== -1;
    var matchCode = p.code && p.code.toLowerCase().indexOf(q) !== -1;
    var matchBrand = p.brand && p.brand.toLowerCase().indexOf(q) !== -1;
    return matchName || matchCode || matchBrand;
  });
}

/**
 * Định dạng tiền tệ VNĐ chuẩn (ví dụ: 5290000 -> "5.290.000 ₫")
 */
function formatMoneyVND(amount) {
  var num = Number(amount) || 0;
  return num.toLocaleString("vi-VN") + " ₫";
}

// Tự động kích hoạt nạp storage ngay khi nạp file nếu chưa có
syncStorage(false);

// Trả về toàn bộ module cơ sở dữ liệu
return {
  categories: categories,
  products: products,
  imports: imports,
  orders: orders,
  customers: customers,
  vouchers: vouchers,
  banners: banners,
  flashSale: flashSale,
  faqs: faqs,
  shippingZones: shippingZones,
  STORAGE_KEYS: STORAGE_KEYS,
  syncStorage: syncStorage,
  getProductById: getProductById,
  getProductsByCategory: getProductsByCategory,
  searchProducts: searchProducts,
  formatMoneyVND: formatMoneyVND,
};
