/**
 * ==============================================================================
 * SPORTSTORE - TAB 2: QUẢN LÝ KHÁCH HÀNG (TAB-CUSTOMER.JS)
 * Chuẩn Bareme SGU (0.75 Điểm):
 *  - Hiển thị bảng khách hàng (Mã, Tên, Email, SĐT, Trạng thái)
 *  - Nút onclick="resetPassword(id)": Đặt mật khẩu về 123456, hiện alert thông báo
 *  - Nút onclick="toggleLockUser(id)": Đổi trạng thái "Đang hoạt động" <-> "Bị khóa"
 *  - Lưu và đọc trực tiếp từ LocalStorage
 * ==============================================================================
 */

/**
 * Vẽ bảng danh sách khách hàng từ LocalStorage
 */
function renderCustomerTable() {
  var customers = getStorage(STORAGE_KEYS.CUSTOMERS, []);
  var tbody = document.getElementById("customer-tbody");
  if (!tbody) return;

  var filterKeyword = "";
  var searchInput = document.getElementById("customer-search-input");
  if (searchInput) {
    filterKeyword = searchInput.value.trim().toLowerCase();
  }

  tbody.innerHTML = "";

  for (var i = 0; i < customers.length; i++) {
    var c = customers[i];

    // Trích xuất an toàn các trường thông tin (chuẩn hóa customerId)
    var custId = c.customerId || c.id || c.code || ("KH-" + (i + 1 < 10 ? "00" : "0") + (i + 1));
    var custName = c.name || "Khách Hàng " + custId;
    var custEmail = c.email || "chua_co_email@sportstore.vn";
    var custPhone = c.phone || "N/A";
    var custTier = c.tier || c.membershipTier || "Thành viên";
    var custJoinDate = c.joinDate || c.createdAt || "15/01/2026";

    // Lọc theo từ khóa tìm kiếm (tên, email hoặc số điện thoại)
    if (filterKeyword) {
      var matchName = custName.toLowerCase().indexOf(filterKeyword) !== -1;
      var matchEmail = custEmail.toLowerCase().indexOf(filterKeyword) !== -1;
      var matchPhone = custPhone.indexOf(filterKeyword) !== -1;
      var matchId = custId.toLowerCase().indexOf(filterKeyword) !== -1;
      if (!matchName && !matchEmail && !matchPhone && !matchId) {
        continue;
      }
    }

    var isLocked = (c.status === "locked" || c.status === "Bị khóa");
    var statusText = isLocked ? "Bị khóa" : "Đang hoạt động";
    var statusClass = isLocked ? "status-locked" : "status-active";
    var lockBtnText = isLocked ? "Mở khóa" : "Khóa tài khoản";
    var lockBtnClass = isLocked ? "btn-success" : "btn-lock";

    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${custId}</strong></td>
      <td>
        <div class="item-title">${custName}</div>
        <div class="item-code">Tham gia: ${custJoinDate}</div>
      </td>
      <td>${custEmail}</td>
      <td>${custPhone}</td>
      <td><span class="nav-badge badge-blue">${custTier}</span></td>
      <td><span class="status-pill ${statusClass}">${statusText}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-action btn-reset" onclick="resetPassword('${custId}')" title="Khôi phục mật khẩu về 123456">
            Đặt lại MK
          </button>
          <button type="button" class="btn-action ${lockBtnClass}" onclick="toggleLockUser('${custId}')" title="Chuyển trạng thái khóa / mở">
            ${lockBtnText}
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/**
 * Đặt lại mật khẩu khách hàng về '123456' theo Bareme SGU
 */
function resetPassword(customerId) {
  var customers = getStorage(STORAGE_KEYS.CUSTOMERS, []);
  var found = false;

  for (var i = 0; i < customers.length; i++) {
    var c = customers[i];
    var currentId = c.customerId || c.id || c.code;
    if (currentId === customerId || (!currentId && ("KH-" + (i + 1 < 10 ? "00" : "0") + (i + 1)) === customerId)) {
      customers[i].password = "123456";
      customers[i].customerId = customerId;
      customers[i].id = customerId;
      found = true;
      break;
    }
  }

  if (found) {
    setStorage(STORAGE_KEYS.CUSTOMERS, customers);
    alert(
      "Thành công: Đã đặt lại mật khẩu cho khách hàng [" +
        customerId +
        "] về mặc định: 123456",
    );
    renderCustomerTable();
  }
}

/**
 * Chuyển trạng thái tài khoản khách hàng giữa 'Đang hoạt động' và 'Bị khóa'
 */
function toggleLockUser(customerId) {
  var customers = getStorage(STORAGE_KEYS.CUSTOMERS, []);
  var newStatus = "";

  for (var i = 0; i < customers.length; i++) {
    var c = customers[i];
    var currentId = c.customerId || c.id || c.code;
    if (currentId === customerId || (!currentId && ("KH-" + (i + 1 < 10 ? "00" : "0") + (i + 1)) === customerId)) {
      if (customers[i].status === "locked" || customers[i].status === "Bị khóa") {
        customers[i].status = "active";
        newStatus = "Đang hoạt động";
      } else {
        customers[i].status = "locked";
        newStatus = "Bị khóa";
      }
      customers[i].customerId = customerId;
      customers[i].id = customerId; // Chuẩn hóa lại ID
      break;
    }
  }

  setStorage(STORAGE_KEYS.CUSTOMERS, customers);
  alert(
    "Đã cập nhật trạng thái khách hàng [" +
      customerId +
      "] thành: " +
      newStatus,
  );
  renderCustomerTable();
}

/**
 * Tìm kiếm khách hàng khi nhập ký tự vào ô search
 */
function filterCustomers() {
  renderCustomerTable();
}
