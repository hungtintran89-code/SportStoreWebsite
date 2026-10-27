/**
 * ==============================================================================
 * SPORTSTORE - TRANG CHỦ LOGIC (INDEX.JS)
 * ==============================================================================
 * Nhiệm vụ:
 *  - Đọc danh mục và sản phẩm trực tiếp từ LocalStorage (Đồng bộ với Admin CRUD)
 *  - Render danh mục thể thao nổi bật & danh sách sản phẩm
 *  - Xử lý Giỏ hàng (Thêm vào giỏ, cập nhật số lượng)
 *  - Chạy đồng hồ đếm ngược Flash sale và banner slider
 */

var cartKey = "sport_cart";

/**
 * Lấy số lượng giỏ hàng hiện tại
 */
function getCartItems() {
  return getStorage(cartKey, []);
}

/**
 * Cập nhật số đếm giỏ hàng trên thanh Header
 */
function updateHeaderCartBadge() {
  var cart = getCartItems();
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    count += Number(cart[i].quantity || 1);
  }
  var badge = document.getElementById("header-cart-badge");
  if (badge) badge.textContent = count;
}

/**
 * Vẽ danh mục môn thể thao lên trang chủ
 */
function renderIndexCategories() {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var container = document.getElementById("index-categories-grid");
  if (!container) return;

  var html = "";
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    html += `
      <div class="category-card" onclick="filterByCategory('${cat.name}')">
        <div class="category-icon">${cat.icon || '🏷️'}</div>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${cat.desc || 'Trang bị chính hãng'}</div>
      </div>
    `;
  }
  container.innerHTML = html;
}

/**
 * Vẽ danh sách sản phẩm trang chủ
 */
function renderIndexProducts() {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var containerHot = document.getElementById("index-hot-products");
  var containerNew = document.getElementById("index-new-products");

  if (!containerHot || !containerNew) return;

  var htmlHot = "";
  var htmlNew = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.status === "hidden") continue; // Không hiện sản phẩm đã bị ẩn trong Admin

    var cardHtml = `
      <div class="product-card">
        <div class="product-thumb">
          <span class="badge-tag">${p.brand || 'CHÍNH HÃNG'}</span>
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-info">
          <div>
            <div class="product-cat">${p.category}</div>
            <div class="product-name" title="${p.name}">${p.name}</div>
          </div>
          <div class="product-bottom">
            <div class="product-price">${formatVND(p.price)}</div>
            <button type="button" class="btn-add-cart" onclick="addToCart(${p.id})">
              + Thêm Giỏ
            </button>
          </div>
        </div>
      </div>
    `;

    // Phân loại HOT và MỚI
    if (i < 4) {
      htmlHot += cardHtml;
    }
    htmlNew += cardHtml;
  }

  containerHot.innerHTML = htmlHot;
  containerNew.innerHTML = htmlNew;
}

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {number} productId 
 */
function addToCart(productId) {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var target = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      target = products[i];
      break;
    }
  }
  if (!target) return;

  var cart = getCartItems();
  var found = false;

  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === productId) {
      cart[j].quantity = Number(cart[j].quantity || 1) + 1;
      found = true;
      break;
    }
  }

  if (!found) {
    cart.push({
      id: target.id,
      name: target.name,
      price: target.price,
      image: target.image,
      quantity: 1
    });
  }

  setStorage(cartKey, cart);
  updateHeaderCartBadge();
  alert("🛒 Đã thêm [" + target.name + "] vào giỏ hàng thành công!");
}

/**
 * Lọc sản phẩm theo danh mục khi click vào Card môn thể thao
 * @param {string} categoryName 
 */
function filterByCategory(categoryName) {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var containerNew = document.getElementById("index-new-products");
  if (!containerNew) return;

  var html = "";
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.status === "hidden") continue;
    if (p.category !== categoryName) continue;

    html += `
      <div class="product-card">
        <div class="product-thumb">
          <span class="badge-tag">${p.brand || 'CHÍNH HÃNG'}</span>
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-info">
          <div>
            <div class="product-cat">${p.category}</div>
            <div class="product-name" title="${p.name}">${p.name}</div>
          </div>
          <div class="product-bottom">
            <div class="product-price">${formatVND(p.price)}</div>
            <button type="button" class="btn-add-cart" onclick="addToCart(${p.id})">
              + Thêm Giỏ
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `<p class="products-empty-msg">Không có sản phẩm nào thuộc môn [${categoryName}].</p>`;
  }

  containerNew.innerHTML = html;
  // Cuộn mượt đến danh sách sản phẩm
  document.getElementById("section-products").scrollIntoView({ behavior: "smooth" });
}

/**
 * Tìm kiếm sản phẩm từ thanh Header trang chủ
 */
function searchHomeProducts() {
  var keyword = document.getElementById("home-search-input").value.trim().toLowerCase();
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var containerNew = document.getElementById("index-new-products");
  if (!containerNew) return;

  var html = "";
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.status === "hidden") continue;
    if (keyword) {
      var matchName = p.name && p.name.toLowerCase().indexOf(keyword) !== -1;
      var matchBrand = p.brand && p.brand.toLowerCase().indexOf(keyword) !== -1;
      var matchCat = p.category && p.category.toLowerCase().indexOf(keyword) !== -1;
      if (!matchName && !matchBrand && !matchCat) continue;
    }

    html += `
      <div class="product-card">
        <div class="product-thumb">
          <span class="badge-tag">${p.brand || 'CHÍNH HÃNG'}</span>
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-info">
          <div>
            <div class="product-cat">${p.category}</div>
            <div class="product-name" title="${p.name}">${p.name}</div>
          </div>
          <div class="product-bottom">
            <div class="product-price">${formatVND(p.price)}</div>
            <button type="button" class="btn-add-cart" onclick="addToCart(${p.id})">
              + Thêm Giỏ
            </button>
          </div>
        </div>
      </div>
    `;
  }

  containerNew.innerHTML = html;
}

/**
 * Đồng hồ đếm ngược giờ vàng Flash Sale
 */
function startFlashSaleTimer() {
  var h = 8, m = 45, s = 30;
  setInterval(function() {
    s--;
    if (s < 0) {
      s = 59;
      m--;
      if (m < 0) {
        m = 59;
        h--;
        if (h < 0) h = 8;
      }
    }
    var elH = document.getElementById("sale-hours");
    var elM = document.getElementById("sale-minutes");
    var elS = document.getElementById("sale-seconds");
    if (elH) elH.textContent = h < 10 ? "0" + h : h;
    if (elM) elM.textContent = m < 10 ? "0" + m : m;
    if (elS) elS.textContent = s < 10 ? "0" + s : s;
  }, 1000);
}

// Khởi chạy khi DOM sẵn sàng
window.addEventListener("DOMContentLoaded", function() {
  updateHeaderCartBadge();
  renderIndexCategories();
  renderIndexProducts();
  startFlashSaleTimer();
});
