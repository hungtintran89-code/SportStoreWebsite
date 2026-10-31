
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
  const soLuongDangCo = existingItem ? existingItem.quantity : 1 ;
  if( soLuongDangCo + addQty > product.stock ){
    showToast("Không thể thêm! Trong kho chỉ còn " + tonKho + " món (bạn đã có " + soLuongDangCo + " món trong giỏ).",  "danger");
    return false;
  }

  if (existingItem) {
    existingItem.quantity = soLuongDangCo + addQty ;
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
  let totalCount = cart.length ;

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
function showToast(message, type = "info" ) {
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
