// 4. TAB 2: QUẢN LÝ ĐƠN HÀNG (ORDER) - DÙNG CHUNG HÀM xemChiTietDon
function hienThiBangDonHangAdmin() {
  var dsDon = layDuLieuAdmin("sport_orders");
  var tbody = document.getElementById("admin-orders-tbody");
  if (!tbody) return;

  var tuNgay = document.getElementById("order-filter-from-date") ? document.getElementById("order-filter-from-date").value : "";
  var denNgay = document.getElementById("order-filter-to-date") ? document.getElementById("order-filter-to-date").value : "";
  var locTrangThai = document.getElementById("order-filter-status") ? document.getElementById("order-filter-status").value : "ALL";

  var html = "";
  for (var i = dsDon.length - 1; i >= 0; i--) {
    var o = dsDon[i];
    var ngay = o.date || (o.createdAt ? o.createdAt.split("T")[0] : "");

    if (locTrangThai && locTrangThai !== "ALL" && o.status !== locTrangThai) continue;
    if (tuNgay && ngay && ngay < tuNgay) continue;
    if (denNgay && ngay && ngay > denNgay) continue;

    var tenKhach = (o.customer && o.customer.name) ? o.customer.name : (o.fullName || o.customer || "Khách hàng");
    var sdtKhach = o.phone || (o.customer && o.customer.phone) || "";

    var tomTatMon = "Trang bị thể thao";
    if (o.items && o.items.length > 0) {
      tomTatMon = o.items[0].name + " (x" + o.items[0].quantity + ")";
      if (o.items.length > 1) tomTatMon += " và +" + (o.items.length - 1) + " món khác";
    }

    var ma = o.orderId || o.id;

    html += `
      <tr>
        <td><strong class="cell-accent">#${ma}</strong></td>
        <td>
          <div class="order-cust-name">${tenKhach}</div>
          <div class="order-cust-phone">SĐT: ${sdtKhach}</div>
        </td>
        <td>${ngay || "Hôm nay"}</td>
        <td>${tomTatMon}</td>
        <td><strong class="cell-accent">${formatMoney(o.total)}</strong></td>
        <td><span class="nav-badge badge-gray">${o.paymentMethod || "Tiền mặt"}</span></td>
        <td>
          <select class="filter-select order-status-select" onchange="doiTrangThaiDonHang('${ma}', this.value)">
            <option value="Mới đặt" ${o.status === "Mới đặt" || o.status === "pending" ? "selected" : ""}>Mới đặt</option>
            <option value="Đã xử lý" ${o.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
            <option value="Đang giao" ${o.status === "Đang giao" ? "selected" : ""}>Đang giao</option>
            <option value="Đã giao" ${o.status === "Đã giao" ? "selected" : ""}>Đã giao</option>
            <option value="Đã hủy" ${o.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
          </select>
        </td>
        <td>
          <!-- GỌI TRỰC TIẾP HÀM xemChiTietDon CỦA DEV5_USER.JS -->
          <button type="button" class="btn-action btn-edit btn-order-detail" onclick="xemChiTietDon('${ma}')">
            🔍 Chi Tiết
          </button>
        </td>
      </tr>
    `;
  }

  if (html === "") {
    html = `<tr><td colspan="8" class="table-empty-row">Không có đơn hàng nào phù hợp với bộ lọc.</td></tr>`;
  }
  tbody.innerHTML = html;
}

// CODE MỚI: TỰ ĐỘNG HOÀN TRẢ SỐ LƯỢNG VÀO KHO KHI HỦY ĐƠN
function doiTrangThaiDonHang(maDon, trangThaiMoi) {
  var dsDon = layDuLieuAdmin("sport_orders");
  var don = null;

  for (var i = 0; i < dsDon.length; i++) {
    if (dsDon[i].orderId === maDon || dsDon[i].id === maDon) {
      don = dsDon[i];
      break;
    }
  }

  if (!don) {
    alert("Không tìm thấy đơn hàng #" + maDon);
    return;
  }

  var trangThaiCu = don.status;
  if (trangThaiCu === trangThaiMoi) return;

  // 1. Khi chọn "Đã hủy" -> Hỏi xác nhận trước để tránh bấm nhầm
  if (trangThaiMoi === "Đã hủy") {
    var xacNhan = confirm("Bạn có chắc chắn muốn HỦY đơn hàng #" + maDon + " và HOÀN TRẢ lại toàn bộ sản phẩm vào kho không?");
    if (!xacNhan) {
      hienThiBangDonHangAdmin(); // Đặt lại dropdown về giá trị cũ
      return;
    }
  }

  var dsSp = layDuLieuAdmin("sport_products");
  var danhSachMon = don.items || don.orderItems || [];
  var tongMonHoanTra = 0;

  // 2. TRƯỜNG HỢP Chuyển sang "Đã hủy" -> CỘNG LẠI TỒN KHO
  if (trangThaiCu !== "Đã hủy" && trangThaiMoi === "Đã hủy") {
    for (var j = 0; j < danhSachMon.length; j++) {
      var item = danhSachMon[j];
      var maSanPham = item.productId || item.id;
      var soLuong = Number(item.quantity || 1);

      for (var k = 0; k < dsSp.length; k++) {
        if (String(dsSp[k].id) === String(maSanPham) || dsSp[k].name === item.name) {
          var tonCu = Number(dsSp[k].stock !== undefined ? dsSp[k].stock : (dsSp[k].quantity || 0));
          dsSp[k].stock = tonCu + soLuong;
          tongMonHoanTra += soLuong;

          // Nếu trước đó sản phẩm từng bị ẩn do hết hàng thì mở bán lại
          if (dsSp[k].status === "hidden" && dsSp[k].stock > 0) {
            dsSp[k].status = "active";
          }
          break;
        }
      }
    }
    luuDuLieuAdmin("sport_products", dsSp);
  }

  // 3. TRƯỜNG HỢP Nếu đổi ngược từ "Đã hủy" về trạng thái bình thường -> TRỪ LẠI KHO
  if (trangThaiCu === "Đã hủy" && trangThaiMoi !== "Đã hủy") {
    for (var j2 = 0; j2 < danhSachMon.length; j2++) {
      var item2 = danhSachMon[j2];
      var maSanPham2 = item2.productId || item2.id;
      var soLuong2 = Number(item2.quantity || 1);

      for (var k2 = 0; k2 < dsSp.length; k2++) {
        if (String(dsSp[k2].id) === String(maSanPham2) || dsSp[k2].name === item2.name) {
          var tonHienTai = Number(dsSp[k2].stock !== undefined ? dsSp[k2].stock : (dsSp[k2].quantity || 0));
          dsSp[k2].stock = Math.max(0, tonHienTai - soLuong2);
          if (dsSp[k2].stock === 0) {
            dsSp[k2].status = "hidden";
          }
          break;
        }
      }
    }
    luuDuLieuAdmin("sport_products", dsSp);
  }

  // 4. Lưu trạng thái mới cho đơn hàng
  don.status = trangThaiMoi;
  luuDuLieuAdmin("sport_orders", dsDon);

  // 5. Thông báo Toast chuyên nghiệp
  if (trangThaiMoi === "Đã hủy") {
    if (typeof showToast === "function") {
      showToast("Đã hủy đơn [#" + maDon + "] và hoàn trả " + tongMonHoanTra + " món vào kho thành công!", "warning");
    }
  } else {
    if (typeof showToast === "function") {
      showToast("Đã cập nhật trạng thái đơn [#" + maDon + "] thành: " + trangThaiMoi, "success");
    }
  }

  // 6. Cập nhật lại ngay lập tức các bảng giao diện Admin liên quan
  hienThiBangDonHangAdmin();
  capNhatSoDemMenuAdmin();
  if (typeof hienThiBangTonKhoAdmin === "function") hienThiBangTonKhoAdmin();
  if (typeof hienThiBangSanPhamAdmin === "function") hienThiBangSanPhamAdmin();
}

function locDonHangAdmin() {
  hienThiBangDonHangAdmin();
}



// 8. TAB 6: QUẢN LÝ NHẬP HÀNG (IMPORT)
function hienThiBangNhapHang() {
  var dsNhap = layDuLieuAdmin("sport_imports");
  var tbody = document.getElementById("admin-imports-tbody");
  if (!tbody) return;

  // Lấy các giá trị bộ lọc tìm kiếm
  var tuKhoa = document.getElementById("import-search-input") ? document.getElementById("import-search-input").value.trim().toLowerCase() : "";
  var tuNgay = document.getElementById("import-filter-from-date") ? document.getElementById("import-filter-from-date").value : "";
  var denNgay = document.getElementById("import-filter-to-date") ? document.getElementById("import-filter-to-date").value : "";
  var locTrangThai = document.getElementById("import-filter-status") ? document.getElementById("import-filter-status").value : "ALL";

  var html = "";
  for (var i = dsNhap.length - 1; i >= 0; i--) {
    var p = dsNhap[i];
    var maPhieu = p.importId || p.id || p.slipId || ("PN-" + (i + 1));
    var nhaCc = p.supplier || "Nhà Phân Phối Thể Thao";
    var ngayNhap = p.date || "Hôm nay";
    var trangThai = p.status || "Hoàn thành";
    var soLuongHienThi = p.totalQuantity ? p.totalQuantity : (p.items ? p.items.length : 1);
    var tongTien = p.totalCost || 0;

    // Bộ lọc theo từ khóa, ngày và trạng thái
    if (tuKhoa && !maPhieu.toLowerCase().includes(tuKhoa) && !nhaCc.toLowerCase().includes(tuKhoa)) continue;
    if (tuNgay && ngayNhap < tuNgay) continue;
    if (denNgay && ngayNhap > denNgay) continue;
    if (locTrangThai !== "ALL" && trangThai !== locTrangThai) continue;

    // 1. Phân biệt cột CHI TIẾT / SỬA:
    // - Chưa hoàn thành -> Nút "Sửa"
    // - Đã hoàn thành -> Nút "Chi tiết"
    var nutChiTietHoacSua = "";
    if (trangThai === "Hoàn thành") {
      nutChiTietHoacSua = '<button type="button" class="btn-action btn-action-view" onclick="xemChiTietPhieuNhap(\'' + maPhieu + '\')">Chi tiết</button>';
    } else {
      nutChiTietHoacSua = '<button type="button" class="btn-action btn-action-edit" onclick="moModalSuaPhieuNhap(\'' + maPhieu + '\')">Sửa</button>';
    }

    // 2. Phân biệt cột THAO TÁC:
    // - Chưa hoàn thành -> Nút "Hoàn thành" (bấm được)
    // - Đã hoàn thành -> Nút "Đã hoàn thành" (bị khóa, không bấm được)
    var nutThaoTac = "";
    if (trangThai === "Hoàn thành") {
      nutThaoTac = '<button type="button" class="btn-action btn-action-disabled" disabled>Đã hoàn thành</button>';
    } else {
      nutThaoTac = '<button type="button" class="btn-action btn-action-success-lg" onclick="xacNhanPhieuNhap(\'' + maPhieu + '\')">Hoàn thành</button>';
    }

    html += `
      <tr>
        <td><strong>#${maPhieu}</strong></td>
        <td>${nhaCc}</td>
        <td>${ngayNhap}</td>
        <td><strong>${soLuongHienThi} món</strong></td>
        <td><strong class="cell-accent">${formatMoney(tongTien)}</strong></td>
        <td>${p.creator || "Admin"}</td>
        <td>${nutChiTietHoacSua}</td>
        <td>${nutThaoTac}</td>
      </tr>
    `;
  }

  if (html === "") {
    html = `<tr><td colspan="8" class="table-empty-row">Chưa có phiếu nhập hàng nào.</td></tr>`;
  }
  tbody.innerHTML = html;
}



function xemChiTietPhieuNhap(maPhieu) {
  // 1. Tìm phiếu nhập theo mã phiếu
  var dsNhap = layDuLieuAdmin("sport_imports");
  var phieu = null;
  for (var i = 0; i < dsNhap.length; i++) {
    if (String(dsNhap[i].importId || dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
      phieu = dsNhap[i];
      break;
    }
  }

  if (!phieu) {
    alert("Không tìm thấy thông tin phiếu nhập này!");
    return;
  }

  // 2. Tìm thông tin chi tiết của sản phẩm đó trong sport_products
  var dsSp = layDuLieuAdmin("sport_products");
  var sp = null;
  var firstItem = (phieu.items && phieu.items.length > 0) ? phieu.items[0] : null;
  var pId = phieu.productId || (firstItem ? (firstItem.productId || firstItem.id) : null);

  if (pId) {
    for (var j = 0; j < dsSp.length; j++) {
      if (String(dsSp[j].id) === String(pId)) {
        sp = dsSp[j];
        break;
      }
    }
  }

  // Lấy các dữ liệu chi tiết
  var tenSp = sp ? sp.name : (firstItem ? firstItem.name : (phieu.productName || "Lô dụng cụ thể thao"));
  var maSp = sp ? (sp.code || ("SP-" + sp.id)) : (firstItem ? (firstItem.code || "SP-" + (firstItem.productId || firstItem.id)) : (pId ? ("SP-" + pId) : "SP-CHUNG"));
  var anhSp = sp ? (sp.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200") : (firstItem && firstItem.image ? firstItem.image : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200");
  var hangSp = sp ? (sp.brand || "Chính hãng") : "Chính hãng";
  var tonKho = sp ? Number(sp.stock !== undefined ? sp.stock : (sp.quantity || 0)) : "—";
  var soLuongNhap = Number(phieu.totalQuantity || (firstItem ? firstItem.quantity : 1));
  var donGiaNhap = Number(phieu.unitPrice || (firstItem ? (firstItem.importPrice || firstItem.unitPrice || firstItem.price) : (phieu.totalCost ? phieu.totalCost / soLuongNhap : 0)));
  var tongTien = Number(phieu.totalCost || (soLuongNhap * donGiaNhap));
  var trangThai = phieu.status || "Hoàn thành";

  var nhanTrangThai = trangThai === "Tạm lưu"
      ? '<span class="badge-status badge-status-pending">Chờ duyệt</span>'
      : '<span class="badge-status badge-status-completed">Đã hoàn thành</span>';

  // 3. Đổ dữ liệu vào Modal chi tiết
  var modalTitle = document.getElementById("import-detail-title");
  if (modalTitle) {
    modalTitle.textContent = "Chi Tiết Phiếu Nhập #" + (phieu.importId || phieu.id || phieu.slipId);
  }

  var modalBody = document.getElementById("import-detail-body");
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="import-modal-header">
        <img src="${anhSp}" class="import-modal-img">
        <div>
          <h4 class="import-modal-title">${tenSp}</h4>
          <span class="badge-code-pill import-modal-badge">${maSp}</span>
          <span class="import-modal-brand">Hãng: <strong>${hangSp}</strong></span>
        </div>
      </div>
      <table class="import-modal-table">
        <tr class="import-table-row"><td class="import-col-label">Mã phiếu:</td><td class="import-val-bold">#${phieu.importId || phieu.id || phieu.slipId}</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Nhà cung cấp:</td><td class="import-val-semi">${phieu.supplier || "Tổng Kho Thể Thao"}</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Ngày nhập:</td><td class="import-val-right">${phieu.date || "Hôm nay"}</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Số lượng nhập:</td><td class="import-val-accent">+${soLuongNhap} món</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Đơn giá vốn:</td><td class="import-val-semi">${donGiaNhap.toLocaleString("vi-VN")} đ</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Tổng tiền vốn:</td><td class="import-val-danger">${tongTien.toLocaleString("vi-VN")} đ</td></tr>
        <tr class="import-table-row"><td class="import-col-label">Tồn kho hiện tại:</td><td class="import-val-success">${tonKho} cái</td></tr>
        <tr><td class="import-col-label">Trạng thái phiếu:</td><td class="import-val-right">${nhanTrangThai}</td></tr>
      </table>
    `;
  }

  // 4. Mở popup
  moModalAdmin("modal-import-detail");
}


// Biến lưu mã phiếu đang sửa (nếu là null nghĩa là đang tạo phiếu mới)
var maPhieuDangSua = null;

// Hàm mở popup sửa phiếu nhập
function moModalSuaPhieuNhap(maPhieu) {
  var dsNhap = layDuLieuAdmin("sport_imports");
  var phieu = null;
  for (var i = 0; i < dsNhap.length; i++) {
    if (String(dsNhap[i].importId || dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
      phieu = dsNhap[i];
      break;
    }
  }

  if (!phieu) {
    alert("Không tìm thấy thông tin phiếu nhập!");
    return;
  }

  // Đề bài: Chỉ được sửa trước khi hoàn thành
  if (phieu.status === "Hoàn thành") {
    alert("Phiếu này đã hoàn thành, không thể sửa!");
    return;
  }

  maPhieuDangSua = maPhieu;

  // Đổi tiêu đề popup
  if (document.getElementById("modal-import-title")) {
    document.getElementById("modal-import-title").textContent = "Chỉnh Sửa Phiếu Nhập #" + maPhieu;
  }

  // Nạp danh sách sản phẩm và chọn đúng sản phẩm của phiếu
  var dsSp = layDuLieuAdmin("sport_products");
  var selectEl = document.getElementById("import-product-select");
  if (selectEl) {
    var html = '<option value="">-- Chọn sản phẩm cần nhập --</option>';
    for (var j = 0; j < dsSp.length; j++) {
      var sp = dsSp[j];
      var ma = sp.code || ("SP-" + sp.id);
      var giaGoc = sp.costPrice || sp.cost || Math.round(sp.price * 0.7);
      html += '<option value="' + sp.id + '" data-cost="' + giaGoc + '">' + ma + ' - ' + sp.name + '</option>';
    }
    selectEl.innerHTML = html;
    selectEl.value = phieu.productId || "";
  }

  // Điền dữ liệu cũ vào các ô input
  if (document.getElementById("import-id")) {
    document.getElementById("import-id").value = phieu.importId || phieu.id || phieu.slipId || maPhieu;
    document.getElementById("import-id").disabled = true;
  }
  if (document.getElementById("import-date")) {
    document.getElementById("import-date").value = phieu.date || "";
  }
  if (document.getElementById("import-supplier")) {
    document.getElementById("import-supplier").value = phieu.supplier || "Tổng Kho Thể Thao";
  }
  if (document.getElementById("import-qty")) {
    document.getElementById("import-qty").value = phieu.totalQuantity || 1;
  }
  if (document.getElementById("import-unit-price")) {
    document.getElementById("import-unit-price").value = phieu.unitPrice || (phieu.totalCost ? Math.round(phieu.totalCost / (phieu.totalQuantity || 1)) : 0);
  }
  if (document.getElementById("import-status")) {
    document.getElementById("import-status").value = phieu.status || "Tạm lưu";
  }
  if (document.getElementById("import-note")) {
    document.getElementById("import-note").value = phieu.note || "";
  }

  moModalAdmin("modal-import");
}

function luuPhieuNhapHang() {
  // 1. Lấy dữ liệu từ form
  var maSpChon = document.getElementById("import-product-select") ? document.getElementById("import-product-select").value : "";
  var soLuongNhap = Number(document.getElementById("import-qty") ? document.getElementById("import-qty").value : 0);
  var donGiaNhap = Number(document.getElementById("import-unit-price") ? document.getElementById("import-unit-price").value : 0);
  var nhaCungCap = document.getElementById("import-supplier") ? document.getElementById("import-supplier").value.trim() : "Tổng Kho Thể Thao";
  var ngayNhap = document.getElementById("import-date") ? document.getElementById("import-date").value : "";
  var ghiChu = document.getElementById("import-note") ? document.getElementById("import-note").value.trim() : "";

  if (!maSpChon) {
    alert("Vui lòng chọn sản phẩm cần nhập kho!");
    return;
  }
  if (soLuongNhap <= 0) {
    alert("Số lượng nhập phải lớn hơn 0!");
    return;
  }

  var dsSp = layDuLieuAdmin("sport_products");
  var tenSanPham = "";
  for (var i = 0; i < dsSp.length; i++) {
    if (String(dsSp[i].id) === String(maSpChon)) {
      tenSanPham = dsSp[i].name;
      break;
    }
  }

  // 3. Lưu vào danh sách phiếu nhập sport_imports
  var dsNhap = layDuLieuAdmin("sport_imports");
  var tongTien = soLuongNhap * donGiaNhap;

  if (maPhieuDangSua) {
    // ĐANG SỬA PHIẾU CŨ: Cập nhật lại các thông tin của phiếu đó
    for (var k = 0; k < dsNhap.length; k++) {
      if (String(dsNhap[k].importId || dsNhap[k].id || dsNhap[k].slipId) === String(maPhieuDangSua)) {
        dsNhap[k].productId = maSpChon;
        dsNhap[k].productName = tenSanPham;
        dsNhap[k].supplier = nhaCungCap;
        dsNhap[k].date = ngayNhap;
        dsNhap[k].totalQuantity = soLuongNhap;
        dsNhap[k].unitPrice = donGiaNhap;
        dsNhap[k].totalCost = tongTien;
        dsNhap[k].note = ghiChu;
        dsNhap[k].status = "Tạm lưu";
        break;
      }
    }
    if (typeof showToast === "function") {
      showToast("Đã cập nhật phiếu nhập #" + maPhieuDangSua, "success");
    } else {
      alert("Đã cập nhật phiếu nhập #" + maPhieuDangSua);
    }
  } else {
    var maMoi = "PN-00" + (dsNhap.length + 1);
    dsNhap.push({
      id: maMoi,
      slipId: maMoi,
      importId: maMoi,
      productId: maSpChon,
      productName: tenSanPham,
      supplier: nhaCungCap || "Tổng Kho Thể Thao",
      date: ngayNhap || new Date().toISOString().split("T")[0],
      totalQuantity: soLuongNhap,
      unitPrice: donGiaNhap,
      totalCost: tongTien,
      note: ghiChu,
      creator: "Admin",
      status: "Tạm lưu"
    });
    if (typeof showToast === "function") {
      showToast("Đã tạo phiếu nhập kho: " + maMoi, "success");
    } else {
      alert("Đã tạo phiếu nhập kho: " + maMoi);
    }
  }

  luuDuLieuAdmin("sport_imports", dsNhap);
  dongModalAdmin("modal-import");
  hienThiBangNhapHang();
  hienThiBangSanPhamAdmin();
  if (typeof hienThiBangTonKhoAdmin === "function") {
    hienThiBangTonKhoAdmin();
  }
  capNhatSoDemMenuAdmin();
}


function xacNhanPhieuNhap(maPhieu) {
  // 1. Hỏi người dùng xác nhận
  var dongY = confirm("Bạn có chắc chắn muốn duyệt phiếu nhập #" + maPhieu + " và cộng số lượng vào kho ngay không?");
  if (!dongY) {
    return;
  }

  // 2. Tìm phiếu nhập trong danh sách sport_imports
  var dsNhap = layDuLieuAdmin("sport_imports");
  var phieu = null;

  for (var i = 0; i < dsNhap.length; i++) {
    if (String(dsNhap[i].importId || dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
      phieu = dsNhap[i];
      break;
    }
  }

  if (!phieu) {
    alert("Không tìm thấy thông tin phiếu nhập!");
    return;
  }

  if (phieu.status === "Hoàn thành") {
    alert("Phiếu nhập này đã được hoàn thành trước đó rồi!");
    return;
  }

  // 3. Tiến hành CỘNG DỒN SỐ LƯỢNG VÀO KHO trong sport_products
  var dsSp = layDuLieuAdmin("sport_products");
  var maSp = phieu.productId;
  var soLuong = Number(phieu.totalQuantity || 1);
  var donGia = Number(phieu.unitPrice || 0);
  var tenSp = phieu.productName || "";

  for (var j = 0; j < dsSp.length; j++) {
    if (String(dsSp[j].id) === String(maSp)) {
      var tonCu = Number(dsSp[j].stock !== undefined ? dsSp[j].stock : (dsSp[j].quantity || 0));
      dsSp[j].stock = tonCu + soLuong;

      if (donGia > 0) {
        dsSp[j].costPrice = donGia;
        dsSp[j].cost = donGia;
        var giaBanHienTai = Number(dsSp[j].price || 0);
        if (giaBanHienTai > 0) {
          dsSp[j].profitPercent = Math.round(((giaBanHienTai - donGia) / donGia) * 100);
        }
      }

      // Mở bán lại nếu sản phẩm từng bị ẩn vì hết hàng
      if (dsSp[j].status === "hidden" && dsSp[j].stock > 0) {
        dsSp[j].status = "active";
      }

      tenSp = dsSp[j].name;
      break;
    }
  }
  luuDuLieuAdmin("sport_products", dsSp);

  // 4. Chuyển trạng thái phiếu nhập sang "Hoàn thành"
  phieu.status = "Hoàn thành";
  luuDuLieuAdmin("sport_imports", dsNhap);

  // 5. Cập nhật lại giao diện các trang
  hienThiBangNhapHang();
  hienThiBangSanPhamAdmin();
  if (typeof hienThiBangTonKhoAdmin === "function") {
    hienThiBangTonKhoAdmin();
  }
  capNhatSoDemMenuAdmin();

  if (typeof showToast === "function") {
    showToast("Đã duyệt phiếu #" + maPhieu + "! Đã cộng thêm " + soLuong + " cái vào kho.", "success");
  } else {
    alert("Đã duyệt phiếu #" + maPhieu + "! Đã cộng thêm " + soLuong + " cái vào kho.");
  }
}

function locPhieuNhapHang() {
  hienThiBangNhapHang();
}

function hienThiBangGiaBanAdmin() {
  var dsSp = layDuLieuAdmin("sport_products");
  var tbody = document.getElementById("admin-pricing-tbody");
  if (!tbody) return;

  var html = "";
  for (var i = 0; i < dsSp.length; i++) {
    var p = dsSp[i];
    // Lấy đúng giá vốn gốc từ costPrice (không bị phụ thuộc vào price)
    var giaVon = Number(p.costPrice || p.cost || (p.price ? Math.round(p.price * 0.7) : 0));
    var giaBan = Number(p.price || 0);
    var phanTram = (giaVon > 0 && giaBan > 0) ? Math.round(((giaBan - giaVon) / giaVon) * 100) : Number(p.profitPercent || 0);
    html += `
      <tr>
        <td><img src="${p.image || ''}" class="table-thumb-sm"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category || p.categoryId || "Khác"}</td>
        <td>${formatMoney(giaVon)}</td>
        <td><strong>${phanTram}%</strong></td>
        <td><strong class="cell-accent">${formatMoney(p.price)}</strong></td>
        <td>
          <button type="button" class="btn-action btn-edit" onclick="moModalSuaGiaBan(${p.id})">Sửa Giá</button>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}
