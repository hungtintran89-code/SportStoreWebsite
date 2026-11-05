// 5. TAB 3: QUẢN LÝ KHÁCH HÀNG (CUSTOMER)
function hienThiBangKhachHangAdmin() {
  var dsKhach = layDuLieuAdmin("sport_customers");
  var tbody = document.getElementById("customer-tbody");
  if (!tbody) return;

  var tuKhoa = document.getElementById("customer-search-input") ? document.getElementById("customer-search-input").value.trim().toLowerCase() : "";

  var html = "";
  for (var i = 0; i < dsKhach.length; i++) {
    var k = dsKhach[i];
    var maKhach = k.customerId || k.id || ("KH-" + (i + 1));
    var ten = k.name || "Khách hàng";
    var email = k.email || "";
    var sdt = k.phone || "";
    var hang = k.tier || "Standard";
    var trangThai = k.status || "active";

    if (tuKhoa !== "") {
      var chuoiTim = (maKhach + " " + ten + " " + email + " " + sdt).toLowerCase();
      if (chuoiTim.indexOf(tuKhoa) === -1) continue;
    }

    var daKhoa = (trangThai === "locked" || trangThai === "inactive");

    html += `
      <tr>
        <td><strong>#${maKhach}</strong></td>
        <td>${ten}</td>
        <td>${email}</td>
        <td><span class="sport-badge badge-blue">${hang}</span></td>
        <td><span class="${daKhoa ? 'cust-status-locked' : 'cust-status-active'}">${daKhoa ? "Bị khóa" : "Hoạt động"}</span></td>
        <td class="cust-detail-cell">
          <button type="button" class="btn-cust-detail" onclick="xemChiTietKhachHang('${maKhach}')" title="Xem chi tiết khách hàng">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Chi tiết</span>
          </button>
        </td>
        <td class="cust-actions-cell">
          <div class="cust-actions-wrap">
            <button type="button" class="cust-btn-reset" onclick="resetMatKhauKhach('${maKhach}')" title="Đặt lại mật khẩu (123456)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
              <span>Reset MK</span>
            </button>
            <button type="button" onclick="khoaMoTaiKhoanKhach('${maKhach}')" class="${daKhoa ? 'cust-btn-unlock' : 'cust-btn-lock'}" title="${daKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                ${daKhoa 
                  ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>'
                  : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'
                }
              </svg>
              <span>${daKhoa ? "Mở Khóa" : "Khóa TK"}</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }
  if (html === "") html = `<tr><td colspan="7" class="table-empty-row">Không tìm thấy khách hàng nào.</td></tr>`;
  tbody.innerHTML = html;
}

function khoaMoTaiKhoanKhach(maKhach) {
  var dsKhach = layDuLieuAdmin("sport_customers");
  for (var i = 0; i < dsKhach.length; i++) {
    if (dsKhach[i].customerId === maKhach || dsKhach[i].id === maKhach) {
      if (dsKhach[i].status === "locked") {
        dsKhach[i].status = "active";
        if (typeof showToast === "function") showToast("Đã mở khóa tài khoản: " + dsKhach[i].name, "success");
      } else {
        dsKhach[i].status = "locked";
        if (typeof showToast === "function") showToast("Đã khóa tài khoản: " + dsKhach[i].name, "warning");
      }
      break;
    }
  }
  luuDuLieuAdmin("sport_customers", dsKhach);
  hienThiBangKhachHangAdmin();
}

function xemChiTietKhachHang(maKhach) {
  var dsKhach = layDuLieuAdmin("sport_customers");
  var khach = null;
  for (var i = 0; i < dsKhach.length; i++) {
    var idHienTai = dsKhach[i].customerId || dsKhach[i].id;
    if (String(idHienTai) === String(maKhach)) {
      khach = dsKhach[i];
      break;
    }
  }
  if (!khach) return;

  var modalBody = document.getElementById("customer-detail-body");
  if (modalBody) {
    var avatar = khach.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60";
    var daKhoa = (khach.status === "locked" || khach.status === "inactive");
    var tongTien = (Number(khach.spent) || 0).toLocaleString("vi-VN") + " đ";
    var diem = Number(khach.points) || 0;

    modalBody.innerHTML = `
      <div class="cust-modal-header">
        <img src="${avatar}" class="cust-modal-avatar">
        <div>
          <h4 class="cust-modal-name">${khach.name || "Khách hàng"}</h4>
          <span class="cust-modal-id">#${maKhach}</span>
          <span class="sport-badge badge-blue cust-modal-badge">${khach.tier || "Standard"}</span>
        </div>
      </div>
      <table class="cust-modal-table">
        <tr class="cust-table-row"><td class="cust-col-label cust-col-label-w">Email:</td><td class="cust-col-val">${khach.email || "Chưa có"}</td></tr>
        <tr class="cust-table-row"><td class="cust-col-label">Số điện thoại:</td><td class="cust-col-val cust-col-accent">${khach.phone || "Chưa có"}</td></tr>
        <tr class="cust-table-row"><td class="cust-col-label">Địa chỉ:</td><td class="cust-col-val">${khach.address || "Chưa cập nhật"}</td></tr>
        <tr class="cust-table-row"><td class="cust-col-label">Điểm tích lũy:</td><td class="cust-col-val cust-col-accent cust-val-bold">${diem} điểm</td></tr>
        <tr class="cust-table-row"><td class="cust-col-label">Tổng chi tiêu:</td><td class="cust-col-val cust-col-success cust-val-bold">${tongTien}</td></tr>
        <tr><td class="cust-col-label">Trạng thái:</td><td class="cust-col-val cust-val-bold ${daKhoa ? 'cust-status-locked' : 'cust-status-active'}">${daKhoa ? "Bị khóa" : "Đang hoạt động"}</td></tr>
      </table>
    `;
  }

  moModalAdmin("modal-customer-detail");
}

function resetMatKhauKhach(maKhach) {
  if (!confirm("Bạn có chắc chắn muốn đặt lại mật khẩu về mặc định (123456) cho tài khoản #" + maKhach + " không?")) return;
  var dsKhach = layDuLieuAdmin("sport_customers");
  for (var i = 0; i < dsKhach.length; i++) {
    if (dsKhach[i].customerId === maKhach || dsKhach[i].id === maKhach) {
      dsKhach[i].password = "123456";
      showToast("Đã reset mật khẩu của " + dsKhach[i].name + " về mặc định: 123456", "success");
      break;
    }
  }
  luuDuLieuAdmin("sport_customers", dsKhach);
}

function locKhachHangAdmin() {
  hienThiBangKhachHangAdmin();
}

