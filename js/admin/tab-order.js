/**
 * ==============================================================================
 * SPORTSTORE - TAB 7: QUẢN LÝ ĐƠN HÀNG (TAB-ORDER.JS)
 * Chuẩn Bareme SGU (0.5 Điểm):
 *  - Bộ lọc: Từ ngày, Đến ngày, Dropdown trạng thái (Tất cả, Mới đặt, Đã xử lý, Đang giao, Đã hủy)
 *  - Nút "Xem chi tiết" mở Modal xem từng món hàng, địa chỉ, tổng tiền
 *  - Dropdown chuyển đổi tình trạng đơn hàng ngay trên bảng
 *  - Lưu và đọc trực tiếp từ LocalStorage
 * ==============================================================================
 */

/**
 * Vẽ bảng quản lý đơn đặt hàng
 */
function renderOrderTable() {
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);
  var tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  var statusFilter = "";
  var selectStatus = document.getElementById("order-filter-status");
  if (selectStatus) statusFilter = selectStatus.value;

  var fromDate = "";
  var toDate = "";
  var inputFrom = document.getElementById("order-filter-from-date");
  var inputTo = document.getElementById("order-filter-to-date");
  if (inputFrom) fromDate = inputFrom.value;
  if (inputTo) toDate = inputTo.value;

  tbody.innerHTML = "";

  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];

    // Lọc theo trạng thái
    if (statusFilter && statusFilter !== "ALL") {
      if (o.status !== statusFilter) continue;
    }

    // Lọc theo khoảng ngày
    if (fromDate && o.date < fromDate) continue;
    if (toDate && o.date > toDate) continue;

    var productSummary =
      o.items && o.items.length > 0
        ? `${o.items[0].name} (x${o.items[0].quantity})`
        : "Trang bị thể thao";

    // Dropdown chuyển trạng thái đơn hàng trực tiếp
    var statusSelectHtml = `
      <select class="filter-select order-status-select" onchange="changeOrderStatus('${o.orderId}', this.value)">
        <option value="Mới đặt" ${o.status === "Mới đặt" ? "selected" : ""}>Mới đặt</option>
        <option value="Đã xử lý" ${o.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
        <option value="Đang giao" ${o.status === "Đang giao" ? "selected" : ""}>Đang giao</option>
        <option value="Đã giao" ${o.status === "Đã giao" ? "selected" : ""}>Đã giao</option>
        <option value="Đã hủy" ${o.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
      </select>
    `;

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong class="text-primary">#${o.orderId}</strong></td>
      <td>
        <div class="item-title">${o.customer}</div>
        <div class="item-code">SĐT: ${o.phone}</div>
      </td>
      <td>${formatDateVN(o.date)}</td>
      <td class="col-summary">
        <div>${productSummary}</div>
      </td>
      <td><strong class="text-primary">${formatVND(o.total)}</strong></td>
      <td><span class="nav-badge badge-gray">${o.payment || "Tiền mặt"}</span></td>
      <td>${statusSelectHtml}</td>
      <td>
        <button type="button" class="btn-action btn-edit" onclick="viewOrderDetail('${o.orderId}')" title="Xem chi tiết các mặt hàng & địa chỉ">
          Chi Tiết
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Chuyển trạng thái đơn hàng khi chọn dropdown
 */
function changeOrderStatus(orderId, newStatus) {
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId === orderId) {
      orders[i].status = newStatus;
      break;
    }
  }
  setStorage(STORAGE_KEYS.ORDERS, orders);
  alert(
    "Đã cập nhật tình trạng đơn hàng [#" + orderId + "] thành: " + newStatus,
  );
  renderOrderTable();
}

/**
 * Mở modal xem chi tiết đơn hàng
 */
function viewOrderDetail(orderId) {
  var orders = getStorage(STORAGE_KEYS.ORDERS, []);
  var target = null;
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId === orderId) {
      target = orders[i];
      break;
    }
  }
  if (!target) return;

  document.getElementById("modal-order-title").textContent =
    "Chi Tiết Đơn Hàng #" + target.orderId;
  document.getElementById("order-detail-customer").textContent =
    target.customer + " (" + target.phone + ")";
  document.getElementById("order-detail-email").textContent =
    target.email || "Chưa cập nhật";
  document.getElementById("order-detail-address").textContent =
    target.address || "Nhận tại cửa hàng";
  document.getElementById("order-detail-date").textContent = formatDateVN(
    target.date,
  );
  document.getElementById("order-detail-payment").textContent =
    target.payment || "COD";
  document.getElementById("order-detail-status").textContent = target.status;
  document.getElementById("order-detail-note").textContent =
    target.note || "Không có";
  document.getElementById("order-detail-total").textContent = formatVND(
    target.total,
  );

  // Render danh sách món hàng trong Modal
  var itemsContainer = document.getElementById("order-detail-items-list");
  var itemsHtml = "";
  if (target.items && target.items.length > 0) {
    for (var j = 0; j < target.items.length; j++) {
      var item = target.items[j];
      itemsHtml += `
        <div class="order-detail-item-row">
          <div class="order-detail-item-left">
            <img src="${item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"}" class="order-detail-item-img">
            <div>
              <div class="order-detail-item-name">${item.name}</div>
              <div class="order-detail-item-sub">Số lượng: x${item.quantity} | Đơn giá: ${formatVND(item.price)}</div>
            </div>
          </div>
          <div class="order-detail-item-total">
            ${formatVND(item.total || item.price * item.quantity)}
          </div>
        </div>
      `;
    }
  } else {
    itemsHtml = "<p class='order-detail-empty'>Không có mặt hàng chi tiết.</p>";
  }
  itemsContainer.innerHTML = itemsHtml;

  openModal("modal-order-detail");
}

/**
 * Lọc danh sách đơn hàng khi đổi khoảng ngày hoặc trạng thái
 */
function filterOrders() {
  renderOrderTable();
}
