// Cac key luu tru trong localStorage
var STORAGE_CART_KEY = "sport_cart";
var STORAGE_USER_KEY = "sport_user";
var STORAGE_ADDR_KEY = "sport_address";

// 1. Ham doc du lieu JSON tu localStorage
function readJson(key, fallback) {
  if (typeof fallback === "undefined") fallback = null;
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

// 2. Ham lay tai khoan dang dang nhap
function getCurrentUser() {
  if (window.sportStoreAuth && typeof window.sportStoreAuth.session === "function") {
    return window.sportStoreAuth.session();
  }
  return readJson("sportstore_auth", null) || readJson(STORAGE_USER_KEY, null);
}

// 3. Ham dinh dang tien VND
function formatMoney(amount) {
  if (!amount || isNaN(amount)) return "0 ₫";
  return Number(amount).toLocaleString("vi-VN") + " ₫";
}

// 4. Ham lay gio hang cua tai khoan hien tai
function getCart() {
  var user = getCurrentUser();
  var cId = user && (user.customerId || user.id);
  if (!cId) return [];

  var raw = readJson(STORAGE_CART_KEY, []);
  var allCarts = Array.isArray(raw) ? raw : [];

  for (var i = 0; i < allCarts.length; i++) {
    var item = allCarts[i];
    if (item && String(item.customerId || item.id) === String(cId) && Array.isArray(item.product)) {
      return item.product;
    }
  }
  return [];
}

// 5. Ham luu gio hang cua tai khoan hien tai
function saveCart(cartArray) {
  try {
    var user = getCurrentUser();
    var cId = user && (user.customerId || user.id);
    if (!cId) {
      updateCartBadge();
      return;
    }

    var raw = readJson(STORAGE_CART_KEY, []);
    var allCarts = [];
    if (Array.isArray(raw)) {
      for (var i = 0; i < raw.length; i++) {
        if (raw[i] && Array.isArray(raw[i].product)) {
          allCarts.push(raw[i]);
        }
      }
    }

    var safeProducts = Array.isArray(cartArray) ? cartArray : [];
    var userCart = null;
    for (var j = 0; j < allCarts.length; j++) {
      if (String(allCarts[j].customerId || allCarts[j].id) === String(cId)) {
        userCart = allCarts[j];
        break;
      }
    }

    if (userCart) {
      userCart.product = safeProducts;
      userCart.customerId = cId;
    } else {
      allCarts.push({
        customerId: cId,
        product: safeProducts
      });
    }

    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(allCarts));
    updateCartBadge();
  } catch (error) {
    console.warn("Loi luu gio hang:", error);
  }
}

// 6. Ham them san pham vao gio hang
function addToCart(product, quantityToAdd) {
  var user = getCurrentUser();
  if (!user) {
    showToast("Vui lòng đăng nhập tài khoản để mua sản phẩm!", "danger");
    return false;
  }

  var cart = getCart();
  var size = product.size || "Mặc định";
  var color = product.color || "Tiêu chuẩn";
  var addQty = Math.max(1, Number(quantityToAdd) || 1);

  var existingItem = null;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    if (
      String(item.id) === String(product.id) &&
      (item.size || "Mặc định") === size &&
      (item.color || "Tiêu chuẩn") === color
    ) {
      existingItem = item;
      break;
    }
  }

  if (existingItem) {
    existingItem.quantity = Math.min(10, existingItem.quantity + addQty);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      size: size,
      color: color,
      quantity: Math.min(10, addQty),
      stock: product.stock
    });
  }

  saveCart(cart);
  showToast('Đã thêm "' + product.name + '" vào giỏ hàng!', "success");
  return true;
}

// 7. Ham cap nhat so luong tren icon gio hang o Header
function updateCartBadge() {
  var cart = getCart();
  var totalCount = cart.length;

  var badgeElements = document.querySelectorAll(".cart-badge, #cartBadge, #header-cart-badge-count, .badge-pill");
  for (var i = 0; i < badgeElements.length; i++) {
    badgeElements[i].textContent = totalCount;
  }
}

// 8. Ham hien thi thong bao goc man hinh (Toast)
function showToast(message, type) {
  if (!type) type = "info";
  var container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "sport-toast-container";
    document.body.appendChild(container);
  }

  var toast = document.createElement("div");
  var statusClass = type === "danger" ? "error" : type;
  toast.className = "sport-toast toast-message " + statusClass + " toast-" + type;

  var iconHtml = '<i class="fa-solid fa-bell" style="color:#0284c7;"></i>';
  if (type === "success") iconHtml = '<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i>';
  if (type === "danger" || type === "error") iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="color:#dc2626;"></i>';

  toast.innerHTML = '<div class="sport-toast-item-inner"><span>' + iconHtml + '</span> <span>' + message + '</span></div>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 9. Khoi chay khi nap trang
function initCommon() {
  updateCartBadge();

  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll(".nav-link, .sport-nav-menu li a");

  for (var i = 0; i < navLinks.length; i++) {
    var link = navLinks[i];
    var href = link.getAttribute("href");
    if (href) {
      var cleanHref = href.replace("../", "").replace("pages/", "");
      if (currentPath.indexOf(cleanHref) !== -1) {
        link.classList.add("active");
      }
    }
  }
}

initCommon();
