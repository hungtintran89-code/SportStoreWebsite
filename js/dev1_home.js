
// Biến lưu trạng thái của Slider Banner
var slideHienTai = 0;
var danhSachBanner = [];
var timerTuDongChay = null;

document.addEventListener("DOMContentLoaded", function () {
  // 1. Cập nhật số lượng giỏ hàng trên Header (hàm của common.js)
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }

  // 2. Chạy lần lượt 6 chức năng của trang chủ
  khoiTaoBannerSlider();
  khoiTaoDongHoFlashSale();
  hienThiSanPhamFlashSale();
  hienThiDanhMucTieuBieu();
  khoiTaoTabTrangBiXuHuong();
  khoiTaoFormDangKyNhanTin();
});

function khoiTaoBannerSlider() {
  // Lấy dữ liệu từ file banners.js
  if (typeof banners !== "undefined") {
    danhSachBanner = banners;
  }
  if (!danhSachBanner || danhSachBanner.length === 0) return;

  var khungChuaSlides = document.getElementById("dev1-carousel-slides");
  var khungChuaDots = document.getElementById("dev1-carousel-dots");
  if (!khungChuaSlides || !khungChuaDots) return;

  // Xóa nội dung mẫu cũ
  khungChuaSlides.innerHTML = "";
  khungChuaDots.innerHTML = "";

  // Tạo từng slide ảnh và từng chấm tròn
  for (var i = 0; i < danhSachBanner.length; i++) {
    var b = danhSachBanner[i];

    // Tạo thẻ div cho slide
    var slideDiv = document.createElement("div");
    slideDiv.className = "dev1-slide-item" + (i === 0 ? " active" : "");
    slideDiv.style.backgroundImage = "url('" + (b.bg || "") + "')";

    slideDiv.innerHTML = `
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
    `;
    khungChuaSlides.appendChild(slideDiv);

    // Tạo chấm tròn (dot)
    var dotSpan = document.createElement("div");
    dotSpan.className = "dev1-dot" + (i === 0 ? " active" : "");
    dotSpan.setAttribute("data-index", i);
    // Khi bấm vào chấm tròn thì nhảy tới slide đó
    dotSpan.onclick = function () {
      var viTri = Number(this.getAttribute("data-index"));
      hienThiSlide(viTri);
    };
    khungChuaDots.appendChild(dotSpan);
  }

  // Nút bấm lùi lại (❮)
  var nutPrev = document.getElementById("dev1-prev-slide");
  if (nutPrev) {
    nutPrev.onclick = function () {
      var viTriMoi = slideHienTai - 1;
      if (viTriMoi < 0) viTriMoi = danhSachBanner.length - 1;
      hienThiSlide(viTriMoi);
    };
  }

  // Nút bấm tiến tới (❯)
  var nutNext = document.getElementById("dev1-next-slide");
  if (nutNext) {
    nutNext.onclick = function () {
      var viTriMoi = slideHienTai + 1;
      if (viTriMoi >= danhSachBanner.length) viTriMoi = 0;
      hienThiSlide(viTriMoi);
    };
  }

  // Thiết lập tự động nhảy slide sau mỗi 4.5 giây
  batDauTuDongChaySlide();
}

function hienThiSlide(viTri) {
  slideHienTai = viTri;

  var tatCaSlides = document.querySelectorAll(".dev1-slide-item");
  var tatCaDots = document.querySelectorAll(".dev1-dot");

  for (var i = 0; i < tatCaSlides.length; i++) {
    tatCaSlides[i].classList.remove("active");
  }
  for (var j = 0; j < tatCaDots.length; j++) {
    tatCaDots[j].classList.remove("active");
  }

  if (tatCaSlides[slideHienTai]) tatCaSlides[slideHienTai].classList.add("active");
  if (tatCaDots[slideHienTai]) tatCaDots[slideHienTai].classList.add("active");

  // Khởi động lại đồng hồ đếm 4.5s sau khi người dùng bấm nút
  batDauTuDongChaySlide();
}

function batDauTuDongChaySlide() {
  clearInterval(timerTuDongChay);
  timerTuDongChay = setInterval(function () {
    var viTriTiepTheo = slideHienTai + 1;
    if (viTriTiepTheo >= danhSachBanner.length) viTriTiepTheo = 0;
    hienThiSlide(viTriTiepTheo);
  }, 4500);
}

function khoiTaoDongHoFlashSale() {
  // Đặt thời gian đếm ngược: 8 tiếng 45 phút 27 giây
  var tongSoGiay = 8 * 3600 + 45 * 60 + 27;

  var oGio = document.getElementById("dev1-hours");
  var oPhut = document.getElementById("dev1-minutes");
  var oGiay = document.getElementById("dev1-seconds");

  if (!oGio || !oPhut || !oGiay) return;

  setInterval(function () {
    if (tongSoGiay <= 0) return;
    tongSoGiay--;

    var h = Math.floor(tongSoGiay / 3600);
    var m = Math.floor((tongSoGiay % 3600) / 60);
    var s = tongSoGiay % 60;

    // Định dạng luôn có 2 chữ số (VD: 08:05:09)
    oGio.textContent = (h < 10 ? "0" : "") + h;
    oPhut.textContent = (m < 10 ? "0" : "") + m;
    oGiay.textContent = (s < 10 ? "0" : "") + s;
  }, 1000);
}

function hienThiSanPhamFlashSale() {
  var dsSale = [];
  if (typeof flashSale !== "undefined" && flashSale.items) {
    dsSale = flashSale.items;
  }

  var khungFlashSale = document.getElementById("dev1-flash-grid");
  if (!khungFlashSale) return;
  khungFlashSale.innerHTML = "";

  for (var i = 0; i < dsSale.length; i++) {
    var item = dsSale[i];
    var phanTramDaBan = Math.round((item.sold / item.stock) * 100);

    var cardDiv = document.createElement("div");
    cardDiv.className = "dev1-flash-card";
    cardDiv.innerHTML = `
      <div class="dev1-card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <span class="dev1-card-discount-badge">${item.discount}</span>
      </div>
      <div class="dev1-card-body">
        <div class="dev1-card-cat">${item.category}</div>
        <h3 class="dev1-card-title">${item.name}</h3>
        <div class="dev1-price-row">
          <span class="dev1-sale-price">${formatMoney(item.salePrice)}</span>
          <span class="dev1-old-price">${formatMoney(item.price)}</span>
        </div>
        <div class="dev1-progress-bar">
          <div class="dev1-progress-fill" style="width: ${phanTramDaBan}%"></div>
        </div>
        <div class="dev1-flash-progress-meta">
          <span>Đã bán: ${item.sold}</span>
          <span>⭐ ${item.rating}</span>
        </div>
        <!-- Bấm Săn sale ngay sẽ dẫn sang trang sản phẩm mở món này -->
        <a href="pages/dev2_products.html?id=${item.id}" class="btn-sport btn-accent dev1-btn-flash-buy">Săn sale ngay</a>
      </div>
    `;
    khungFlashSale.appendChild(cardDiv);
  }
}

function hienThiDanhMucTieuBieu() {
  var dsDanhMuc = [];
  if (typeof categories !== "undefined") {
    dsDanhMuc = categories;
  }

  var khungDanhMuc = document.getElementById("dev1-cat-grid");
  if (!khungDanhMuc) return;
  khungDanhMuc.innerHTML = "";

  // Lấy tối đa 4 danh mục để hiển thị đẹp trên trang chủ
  for (var i = 0; i < dsDanhMuc.length && i < 4; i++) {
    var c = dsDanhMuc[i];
    var theDiv = document.createElement("a");
    theDiv.href = "pages/dev2_products.html";
    theDiv.className = "dev1-cat-card";
    theDiv.innerHTML = `
      <div class="dev1-cat-icon">${c.icon || "🏅"}</div>
      <div>
        <div class="dev1-cat-title">${c.name}</div>
        <div class="dev1-cat-count">${c.itemCount || 10}+ Sản phẩm</div>
      </div>
    `;
    khungDanhMuc.appendChild(theDiv);
  }
}

function khoiTaoTabTrangBiXuHuong() {
  // 1. Đọc tất cả sản phẩm từ LocalStorage hoặc file products.js
  var tatCaSanPham = [];
  try {
    var raw = localStorage.getItem("sport_products");
    if (raw) tatCaSanPham = JSON.parse(raw);
  } catch (e) {
    tatCaSanPham = [];
  }
  if (!tatCaSanPham || tatCaSanPham.length === 0) {
    if (typeof products !== "undefined") tatCaSanPham = products;
  }

  // 2. Lọc ra danh sách Bán chạy nhất (isHot == true)
  var dsBanChay = [];
  for (var i = 0; i < tatCaSanPham.length; i++) {
    if (tatCaSanPham[i].isHot === true) {
      dsBanChay.push(tatCaSanPham[i]);
    }
  }

  // 3. Lọc ra danh sách Hàng mới về (isNew == true)
  var dsHangMoi = [];
  for (var j = 0; j < tatCaSanPham.length; j++) {
    if (tatCaSanPham[j].isNew === true) {
      dsHangMoi.push(tatCaSanPham[j]);
    }
  }

  // Khung chứa 2 nút tab
  var khungNutTab = document.getElementById("dev1-tab-buttons");
  if (!khungNutTab) return;
  khungNutTab.innerHTML = `
    <button type="button" class="dev1-tab-btn active" id="btn-tab-bestseller">Bán Chạy Nhất</button>
    <button type="button" class="dev1-tab-btn" id="btn-tab-newarrival">Hàng Mới Về 2026</button>
  `;

  var btnBanChay = document.getElementById("btn-tab-bestseller");
  var btnHangMoi = document.getElementById("btn-tab-newarrival");

  // Sự kiện khi bấm tab "Bán Chạy Nhất"
  btnBanChay.onclick = function () {
    btnBanChay.classList.add("active");
    btnHangMoi.classList.remove("active");
    veDanhSachSanPhamTrending(dsBanChay);
  };

  // Sự kiện khi bấm tab "Hàng Mới Về"
  btnHangMoi.onclick = function () {
    btnHangMoi.classList.add("active");
    btnBanChay.classList.remove("active");
    veDanhSachSanPhamTrending(dsHangMoi);
  };

  // Mặc định ban đầu vẽ danh sách Bán chạy
  veDanhSachSanPhamTrending(dsBanChay);
}

function veDanhSachSanPhamTrending(danhSach) {
  var khungLưới = document.getElementById("dev1-trending-grid");
  if (!khungLưới) return;
  khungLưới.innerHTML = "";

  if (!danhSach || danhSach.length === 0) {
    khungLưới.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:30px; color:#64748b;">Chưa có sản phẩm nào.</p>';
    return;
  }

  // Giới hạn hiển thị tối đa 6 sản phẩm cho đẹp
  for (var i = 0; i < danhSach.length && i < 6; i++) {
    var sp = danhSach[i];
    var theDiv = document.createElement("div");
    theDiv.className = "dev1-gear-card";

    theDiv.innerHTML = `
      <div class="dev1-card-media">
        <img src="${sp.image}" alt="${sp.name}" loading="lazy">
        <span class="sport-badge badge-cyan dev1-card-badge">${sp.badge || "HOT"}</span>
      </div>
      <div class="dev1-card-body">
        <div class="dev1-card-cat">${sp.category || "Thể Thao"}</div>
        <h3 class="dev1-card-title">${sp.name}</h3>
        <div class="dev1-price-row">
          <span class="dev1-sale-price">${formatMoney(sp.salePrice || sp.price)}</span>
          <span class="dev1-rating-star">⭐ ${sp.rating || 5.0}</span>
        </div>
        <div class="dev1-card-btn-row">
          <!-- Nút Chi Tiết: Chuyển sang dev2_products.html mở đúng id này -->
          <a href="pages/dev2_products.html?id=${sp.id}" class="btn-sport btn-outline dev1-card-btn-detail" style="text-decoration:none; display:flex; align-items:center; justify-content:center;">Chi Tiết</a>

          <!-- Nút + Giỏ: Gọi hàm thêm nhanh vào giỏ hàng -->
          <button type="button" class="btn-sport btn-primary dev1-card-btn-cart" onclick="themVaoGioTrangChu('${sp.id}')">+ Giỏ</button>
        </div>
      </div>
    `;
    khungLưới.appendChild(theDiv);
  }
}

window.themVaoGioTrangChu = function (idSanPham) {
  // 1. Tìm sản phẩm trong danh sách
  var tatCa = [];
  try {
    var raw = localStorage.getItem("sport_products");
    if (raw) tatCa = JSON.parse(raw);
  } catch (e) {
    tatCa = [];
  }
  if (!tatCa || tatCa.length === 0) {
    if (typeof products !== "undefined") tatCa = products;
  }

  var spDuocChon = null;
  for (var i = 0; i < tatCa.length; i++) {
    if (String(tatCa[i].id) === String(idSanPham)) {
      spDuocChon = tatCa[i];
      break;
    }
  }

  if (!spDuocChon) {
    showToast("Không tìm thấy sản phẩm này!", "danger");
    return;
  }

  // 2. Chuẩn bị thông tin sản phẩm
  var monHang = {
    id: spDuocChon.id,
    name: spDuocChon.name,
    price: spDuocChon.salePrice || spDuocChon.price || 0,
    image: spDuocChon.image,
    size: "Tiêu chuẩn",
    color: "Mặc định",
    stock: spDuocChon.stock || 50
  };

  // 3. Gọi hàm addToCart chuẩn của common.js (có kiểm tra đăng nhập & nhảy số Header)
  if (typeof addToCart === "function") {
    var thanhCong = addToCart(monHang, 1);
    if (thanhCong && typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  } else {
    alert("Đã thêm [" + monHang.name + "] vào giỏ hàng!");
  }
};

function khoiTaoFormDangKyNhanTin() {
  var form = document.getElementById("dev1-nl-form");
  var inputEmail = document.getElementById("dev1-email-input");
  if (!form || !inputEmail) return;

  form.onsubmit = function (e) {
    e.preventDefault(); // Chặn việc tải lại trang web
    var email = inputEmail.value.trim();

    if (!email || email.indexOf("@") === -1) {
      showToast("Vui lòng nhập địa chỉ email hợp lệ!", "danger");
      inputEmail.focus();
      return;
    }

    showToast("Đăng ký thành công! Mã ưu đãi SPORT2026 đã gửi tới " + email, "success");
    form.reset();
  };
}
