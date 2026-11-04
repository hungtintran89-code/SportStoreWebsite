/* ==============================================================================
   SPORTSTORE - LOGIC TRANG CHỦ (DEV1_HOME.JS)
   Viết dạng hàm độc lập, dễ hiểu, dùng onclick trực tiếp, chỉ dùng for và if-else
============================================================================== */

// Biến quản lý vị trí slide banner hiện tại và bộ đếm giờ tự chuyển
var slideHienTai = 0;
var timerChaySlide = null;

// ==============================================================================
// 1. KHỐI BANNER SLIDER (CHUYỂN ẢNH)
// ==============================================================================

// Hàm vẽ danh sách slide ảnh và các chấm tròn từ banners.js
function khoiTaoBanner() {
  var dsBanner = [];
  if (typeof banners !== "undefined") {
    dsBanner = banners;
  }
  if (!dsBanner || dsBanner.length === 0) return;

  var khungSlides = document.getElementById("dev1-carousel-slides");
  var khungDots = document.getElementById("dev1-carousel-dots");
  if (!khungSlides || !khungDots) return;

  var htmlSlides = "";
  var htmlDots = "";

  for (var i = 0; i < dsBanner.length; i++) {
    var b = dsBanner[i];

    // Tạo HTML cho từng tấm slide
    htmlSlides += `
      <div class="dev1-slide-item ${i === 0 ? "active" : ""}" style="background-image: url('${b.bg}')">
        <div class="dev1-slide-overlay"></div>
        <div class="dev1-slide-content">
          <span class="sport-badge badge-cyan dev1-slide-badge">${b.badge || "SPORT"}</span>
          <h1 class="dev1-slide-title">${b.title}</h1>
          <p class="dev1-slide-sub">${b.subtitle}</p>
          <div class="dev1-slide-tag-row">
            <a href="pages/dev2_products.html" class="btn-sport btn-primary">${b.btnText || "Khám Phá"}</a>
            <span class="sport-badge badge-orange dev1-slide-tag-pill">${b.tag || "HOT"}</span>
          </div>
        </div>
      </div>
    `;

    // Tạo chấm tròn có gắn onclick chuyển tới đúng slide đó
    htmlDots += `<div class="dev1-dot ${i === 0 ? "active" : ""}" onclick="hienThiSlide(${i})"></div>`;
  }

  khungSlides.innerHTML = htmlSlides;
  khungDots.innerHTML = htmlDots;

  // Bắt đầu đếm giờ tự động chuyển slide sau mỗi 4.5 giây
  datLaiTimerSlide();
}

// Hàm hiển thị đúng slide tại vị trí mong muốn
function hienThiSlide(viTri) {
  var tatCaSlides = document.querySelectorAll(".dev1-slide-item");
  var tatCaDots = document.querySelectorAll(".dev1-dot");
  if (tatCaSlides.length === 0) return;

  // Xử lý quay vòng: nếu quá slide cuối thì về 0, nếu lùi quá 0 thì về cuối
  if (viTri >= tatCaSlides.length) viTri = 0;
  if (viTri < 0) viTri = tatCaSlides.length - 1;
  slideHienTai = viTri;

  // Tắt active ở tất cả slide và dot
  for (var i = 0; i < tatCaSlides.length; i++) {
    tatCaSlides[i].classList.remove("active");
  }
  for (var j = 0; j < tatCaDots.length; j++) {
    tatCaDots[j].classList.remove("active");
  }

  // Bật active cho slide và dot được chọn
  tatCaSlides[slideHienTai].classList.add("active");
  if (tatCaDots[slideHienTai]) {
    tatCaDots[slideHienTai].classList.add("active");
  }

  // Reset lại bộ đếm giờ để người dùng kịp xem
  datLaiTimerSlide();
}

// Hàm bấm nút lùi (❮) - được gọi bởi onclick="luiSlide()" trong HTML
function luiSlide() {
  hienThiSlide(slideHienTai - 1);
}

// Hàm bấm nút tiến (❯) - được gọi bởi onclick="toiSlide()" trong HTML
function toiSlide() {
  hienThiSlide(slideHienTai + 1);
}

// Tự động nhảy slide sau 4.5 giây
function datLaiTimerSlide() {
  clearInterval(timerChaySlide);
  timerChaySlide = setInterval(function () {
    toiSlide();
  }, 4500);
}

// ==============================================================================
// 2. KHỐI ĐỒNG HỒ ĐẾM NGƯỢC FLASH SALE
// ==============================================================================
function chayDongHoFlashSale() {
  // Đặt thời gian đếm ngược mẫu: 8 tiếng 45 phút 27 giây (quy ra tổng số giây)
  var tongGiay = 8 * 3600 + 45 * 60 + 27;

  var oGio = document.getElementById("dev1-hours");
  var oPhut = document.getElementById("dev1-minutes");
  var oGiay = document.getElementById("dev1-seconds");
  if (!oGio || !oPhut || !oGiay) return;

  setInterval(function () {
    if (tongGiay <= 0) return;
    tongGiay--;

    var h = Math.floor(tongGiay / 3600);
    var m = Math.floor((tongGiay % 3600) / 60);
    var s = tongGiay % 60;

    // Định dạng luôn có 2 chữ số (VD: 08:05:09)
    oGio.textContent = (h < 10 ? "0" : "") + h;
    oPhut.textContent = (m < 10 ? "0" : "") + m;
    oGiay.textContent = (s < 10 ? "0" : "") + s;
  }, 1000);
}

// ==============================================================================
// 3. KHỐI SẢN PHẨM FLASH SALE
// ==============================================================================
function hienThiSanPhamFlashSale() {
  var khungFlashSale = document.getElementById("dev1-flash-grid");
  if (!khungFlashSale) return;
  khungFlashSale.innerHTML = "";

  // Tận dụng hàm readJson() có sẵn trong common.js để đọc dữ liệu
  var tatCaSanPham = readJson("sport_products", []);
  if (!Array.isArray(tatCaSanPham) || tatCaSanPham.length === 0) {
    tatCaSanPham = typeof products !== "undefined" ? products : [];
  }

  // Lọc ra tối đa 4 sản phẩm đang có giảm giá (originalPrice > price)
  var dsSale = [];
  for (var i = tatCaSanPham.length; i >= 0; i--) {
    var sp = tatCaSanPham[i];
    if (!sp || sp.status === "hidden") continue;

    var giaBan = Number(sp.price || 0);
    var giaGoc = Number(sp.originalPrice || 0);

    if (giaGoc > giaBan) {
      dsSale.push(sp);
      if (dsSale.length === 4) break;
    }
  }

  // Vẽ 4 sản phẩm Flash Sale và định dạng tiền bằng formatMoney() của common.js
  for (var j = 0; j < dsSale.length; j++) {
    var item = dsSale[j];
    var giaHienThi = Number(item.price || 0);
    var giaCu = Number(item.originalPrice || 0);
    var phanTramGiam =
      "-" + Math.round(((giaCu - giaHienThi) / giaCu) * 100) + "%";

    var daBan = Number(item.sold || 50);
    var tonKho = Number(item.stock || 0);
    var phanTramDaBan = Math.min(
      95,
      Math.round((daBan / (daBan + tonKho)) * 100),
    );

    var cardDiv = document.createElement("div");
    cardDiv.className = "dev1-flash-card";
    cardDiv.innerHTML = `
      <div class="dev1-card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <span class="dev1-card-discount-badge">${phanTramGiam}</span>
      </div>
      <div class="dev1-card-body">
        <div class="dev1-card-cat">${item.category}</div>
        <h3 class="dev1-card-title">${item.name}</h3>
        <div class="dev1-price-row">
          <span class="dev1-sale-price">${formatMoney(giaHienThi)}</span>
          <span class="dev1-old-price">${formatMoney(giaCu)}</span>
        </div>
        <div class="dev1-progress-bar">
          <div class="dev1-progress-fill" style="width: ${phanTramDaBan}%"></div>
        </div>
        <div class="dev1-flash-progress-meta">
          <span>Đã bán: ${daBan}</span>
          <span>⭐ 5.0</span>
        </div>
        <a href="pages/dev2_products.html?id=${item.id}" class="btn-sport btn-accent dev1-btn-flash-buy">Săn sale ngay</a>
      </div>
    `;
    khungFlashSale.appendChild(cardDiv);
  }
}

// ==============================================================================
// 4. KHỐI DANH MỤC TIÊU BIỂU (4 Ô BỘ MÔN)
// ==============================================================================
function hienThiDanhMucTieuBieu() {
  var dsDanhMuc = [];
  if (typeof categories !== "undefined") {
    dsDanhMuc = categories;
  }

  var khungDanhMuc = document.getElementById("dev1-cat-grid");
  if (!khungDanhMuc) return;

  var html = "";
  // Lấy 4 danh mục đầu tiên
  for (var i = 0; i < dsDanhMuc.length && i < 4; i++) {
    var c = dsDanhMuc[i];

    html += `
      <a href="pages/dev2_products.html?cat=${c.id}" class="dev1-cat-card">
        <div class="dev1-cat-icon">${c.icon || "🏅"}</div>
        <div>
          <div class="dev1-cat-title">${c.name}</div>
          <div class="dev1-cat-count">${c.itemCount || 10}+ Sản phẩm</div>
        </div>
      </a>
    `;
  }

  khungDanhMuc.innerHTML = html;
}

// ==============================================================================
// 5. KHỐI TAB TRANG BỊ XU HƯỚNG (BÁN CHẠY & HÀNG MỚI)
// ==============================================================================

// Hàm đổi tab - được gọi bởi onclick="chonTabXuHuong('bestseller')" trong HTML
function chonTabXuHuong(loaiTab) {
  var btnBanChay = document.getElementById("tab-bestseller");
  var btnHangMoi = document.getElementById("tab-new");

  // 1. Chuyển đổi class active giữa 2 nút
  if (loaiTab === "bestseller") {
    if (btnBanChay) btnBanChay.classList.add("active");
    if (btnHangMoi) btnHangMoi.classList.remove("active");
  } else {
    if (btnHangMoi) btnHangMoi.classList.add("active");
    if (btnBanChay) btnBanChay.classList.remove("active");
  }

  // 2. Lấy toàn bộ danh sách sản phẩm
  var tatCa = [];
  try {
    tatCa = JSON.parse(localStorage.getItem("sport_products")) || [];
  } catch (e) {
    tatCa = [];
  }
  if (tatCa.length === 0 && typeof products !== "undefined") {
    tatCa = products;
  }

  // 3. Dùng vòng lặp for lọc theo tab
  var dsLoai = readJson("sport_categories", []);
  var dsHienThi = [];
  for (var i = 0; i < tatCa.length; i++) {
    var p = tatCa[i];
    if (!p || p.status === "hidden" || p.status === "inactive") continue;

    // Bỏ qua nếu danh mục của sản phẩm này đang bị ẩn
    var loaiBiAn = false;
    for (var k = 0; k < dsLoai.length; k++) {
      if ((dsLoai[k].id === p.categoryId || dsLoai[k].name === p.category) && dsLoai[k].status === "hidden") {
        loaiBiAn = true;
        break;
      }
    }
    if (loaiBiAn) continue;

    if (loaiTab === "bestseller" && p.isHot === true) {
      dsHienThi.push(p);
    } else if (loaiTab === "new" && p.isNew === true) {
      dsHienThi.push(p);
    }
  }

  // 4. Vẽ danh sách ra màn hình
  veLuoiSanPhamXuHuong(dsHienThi);
}

// Hàm vẽ các thẻ sản phẩm xu hướng
function veLuoiSanPhamXuHuong(danhSach) {
  var khung = document.getElementById("dev1-trending-grid");
  if (!khung) return;

  if (danhSach.length === 0) {
    khung.innerHTML =
      '<p style="grid-column:1/-1; text-align:center; padding:30px; color:#64748b;">Chưa có sản phẩm nào.</p>';
    return;
  }

  var html = "";
  // Hiển thị tối đa 6 sản phẩm
  for (var i = 0; i < danhSach.length && i < 6; i++) {
    var sp = danhSach[i];
    var giaHienThi = sp.salePrice || sp.price || 0;

    html += `
      <div class="dev1-gear-card">
        <div class="dev1-card-media">
          <img src="${sp.image}" alt="${sp.name}">
          <span class="sport-badge badge-cyan dev1-card-badge">${sp.badge || "HOT"}</span>
        </div>
        <div class="dev1-card-body">
          <div class="dev1-card-cat">${sp.category || "Thể Thao"}</div>
          <h3 class="dev1-card-title">${sp.name}</h3>
          <div class="dev1-price-row">
            <span class="dev1-sale-price">${formatMoney(giaHienThi)}</span>
            <span class="dev1-rating-star">⭐ ${sp.rating || 5.0}</span>
          </div>
          <div class="dev1-card-btn-row">
            <a href="pages/dev2_products.html?id=${sp.id}" class="btn-sport btn-outline dev1-card-btn-detail" style="text-decoration:none;">Chi Tiết</a>
            <button type="button" class="btn-sport btn-primary dev1-card-btn-cart" onclick="themVaoGioNhanh(${sp.id})">+ Giỏ</button>
          </div>
        </div>
      </div>
    `;
  }

  khung.innerHTML = html;
}

// ==============================================================================
// 6. HÀM THÊM NHANH VÀO GIỎ HÀNG (ONCLICK TỪ NÚT "+ GIỎ")
// ==============================================================================
function themVaoGioNhanh(idSanPham) {
  // Tìm sản phẩm trong kho bằng vòng lặp for
  var tatCa = typeof products !== "undefined" ? products : [];
  var spChon = null;

  for (var i = 0; i < tatCa.length; i++) {
    if (tatCa[i].id == idSanPham) {
      spChon = tatCa[i];
      break;
    }
  }

  if (!spChon) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }

  // Chuẩn bị thông tin sản phẩm
  var monHang = {
    id: spChon.id,
    name: spChon.name,
    price: spChon.salePrice || spChon.price || 0,
    image: spChon.image,
    size: "Tiêu chuẩn",
    color: "Mặc định",
    stock: spChon.stock || 50,
  };

  // Gọi hàm addToCart chung của website (trong common.js)
  if (typeof addToCart === "function") {
    var ok = addToCart(monHang, 1);
    if (ok && typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  } else {
    alert("Đã thêm [" + monHang.name + "] vào giỏ hàng thành công!");
  }
}

// ==============================================================================
// 7. KHỐI FORM ĐĂNG KÝ BẢN TIN (ONSUBMIT TỪ FORM)
// ==============================================================================
function dangKyNhanTin(event) {
  event.preventDefault(); // Chặn việc trình duyệt load lại trang

  var oEmail = document.getElementById("dev1-email-input");
  var email = oEmail ? oEmail.value.trim() : "";

  if (!email || email.indexOf("@") === -1) {
    alert("Vui lòng nhập địa chỉ email hợp lệ!");
    return;
  }

  alert(
    "Đăng ký thành công! Mã ưu đãi SPORT2026 đã được gửi tới email: " + email,
  );
  oEmail.value = "";
}

// ==============================================================================
// 8. TỰ ĐỘNG KHỞI CHẠY TẤT CẢ KHI TẢI TRANG
// ==============================================================================
window.onload = function () {
  // Cập nhật số lượng giỏ hàng trên Header nếu có
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }

  khoiTaoBanner();
  chayDongHoFlashSale();
  hienThiSanPhamFlashSale();
  hienThiDanhMucTieuBieu();
  chonTabXuHuong("bestseller"); // Mặc định mở tab Bán chạy trước
};
