/**
 * ==============================================================================
 * SPORTSTORE - TAB 5: QUẢN LÝ NHẬP HÀNG VÀO KHO (TAB-IMPORT.JS)
 * Chuẩn Bareme SGU (0.75 Điểm):
 *  - Danh sách phiếu nhập & Tìm kiếm theo mã phiếu / khoảng ngày
 *  - Tạo phiếu nhập mới: Chọn sản phẩm, số lượng, giá nhập
 *  - Trạng thái: "Tạm lưu" (cho phép bấm Sửa) và "Hoàn thành" (disable nút sửa, tự cộng kho)
 *  - Lưu và đọc trực tiếp từ LocalStorage
 * ==============================================================================
 */

var currentEditingImportId = "";

/**
 * Vẽ bảng danh sách phiếu nhập hàng
 */
function renderImportTable() {
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var tbody = document.getElementById("admin-imports-tbody");
  if (!tbody) return;

  var keyword = "";
  var searchInput = document.getElementById("import-search-input");
  if (searchInput) keyword = searchInput.value.trim().toLowerCase();

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

  for (var i = 0; i < imports.length; i++) {
    var imp = imports[i];

    // Trích xuất an toàn các trường dữ liệu (tương thích mọi phiên bản)
    var impId = imp.importId || imp.id || imp.code || ("PN-2026-" + (i + 1 < 10 ? "00" : "0") + (i + 1));
    var impSupplier = imp.supplier || imp.supplierName || "Nhà Phân Phối Thể Thao";
    var impDate = imp.date || (imp.createdAt ? imp.createdAt.split(" ")[0] : "") || "2026-10-15";
    var impQty = Number(imp.totalQuantity != null ? imp.totalQuantity : (imp.totalItems != null ? imp.totalItems : (imp.quantity || 0)));
    var impCost = Number(imp.totalCost != null ? imp.totalCost : (imp.total != null ? imp.total : (imp.totalPrice || 0)));
    var impCreator = imp.creator || imp.createdBy || "Quản Trị Viên";
    var isCompleted = (imp.status === "Hoàn thành" || imp.status === "completed");
    var impStatusText = isCompleted ? "Hoàn thành" : "Tạm lưu";

    // Lọc theo từ khóa (Mã phiếu hoặc Tên nhà cung cấp)
    if (keyword) {
      var matchId = impId.toLowerCase().indexOf(keyword) !== -1;
      var matchSupplier = impSupplier.toLowerCase().indexOf(keyword) !== -1;
      if (!matchId && !matchSupplier) continue;
    }

    // Lọc theo trạng thái
    if (statusFilter && statusFilter !== "ALL") {
      if (impStatusText !== statusFilter) continue;
    }

    // Lọc theo khoảng ngày nhập
    if (fromDate && impDate < fromDate) continue;
    if (toDate && impDate > toDate) continue;

    var statusClass = isCompleted ? "status-active" : "status-pending";

    // Bareme: "Hoàn thành" thì disable nút sửa, "Tạm lưu" thì cho phép bấm sửa
    var editBtnHtml = isCompleted
      ? `<button type="button" class="btn-action btn-action-disabled" title="Phiếu đã hoàn thành không thể sửa" disabled>Đã chốt</button>`
      : `<button type="button" class="btn-action btn-edit" onclick="openModalEditImport('${impId}')" title="Chỉnh sửa phiếu nhập tạm lưu">Sửa</button>`;

    var completeBtnHtml = isCompleted
      ? ""
      : `<button type="button" class="btn-action btn-success" onclick="completeImport('${impId}')" title="Xác nhận hoàn thành & cộng kho">Hoàn tất</button>`;

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong class="text-primary">${impId}</strong></td>
      <td>
        <div class="item-title">${impSupplier}</div>
        <div class="item-code">${imp.note || "Phiếu nhập kho"}</div>
      </td>
      <td>${formatDateVN(impDate)}</td>
      <td><strong>${impQty} món</strong></td>
      <td><strong class="text-success">${formatVND(impCost)}</strong></td>
      <td>${impCreator}</td>
      <td><span class="status-pill ${statusClass}">${impStatusText}</span></td>
      <td>
        <div class="table-actions">
          ${editBtnHtml}
          ${completeBtnHtml}
          <button type="button" class="btn-action btn-action-view" onclick="viewImportDetail('${impId}')">
             Xem
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Đổ danh sách sản phẩm vào thẻ select khi tạo phiếu nhập
 */
function populateImportProductSelect() {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var select = document.getElementById("import-product-select");
  if (!select) return;

  var html = "";
  for (var i = 0; i < products.length; i++) {
    html += `<option value="${products[i].id}">${products[i].name} (Hiện có: ${products[i].stock})</option>`;
  }
  select.innerHTML = html;

  // Tự động điền giá vốn mẫu khi đổi sản phẩm
  onImportProductChange();
}

/**
 * Khi người dùng đổi sản phẩm trong dropdown nhập hàng
 */
function onImportProductChange() {
  var select = document.getElementById("import-product-select");
  var inputPrice = document.getElementById("import-unit-price");
  if (!select || !inputPrice) return;

  var prodId = Number(select.value);
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === prodId) {
      inputPrice.value =
        products[i].costPrice || Math.round(products[i].price * 0.7);
      break;
    }
  }
}

/**
 * Mở modal tạo phiếu nhập mới
 */
function openModalAddImport() {
  currentEditingImportId = "";
  populateImportProductSelect();

  document.getElementById("modal-import-title").textContent =
    "Tạo Phiếu Nhập Hàng Vào Kho";
  document.getElementById("import-id").value =
    "PN-" + new Date().getFullYear() + "-" + Date.now().toString().slice(-3);
  document.getElementById("import-supplier").value =
    "Nike Việt Nam Distribution";
  document.getElementById("import-date").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("import-qty").value = "20";
  document.getElementById("import-status").value = "Tạm lưu"; // Mặc định là Tạm lưu
  document.getElementById("import-note").value = "";

  openModal("modal-import");
}

/**
 * Mở modal chỉnh sửa phiếu nhập Tạm lưu
 */
function openModalEditImport(importId) {
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var target = null;
  for (var i = 0; i < imports.length; i++) {
    var curId = imports[i].importId || imports[i].id || imports[i].code;
    if (curId === importId || (!curId && ("PN-2026-" + (i + 1 < 10 ? "00" : "0") + (i + 1)) === importId)) {
      target = imports[i];
      target.importId = importId;
      break;
    }
  }
  if (!target) return;

  if (target.status === "Hoàn thành") {
    alert(
      "Phiếu nhập này đã 'Hoàn thành' và chốt sổ kho, không thể chỉnh sửa!",
    );
    return;
  }

  currentEditingImportId = importId;
  populateImportProductSelect();

  document.getElementById("modal-import-title").textContent =
    "Chỉnh Sửa Phiếu Nhập: " + target.importId;
  document.getElementById("import-id").value = target.importId;
  document.getElementById("import-supplier").value = target.supplier;
  document.getElementById("import-date").value = target.date;
  document.getElementById("import-status").value = target.status;
  document.getElementById("import-note").value = target.note || "";

  if (target.items && target.items.length > 0) {
    document.getElementById("import-product-select").value =
      target.items[0].productId;
    document.getElementById("import-qty").value = target.items[0].quantity;
    document.getElementById("import-unit-price").value =
      target.items[0].importPrice;
  }

  openModal("modal-import");
}

/**
 * Lưu phiếu nhập hàng
 */
function saveImport() {
  var importId = document.getElementById("import-id").value.trim();
  var supplier = document.getElementById("import-supplier").value.trim();
  var date = document.getElementById("import-date").value;
  var productId = Number(
    document.getElementById("import-product-select").value,
  );
  var quantity = Number(document.getElementById("import-qty").value) || 0;
  var unitPrice =
    Number(document.getElementById("import-unit-price").value) || 0;
  var status = document.getElementById("import-status").value;
  var note = document.getElementById("import-note").value.trim();

  if (!importId || !supplier || quantity <= 0 || unitPrice <= 0) {
    alert(
      "Vui lòng điền đầy đủ nhà cung cấp, số lượng (>0) và đơn giá nhập (>0)!",
    );
    return;
  }

  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  var productName = "Sản phẩm thể thao";
  for (var p = 0; p < products.length; p++) {
    if (products[p].id === productId) {
      productName = products[p].name;
      break;
    }
  }

  var totalCost = quantity * unitPrice;
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);

  var itemData = {
    productId: productId,
    name: productName,
    quantity: quantity,
    importPrice: unitPrice,
    total: totalCost,
  };

  if (currentEditingImportId === "") {
    // Thêm mới phiếu
    imports.unshift({
      importId: importId,
      supplier: supplier,
      date: date,
      creator: "Quản Trị Viên",
      status: status,
      note: note,
      items: [itemData],
      totalQuantity: quantity,
      totalCost: totalCost,
    });

    // Bareme: Nếu chọn trạng thái là "Hoàn thành" ngay từ đầu thì tự động cộng kho!
    if (status === "Hoàn thành") {
      addStockToProduct(productId, quantity, unitPrice);
      alert(
        "Đã tạo phiếu nhập [" +
          importId +
          "] thành công & tự động CỘNG " +
          quantity +
          " món vào kho!",
      );
    } else {
      alert(
        "Đã lưu tạm phiếu nhập [" +
          importId +
          "]. Bạn có thể bấm 'Hoàn tất' sau để cộng kho!",
      );
    }
  } else {
    // Sửa phiếu tạm lưu
    for (var i = 0; i < imports.length; i++) {
      if (imports[i].importId === currentEditingImportId) {
        imports[i].supplier = supplier;
        imports[i].date = date;
        imports[i].status = status;
        imports[i].note = note;
        imports[i].items = [itemData];
        imports[i].totalQuantity = quantity;
        imports[i].totalCost = totalCost;

        // Nếu chuyển từ Tạm lưu -> Hoàn thành
        if (status === "Hoàn thành") {
          addStockToProduct(productId, quantity, unitPrice);
          alert(
            "Phiếu đã chuyển sang 'Hoàn thành' & tự động CỘNG " +
              quantity +
              " món vào kho!",
          );
        } else {
          alert("Đã cập nhật thông tin phiếu nhập tạm lưu!");
        }
        break;
      }
    }
  }

  setStorage(STORAGE_KEYS.IMPORTS, imports);
  closeModal("modal-import");
  renderImportTable();
  updateSidebarBadges();
}

/**
 * Hàm bấm "Hoàn tất" nhanh trực tiếp từ bảng: Chuyển sang Hoàn thành và TỰ CỘNG KHO
 */
function completeImport(importId) {
  if (
    !confirm(
      "Xác nhận HOÀN THÀNH phiếu nhập [" +
        importId +
        "]? Sau khi hoàn thành, số lượng sẽ được tự động cộng vào kho sản phẩm và không thể sửa lại.",
    )
  ) {
    return;
  }

  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  for (var i = 0; i < imports.length; i++) {
    var curId = imports[i].importId || imports[i].id || imports[i].code;
    if (curId === importId || (!curId && ("PN-2026-" + (i + 1 < 10 ? "00" : "0") + (i + 1)) === importId)) {
      imports[i].importId = importId;
      imports[i].status = "Hoàn thành";
      // Cộng kho cho từng mặt hàng trong phiếu
      if (imports[i].items) {
        for (var j = 0; j < imports[i].items.length; j++) {
          var itm = imports[i].items[j];
          addStockToProduct(itm.productId, itm.quantity, itm.importPrice);
        }
      }
      break;
    }
  }

  setStorage(STORAGE_KEYS.IMPORTS, imports);
  alert(
    "Thành công: Đã chuyển phiếu nhập [" +
      importId +
      "] sang HOÀN THÀNH và CỘNG VÀO KHO!",
  );
  renderImportTable();
}

/**
 * Tiện ích cộng số lượng vào sản phẩm trong kho và cập nhật giá vốn
 */
function addStockToProduct(productId, addQuantity, costPrice) {
  var products = getStorage(STORAGE_KEYS.PRODUCTS, []);
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      products[i].stock = Number(products[i].stock || 0) + Number(addQuantity);
      if (costPrice && costPrice > 0) {
        products[i].costPrice = costPrice;
      }
      break;
    }
  }
  setStorage(STORAGE_KEYS.PRODUCTS, products);
}

/**
 * Xem chi tiết phiếu nhập
 */
function viewImportDetail(importId) {
  var imports = getStorage(STORAGE_KEYS.IMPORTS, []);
  var target = null;
  for (var i = 0; i < imports.length; i++) {
    var curId = imports[i].importId || imports[i].id || imports[i].code;
    if (curId === importId || (!curId && ("PN-2026-" + (i + 1 < 10 ? "00" : "0") + (i + 1)) === importId)) {
      target = imports[i];
      target.importId = importId;
      break;
    }
  }
  if (!target) return;

  var detailText =
    "CHI TIẾT PHIẾU NHẬP #" +
    (target.importId || importId) +
    "\n" +
    "Nhà cung cấp: " +
    (target.supplier || target.supplierName || "Nhà phân phối") +
    "\n" +
    "Ngày nhập: " +
    formatDateVN(target.date || target.createdAt) +
    "\n" +
    "Trạng thái: " +
    (target.status || "Hoàn thành") +
    "\n" +
    "Ghi chú: " +
    (target.note || "Không có") +
    "\n\n" +
    "DANH SÁCH MẶT HÀNG:\n";

  if (target.items) {
    for (var j = 0; j < target.items.length; j++) {
      var itm = target.items[j];
      detailText +=
        "- " +
        itm.name +
        " | SL: " +
        itm.quantity +
        " | Đơn giá: " +
        formatVND(itm.importPrice) +
        " -> Thành tiền: " +
        formatVND(itm.total) +
        "\n";
    }
  }

  detailText += "\nTỔNG CỘNG TIỀN VỐN: " + formatVND(target.totalCost);
  alert(detailText);
}

/**
 * Lọc danh sách phiếu nhập
 */
function filterImports() {
  renderImportTable();
}
