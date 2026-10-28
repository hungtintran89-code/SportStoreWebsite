var vouchers = [
  {
    code: "SPORT50K",
    title: "Giảm ngay 50.000 ₫",
    desc: "Áp dụng cho mọi đơn hàng trang bị thể thao từ 500.000 ₫ trở lên",
    type: "cash",
    discountValue: 50000,
    minOrder: 500000,
    maxDiscount: 50000,
    expiryDate: "2026-12-31",
    status: "active"
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
    status: "active"
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
    status: "active"
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
    status: "active"
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
    status: "active"
  }
];

var MOCK_VOUCHERS = vouchers;