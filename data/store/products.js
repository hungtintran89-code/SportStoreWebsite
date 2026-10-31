var products = [
  {
    id: 201, code: "SP-201", name: "Giày Chạy Bộ Nike ZoomX Vaporfly 3 Proto", brand: "Nike", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 4000000, profitPercent: 32.25, price: 5290000, salePrice: 4890000, discount: "-8%", stock: 18, sold: 142, rating: 4.9, reviewCount: 98,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43", "44"], colors: ["Trắng / Đỏ Cam Proto", "Xanh Neon / Đen", "Hồng Hyper Pink"],
    desc: "Siêu phẩm giày marathon với đệm ZoomX toàn phần kết hợp đĩa sợi carbon Flyplate nguyên khối.",
    features: ["Đệm ZoomX siêu nảy hoàn trả 85% năng lượng", "Đĩa đệm carbon Flyplate trợ lực tối đa", "Trọng lượng siêu nhẹ chỉ 198g"],
    specs: { weight: "198g", cushion: "Bọt ZoomX siêu nhẹ", plate: "Đĩa carbon Flyplate", surface: "Đường chạy Road / Marathon", drop: "8mm", level: "Vận động viên chuyên nghiệp" },
    status: "active", featured: true, isNew: true, isHot: true
  },
  {
    id: 202, code: "SP-202", name: "Giày Đá Bóng Adidas Predator Elite FG", brand: "Adidas", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 2400000, profitPercent: 31.25, price: 3150000, salePrice: 2890000, discount: "-8%", stock: 24, sold: 88, rating: 4.8, reviewCount: 65,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["39", "40", "41", "42", "43"], colors: ["Đỏ Đen Predator Solar Red", "Trắng Bạc Pearl"],
    desc: "Vũ khí kiểm soát bóng đỉnh cao với công nghệ gai cao su Strikeskin độc quyền.",
    features: ["Công nghệ Strikeskin tăng độ xoáy đường bóng", "Đế ngoài Controlframe 2.0 bám sân tự nhiên", "Cổ thun Primeknit ôm sát cổ chân"],
    specs: { weight: "215g", studs: "Đinh FG sân cỏ tự nhiên", upper: "HybridTouch 2.0", level: "Thi đấu đỉnh cao" },
    status: "active", featured: true, isNew: false, isHot: true
  },
  {
    id: 203, code: "SP-203", name: "Vợt Cầu Lông Yonex Astrox 100ZZ Kurenai", brand: "Yonex", categoryId: "CAT-RACKET", category: "Cầu Lông - Tennis",
    costPrice: 3200000, profitPercent: 32.81, price: 4250000, salePrice: 3950000, discount: "-7%", stock: 0, sold: 104, rating: 5.0, reviewCount: 82,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["3U-G5", "4U-G5"], colors: ["Kurenai Đỏ Thẫm"],
    desc: "Cây vợt tấn công huyền thoại được Viktor Axelsen tin dùng, thân vợt siêu mỏng Hyper Slim Shaft.",
    features: ["Hệ thống phân bổ trọng lực Rotational Generator", "Thân vợt Namd carbon đàn hồi cực mạnh", "Mặt vợt ISOMETRIC điểm ngọt rộng"],
    specs: { weight: "83g (4U) / 88g (3U)", balance: "Nặng đầu (Head Heavy)", flex: "Cứng (Extra Stiff)", tension: "Tối đa 28 lbs (12.5 kg)", origin: "Made in Japan" },
    status: "active", featured: true, isNew: false, isHot: true
  },
  {
    id: 204, code: "SP-204", name: "Áo Thun Tập Gym Nam Under Armour HeatGear Compression", brand: "Under Armour", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 550000, profitPercent: 36.36, price: 750000, salePrice: 650000, discount: "-13%", stock: 2, sold: 230, rating: 4.7, reviewCount: 110,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Đen Carbon", "Xám Khói", "Xanh Navy"],
    desc: "Áo bó cơ tăng cường lưu thông máu, chất liệu HeatGear siêu nhẹ thấm hút mồ hôi nhanh gấp 3 lần.",
    features: ["Vải co giãn 4 chiều vận động không giới hạn", "Lưới thông gió nách và lưng thoáng mát", "Chống mùi kháng khuẩn Anti-Odor"],
    specs: { material: "84% Polyester / 16% Elastane", design: "Compression ôm sát", usage: "Tập tạ, Chạy bộ, Thể hình" },
    status: "active", featured: false, isNew: true, isHot: false
  },
  {
    id: 205, code: "SP-205", name: "Giày Chạy Bộ Adidas Adizero Adios Pro 3", brand: "Adidas", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 4200000, profitPercent: 30.71, price: 5490000, salePrice: 4990000, discount: "-9%", stock: 15, sold: 76, rating: 4.9, reviewCount: 54,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "43", "44"], colors: ["Trắng Sọc Đen Solar Red", "Đen Lucid Cyan"],
    desc: "Kỷ lục gia đường chạy cự ly 42km trang bị thanh sợi carbon ENERGYRODS 2.0 tối ưu động lượng.",
    features: ["Đệm 2 lớp Lightstrike Pro êm nảy bền bỉ", "Thanh carbon Energyrods mô phỏng xương bàn chân", "Đế cao su Continental bám đường ướt vượt trội"],
    specs: { weight: "215g", cushion: "Lightstrike Pro", plate: "Carbon Energyrods 2.0", drop: "6.5mm" },
    status: "active", featured: true, isNew: true, isHot: true
  },
  {
    id: 206, code: "SP-206", name: "Bóng Thi Đấu Cúp C1 Adidas UCL Pro 2026", brand: "Adidas", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 1800000, profitPercent: 33.33, price: 2400000, salePrice: 2190000, discount: "-9%", stock: 30, sold: 62, rating: 4.9, reviewCount: 40,
    image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bf?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614632537197-38a17061c2bf?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Size 5 Tiêu chuẩn"], colors: ["Trắng Sao Vàng Xanh"],
    desc: "Quả bóng thi đấu chính thức UEFA Champions League đạt chuẩn FIFA Quality Pro khắt khe nhất.",
    features: ["Cấu trúc không đường may hàn nhiệt Thermal bonded", "Vỏ bóng bề mặt hạt nổi khí động học", "Ruột cao su butyl giữ hơi tối đa"],
    specs: { weight: "430g", level: "FIFA Quality Pro", circumference: "68.5 - 69.5 cm" },
    status: "active", featured: false, isNew: false, isHot: true
  },
  {
    id: 207, code: "SP-207", name: "Vợt Tennis Wilson Pro Staff 97 v14", brand: "Wilson", categoryId: "CAT-RACKET", category: "Cầu Lông - Tennis",
    costPrice: 3800000, profitPercent: 28.95, price: 4900000, salePrice: 4500000, discount: "-8%", stock: 10, sold: 45, rating: 4.8, reviewCount: 32,
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Grip 2 (4 1/4)", "Grip 3 (4 3/8)"], colors: ["Nâu Đồng Ánh Kim Braid 45"],
    desc: "Cây vợt biểu tượng kiểm soát và cảm giác bóng chuẩn xác gắn liền với huyền thoại Roger Federer.",
    features: ["Công nghệ dệt sợi Carbon Braid 45 độc quyền", "Cấu trúc uốn Paradigm Bending tăng cảm giác bóng", "Độ đầm tay cực cao cho cú đánh uy lực"],
    specs: { weight: "315g (chưa đan dây)", headSize: "97 sq in", stringPattern: "16x19", balance: "31cm (10 pts HL)" },
    status: "active", featured: true, isNew: false, isHot: false
  },
  {
    id: 208, code: "SP-208", name: "Đai Lưng Tập Gym Da Bò Thật Harbinger Pro 4 Inch", brand: "Harbinger", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 650000, profitPercent: 36.92, price: 890000, salePrice: 790000, discount: "-11%", stock: 25, sold: 115, rating: 4.9, reviewCount: 78,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S (65-75cm)", "M (75-85cm)", "L (85-95cm)"], colors: ["Nâu Da Bò Tự Nhiên", "Đen Khóa Thép"],
    desc: "Bảo vệ cột sống an toàn tuyệt đối trong các bài tập nặng Squat, Deadlift với đệm lưng êm ái.",
    features: ["Da bò thật nguyên tấm dày 10mm siêu bền", "Khóa đôi thép không gỉ chịu lực cực đại", "Đệm lưng êm ái giảm chấn thương"],
    specs: { material: "100% Da bò thật & Thép tôi", width: "4 inch (10cm)", origin: "USA Brand" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 209, code: "SP-209", name: "Giày Chạy Bộ Asics Gel-Kayano 30", brand: "Asics", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 3100000, profitPercent: 28.71, price: 3990000, salePrice: 3590000, discount: "-10%", stock: 20, sold: 93, rating: 4.8, reviewCount: 68,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "42.5", "43", "44"], colors: ["Xanh Dương / Cam", "Trắng Tinh Khiết"],
    desc: "Vua của dòng giày ổn định chống lật cổ chân với công nghệ 4D GUIDANCE SYSTEM hiện đại.",
    features: ["Đệm PureGEL êm hơn 65% so với Gel cũ", "Bọt FF BLAST PLUS ECO đàn hồi bền vững", "Thiết kế chống lệch cổ chân cho người chân bẹt"],
    specs: { weight: "303g", cushion: "PureGEL + FF Blast+ Eco", drop: "10mm", type: "Chạy đường dài bảo vệ khớp" },
    status: "active", featured: false, isNew: true, isHot: true
  },
  {
    id: 210, code: "SP-210", name: "Giày Đá Bóng Nike Mercurial Superfly 10 Elite FG", brand: "Nike", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 4500000, profitPercent: 28.67, price: 5790000, salePrice: 5290000, discount: "-9%", stock: 14, sold: 58, rating: 4.9, reviewCount: 42,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "43"], colors: ["Xanh Glacier Blue", "Đồng Metallic"],
    desc: "Tốc độ xé gió cùng đế Air Zoom 3/4 chiều dài dành cho những cầu thủ bứt tốc hàng đầu.",
    features: ["Bộ đệm Air Zoom chuyên biệt cho bóng đá", "Chất liệu thân Gripknit bám bóng ướt", "Cổ Dynamic Fit co giãn ôm sát"],
    specs: { weight: "195g", studs: "Đinh FG thi đấu", level: "Elite chuyên nghiệp" },
    status: "active", featured: true, isNew: true, isHot: true
  },
  {
    id: 211, code: "SP-211", name: "Vợt Cầu Lông Lining Axforce 90 Max Hổ Ma", brand: "Lining", categoryId: "CAT-RACKET", category: "Cầu Lông - Tennis",
    costPrice: 3100000, profitPercent: 32.26, price: 4100000, salePrice: 3790000, discount: "-8%", stock: 16, sold: 72, rating: 4.8, reviewCount: 51,
    image: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["3U-G5", "4U-G5"], colors: ["Đen Đỏ Hổ Ma Max"],
    desc: "Vợt đập cầu uy lực khủng khiếp của Loh Kean Yew, khung Carbon M50 siêu bền chịu sức căng lớn.",
    features: ["Vật liệu Carbon siêu dẫn nhiệt M50", "Đũa vợt 6.2mm siêu mảnh giảm cản gió", "Công nghệ đập cầu bùng nổ Thunder Technology"],
    specs: { weight: "84g (4U)", balance: "305mm (Nặng đầu)", flex: "Cứng", tension: "Tối đa 30 lbs (13.5 kg)" },
    status: "active", featured: false, isNew: true, isHot: false
  },
  {
    id: 212, code: "SP-212", name: "Bình Nước Giữ Nhiệt Thể Thao Nike Recharge 950ml", brand: "Nike", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 420000, profitPercent: 38.10, price: 580000, salePrice: 490000, discount: "-16%", stock: 50, sold: 180, rating: 4.7, reviewCount: 88,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["950ml (32oz)"], colors: ["Đen Nhám Chống Trượt", "Trắng Bạc Inox"],
    desc: "Thép không gỉ 2 lớp chân không giữ lạnh tới 24 tiếng, nắp vặn thông minh chống rò rỉ nước.",
    features: ["Thép không gỉ 18/8 không chứa BPA", "Giữ lạnh 24h và giữ ấm 12h", "Quai xách cao su công thái học"],
    specs: { capacity: "950ml", insulation: "Chân không 2 lớp", material: "Inox 304" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 213, code: "SP-213", name: "Giày Bóng Rổ Nike LeBron XXI Akoya", brand: "Nike", categoryId: "CAT-GYM", category: "Bóng Rổ & Đa Năng",
    costPrice: 3800000, profitPercent: 31.32, price: 4990000, salePrice: 4490000, discount: "-10%", stock: 12, sold: 48, rating: 4.9, reviewCount: 36,
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["41", "42", "42.5", "43", "44", "45"], colors: ["Trắng Ngọc Trai Akoya"],
    desc: "Đỉnh cao giày bóng rổ với túi đệm Zoom Air gót và mũi chân, bảo vệ cổ chân cho các pha bật nhảy.",
    features: ["Đệm Zoom Turbo mũi và Zoom 13mm ở gót", "Cáp trợ lực 360 độ siết chặt chân", "Đế ngoài hoa văn xương cá bám sàn gỗ"],
    specs: { weight: "410g", cushion: "Air Zoom kép", position: "Tiền đạo & Trung phong" },
    status: "active", featured: true, isNew: true, isHot: false
  },
  {
    id: 214, code: "SP-214", name: "Giày Chạy Trail Salomon Speedcross 6 Gore-Tex", brand: "Salomon", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 2800000, profitPercent: 28.21, price: 3590000, salePrice: 3190000, discount: "-11%", stock: 16, sold: 55, rating: 4.8, reviewCount: 39,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "43"], colors: ["Đen Xám Bùn Đất", "Xanh Rêu Địa Hình"],
    desc: "Chinh phục mọi cung đường địa hình đồi núi, màng chống thấm nước GORE-TEX độc quyền.",
    features: ["Màng chống nước GORE-TEX thông thoáng", "Gai cao su Contagrip bám bùn lầy", "Hệ thống dây rút Quicklace thắt nhanh 1 giây"],
    specs: { weight: "328g", waterproof: "Gore-Tex 100%", surface: "Đường mòn, đá dốc, sình lầy" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 215, code: "SP-215", name: "Găng Tay Thủ Môn Adidas Predator Pro Có Xương", brand: "Adidas", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 1900000, profitPercent: 31.58, price: 2500000, salePrice: 2250000, discount: "-10%", stock: 18, sold: 41, rating: 4.9, reviewCount: 29,
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Size 8", "Size 9", "Size 10"], colors: ["Đen Đỏ Solar Red"],
    desc: "Mút URG 2.0 dính bóng cực đỉnh, có thanh xương ngón tháo rời chống lật ngón tay khi cản phá bóng mạnh.",
    features: ["Mút cao su URG 2.0 dính bóng mọi thời tiết", "Hệ thống xương ngón FINGERSAVE bảo vệ tối đa", "Thân dệt không quai đeo ôm cổ tay"],
    specs: { palm: "Latex URG 2.0 4mm", cut: "Negative Cut ôm ngón", protection: "Có xương tháo rời" },
    status: "active", featured: false, isNew: true, isHot: false
  },
  {
    id: 216, code: "SP-216", name: "Ống Cầu Lông Ba Sao Yonex Aerosensa 50 (12 Quả)", brand: "Yonex", categoryId: "CAT-RACKET", category: "Cầu Lông - Tennis",
    costPrice: 590000, profitPercent: 32.20, price: 780000, salePrice: 690000, discount: "-12%", stock: 80, sold: 340, rating: 5.0, reviewCount: 160,
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Tốc độ 77 (Chuẩn Việt Nam)"], colors: ["Trắng Lông Ngỗng"],
    desc: "Cầu thi đấu giải vô địch thế giới BWF, lông ngỗng tự nhiên cao cấp bay đầm và cực bền.",
    features: ["100% lông ngỗng tuyển chọn đều đặn", "Đế bồ kết bọc da tự nhiên 3 lớp", "Quỹ đạo bay ổn định tuyệt đối"],
    specs: { quantity: "12 quả / ống", speed: "77", standard: "BWF Approved Tournament" },
    status: "active", featured: false, isNew: false, isHot: true
  },
  {
    id: 217, code: "SP-217", name: "Dây Nhảy Thể Lực Tốc Độ Cao Rogue SR-1 Bearing", brand: "Rogue", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 280000, profitPercent: 39.29, price: 390000, salePrice: 350000, discount: "-10%", stock: 60, sold: 210, rating: 4.8, reviewCount: 95,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Dài 3m (Tùy chỉnh độ dài)"], colors: ["Đen Nhám", "Đỏ Nổi Bật"],
    desc: "Dây nhảy bạc đạn 4 vòng bi thép siêu mượt, chuyên dụng cho bài tập Double Unders trong CrossFit.",
    features: ["4 vòng bi xoay tốc độ cao không xoắn dây", "Cáp thép bọc nhựa PU chống mài mòn", "Tay cầm nhám công thái học chống tuột"],
    specs: { cable: "Cáp thép 2.4mm", bearings: "4x Precision Ball Bearings", origin: "USA Brand" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 218, code: "SP-218", name: "Đồng Hồ Thể Thao GPS Garmin Forerunner 265", brand: "Garmin", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 9200000, profitPercent: 26.09, price: 11600000, salePrice: 10490000, discount: "-10%", stock: 8, sold: 32, rating: 5.0, reviewCount: 28,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Size 46mm Tiêu chuẩn"], colors: ["Đen Viền Xám", "Trắng Dây Xanh"],
    desc: "Màn hình AMOLED sắc nét, đo chỉ số VO2 Max, động lực học chạy bộ và pin lên tới 13 ngày.",
    features: ["Màn hình cảm ứng AMOLED rực rỡ ngoài trời", "GPS đa băng tần GNSS định vị chính xác từng mét", "Theo dõi thể lực sẵn sàng tập luyện Training Readiness"],
    specs: { battery: "13 ngày (Smartwatch) / 20h (GPS)", waterproof: "5 ATM (50m)", sensors: "Đo nhịp tim Gen 4, Pulse Ox" },
    status: "active", featured: true, isNew: true, isHot: true
  },
  {
    id: 219, code: "SP-219", name: "Giày Đá Bóng Cỏ Nhân Tạo Nike Phantom GX 2 Pro TF", brand: "Nike", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 2100000, profitPercent: 28.57, price: 2700000, salePrice: 2450000, discount: "-9%", stock: 22, sold: 110, rating: 4.8, reviewCount: 74,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["39", "40", "41", "42", "42.5", "43"], colors: ["Đen Bạc Metallic", "Trắng Xanh Mint"],
    desc: "Đế đinh dăm TF bám sân phủi cực tốt, bề mặt vân nổi hỗ trợ chuyền và dứt điểm hiểm hóc.",
    features: ["Bề mặt NikeSkin bám bóng chân thật", "Đệm React siêu êm giảm chấn khớp gối", "Đinh dăm cao su chống trơn trượt sân mưa"],
    specs: { weight: "230g", studs: "Đinh dăm cao su TF", surface: "Sân cỏ nhân tạo 5-7 người" },
    status: "active", featured: false, isNew: true, isHot: true
  },
  {
    id: 220, code: "SP-220", name: "Quần Bó Cơ Thể Thao Nam 2 Trong 1 Nike Dri-FIT Stride", brand: "Nike", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 750000, profitPercent: 32.00, price: 990000, salePrice: 850000, discount: "-14%", stock: 35, sold: 140, rating: 4.7, reviewCount: 62,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL"], colors: ["Đen Tuyền", "Xám Khói"],
    desc: "Thiết kế thông minh lớp quần short ngoài nhẹ tênh và lớp lót bó cơ chống cọ xát đùi trong.",
    features: ["Chất vải Dri-FIT thấm mồ hôi siêu tốc", "Túi sau lưng có khóa kéo vừa điện thoại lớn", "Dải phản quang an toàn khi chạy đêm"],
    specs: { material: "100% Polyester tái chế", pockets: "3 túi (1 túi khóa kéo chống nước)" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 221, code: "SP-221", name: "Túi Vợt Cầu Lông Yonex Pro Tournament Bag 9 Cây", brand: "Yonex", categoryId: "CAT-RACKET", category: "Cầu Lông - Tennis",
    costPrice: 1500000, profitPercent: 32.67, price: 1990000, salePrice: 1750000, discount: "-12%", stock: 15, sold: 50, rating: 4.9, reviewCount: 38,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Kích thước lớn 78x38x34cm"], colors: ["Xanh Navy Ánh Bạc", "Đen Vàng Chanh"],
    desc: "Ngăn cách nhiệt bảo vệ dây cước khỏi nhiệt độ môi trường, ngăn riêng biệt đựng giày và quần áo ướt.",
    features: ["Ngăn lót bạc cách nhiệt Thermo Guard", "Ngăn để giày riêng biệt thoáng khí", "Quai đeo công thái học êm ái như balo"],
    specs: { capacity: "Đựng 6 - 9 cây vợt + phụ kiện", material: "Polyester chống nước 90%" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 222, code: "SP-222", name: "Đệm Lót Tập Yoga Cao Su Tự Nhiên Lululemon 5mm", brand: "Lululemon", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 1400000, profitPercent: 32.14, price: 1850000, salePrice: 1650000, discount: "-11%", stock: 20, sold: 85, rating: 4.9, reviewCount: 56,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["180cm x 66cm x 5mm"], colors: ["Đen Marble Đá Hoa Cương", "Xanh Rêu Pastel"],
    desc: "Độ bám sàn chống trượt đỉnh cao ngay cả khi đổ nhiều mồ hôi, cao su tự nhiên thân thiện môi trường.",
    features: ["Độ bám vô song bất kể mồ hôi tay", "Độ dày 5mm bảo vệ hoàn hảo khớp gối", "Lớp chống khuẩn ngăn ẩm mốc"],
    specs: { material: "Cao su thiên nhiên đạt chuẩn FSC", thickness: "5mm", weight: "2.38kg" },
    status: "active", featured: false, isNew: true, isHot: false
  },
  {
    id: 223, code: "SP-223", name: "Kính Bơi Thi Đấu Chống Đọng Sương Speedo Fastskin Pure Focus", brand: "Speedo", categoryId: "CAT-GYM", category: "Bơi Lội & Thể Thao",
    costPrice: 1200000, profitPercent: 33.33, price: 1600000, salePrice: 1450000, discount: "-9%", stock: 25, sold: 68, rating: 4.8, reviewCount: 44,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Freesize (Kèm 3 cầu mũi thay thế)"], colors: ["Tráng Gương Bạc Cầu Vồng", "Khói Đen Tàng Hình"],
    desc: "Mắt kính tráng gương chống chói mắt dưới ánh nắng mặt trời, giảm lực cản nước tới 5% khi bơi tốc độ.",
    features: ["Mắt kính thủy động lực học cản nước tối thiểu", "Lớp phủ Anti-Fog chống đọng sương gấp 2 lần", "Dây đeo có thước đo lực siết chính xác"],
    specs: { lens: "Tráng gương Polycarbonate", standard: "FINA Approved thi đấu Olympic" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 224, code: "SP-224", name: "Con Lăn Giãn Cơ Massage Bọt Xốp TriggerPoint GRID 1.0", brand: "TriggerPoint", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 600000, profitPercent: 36.67, price: 820000, salePrice: 720000, discount: "-12%", stock: 30, sold: 125, rating: 4.8, reviewCount: 70,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Dài 33cm x Đường kính 14cm"], colors: ["Cam Rực Rỡ", "Đen Nguyên Khối"],
    desc: "Giải phóng mỏi cơ mạc sau tập luyện, mô phỏng cảm giác bàn tay massage của chuyên viên trị liệu.",
    features: ["Bề mặt rãnh mô phỏng ngón tay và lòng bàn tay", "Lõi nhựa rỗng cứng chịu tải trọng 225kg", "Không bị xẹp lún sau nhiều năm sử dụng"],
    specs: { weightLimit: "225 kg", material: "Bọt xốp EVA cao cấp", length: "33cm" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 225, code: "SP-225", name: "Giày Chạy Bộ Nam Puma Deviate Nitro 2", brand: "Puma", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 2800000, profitPercent: 32.14, price: 3700000, salePrice: 3290000, discount: "-11%", stock: 18, sold: 64, rating: 4.8, reviewCount: 45,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "43"], colors: ["Xanh Lá Dạ Quang Puma", "Cam Lửa"],
    desc: "Đệm NITRO Elite siêu đàn hồi kết hợp đĩa sợi carbon PWRPLATE toàn phần với mức giá cực kỳ dễ tiếp cận.",
    features: ["Bọt NITRO Elite bơm khí nitơ siêu nhẹ", "Đĩa carbon PWRPLATE trợ lực từng guồng chân", "Đế ngoài PUMAGRIP bám mặt đường ướt xuất sắc"],
    specs: { weight: "260g", cushion: "Nitro Elite Foam", plate: "PWRPLATE Carbon", drop: "6mm" },
    status: "active", featured: false, isNew: true, isHot: false
  },
  {
    id: 226, code: "SP-226", name: "Quần Bó Cơ Nữ Nâng Mông Gymshark Vital Seamless 2.0", brand: "Gymshark", categoryId: "CAT-GYM", category: "Gym & Fitness",
    costPrice: 720000, profitPercent: 34.72, price: 970000, salePrice: 850000, discount: "-12%", stock: 35, sold: 190, rating: 4.9, reviewCount: 115,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"], colors: ["Xám Khói Đốm", "Xanh Rêu Pastel", "Hồng Mận"],
    desc: "Dệt liền mạch không đường may, cạp cao ôm chặt eo và công nghệ nâng mông tự nhiên cho phái nữ.",
    features: ["Công nghệ Seamless không đường may chống hằn", "Đai lưng cạp cao gen bụng chống tuột khi squat", "Họa tiết tạo bóng tôn dáng vòng 3"],
    specs: { material: "93% Nylon / 7% Elastane", waist: "High-waisted cạp cao" },
    status: "active", featured: false, isNew: false, isHot: true
  },
  {
    id: 227, code: "SP-227", name: "Đai Đeo Hông Chạy Bộ Đựng Nước Aonijie W8101", brand: "Aonijie", categoryId: "CAT-RUN", category: "Chạy Bộ",
    costPrice: 280000, profitPercent: 39.29, price: 390000, salePrice: 320000, discount: "-18%", stock: 45, sold: 220, rating: 4.7, reviewCount: 105,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S/M (Vòng eo 66-80cm)", "M/L (Vòng eo 80-95cm)"], colors: ["Đen Phản Quang", "Xanh Neon"],
    desc: "Ôm sát hông 360 độ hoàn toàn không nảy lắc khi chạy nhanh, kèm bình nước mềm 250ml tiện lợi.",
    features: ["Chất vải thun co giãn 4 chiều thoáng khí", "Không rung lắc dù chứa điện thoại và nước", "Tích hợp móc treo gậy chạy trail và số đeo BIB"],
    specs: { weight: "40g", capacity: "Chứa điện thoại 6.8 inch + Bình 250ml" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 228, code: "SP-228", name: "Bọc Ống Đồng Bóng Đá Carbon Siêu Nhẹ Nike Mercurial Lite", brand: "Nike", categoryId: "CAT-FOOTBALL", category: "Bóng Đá",
    costPrice: 420000, profitPercent: 38.10, price: 580000, salePrice: 490000, discount: "-16%", stock: 40, sold: 135, rating: 4.8, reviewCount: 60,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S (Dưới 1m60)", "M (1m60 - 1m75)", "L (Trên 1m75)"], colors: ["Đen Bạc Mercurial", "Trắng Cam"],
    desc: "Vỏ nhựa K-resin chịu lực va chạm mạnh từ đối phương, lớp lót xốp EVA êm ái kèm vớ bao cố định.",
    features: ["Vỏ mỏng ôm sát theo đường cong ống đồng", "Bọt xốp EVA đục lỗ thoáng khí giảm lực chấn", "Kèm đôi vớ thun co giãn giữ bọc chắc chắn"],
    specs: { weight: "50g", shell: "79% K-resin / 21% EVA" },
    status: "active", featured: false, isNew: false, isHot: false
  },
  {
    id: 229, code: "SP-229", name: "Bóng Rổ Da Thi Đấu Trong Nhà & Ngoài Trời Molten GG7X", brand: "Molten", categoryId: "CAT-GYM", category: "Bóng Rổ & Ngoài Trời",
    costPrice: 850000, profitPercent: 35.29, price: 1150000, salePrice: 990000, discount: "-14%", stock: 25, sold: 90, rating: 4.9, reviewCount: 52,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Size 7 (Nam tiêu chuẩn)"], colors: ["Cam Nâu Viền Vàng 12 Mảnh"],
    desc: "Bóng rổ tiêu chuẩn thi đấu FIBA, da PU cao cấp bám dính tay cực tốt giúp kiểm soát bóng chuẩn xác.",
    features: ["Thiết kế 12 mảnh ghép đặc trưng của Molten", "Chất liệu da tổng hợp PU chống mài mòn cao", "Độ nảy đều đặn và đầm tay"],
    specs: { level: "FIBA Approved", size: "Size 7", surface: "Sân trong nhà & Sân bê tông ngoài trời" },
    status: "active", featured: false, isNew: false, isHot: true
  },
  {
    id: 230, code: "SP-230", name: "Quả Cầu Mây Thi Đấu Marathon MT.908", brand: "Marathon", categoryId: "CAT-GYM", category: "Thể Thao Truyền Thống",
    costPrice: 220000, profitPercent: 36.36, price: 300000, salePrice: 260000, discount: "-13%", stock: 30, sold: 75, rating: 4.8, reviewCount: 30,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["Tiêu chuẩn thi đấu"], colors: ["Vàng Nâu Marathon"],
    desc: "Quả cầu mây nhựa tổng hợp đạt chuẩn thi đấu SEA Games và Asiad, độ nảy và độ bền tuyệt đối.",
    features: ["Chất liệu nhựa Polypropylene tổng hợp cao cấp", "Đạt chuẩn liên đoàn cầu mây quốc tế ISTAF", "Độ nảy hoàn hảo cho những pha móc cầu"],
    specs: { weight: "175g", origin: "Made in Thailand", standard: "ISTAF Approved" },
    status: "active", featured: false, isNew: false, isHot: false
  }
];