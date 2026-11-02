// Biến lưu ID sản phẩm đang chỉnh sửa (nếu là -1 nghĩa là đang thêm mới)
var currentEditingProductId = -1;

/**
 * Vẽ bảng danh sách sản phẩm
 */
function renderProductTable() {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  // Lấy các giá trị lọc
  var keyword = "";
  var searchInput = document.getElementById("product-search-input");
  if (searchInput) keyword = searchInput.value.trim().toLowerCase();

  var categoryFilter = "";
  var selectCategory = document.getElementById("product-filter-category");
  if (selectCategory) categoryFilter = selectCategory.value;

  var brandFilter = "";
  var selectBrand = document.getElementById("product-filter-brand");
  if (selectBrand) brandFilter = selectBrand.value;

  tbody.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    // Lọc theo từ khóa tìm kiếm
    if (keyword) {
      var matchName = p.name && p.name.toLowerCase().indexOf(keyword) !== -1;
      var matchCode = p.code && p.code.toLowerCase().indexOf(keyword) !== -1;
      var matchBrand = p.brand && p.brand.toLowerCase().indexOf(keyword) !== -1;
      if (!matchName && !matchCode && !matchBrand) continue;
    }

    // Lọc theo phân loại môn thể thao
    if (categoryFilter && categoryFilter !== "ALL") {
      if (p.category !== categoryFilter && p.categoryId !== categoryFilter)
        continue;
    }

    // Lọc theo thương hiệu
    if (brandFilter && brandFilter !== "ALL") {
      if (p.brand !== brandFilter) continue;
    }

    var isHidden = p.status === "hidden";
    var statusText = isHidden ? "Đang ẩn" : "Đang bán";
    var statusClass = isHidden ? "status-locked" : "status-active";
    var toggleBtnText = isHidden ? "Hiện" : "Ẩn";

    // Cảnh báo tồn kho đỏ nếu <= 5
    var stockBadge = `<strong>${p.stock}</strong>`;
    if (p.stock <= 5) {
      stockBadge = `<span class="stock-warning">${p.stock}</span>`;
    }

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${p.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"}" class="table-img" alt="${p.name}">
      </td>
      <td>
        <div class="item-title">${p.name}</div>
        <div class="item-code">Mã: ${p.code || "SP-" + p.id}</div>
      </td>
      <td><span class="nav-badge badge-blue">${p.category}</span></td>
      <td><strong>${p.brand || "Khác"}</strong></td>
      <td><strong class="text-primary">${formatVND(p.price)}</strong></td>
      <td>${stockBadge}</td>
      <td><span class="status-pill ${statusClass}">${statusText}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-action btn-edit" onclick="editProduct(${p.id})">
            Sửa
          </button>
          <button type="button" class="btn-action btn-lock" onclick="toggleHideProduct(${p.id})">
            ${toggleBtnText}
          </button>
          <button type="button" class="btn-action btn-delete" onclick="deleteProduct(${p.id})">
            Xóa
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Đồng bộ danh sách danh mục vào thẻ select của form sản phẩm
 */
function populateCategorySelects() {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var selectForm = document.getElementById("prod-category");
  var selectFilter = document.getElementById("product-filter-category");

  if (selectForm) {
    var optionsHtml = "";
    for (var i = 0; i < categories.length; i++) {
      optionsHtml += `<option value="${categories[i].name}">${categories[i].icon} ${categories[i].name}</option>`;
    }
    selectForm.innerHTML = optionsHtml;
  }

  if (selectFilter) {
    var filterHtml = `<option value="ALL">Tất cả môn thể thao</option>`;
    for (var j = 0; j < categories.length; j++) {
      filterHtml += `<option value="${categories[j].name}">${categories[j].name}</option>`;
    }
    selectFilter.innerHTML = filterHtml;
  }
}

/**
 * Mở modal thêm mới sản phẩm
 */
function openModalAddProduct() {
  currentEditingProductId = -1;
  populateCategorySelects();

  document.getElementById("modal-product-title").textContent =
    "Thêm Mới Sản Phẩm / Trang Bị Thể Thao";
  document.getElementById("prod-name").value = "";
  document.getElementById("prod-code").value =
    "SP-" + Date.now().toString().slice(-4);

  var hotCheck = document.getElementById("prod-is-hot") ;
  var newCheck = document.getElementById("prod-is-new") ;
  if (hotCheck) hotCheck.checked = false;
  if (newCheck) newCheck.checked = false;

  openModal("modal-product");
}

/**
 * Sửa sản phẩm: Load đúng thông tin cũ lên Modal Form theo Bareme SGU
 */
function editProduct(productId) {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var target = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      target = products[i];
      break;
    }
  }
  if (!target) return;

  currentEditingProductId = productId;
  populateCategorySelects();

  document.getElementById("modal-product-title").textContent =
    "Chỉnh Sửa Sản Phẩm: " + target.name;
  document.getElementById("prod-name").value = target.name;
  document.getElementById("prod-code").value = target.code || "SP-" + target.id;
  document.getElementById("prod-category").value = target.category;
  document.getElementById("prod-brand").value = target.brand || "Nike";
  document.getElementById("prod-cost").value =
    target.costPrice || Math.round(target.price * 0.75);
  document.getElementById("prod-price").value = target.price;
  document.getElementById("prod-stock").value = target.stock;
  document.getElementById("prod-image").value = target.image || "";
  document.getElementById("prod-desc").value = target.desc || "";
  var stockInput = document.getElementById("prod-stock");
  if (stockInput) {
    stockInput.value = target.stock || 0;
    stockInput.disabled = true;
  }
  var hotCheck = document.getElementById("prod-is-hot");
  var newCheck = document.getElementById("prod-is-new");
  if (hotCheck) hotCheck.checked = target.isHot === true;
  if (newCheck) newCheck.checked = target.isNew === true;

  openModal("modal-product");
}

/**
 * Lưu sản phẩm (Thêm mới hoặc Cập nhật)
 */
function saveProduct() {
  var name = document.getElementById("prod-name").value.trim();
  var code = document.getElementById("prod-code").value.trim();
  var category = document.getElementById("prod-category").value;
  var brand = document.getElementById("prod-brand").value;
  var costPrice = Number(document.getElementById("prod-cost").value) || 0;
  var price = Number(document.getElementById("prod-price").value) || 0;
  var stock = Number(document.getElementById("prod-stock").value) || 0;
  var image = document.getElementById("prod-image").value.trim();
  var desc = document.getElementById("prod-desc").value.trim();

  if (!name || price <= 0) {
    alert("Vui lòng nhập tên sản phẩm và giá bán hợp lệ (> 0đ)!");
    return;
  }

  // Tự động tính % lợi nhuận
  var profitPercent = 30;
  if (costPrice > 0) {
    profitPercent = Math.round(((price - costPrice) / costPrice) * 100);
  }

  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);

  // Lấy giá trị cờ
  var isHot = document.getElementById("prod-is-hot") ? document.getElementById("prod-is-hot").checked : false;
  var isNew = document.getElementById("prod-is-new") ? document.getElementById("prod-is-new").checked : false;


  if (currentEditingProductId === -1) {
    // Thêm mới
    var newId = Date.now();
    var newProduct = {
      id: newId,
      code: code || "SP-" + newId.toString().slice(-4),
      name: name,
      category: category,
      brand: brand,
      costPrice: costPrice,
      profitPercent: profitPercent,
      price: price,
      stock: stock,
      image:
        image ||
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      desc: desc,
      status: "active",
      isHot: isHot,
      isNew: isNew,
    };
    var danhSachMoi = [newProduct];
    for (var i = 0; i < products.length; i++) {
      danhSachMoi.push(products[i]);
    }
    products = danhSachMoi;
    alert("Đã thêm mới sản phẩm [" + name + "] thành công!");
  } else {
    // Cập nhật sản phẩm cũ
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === currentEditingProductId) {
        products[i].name = name;
        products[i].code = code;
        products[i].category = category;
        products[i].brand = brand;
        products[i].costPrice = costPrice;
        products[i].profitPercent = profitPercent;
        products[i].price = price;
        products[i].stock = stock;
        products[i].image = image;
        products[i].desc = desc;
        products[i].isHot = isHot;
        products[i].isNew = isNew;

        break;
      }
    }
    alert("Đã cập nhật sản phẩm thành công!");
  }

  setStorage(STORAGE_KEYS.PRODUCTS, products);
  closeModal("modal-product");
  renderProductTable();
  updateSidebarBadges();
}

/**
 * Xóa sản phẩm
 */
function deleteProduct(productId) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống không?"))
    return;

  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var newProds = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].id !== productId) {
      newProds.push(products[i]);
    }
  }

  setStorage(STORAGE_KEYS.PRODUCTS, newProds);
  alert("Đã xóa sản phẩm thành công!");
  renderProductTable();
  updateSidebarBadges();
}

/**
 * Ẩn / Hiện sản phẩm
 */
function toggleHideProduct(productId) {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      products[i].status =
        products[i].status === "hidden" ? "active" : "hidden";
      break;
    }
  }
  setStorage(STORAGE_KEYS.PRODUCTS, products);
  renderProductTable();
}

/**
 * Lọc danh sách sản phẩm khi thay đổi ô input hoặc dropdown
 */
function filterProducts() {
  renderProductTable();
}
