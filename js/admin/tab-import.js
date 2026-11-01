/**
 * ==============================================================================
 * SPORTSTORE - TAB 5: QUẢN LÝ NHẬP HÀNG (TAB-IMPORT.JS)
 * - Quản lý phiếu nhập hàng vào kho
 * - Tìm kiếm, lọc theo ngày, trạng thái
 * - Tạo phiếu nhập hàng và tự động cập nhật tồn kho khi hoàn thành
 * ==============================================================================
 */

/**
 * 1. Vẽ bảng danh sách phiếu nhập hàng
 */
function renderImportTable() {
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var tbody = document.getElementById("admin-imports-tbody");
  if (!tbody) return;

  var searchKw = "";
  var searchInput = document.getElementById("import-search-input");
  if (searchInput) searchKw = searchInput.value.trim().toLowerCase();

  var statusFilter = "";
  var selectStatus = document.getElementById("import-filter-status");
  if (selectStatus) statusFilter = selectStatus.value;

  var fromDate = "";
  var toDate = "";
  var inputFrom = document.getElementById("import-filter-from-date");
  var inputTo = document.getElementById("import-filter-to-date");
  if (inputFrom) fromDate = inputFrom.value;
  if (inputTo) toDate = inputTo.value;

  tbody.innerHTML = "";

  if (imports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 24px;">Chưa có phiếu nhập hàng nào trong hệ thống.</td></tr>`;
    return;
  }

  var filteredCount = 0;

  for (var i = 0; i < imports.length; i++) {
    var imp = imports[i];

    // Lọc theo từ khóa (Mã phiếu hoặc nhà cung cấp)
    if (searchKw) {
      var idMatch = (imp.importId || "").toLowerCase().indexOf(searchKw) !== -1;
      var supMatch = (imp.supplier || "").toLowerCase().indexOf(searchKw) !== -1;
      if (!idMatch && !supMatch) continue;
    }

    // Lọc theo trạng thái
    if (statusFilter && statusFilter !== "ALL") {
      if (imp.status !== statusFilter) continue;
    }

    // Lọc theo khoảng ngày
    if (fromDate && imp.date < fromDate) continue;
    if (toDate && imp.date > toDate) continue;

    filteredCount++;

    var badgeClass = imp.status === "Hoàn thành" ? "badge-green" : "badge-orange";
    var dateDisplay = typeof formatDateVN === "function" ? formatDateVN(imp.date) : imp.date;

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong class="text-primary">#${imp.importId}</strong></td>
      <td>
        <div class="item-title">${imp.supplier}</div>
        <div class="item-code" style="font-size: 0.8rem; color: #64748b;">${imp.note || "Không có ghi chú"}</div>
      </td>
      <td>${dateDisplay}</td>
      <td><strong>${imp.totalQuantity || 0}</strong> món</td>
      <td><strong class="text-primary">${formatVND(imp.totalCost || 0)}</strong></td>
      <td>${imp.creator || "Quản Trị Viên"}</td>
      <td><span class="nav-badge ${badgeClass}">${imp.status || "Hoàn thành"}</span></td>
      <td>
        <button type="button" class="btn-action btn-delete" onclick="deleteImport('${imp.importId}')" title="Xóa phiếu nhập">
          Xóa
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  if (filteredCount === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 24px;">Không tìm thấy phiếu nhập nào phù hợp với bộ lọc.</td></tr>`;
  }
}

/**
 * 2. Lọc danh sách phiếu nhập khi người dùng nhập từ khóa / chọn ngày
 */
function filterImports() {
  renderImportTable();
}

/**
 * 3. Mở Modal tạo phiếu nhập mới
 */
function openModalAddImport() {
  var idInput = document.getElementById("import-id");
  var dateInput = document.getElementById("import-date");
  var supplierInput = document.getElementById("import-supplier");
  var selectProduct = document.getElementById("import-product-select");
  var qtyInput = document.getElementById("import-qty");
  var priceInput = document.getElementById("import-unit-price");
  var noteInput = document.getElementById("import-note");

  // Tự sinh mã phiếu nhập tiếp theo
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var nextNum = imports.length + 1;
  var nextCode = "PN-2026-" + (nextNum < 10 ? "00" + nextNum : nextNum < 100 ? "0" + nextNum : nextNum);

  if (idInput) idInput.value = nextCode;
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
  if (supplierInput) supplierInput.value = "";
  if (qtyInput) qtyInput.value = "10";
  if (noteInput) noteInput.value = "";

  // Đổ danh sách sản phẩm vào dropdown
  if (selectProduct) {
    var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
    var html = "";
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      html += `<option value="${p.id}" data-cost="${p.costPrice || Math.round(p.price * 0.7)}">${p.code || "SP-" + p.id} - ${p.name} (Tồn hiện tại: ${p.stock || 0})</option>`;
    }
    selectProduct.innerHTML = html;
  }

  onImportProductChange();

  if (typeof openModal === "function") {
    openModal("modal-import");
  } else {
    var modal = document.getElementById("modal-import");
    if (modal) modal.classList.add("show");
  }
}

/**
 * 4. Khi thay đổi sản phẩm chọn nhập, tự động điền giá vốn gợi ý
 */
function onImportProductChange() {
  var selectProduct = document.getElementById("import-product-select");
  var priceInput = document.getElementById("import-unit-price");
  if (!selectProduct || !priceInput) return;

  var selectedOption = selectProduct.options[selectProduct.selectedIndex];
  if (selectedOption) {
    var cost = selectedOption.getAttribute("data-cost");
    if (cost) priceInput.value = cost;
  }
}

/**
 * 5. Lưu phiếu nhập mới vào LocalStorage
 */
function saveImport() {
  var idInput = document.getElementById("import-id");
  var dateInput = document.getElementById("import-date");
  var supplierInput = document.getElementById("import-supplier");
  var selectProduct = document.getElementById("import-product-select");
  var qtyInput = document.getElementById("import-qty");
  var priceInput = document.getElementById("import-unit-price");
  var statusSelect = document.getElementById("import-status");
  var noteInput = document.getElementById("import-note");

  var importId = idInput ? idInput.value.trim() : "";
  var supplier = supplierInput ? supplierInput.value.trim() : "";
  var date = dateInput ? dateInput.value : "";
  var quantity = qtyInput ? parseInt(qtyInput.value) || 0 : 0;
  var unitPrice = priceInput ? parseInt(priceInput.value) || 0 : 0;
  var status = statusSelect ? statusSelect.value : "Hoàn thành";
  var note = noteInput ? noteInput.value.trim() : "";

  if (!importId || !supplier) {
    alert("Vui lòng điền đầy đủ Mã phiếu nhập và Nhà cung cấp!");
    return;
  }

  if (quantity <= 0) {
    alert("Số lượng nhập phải lớn hơn 0!");
    return;
  }

  var selectedProductId = selectProduct ? selectProduct.value : null;
  var selectedProductName = selectProduct && selectProduct.selectedIndex >= 0
    ? selectProduct.options[selectProduct.selectedIndex].text
    : "Sản phẩm";

  var totalCost = quantity * unitPrice;

  var newImport = {
    importId: importId,
    supplier: supplier,
    date: date || new Date().toISOString().split("T")[0],
    creator: "Quản Trị Viên",
    status: status,
    note: note,
    items: [
      {
        productId: selectedProductId,
        name: selectedProductName,
        quantity: quantity,
        importPrice: unitPrice,
        total: totalCost
      }
    ],
    totalQuantity: quantity,
    totalCost: totalCost
  };

  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  // Dùng vòng for đơn giản đưa phiếu mới lên đầu danh sách
  var danhSachMoi = [newImport];
  for (var i = 0; i < imports.length; i++) {
    danhSachMoi.push(imports[i]);
  }
  setStorage(STORAGE_KEYS.IMPORTS, danhSachMoi);

  // Nếu phiếu nhập có trạng thái "Hoàn thành", tự động cộng dồn số lượng tồn kho của sản phẩm
  if (status === "Hoàn thành" && selectedProductId) {
    var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
    for (var i = 0; i < products.length; i++) {
      if (String(products[i].id) === String(selectedProductId)) {
        products[i].stock = (parseInt(products[i].stock) || 0) + quantity;
        break;
      }
    }
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  alert("Đã tạo thành công phiếu nhập hàng [#" + importId + "]!");

  if (typeof closeModal === "function") {
    closeModal("modal-import");
  } else {
    var modal = document.getElementById("modal-import");
    if (modal) modal.classList.remove("show");
  }

  renderImportTable();
  if (typeof updateSidebarBadges === "function") updateSidebarBadges();
  if (typeof updateDashboardStats === "function") updateDashboardStats();
}

/**
 * 6. Xóa phiếu nhập hàng
 */
function deleteImport(importId) {
  var xacNhan = confirm("Bạn có chắc chắn muốn xóa phiếu nhập [#" + importId + "] không?");
  if (!xacNhan) return;

  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  // Dùng vòng for đơn giản lọc bỏ phiếu cần xóa
  var newImports = [];
  for (var i = 0; i < imports.length; i++) {
    if (imports[i].importId !== importId) {
      newImports.push(imports[i]);
    }
  }

  setStorage(STORAGE_KEYS.IMPORTS, newImports);
  alert("Đã xóa phiếu nhập hàng [#" + importId + "]!");

  renderImportTable();
  if (typeof updateSidebarBadges === "function") updateSidebarBadges();
  if (typeof updateDashboardStats === "function") updateDashboardStats();
}

