// Biến lưu ID loại sản phẩm đang được chỉnh sửa (nếu là "" nghĩa là đang thêm mới)
var currentEditingCategoryId = "";

/**
 * Vẽ bảng danh mục loại sản phẩm*/
function renderCategoryTable() {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var tbody = document.getElementById("category-tbody");
  if (!tbody) return;

  var filterKeyword = "";
  var searchInput = document.getElementById("category-search-input");
  if (searchInput) {
    filterKeyword = searchInput.value.trim().toLowerCase();
  }

  tbody.innerHTML = "";

  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];

    if (filterKeyword) {

      var matchName = cat.name && cat.name.toLowerCase().indexOf(filterKeyword) !== -1;

      var matchId = cat.id && cat.id.toLowerCase().indexOf(filterKeyword) !== -1;

      if (!matchName && !matchId) continue;
    }

    var productCount = 0;
    for (var j = 0; j < products.length; j++) {
      if (
        products[j].categoryId === cat.id ||
        products[j].category === cat.name
      ) {
        productCount++;
      }
    }

    var isHidden = cat.status === "hidden";
    var statusText = isHidden ? "Đang ẩn" : "Đang áp dụng";
    var statusClass = isHidden ? "status-locked" : "status-active";
    var toggleBtnText = isHidden ? "Hiện" : "Ẩn";

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-icon">${cat.icon || "🏷️"}</td>
      <td><strong>${cat.id}</strong></td>
      <td>
        <div class="item-title">${cat.name}</div>
      </td>
      <td><span class="nav-badge badge-blue">${productCount} sản phẩm</span></td>
      <td><strong>${cat.profitPercent || 25}%</strong></td>
      <td><span class="status-pill ${statusClass}">${statusText}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-action btn-edit" onclick="openModalEditCategory('${cat.id}')">
             Sửa
          </button>
          <button type="button" class="btn-action btn-lock" onclick="toggleHideCategory('${cat.id}')">
            ${toggleBtnText}
          </button>
          <button type="button" class="btn-action btn-delete" onclick="deleteCategory('${cat.id}')">
             Xóa
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Mở modal thêm mới loại sản phẩm
 */
function openModalAddCategory() {

  currentEditingCategoryId = "";

  document.getElementById("modal-category-title").textContent = "Thêm Mới Loại Sản Phẩm";

  document.getElementById("cat-id").value =  "CAT-" + (categories.length + 1);

  document.getElementById("cat-id").disabled = true;

  document.getElementById("cat-name").value = "";
  document.getElementById("cat-icon").value = "🏆";
  document.getElementById("cat-desc").value = "";
  document.getElementById("cat-profit").value = "30";

  openModal("modal-category");
}

/** Mở modal chỉnh sửa loại sản phẩm*/
function openModalEditCategory(catId) {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var target = null;
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].id === catId) {
      target = categories[i];
      break;
    }
  }
  if (!target) return;

  currentEditingCategoryId = catId;
  document.getElementById("modal-category-title").textContent =
    "Chỉnh Sửa Loại Sản Phẩm: " + target.name;
  document.getElementById("cat-id").value = target.id;
  document.getElementById("cat-id").disabled = true; // Không cho sửa mã ID gốc
  document.getElementById("cat-name").value = target.name;
  document.getElementById("cat-icon").value = target.icon || "🏷️";
  document.getElementById("cat-desc").value = target.desc || "";
  document.getElementById("cat-profit").value = target.profitPercent || 25;

  openModal("modal-category");
}

/**
 * Lưu loại sản phẩm (Thêm mới hoặc Cập nhật)
 */
function saveCategory() {
  var id = document.getElementById("cat-id").value.trim();
  var name = document.getElementById("cat-name").value.trim();
  var icon = document.getElementById("cat-icon").value.trim() || "🏷️";
  var desc = document.getElementById("cat-desc").value.trim();
  var profit = Number(document.getElementById("cat-profit").value) || 25;

  if ( !name || !icon || !desc || !profit) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);

  if (currentEditingCategoryId === "") {

    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        alert("Mã loại [" + id + "] đã tồn tại! Vui lòng chọn mã khác.");
        return;
      }
    }
    categories.push({
      id: id,
      name: name,
      icon: icon,
      desc: desc,
      profitPercent: profit,
      status: "active",
    });
    alert("Đã thêm mới loại sản phẩm [" + name + "] thành công!");
  } else {
    // Cập nhật loại cũ
    for (var j = 0; j < categories.length; j++) {
      if (categories[j].id === currentEditingCategoryId) {
        categories[j].name = name;
        categories[j].icon = icon;
        categories[j].desc = desc;
        categories[j].profitPercent = profit;
        break;
      }
    }
    alert("Đã cập nhật loại sản phẩm thành công!");
  }

  setStorage(STORAGE_KEYS.CATEGORIES, categories);
  closeModal("modal-category");
  renderCategoryTable();
  updateSidebarBadges();
}

/**
 * Xóa loại sản phẩm
 */
function deleteCategory(catId) {
  if (!confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này không?")) return;

  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var newCats = [];
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].id !== catId) {
      newCats.push(categories[i]);
    }
  }

  setStorage(STORAGE_KEYS.CATEGORIES, newCats);
  alert("Đã xóa loại sản phẩm [" + catId + "]!");
  renderCategoryTable();
  updateSidebarBadges();
}

/**
 * Ẩn / Hiện loại sản phẩm
 */
function toggleHideCategory(catId) {
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].id === catId) {
      categories[i].status =
        categories[i].status === "hidden" ? "active" : "hidden";
      break;
    }
  }
  setStorage(STORAGE_KEYS.CATEGORIES, categories);
  renderCategoryTable();
}

/**
 * Lọc loại sản phẩm khi tìm kiếm
 */
function filterCategories() {
  renderCategoryTable();
}
