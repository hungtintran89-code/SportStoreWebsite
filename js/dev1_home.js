// Bien luu trang thai slider banner
var slideHienTai = 0;
var danhSachBanner = [];
var timerTuDongChay = null;

document.addEventListener("DOMContentLoaded", function () {
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }

  khoiTaoBannerSlider();
  khoiTaoDongHoFlashSale();
  hienThiSanPhamFlashSale();
  hienThiDanhMucTieuBieu();
  khoiTaoTabTrangBiXuHuong();
  khoiTaoFormDangKyNhanTin();
});

// Lay danh sach san pham tu localStorage hoac file products.js
function layTatCaSanPhamTrangChu() {
  var verHienTai = "v2026_multisport_v6_real100";
  try {
    var verLuu = localStorage.getItem("sport_data_version");
    if (verLuu !== verHienTai && typeof products !== "undefined" && Array.isArray(products)) {
      localStorage.setItem("sport_products", JSON.stringify(products));
      localStorage.setItem("sport_data_version", verHienTai);
      return products;
    }
    var raw = localStorage.getItem("sport_products");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return (typeof products !== "undefined" && Array.isArray(products)) ? products : [];
}

function khoiTaoBannerSlider() {
  if (typeof banners !== "undefined") {
    danhSachBanner = banners;
  }
  if (!danhSachBanner || danhSachBanner.length === 0) return;

  var khungChuaSlides = document.getElementById("dev1-carousel-slides");
  var khungChuaDots = document.getElementById("dev1-carousel-dots");
  if (!khungChuaSlides || !khungChuaDots) return;

  khungChuaSlides.innerHTML = "";
  khungChuaDots.innerHTML = "";

  for (var i = 0; i < danhSachBanner.length; i++) {
    var b = danhSachBanner[i];

    var slideDiv = document.createElement("div");
    slideDiv.className = "dev1-slide-item" + (i === 0 ? " active" : "");

    // Danh sach 3 san pham hot ben phai banner
    var hotListHtml = "";
    var dsHot = b.hotProducts || [];
    for (var k = 0; k < dsHot.length; k++) {
      var hp = dsHot[k];
      hotListHtml +=
        '<a href="pages/dev2_products.html?id=' + hp.id + '" class="dev1-slide-hot-card" title="' + hp.name + '">' +
          '<span class="dev1-slide-hot-disc">' + (hp.discount || "-15%") + '</span>' +
          '<div class="dev1-slide-hot-img">' +
            '<img src="' + hp.image + '" alt="' + hp.name + '" loading="lazy">' +
          '</div>' +
          '<div class="dev1-slide-hot-sport">' + hp.sport + '</div>' +
          '<div class="dev1-slide-hot-name">' + hp.name + '</div>' +
          '<div class="dev1-slide-hot-price">' + formatMoney(hp.price) + '</div>' +
        '</a>';
    }

    slideDiv.innerHTML =
      '<div class="dev1-slide-content">' +
        '<span class="sport-badge badge-cyan dev1-slide-badge">' + (b.badge || "SPORTSTORE") + '</span>' +
        '<h1 class="dev1-slide-title">' + b.title + '</h1>' +
        '<p class="dev1-slide-sub">' + b.subtitle + '</p>' +
        '<div class="dev1-slide-tag-row">' +
          '<a href="' + (b.link || "pages/dev2_products.html") + '" class="btn-sport btn-primary">' + (b.btnText || "Khám Phá Ngay") + '</a>' +
          '<span class="sport-badge badge-orange dev1-slide-tag-pill">' + (b.tag || "HOT 2026") + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="dev1-slide-hot-panel">' +
        '<div class="dev1-slide-hot-header">' +
          '<span class="dev1-slide-hot-title"><i class="fa-solid fa-fire"></i> ' + (b.hotTitle || "SẢN PHẨM ĐANG HOT") + '</span>' +
          '<a href="' + (b.link || "pages/dev2_products.html") + '" class="dev1-slide-hot-more">Xem tất cả <i class="fa-solid fa-arrow-right"></i></a>' +
        '</div>' +
        '<div class="dev1-slide-hot-list">' + hotListHtml + '</div>' +
      '</div>';

    khungChuaSlides.appendChild(slideDiv);

    var dotSpan = document.createElement("div");
    dotSpan.className = "dev1-dot" + (i === 0 ? " active" : "");
    dotSpan.setAttribute("data-index", i);
    dotSpan.onclick = function () {
      var viTri = Number(this.getAttribute("data-index"));
      hienThiSlide(viTri);
    };
    khungChuaDots.appendChild(dotSpan);
  }

  var nutPrev = document.getElementById("dev1-prev-slide");
  if (nutPrev) {
    nutPrev.onclick = function () {
      var viTriMoi = slideHienTai - 1;
      if (viTriMoi < 0) viTriMoi = danhSachBanner.length - 1;
      hienThiSlide(viTriMoi);
    };
  }

  var nutNext = document.getElementById("dev1-next-slide");
  if (nutNext) {
    nutNext.onclick = function () {
      var viTriMoi = slideHienTai + 1;
      if (viTriMoi >= danhSachBanner.length) viTriMoi = 0;
      hienThiSlide(viTriMoi);
    };
  }

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

  batDauTuDongChaySlide();
}

function batDauTuDongChaySlide() {
  clearInterval(timerTuDongChay);
  timerTuDongChay = setInterval(function () {
    var viTriTiepTheo = slideHienTai + 1;
    if (viTriTiepTheo >= danhSachBanner.length) viTriTiepTheo = 0;
    hienThiSlide(viTriTiepTheo);
  }, 5500);
}

function khoiTaoDongHoFlashSale() {
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

    oGio.textContent = (h < 10 ? "0" : "") + h;
    oPhut.textContent = (m < 10 ? "0" : "") + m;
    oGiay.textContent = (s < 10 ? "0" : "") + s;
  }, 1000);
}

function hienThiSanPhamFlashSale() {
  var dsSale = [];
  if (typeof flashSale !== "undefined" && Array.isArray(flashSale.items)) {
    dsSale = flashSale.items;
  }

  var khungFlashSale = document.getElementById("dev1-flash-grid");
  if (!khungFlashSale) return;
  khungFlashSale.innerHTML = "";

  for (var i = 0; i < dsSale.length; i++) {
    var item = dsSale[i];
    var phanTramDaBan = Math.min(92, Math.max(35, Math.round((item.sold / (item.stock || 100)) * 100)));

    var cardDiv = document.createElement("div");
    cardDiv.className = "dev1-flash-card";
    cardDiv.innerHTML =
      '<div class="dev1-card-media">' +
        '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
        '<span class="dev1-card-discount-badge">' + item.discount + '</span>' +
        '<span class="dev1-card-sport-pill">' + (item.sport || "Thể Thao") + '</span>' +
      '</div>' +
      '<div class="dev1-card-body">' +
        '<div class="dev1-card-cat">' + item.category + '</div>' +
        '<h3 class="dev1-card-title">' + item.name + '</h3>' +
        '<div class="dev1-price-row">' +
          '<span class="dev1-sale-price">' + formatMoney(item.salePrice) + '</span>' +
          '<span class="dev1-old-price">' + formatMoney(item.price) + '</span>' +
        '</div>' +
        '<div class="dev1-progress-bar">' +
          '<div class="dev1-progress-fill" style="width: ' + phanTramDaBan + '%"></div>' +
        '</div>' +
        '<div class="dev1-flash-progress-meta">' +
          '<span><i class="fa-solid fa-fire" style="color:#ea580c;"></i> Đã bán: ' + item.sold + '</span>' +
          '<span><i class="fa-solid fa-star" style="color:#f59e0b;"></i> ' + item.rating + '</span>' +
        '</div>' +
        '<a href="pages/dev2_products.html?id=' + item.id + '" class="btn-sport btn-accent dev1-btn-flash-buy">Săn sale ngay</a>' +
      '</div>';
    khungFlashSale.appendChild(cardDiv);
  }
}

// Hien thi 8 bo mon the thao kem anh that va so luong san pham
function hienThiDanhMucTieuBieu() {
  var khungDanhMuc = document.getElementById("dev1-cat-grid");
  if (!khungDanhMuc) return;
  khungDanhMuc.innerHTML = "";

  var tatCa = layTatCaSanPhamTrangChu();
  var dsBoMon = [
    { name: "Cầu Lông", thumb: "https://cdn.shopvnb.com/img/300x300/uploads/san_pham/vot-cau-long-vnb-v200-xanh-2.webp" },
    { name: "Tennis & Pickleball", thumb: "https://cdn.shopvnb.com/img/300x300/uploads/gallery/vot-pickleball-joola-scorpeus-pro-v-anna-bright-yellow-14mm-chinh-hang_1772066334.webp" },
    { name: "Bóng Đá", thumb: "https://product.hstatic.net/1000061481/product/is7432226_3e95e53e5b3a42f183534dbffd3f11a9_master.jpg" },
    { name: "Chạy Bộ", thumb: "https://cdn.shopvnb.com/img/300x300/uploads/san_pham/giay-cau-long-asic-court-hunter-ff-men_1776914617.webp" },
    { name: "Bóng Rổ", thumb: "https://cdn.hstatic.net/products/200000940071/g-bong-ro-composite-pu-molten-bg4500-size-6-7-dang-cap-thi-dau-quoc-te_68e3022ae52e42cfa752672b87cf791d.jpg" },
    { name: "Bóng Chuyền", thumb: "https://cdn.shopvnb.com/img/300x300/uploads/san_pham/giay-cau-long-mizuno-cyclone-speed-5_1737421314.webp" },
    { name: "Tập Gym", thumb: "https://cdn.shopvnb.com/img/300x300/uploads/gallery/bong-tap-co-tay-power-ball-taro-tr025-b01_1746664031.webp" },
    { name: "Bóng Bàn", thumb: "https://bizweb.dktcdn.net/thumb/large/100/478/357/products/img-6480-jpeg.jpg?v=1752480047450" }
  ];

  for (var i = 0; i < dsBoMon.length; i++) {
    var bm = dsBoMon[i];
    var dem = 0;
    for (var j = 0; j < tatCa.length; j++) {
      if (tatCa[j].sport === bm.name) dem++;
    }
    var theA = document.createElement("a");
    theA.href = "pages/dev2_products.html?sport=" + encodeURIComponent(bm.name);
    theA.className = "dev1-cat-card";
    theA.innerHTML =
      '<div class="dev1-cat-thumb">' +
        '<img src="' + bm.thumb + '" alt="' + bm.name + '" loading="lazy">' +
      '</div>' +
      '<div>' +
        '<div class="dev1-cat-title">' + bm.name + '</div>' +
        '<div class="dev1-cat-count">' + dem + ' Sản phẩm chính hãng</div>' +
      '</div>';
    khungDanhMuc.appendChild(theA);
  }
}

// Hien thi cac tab san pham xu huong theo bo mon
function khoiTaoTabTrangBiXuHuong() {
  var tatCaSanPham = layTatCaSanPhamTrangChu();

  var cacMon = ["Cầu Lông", "Tennis & Pickleball", "Bóng Đá", "Chạy Bộ", "Bóng Rổ", "Bóng Chuyền", "Tập Gym", "Bóng Bàn"];
  var dsDaMon = [];
  for (var m = 0; m < cacMon.length; m++) {
    var tenMon = cacMon[m];
    for (var k = 0; k < tatCaSanPham.length; k++) {
      var sp = tatCaSanPham[k];
      if (sp.sport === tenMon && sp.image && sp.image !== "MISSING_IMAGE" && (sp.categoryId === "CAT01" || sp.categoryId === "CAT02")) {
        dsDaMon.push(sp);
        break;
      }
    }
  }

  function locTheoMon(mangMon) {
    var kq = [];
    for (var idx = 0; idx < 12; idx++) {
      for (var s = 0; s < mangMon.length; s++) {
        var danhSachMon = [];
        for (var p = 0; p < tatCaSanPham.length; p++) {
          if (tatCaSanPham[p].sport === mangMon[s] && tatCaSanPham[p].image && tatCaSanPham[p].image !== "MISSING_IMAGE") {
            danhSachMon.push(tatCaSanPham[p]);
          }
        }
        if (danhSachMon[idx]) kq.push(danhSachMon[idx]);
        if (kq.length >= 8) return kq;
      }
    }
    return kq;
  }

  var cacTab = [
    { id: "all", label: "Tất Cả Nổi Bật", list: dsDaMon },
    { id: "badminton", label: "Cầu Lông", list: locTheoMon(["Cầu Lông"]) },
    { id: "tp", label: "Tennis & Pickleball", list: locTheoMon(["Tennis & Pickleball"]) },
    { id: "football", label: "Bóng Đá", list: locTheoMon(["Bóng Đá"]) },
    { id: "running", label: "Chạy Bộ", list: locTheoMon(["Chạy Bộ"]) },
    { id: "team", label: "Bóng Rổ & Bóng Chuyền", list: locTheoMon(["Bóng Rổ", "Bóng Chuyền"]) },
    { id: "gym_tt", label: "Tập Gym & Bóng Bàn", list: locTheoMon(["Tập Gym", "Bóng Bàn"]) }
  ];

  var khungNutTab = document.getElementById("dev1-tab-buttons");
  if (!khungNutTab) return;
  khungNutTab.innerHTML = "";

  for (var t = 0; t < cacTab.length; t++) {
    ganSuKienTab(khungNutTab, cacTab[t], t === 0);
  }

  veDanhSachSanPhamTrending(dsDaMon);
}

function ganSuKienTab(khungNutTab, tabObj, laTabDau) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "dev1-tab-btn" + (laTabDau ? " active" : "");
  btn.textContent = tabObj.label;
  btn.onclick = function () {
    var tatCaBtn = khungNutTab.querySelectorAll(".dev1-tab-btn");
    for (var b = 0; b < tatCaBtn.length; b++) {
      tatCaBtn[b].classList.remove("active");
    }
    btn.classList.add("active");
    veDanhSachSanPhamTrending(tabObj.list);
  };
  khungNutTab.appendChild(btn);
}

function veDanhSachSanPhamTrending(danhSach) {
  var khungLuoi = document.getElementById("dev1-trending-grid");
  if (!khungLuoi) return;
  khungLuoi.innerHTML = "";

  if (!danhSach || danhSach.length === 0) {
    khungLuoi.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:30px; color:#64748b;">Chưa có sản phẩm nào.</p>';
    return;
  }

  for (var i = 0; i < danhSach.length && i < 8; i++) {
    var sp = danhSach[i];
    var theDiv = document.createElement("div");
    theDiv.className = "dev1-gear-card";

    var giaBan = sp.salePrice || sp.price || 0;
    var giaGocHtml = (sp.originalPrice && sp.originalPrice > giaBan)
      ? '<span class="dev1-old-price">' + formatMoney(sp.originalPrice) + '</span>'
      : "";
    var badgeGiamGia = sp.discount
      ? '<span class="dev1-card-discount-badge">' + sp.discount + '</span>'
      : '<span class="sport-badge badge-cyan dev1-card-badge">CHÍNH HÃNG</span>';

    theDiv.innerHTML =
      '<div class="dev1-card-media">' +
        '<img src="' + sp.image + '" alt="' + sp.name + '" loading="lazy">' +
        badgeGiamGia +
        '<span class="dev1-card-sport-pill">' + (sp.sport || "Thể Thao") + '</span>' +
      '</div>' +
      '<div class="dev1-card-body">' +
        '<div class="dev1-card-cat">' + (sp.brand || "Sport") + ' &bull; ' + (sp.category || "Trang Bị") + '</div>' +
        '<h3 class="dev1-card-title">' + sp.name + '</h3>' +
        '<div class="dev1-price-row">' +
          '<span class="dev1-sale-price">' + formatMoney(giaBan) + '</span>' +
          giaGocHtml +
        '</div>' +
        '<div class="dev1-card-meta-row">' +
          '<span>Đã bán: ' + (sp.sold || 45) + '</span>' +
          '<span class="dev1-rating-star"><i class="fa-solid fa-star"></i> ' + (sp.rating || 4.8) + ' (' + (sp.reviewCount || 24) + ')</span>' +
        '</div>' +
        '<div class="dev1-card-btn-row">' +
          '<a href="pages/dev2_products.html?id=' + sp.id + '" class="btn-sport btn-outline dev1-card-btn-detail" style="text-decoration:none; display:flex; align-items:center; justify-content:center;">Chi Tiết</a>' +
          '<button type="button" class="btn-sport btn-primary dev1-card-btn-cart" onclick="themVaoGioTrangChu(\'' + sp.id + '\')"><i class="fa-solid fa-cart-plus"></i> Giỏ</button>' +
        '</div>' +
      '</div>';
    khungLuoi.appendChild(theDiv);
  }
}

window.themVaoGioTrangChu = function (idSanPham) {
  var tatCa = layTatCaSanPhamTrangChu();

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

  var monHang = {
    id: spDuocChon.id,
    name: spDuocChon.name,
    price: spDuocChon.salePrice || spDuocChon.price || 0,
    image: spDuocChon.image,
    size: (spDuocChon.sizes && spDuocChon.sizes[0]) ? spDuocChon.sizes[0] : "Tiêu chuẩn",
    color: (spDuocChon.colors && spDuocChon.colors[0]) ? spDuocChon.colors[0] : "Mặc định",
    stock: spDuocChon.stock || 50
  };

  if (typeof addToCart === "function") {
    var thanhCong = addToCart(monHang, 1);
    if (thanhCong && typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  }
};

function khoiTaoFormDangKyNhanTin() {
  var form = document.getElementById("dev1-nl-form");
  var inputEmail = document.getElementById("dev1-email-input");
  if (!form || !inputEmail) return;

  form.onsubmit = function (e) {
    e.preventDefault();
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
