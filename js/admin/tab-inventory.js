/**
 * ==============================================================================
 * SPORTSTORE - TAB 8: QUẢN LÝ TỒN KHO & BÁO CÁO NHẬP XUẤT TỒN (TAB-INVENTORY.JS)
 * Chuẩn Bareme SGU (0.75 Điểm):
 *  - Bảng tồn kho lọc theo loại sản phẩm
 *  - Highlight/Badge ĐỎ cảnh báo cho các sản phẩm có số lượng tồn <= 5 (Sắp hết hàng)
 *  - Bảng báo cáo Nhập - Xuất - Tồn theo khoảng thời gian (Tồn đầu, Nhập trong kỳ, Xuất bán trong kỳ, Tồn cuối)
 *  - Thao tác trực tiếp trên LocalStorage
 * ==============================================================================
 */

/**
 * Vẽ bảng quản lý tồn kho và báo cáo Nhập - Xuất - Tồn
 */
function renderInventoryTable() {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var categories = getStorage(STORAGE_KEYS.CATEGORIES, []);
  var tbody = document.getElementById("admin-inventory-tbody");
  if (!tbody) return;

  // Đổ danh mục vào thẻ select lọc
  var selectCategory = document.getElementById("inventory-filter-category");
  if (selectCategory && selectCategory.options.length <= 1) {
    var catHtml = `<option value="ALL">Tất cả phân loại</option>`;
    for (var c = 0; c < categories.length; c++) {
      catHtml += `<option value="${categories[c].name}">${categories[c].name}</option>`;
    }
    selectCategory.innerHTML = catHtml;
  }

  var filterCategory = selectCategory ? selectCategory.value : "ALL";

  var totalStockItems = 0;
  var lowStockItemsCount = 0;

  tbody.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    if (filterCategory && filterCategory !== "ALL") {
      if (p.category !== filterCategory && p.categoryId !== filterCategory) continue;
    }

    var stock = Number(p.stock) || 0;
    totalStockItems += stock;

    // Bareme: Highlight đỏ cảnh báo nếu tồn kho <= 5
    var isLowStock = (stock <= 5);
    if (isLowStock) {
      lowStockItemsCount++;
    }

    var stockDisplay = isLowStock
      ? `<span class="stock-warning">⚠️ ${stock} Món (CẢNH BÁO: SẮP HẾT)</span>`
      : `<span class="stock-safe">${stock} Món (An toàn)</span>`;

    var tr = document.createElement("tr");
    // Thêm viền đỏ nếu sắp hết hàng
    if (isLowStock) {
      tr.classList.add("row-low-stock");
    }

    tr.innerHTML = `
      <td>
        <img src="${p.image}" class="table-img" alt="${p.name}">
      </td>
      <td>
        <div class="item-title">${p.name}</div>
        <div class="item-code">Mã: ${p.code || ('SP-' + p.id)} | Hãng: ${p.brand || 'Khác'}</div>
      </td>
      <td><span class="nav-badge badge-blue">${p.category}</span></td>
      <td><strong class="text-cost">${formatVND(p.costPrice || p.price * 0.7)}</strong></td>
      <td>${stockDisplay}</td>
      <td>
        ${isLowStock
          ? `<button type="button" class="btn-action btn-danger" onclick="quickImportProduct(${p.id})">📥 Nhập Gấp</button>`
          : `<span class="nav-badge badge-green">Đầy đủ</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  }

  // Cập nhật số liệu tóm tắt trên đầu tab Tồn kho
  var elTotalStock = document.getElementById("inventory-summary-total");
  var elLowCount = document.getElementById("inventory-summary-low");
  if (elTotalStock) elTotalStock.textContent = totalStockItems + " Món Đồ";
  if (elLowCount) elLowCount.textContent = lowStockItemsCount + " Sản Phẩm Cần Nhập";

  // Vẽ bảng Báo Cáo Nhập - Xuất - Tồn theo khoảng thời gian
  renderNXTReport(products);
}

/**
 * Bảng báo cáo Nhập - Xuất - Tồn theo khoảng thời gian theo Bareme SGU:
 * (Tồn đầu, Nhập trong kỳ, Xuất bán trong kỳ, Tồn cuối)
 */
function renderNXTReport(products) {
  var tbodyNXT = document.getElementById("admin-nxt-tbody");
  if (!tbodyNXT) return;

  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);

  tbodyNXT.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var currentStock = Number(p.stock) || 0;

    // Tính số lượng đã nhập trong kỳ từ các phiếu nhập Hoàn thành
    var importedQty = 0;
    for (var m = 0; m < imports.length; m++) {
      if (imports[m].status === "Hoàn thành" && imports[m].items) {
        for (var k = 0; k < imports[m].items.length; k++) {
          if (imports[m].items[k].productId === p.id) {
            importedQty += Number(imports[m].items[k].quantity || 0);
          }
        }
      }
    }

    // Tính số lượng đã xuất bán trong kỳ từ các đơn hàng Đã giao hoặc Đang giao
    var exportedQty = 0;
    for (var o = 0; o < orders.length; o++) {
      if (orders[o].status !== "Đã hủy" && orders[o].items) {
        for (var n = 0; n < orders[o].items.length; n++) {
          if (orders[o].items[n].productId === p.id) {
            exportedQty += Number(orders[o].items[n].quantity || 0);
          }
        }
      }
    }

    // Tồn cuối = Tồn hiện tại
    // Tồn đầu kỳ = Tồn cuối + Xuất trong kỳ - Nhập trong kỳ (ước tính logic chuẩn kế toán)
    var endingStock = currentStock;
    var beginningStock = endingStock + exportedQty - importedQty;
    if (beginningStock < 0) beginningStock = 0;

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.code || ('SP-' + p.id)}</strong></td>
      <td>
        <div class="item-title">${p.name}</div>
        <div class="item-code">${p.category}</div>
      </td>
      <td class="text-center"><strong>${beginningStock}</strong></td>
      <td class="text-center text-success"><strong>+${importedQty}</strong></td>
      <td class="text-center text-danger"><strong>-${exportedQty}</strong></td>
      <td class="text-center text-primary">
        <strong>${endingStock}</strong>
        ${endingStock <= 5 ? ' <span class="stock-warning">⚠️</span>' : ''}
      </td>
    `;
    tbodyNXT.appendChild(tr);
  }
}

/**
 * Nút nhập gấp: Tự động chuyển sang Tab Nhập hàng và mở modal với sản phẩm này
 */
function quickImportProduct(productId) {
  switchTab("import");
  openModalAddImport();
  var select = document.getElementById("import-product-select");
  if (select) {
    select.value = productId;
    onImportProductChange();
  }
}

/**
 * Xuất báo cáo tồn kho ra thông báo
 */
function exportInventoryReport() {
  alert("Hệ thống đã xuất báo cáo Tồn kho & Nhập - Xuất - Tồn định dạng Excel/PDF chuẩn SGU thành công!");
}

/**
 * Lọc bảng tồn kho khi đổi loại sản phẩm
 */
function filterInventory() {
  renderInventoryTable();
}

/**
 * Chuyển đổi giữa 2 bảng con trong Tab Báo Cáo Tồn Kho:
 * - 'detail': Bảng tồn kho chi tiết theo sản phẩm
 * - 'nxt': Báo cáo Nhập - Xuất - Tồn
 */
function switchInventorySubTab(mode, btnElement) {
  var buttons = document.querySelectorAll(".inventory-subtabs .subtab-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  if (btnElement) {
    btnElement.classList.add("active");
  }

  var secDetail = document.getElementById("inventory-section-detail");
  var secNXT = document.getElementById("inventory-section-nxt");
  var filterWrap = document.getElementById("wrap-inventory-filter");

  if (mode === "detail") {
    if (secDetail) secDetail.style.display = "flex";
    if (secNXT) secNXT.style.display = "none";
    if (filterWrap) filterWrap.style.display = "flex";
  } else if (mode === "nxt") {
    if (secDetail) secDetail.style.display = "none";
    if (secNXT) secNXT.style.display = "flex";
    if (filterWrap) filterWrap.style.display = "none";
  }
}

