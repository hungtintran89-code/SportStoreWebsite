
// Tên khóa lưu trữ trong LocalStorage
const STORAGE_CART_KEY = "sport_cart"; // Lưu mảng: [ { id: user.id, product: [...] } ]
const STORAGE_USER_KEY = "sport_user"; // Khóa lưu thông tin đăng nhập
const STORAGE_ADDR_KEY = "sport_address"; // Khóa lưu sổ địa chỉ nhận hàng

/**
 * 1. HÀM ĐỌC DỮ LIỆU JSON AN TOÀN TỪ LOCALSTORAGE
 */
function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error("Lỗi khi đọc LocalStorage:", error);
    return fallback;
  }

}

/**
 * 2. HÀM LẤY THÔNG TIN TÀI KHOẢN ĐANG ĐĂNG NHẬP
 */
function getCurrentUser() {
  if (
    window.sportStoreAuth &&
    typeof window.sportStoreAuth.session === "function"
  ) {
    return window.sportStoreAuth.session();
  }

  return readJson("sportstore_auth", null) || readJson(STORAGE_USER_KEY, null);
}
/**
 * 3. HÀM ĐỊNH DẠNG TIỀN TỆ (VND)
 */
function formatMoney(amount) {
  if (!amount || isNaN(amount)) return "0 ₫";
  return Number(amount).toLocaleString("vi-VN") + " ₫";
}

/**
 * 4. HÀM LẤY DANH SÁCH GIỎ HÀNG CỦA TÀI KHOẢN HIỆN TẠI
 * Đọc từ cấu trúc: [ { id: user.id, product: [ ... ] } ]
 */
function getCart() {
  const user = getCurrentUser();
  const cId = user && (user.customerId || user.id);

  if (!cId) {
    return [];
  }

  const raw = readJson(STORAGE_CART_KEY, []);
  const allCarts = Array.isArray(raw) ? raw : [];

  const userCart = allCarts.find(
    (item) =>
      item &&
      String(item.customerId || item.id) === String(cId) &&
      Array.isArray(item.product),
  );

  return userCart ? userCart.product : [];
}

function saveCart(cartArray) {
  try {
    const user = getCurrentUser();
    const cId = user && (user.customerId || user.id);
    if (!cId) {
      updateCartBadge();
      return;
    }
    const raw = readJson(STORAGE_CART_KEY, []);
    const allCarts = Array.isArray(raw)
      ? raw.filter((item) => item && Array.isArray(item.product))
      : [];
    const safeProducts = Array.isArray(cartArray) ? cartArray : [];
    const userCart = allCarts.find(
      (item) => String(item.customerId || item.id) === String(cId),
    );
    if (userCart) {
      userCart.product = safeProducts;
      userCart.customerId = cId;
    } else {
      allCarts.push({
        customerId: cId,
        product: safeProducts,
      });
    }
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(allCarts));
    updateCartBadge();
  } catch (error) {
    console.error("Lỗi khi lưu giỏ hàng:", error);
  }
}

/**
 * 6. HÀM THÊM SẢN PHẨM VÀO GIỎ HÀNG (DÙNG CHO DEV 1, DEV 2, DEV 3)
 * Bắt buộc đăng nhập mới cho phép thêm vào giỏ hàng
 */
function addToCart(product, quantityToAdd = 1) {
  const user = getCurrentUser();
  if (!user) {
    showToast("Vui lòng đăng nhập tài khoản để mua sản phẩm!", "danger");
    if (window.sportStoreAuth && typeof window.sportStoreAuth.openModal === "function") {
      window.sportStoreAuth.openModal("login");
    }
    return false;
  }

  const cart = getCart();
  const size = product.size || "Mặc định";
  const color = product.color || "Tiêu chuẩn";
  const addQty = Math.max(1, Number(quantityToAdd) || 1);

  const existingItem = cart.find(
    (item) =>
      String(item.id) === String(product.id) &&
      (item.size || "Mặc định") === size &&
      (item.color || "Tiêu chuẩn") === color,
  );
  const soLuongDangCo = existingItem ? existingItem.quantity : 0;
  if (soLuongDangCo + addQty > product.stock) {
    showToast("Không thể thêm! Trong kho chỉ còn " + product.stock + " món (bạn đã có " + soLuongDangCo + " món trong giỏ).", "danger");
    return false;
  }

  if (existingItem) {
    existingItem.quantity = soLuongDangCo + addQty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      size: size,
      color: color,
      quantity: Math.min(10, addQty),
      stock: product.stock,
    });
  }

  saveCart(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
  return true;
}

/**
 * 7. HÀM CẬP NHẬT SỐ LƯỢNG TRÊN ICON GIỎ HÀNG Ở HEADER
 * Tương thích cả Header cũ (.cart-badge, #cartBadge) và Header mới (#header-cart-badge-count)
 */
function updateCartBadge() {
  const cart = getCart();
  let totalCount = cart.length;

  const badgeElements = document.querySelectorAll(
    ".cart-badge, #cartBadge, #header-cart-badge-count, .badge-pill",
  );
  badgeElements.forEach((badge) => {
    badge.textContent = totalCount;
  });
}

/**
 * 8. HÀM HIỂN THỊ THÔNG BÁO NHẸ GÓC MÀN HÌNH (TOAST NOTIFICATION)
 * Dùng đúng class .sport-toast-container và .sport-toast của common.css mới
 */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "sport-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const statusClass = type === "danger" ? "error" : type;
  toast.className = `sport-toast toast-message ${statusClass} toast-${type}`;

  let icon = "🔔";
  if (type === "success") icon = "✅";
  if (type === "danger" || type === "error") icon = "⚠️";

  toast.innerHTML = `<div class="sport-toast-item-inner"><span>${icon}</span> <span>${message}</span></div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * 9. KHỞI CHẠY NGAY KHI NẠP FILE
 */
function initCommon() {
  updateCartBadge();

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link, .sport-nav-menu li a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      currentPath.includes(href.replace("../", "").replace("pages/", ""))
    ) {
      link.classList.add("active");
    }
  });
}

initCommon();


/**
 * 10. TIỆN ÍCH QUẢN LÝ MODAL DIALOG TOÀN HỆ THỐNG
 */
function moModal(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.add("show");
}

function dongModal(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.remove("show");
}

function moModalAdmin(idModal) {
  moModal(idModal);
}

function dongModalAdmin(idModal) {
  dongModal(idModal);
}

/**
 * 11. XEM CHI TIẾT ĐƠN HÀNG DÙNG CHUNG (CHO CẢ USER & ADMIN)
 */
function xemChiTietDon(maDon) {
  var tatCaDon = [];
  try {
    var chuoiDon = localStorage.getItem("sport_orders");
    if (chuoiDon) {
      tatCaDon = JSON.parse(chuoiDon);
    } else if (typeof orders !== "undefined") {
      tatCaDon = orders;
    }
  } catch (e) {
    tatCaDon = [];
  }

  var don = null;
  for (var i = 0; i < tatCaDon.length; i++) {
    var o = tatCaDon[i];
    var idDon = o.orderId || o.id;
    if (idDon && String(idDon) === String(maDon)) {
      don = o;
      break;
    }
    if (String("DH-" + (i + 1)) === String(maDon)) {
      don = o;
      break;
    }
  }

  if (!don) {
    if (typeof showToast === "function") {
      showToast("Không tìm thấy thông tin đơn hàng #" + maDon, "danger");
    } else {
      alert("Không tìm thấy thông tin đơn hàng #" + maDon);
    }
    return;
  }

  // Tiêu đề
  var tieuDeEl = document.getElementById("modal-order-title");
  if (tieuDeEl) {
    tieuDeEl.textContent = "Chi Tiết Đơn Hàng #" + (don.orderId || don.id || maDon);
  }

  // Khách hàng & SĐT
  var tenKhach = "Khách hàng";
  var sdtKhach = "";
  var emailKhach = "Chưa cập nhật";
  var diaChiGiao = don.address || "Nhận tại cửa hàng";

  if (don.customer && typeof don.customer === "object") {
    tenKhach = don.customer.name || don.customer.fullName || tenKhach;
    sdtKhach = don.customer.phone || don.phone || "";
    emailKhach = don.customer.email || don.email || emailKhach;
    if (don.customer.address) diaChiGiao = don.customer.address;
  } else if (typeof don.customer === "string" && don.customer.trim()) {
    tenKhach = don.customer;
    sdtKhach = don.phone || "";
    emailKhach = don.email || emailKhach;
  } else {
    tenKhach = don.fullName || don.name || tenKhach;
    sdtKhach = don.phone || "";
    emailKhach = don.email || emailKhach;
  }

  var elCustomer = document.getElementById("order-detail-customer");
  if (elCustomer) {
    elCustomer.textContent = tenKhach + (sdtKhach ? " (" + sdtKhach + ")" : "");
  }

  var elEmail = document.getElementById("order-detail-email");
  if (elEmail) {
    elEmail.textContent = emailKhach;
  }

  var elAddress = document.getElementById("order-detail-address");
  if (elAddress) {
    elAddress.textContent = diaChiGiao;
  }

  var elDate = document.getElementById("order-detail-date");
  if (elDate) {
    var ngayHienThi = don.date || (don.createdAt ? don.createdAt.split("T")[0] : "Hôm nay");
    elDate.textContent = ngayHienThi;
  }

  var elPayment = document.getElementById("order-detail-payment");
  if (elPayment) {
    elPayment.textContent = don.paymentMethod || don.payment || "Tiền mặt";
  }

  var elStatus = document.getElementById("order-detail-status");
  if (elStatus) {
    elStatus.textContent = don.status || "Mới đặt";
  }

  var elNote = document.getElementById("order-detail-note");
  if (elNote) {
    elNote.textContent = don.note || "Không có";
  }

  var elTotal = document.getElementById("order-detail-total");
  if (elTotal) {
    var tongTien = don.total || don.totalPrice || 0;
    elTotal.textContent = typeof formatMoney === "function" ? formatMoney(tongTien) : (Number(tongTien).toLocaleString("vi-VN") + " ₫");
  }

  // Danh sách mặt hàng
  var khungMon = document.getElementById("order-detail-items-list");
  if (khungMon) {
    var danhSachMon = don.items || don.orderItems || [];
    var htmlMon = "";
    if (danhSachMon.length > 0) {
      for (var j = 0; j < danhSachMon.length; j++) {
        var m = danhSachMon[j];
        var anh = m.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100";
        var gia = m.price || 0;
        var sl = m.quantity || 1;
        var tongTienMon = m.total || (gia * sl);
        var giaFmt = typeof formatMoney === "function" ? formatMoney(gia) : (Number(gia).toLocaleString("vi-VN") + " ₫");
        var tongFmt = typeof formatMoney === "function" ? formatMoney(tongTienMon) : (Number(tongTienMon).toLocaleString("vi-VN") + " ₫");

        htmlMon += '<div class="order-detail-item-row">';
        htmlMon += '  <div class="order-detail-item-left">';
        htmlMon += '    <img src="' + anh + '" class="order-detail-item-thumb" alt="' + (m.name || "Sản phẩm") + '">';
        htmlMon += '    <div>';
        htmlMon += '      <div class="order-detail-item-name">' + (m.name || "Sản phẩm") + '</div>';
        htmlMon += '      <div class="order-detail-item-meta">Số lượng: x' + sl + ' | Đơn giá: ' + giaFmt + '</div>';
        htmlMon += '    </div>';
        htmlMon += '  </div>';
        htmlMon += '  <div class="order-detail-item-price">' + tongFmt + '</div>';
        htmlMon += '</div>';
      }
    } else {
      htmlMon = "<p class='order-empty-items'>Không có thông tin chi tiết từng mặt hàng.</p>";
    }
    khungMon.innerHTML = htmlMon;
  }

  // Mở Popup hiển thị lên màn hình
  moModal("modal-order-detail");
}

// Lắng nghe đóng modal khi click ra overlay nền tối hoặc phím ESC
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("show");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    var openModals = document.querySelectorAll(".modal-overlay.show, .sport-auth-modal-overlay.show");
    openModals.forEach(function (m) {
      m.classList.remove("show");
    });
  }
});


/**
 * 12. HỆ THỐNG QUẢN LÝ SẢN PHẨM YÊU THÍCH (WISHLIST) DÙNG CHUNG
 */
function layDanhSachWishlist() {
  try {
    var chuoi = localStorage.getItem("sport_wishlist");
    return chuoi ? JSON.parse(chuoi) : [];
  } catch (e) {
    return [];
  }
}

function luuDanhSachWishlist(danhSach) {
  try {
    localStorage.setItem("sport_wishlist", JSON.stringify(danhSach));
    capNhatSoLuongWishlistBadge();
  } catch (e) { }
}

function isYeuThich(idSanPham) {
  var ds = layDanhSachWishlist();
  for (var i = 0; i < ds.length; i++) {
    if (String(ds[i].id) === String(idSanPham)) return true;
  }
  return false;
}

function toggleYeuThich(idSanPham, btnEl) {
  var ds = layDanhSachWishlist();
  var viTri = -1;
  for (var i = 0; i < ds.length; i++) {
    if (String(ds[i].id) === String(idSanPham)) {
      viTri = i;
      break;
    }
  }

  // 1. Nếu đã có -> Xóa khỏi wishlist
  if (viTri !== -1) {
    var tenSp = ds[viTri].name || "Sản phẩm";
    ds.splice(viTri, 1);
    luuDanhSachWishlist(ds);
    if (typeof showToast === "function") {
      showToast("🤍 Đã bỏ '" + tenSp + "' khỏi danh sách yêu thích.", "info");
    }
    capNhatTrangThaiNutWishlist(idSanPham, false, btnEl);
    if (typeof hienThiYeuThich === "function") hienThiYeuThich();
    return false;
  }

  // 2. Nếu chưa có -> Tìm sản phẩm trong kho và thêm vào
  var tatCa = typeof products !== "undefined" ? products : [];
  var sp = null;
  for (var j = 0; j < tatCa.length; j++) {
    if (String(tatCa[j].id) === String(idSanPham)) {
      sp = tatCa[j];
      break;
    }
  }

  if (!sp) {
    try {
      var spStorage = JSON.parse(localStorage.getItem("sport_products") || "[]");
      for (var k = 0; k < spStorage.length; k++) {
        if (String(spStorage[k].id) === String(idSanPham)) {
          sp = spStorage[k];
          break;
        }
      }
    } catch (e) { }
  }

  if (!sp) {
    if (typeof showToast === "function") showToast("Không tìm thấy thông tin sản phẩm!", "danger");
    return false;
  }

  var gia = (typeof getProductDisplayPrice === "function") ? getProductDisplayPrice(sp) : (sp.price || 0);

  var monMoi = {
    id: sp.id,
    name: sp.name,
    price: gia,
    originalPrice: sp.originalPrice || null,
    image: sp.image || (sp.gallery && sp.gallery[0]) || "",
    category: sp.category || "Thể Thao",
    brand: sp.brand || "SportStore"
  };

  ds.push(monMoi);
  luuDanhSachWishlist(ds);

  if (typeof showToast === "function") {
    showToast("❤️ Đã thêm '" + monMoi.name + "' vào danh sách yêu thích!", "success");
  }

  capNhatTrangThaiNutWishlist(idSanPham, true, btnEl);
  if (typeof hienThiYeuThich === "function") hienThiYeuThich();
  return true;
}

function capNhatTrangThaiNutWishlist(idSanPham, daThich, btnEl) {
  var allBtns = document.querySelectorAll('[data-wishlist-btn="' + idSanPham + '"]');
  allBtns.forEach(function (btn) {
    if (daThich) {
      btn.classList.add("active");
      btn.innerHTML = '<span class="icon-heart-red">❤️</span>';
      btn.title = "Bỏ yêu thích";
    } else {
      btn.classList.remove("active");
      btn.innerHTML = '<span class="icon-heart-gray">🤍</span>';
      btn.title = "Thêm vào yêu thích";
    }
  });

  var qvBtn = document.getElementById("qv-btn-wishlist");
  if (qvBtn && window.sanPhamDangXem && String(window.sanPhamDangXem.id) === String(idSanPham)) {
    if (daThich) {
      qvBtn.classList.add("active");
      qvBtn.innerHTML = '❤️ Đã Thích';
      qvBtn.style.color = '#ef4444';
      qvBtn.style.background = '#ffe4e6';
      qvBtn.style.borderColor = '#fda4af';
    } else {
      qvBtn.classList.remove("active");
      qvBtn.innerHTML = '🤍 Yêu Thích';
      qvBtn.style.color = '#475569';
      qvBtn.style.background = '#ffffff';
      qvBtn.style.borderColor = '#e2e8f0';
    }
  }
}

function capNhatSoLuongWishlistBadge() {
  var ds = layDanhSachWishlist();
  var countEls = document.querySelectorAll("[data-wishlist-count]");
  countEls.forEach(function (el) {
    el.textContent = ds.length;
  });
}

function themVaoGioTuWishlist(spId) {
  var ds = layDanhSachWishlist();
  var sp = null;
  for (var i = 0; i < ds.length; i++) {
    if (String(ds[i].id) === String(spId)) {
      sp = ds[i];
      break;
    }
  }

  if (!sp && typeof products !== "undefined") {
    for (var j = 0; j < products.length; j++) {
      if (String(products[j].id) === String(spId)) {
        sp = products[j];
        break;
      }
    }
  }

  if (!sp) {
    if (typeof showToast === "function") showToast("Không tìm thấy thông tin sản phẩm này!", "danger");
    return;
  }

  var ok = false;
  if (typeof addToCart === "function") {
    ok = addToCart(sp, 1);
  } else if (typeof themVaoGioNhanh === "function") {
    themVaoGioNhanh(sp.id);
    ok = true;
  }

  if (ok !== false) {
    if (typeof showToast === "function") {
      showToast("🛒 Đã thêm '" + sp.name + "' vào giỏ hàng!", "success");
    }
    if (typeof chuyenTab === "function") {
      chuyenTab("checkout");
      if (typeof hienThiGioHang === "function") hienThiGioHang();
    } else {
      window.location.href = "user.html?tab=checkout";
    }
  }
}
