function dangXuat() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất hoặc đổi tài khoản?')) {
    localStorage.removeItem('sport_user');
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  }
}

function layUserHienTai() {
  var chuoiUser = localStorage.getItem("sport_user");
  if (!chuoiUser) {
    return null;
  }
  return JSON.parse(chuoiUser);
}

function chuyenTab(tenTab) {

  var cacNutTab = document.querySelectorAll(".dev5-tab");
  for (var i = 0; i < cacNutTab.length; i++) {
    cacNutTab[i].classList.remove("is-active");
  }

  var cacKhungNoiDung = document.querySelectorAll(".dev5-content .dev5-panel");
  for (var j = 0; j < cacKhungNoiDung.length; j++) {
    cacKhungNoiDung[j].classList.remove("is-active");
  }

  // 3. Đánh dấu nút vừa bấm là active
  var nutDuocChon = document.querySelector('.dev5-tab[data-tab="' + tenTab + '"]');
  if (nutDuocChon) {
    nutDuocChon.classList.add("is-active");
  }

  // 4. Hiển thị khung nội dung của tab vừa bấm
  var khungDuocChon = document.querySelector('.dev5-panel[data-panel="' + tenTab + '"]');
  if (khungDuocChon) {
    khungDuocChon.classList.add("is-active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hienThiThongTinUser() {
  var user = layUserHienTai();
  if (!user) return;

  // Điền tên vào tất cả các thẻ có thuộc tính data-user-name
  var cacTheTen = document.querySelectorAll("[data-user-name]");
  for (var i = 0; i < cacTheTen.length; i++) {
    cacTheTen[i].textContent = user.name || "Hội viên";
  }

  // Điền Email
  var theEmail = document.querySelector("[data-user-email]");
  if (theEmail) {
    theEmail.textContent = "Email: " + (user.email || "Chưa cập nhật");
  }

  // Điền Số điện thoại
  var thePhone = document.querySelector("[data-user-phone]");
  if (thePhone) {
    thePhone.textContent = "SĐT: " + (user.phone || "Chưa cập nhật");
  }

  // Điền Hạng thành viên (Standard / VIP / Gold...)
  var theTier = document.querySelector("[data-user-tier]");
  if (theTier) {
    theTier.textContent = user.tier || "Standard";
  }

  var theBadge = document.querySelector("[data-user-role]");
  if (theBadge) {
    theBadge.textContent = "Thành viên " + (user.tier || "Standard");
  }

  // Cho phép hiện nút Chỉnh sửa hồ sơ
  var nutSua = document.querySelector("[data-edit-profile-btn]");
  if (nutSua) {
    nutSua.classList.remove("dev5-hidden");
  }
}

function moFormSuaHoSo() {
  var form = document.querySelector("[data-profile-form]");
  if (!form) return;

  var user = layUserHienTai();
  if (user) {
    if (form.querySelector('[name="profileName"]')) {
      form.querySelector('[name="profileName"]').value = user.name || "";
    }
    if (form.querySelector('[name="profilePhone"]')) {
      form.querySelector('[name="profilePhone"]').value = user.phone || "";
    }
    if (form.querySelector('[name="profileEmail"]')) {
      form.querySelector('[name="profileEmail"]').value = user.email || "";
    }
  }

  // Bỏ class ẩn để form hiện lên
  form.classList.remove("dev5-hidden");
}

function dongFormSuaHoSo() {
  var form = document.querySelector("[data-profile-form]");
  if (form) {
    form.classList.add("dev5-hidden");
  }
}

function luuHoSo(event) {
  event.preventDefault();

  var form = document.querySelector("[data-profile-form]");
  if (!form) return;

  var user = layUserHienTai();
  if (!user) return;

  // Lấy dữ liệu mới từ các ô input
  user.name = form.querySelector('[name="profileName"]').value;
  user.phone = form.querySelector('[name="profilePhone"]').value;
  user.email = form.querySelector('[name="profileEmail"]').value;

  var matKhauMoi = form.querySelector('[name="profilePassword"]').value;
  if (matKhauMoi && matKhauMoi.trim() !== "") {
    user.password = matKhauMoi;
  }

  // Lưu đè lại vào LocalStorage
  localStorage.setItem("sport_user", JSON.stringify(user));

  showToast("Đã cập nhật thông tin cá nhân thành công!" , "success");
  dongFormSuaHoSo();
  hienThiThongTinUser();
}

function hienThiDonHang() {

  var user = layUserHienTai();
  var khungDonHang = document.querySelector("[data-orders]");

  if (!khungDonHang) return;
  if (!user) {
    khungDonHang.innerHTML = '<p class="dev5-muted">Vui lòng đăng nhập để xem đơn hàng.</p>';
    return;
  }

  // 1. Đọc danh sách tất cả đơn hàng từ LocalStorage
  var tatCaDon = [];
  var chuoiDon = localStorage.getItem("sport_orders");
  if (chuoiDon) {
    tatCaDon = JSON.parse(chuoiDon);
  } else if (typeof orders !== "undefined") {
    tatCaDon = orders;
  }

  // 2.lọc đơn hàng của đúng user đang đăng nhập
  var donCuaToi = [];
  for (var i = 0; i < tatCaDon.length; i++) {
    var d = tatCaDon[i];
    var sId = user.id || user.customerId;
    var trungId = (d.customerId && d.customerId === sId) || (d.userId && d.userId === sId);
    var trungEmail = (d.email && d.email.toLowerCase() === (user.email || "").toLowerCase());
    var trungSdt = (d.phone && d.phone === user.phone);
    if (trungId || trungEmail || trungSdt) {
      donCuaToi.push(d);
    }
  }

  // 3. Cập nhật số lượng đơn hàng lên ô thống kê ở Tab 1
  var theDemDon = document.querySelector("[data-order-count]");
  if (theDemDon) {
    theDemDon.textContent = donCuaToi.length;
  }

  // 4. Nếu chưa có đơn nào
  if (donCuaToi.length === 0) {
    khungDonHang.innerHTML = '<p class="dev5-muted">Bạn chưa có đơn hàng nào.</p>';
    return;
  }

  var cacBuoc = ["Đặt hàng", "Xác nhận", "Đang giao", "Đã giao"];
  var html = "";

  for (var j = donCuaToi.length - 1; j >= 0 ; j-- ) {
    var don = donCuaToi[j];
    var maDon = don.orderId || don.id || ("DH-" + (j + 1));
    var ngayDat = don.date || "Hôm nay";
    var trangThai = don.status || "Mới đặt";
    var tongTien = don.total || 0;

    // Tên các món trong đơn
    var tenMon = "Trang bị thể thao";
    if (don.items && don.items.length > 0) {
      var monDau = don.items[0];
      var tenSanPham = monDau.name || monDau.productName || "Sản phẩm";
      if (don.items.length > 1) {
        tenMon = tenSanPham + " (+" + (don.items.length - 1) + " món khác)";
      } else {
        tenMon = tenSanPham;
      }
    }

    // Tính số bước đã hoàn thành
    var soBuocXong = 1;
    if (trangThai === "Đã giao") {
      soBuocXong = 4;
    } else if (trangThai === "Đang giao") {
      soBuocXong = 3;
    } else if (trangThai === "Đã xử lý" || trangThai === "Xác nhận") {
      soBuocXong = 2;
    }

    // Vẽ 4 ô tiến trình
    var mauVienVaNen = "";
    var mauHuyHieu = "";
    var mauGiaTien = "#059669";
    var chuoiTienTrinh = "";

    // 1. NẾU LÀ ĐƠN BỊ HỦY -> ĐỎ TOÀN BỘ Ô
    if (trangThai === "Đã hủy" || trangThai === "cancelled") {
      // Đỏ toàn bộ khung: nền đỏ nhạt + viền đỏ + bóng đỏ nhẹ
      mauVienVaNen = 'style="background: #fff5f5; border: 1.5px solid #f87171; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);"';
      // Nhãn "Đã hủy" màu đỏ
      mauHuyHieu = 'style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;"';
      // Giá tiền màu đỏ
      mauGiaTien = "#dc2626";
      // Thanh thông báo đơn bị hủy
      chuoiTienTrinh = '<span class="dev5-step" style="background: #fee2e2; color: #b91c1c; border-color: #fca5a5; width: 100%; font-size: 12px; font-weight: 700;">❌ Đơn hàng này đã bị hủy</span>';
    }
    // 2. NẾU LÀ ĐƠN BÌNH THƯỜNG -> CHẠY 4 BƯỚC TIẾN TRÌNH XANH
    else {
      var soBuocXong = 1;
      if (trangThai === "Đã giao") {
        soBuocXong = 4;
      } else if (trangThai === "Đang giao") {
        soBuocXong = 3;
      } else if (trangThai === "Đã xử lý" || trangThai === "Xác nhận") {
        soBuocXong = 2;
      }
      for (var k = 0; k < cacBuoc.length; k++) {
        var classXong = (k < soBuocXong) ? "is-done" : "";
        chuoiTienTrinh += '<span class="dev5-step ' + classXong + '">' + cacBuoc[k] + '</span>';
      }
    }

    html += '<article class="dev5-order-card">';
    html += '  <div class="dev5-order-top">';
    html += '    <div>';
    html += '      <strong>' + maDon + '</strong>';
    html += '      <div class="dev5-muted">' + ngayDat + ' · ' + tenMon + '</div>';
    html += '    </div>';
    html += '    <span class="dev5-status">' + trangThai + '</span>';
    html += '  </div>';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; margin: 12px 0;">';
    html += '    <strong class="dev5-order-price" style="font-size: 1.15rem; color:' +  ';">' + formatMoney(tongTien) + '</strong>';
    html += '    <button type="button" class="dev5-secondary-button" style="padding: 6px 14px; font-size: 13px;" onclick="xemChiTietDon(\'' + maDon + '\')">🔍 Xem chi tiết</button>';
    html += '  </div>';
    html += '  <div class="dev5-timeline">' + chuoiTienTrinh + '</div>';
    html += '</article>';
  }
  khungDonHang.innerHTML = html;
}

function xemChiTietDon(maDon) {
  //Lấy tất cả đơn hàng từ LocalStorage
  var tatCaDon = [];
  var chuoiDon = localStorage.getItem("sport_orders");
  if (chuoiDon) {
    tatCaDon = JSON.parse(chuoiDon);
  } else if (typeof orders !== "undefined") {
    tatCaDon = orders;
  }

  //Tìm đúng đơn hàng có mã trùng khớp bằng vòng lặp for
  var don = null;
  for (var i = 0; i < tatCaDon.length; i++) {
    var idDon = tatCaDon[i].orderId || tatCaDon[i].id;
    if (idDon === maDon) {
      don = tatCaDon[i];
      break;
    }
  }

  if (!don) {
    showToast("Không tìm thấy thông tin đơn hàng này!" , "danger");
    return;
  }

  //Điền thông tin vào Popup
  if (document.getElementById("modal-order-title")) {
    document.getElementById("modal-order-title").textContent = "Chi Tiết Đơn Hàng #" + (don.orderId || don.id);
  }
  if (document.getElementById("order-detail-customer")) {
    var tenKhach = (don.customer && don.customer.name) ? don.customer.name : (don.customer || "Khách hàng");
    document.getElementById("order-detail-customer").textContent = tenKhach + " (" + (don.customer.phone || "") + ")";
  }
  if (document.getElementById("order-detail-email")) {
    document.getElementById("order-detail-email").textContent = don.customer.email || "Chưa cập nhật";
  }
  if (document.getElementById("order-detail-address")) {
    document.getElementById("order-detail-address").textContent = don.address || "Nhận tại cửa hàng";
  }
  if (document.getElementById("order-detail-date")) {
    document.getElementById("order-detail-date").textContent = don.date || "Hôm nay";
  }
  if (document.getElementById("order-detail-payment")) {
    document.getElementById("order-detail-payment").textContent = don.paymentMethod || don.payment || "Tiền mặt";
  }
  if (document.getElementById("order-detail-status")) {
    document.getElementById("order-detail-status").textContent = don.status || "Mới đặt";
  }
  if (document.getElementById("order-detail-note")) {
    document.getElementById("order-detail-note").textContent = don.note || "Không có";
  }
  if (document.getElementById("order-detail-total")) {
    document.getElementById("order-detail-total").textContent = formatMoney(don.total);
  }

  //Vẽ danh sách các món đồ khách đã mua trong đơn này
  var khungMon = document.getElementById("order-detail-items-list");
  if (khungMon) {
    var htmlMon = "";
    if (don.items && don.items.length > 0) {
      for (var j = 0; j < don.items.length; j++) {
        var m = don.items[j];
        var anh = m.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100";
        var gia = m.price || 0;
        var sl = m.quantity || 1;
        var tongTienMon = m.total || (gia * sl);

        htmlMon += '<div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #e2e8f0;">';
        htmlMon += '  <div style="display:flex; align-items:center; gap:12px;">';
        htmlMon += '    <img src="' + anh + '" style="width:48px; height:48px; object-fit:cover; border-radius:6px;">';
        htmlMon += '    <div>';
        htmlMon += '      <div style="font-weight:600; font-size:14px; color:#1e293b;">' + (m.name || "Sản phẩm") + '</div>';
        htmlMon += '      <div style="font-size:12px; color:#64748b;">Số lượng: x' + sl + ' | Đơn giá: ' + formatMoney(gia) + '</div>';
        htmlMon += '    </div>';
        htmlMon += '  </div>';
        htmlMon += '  <div style="font-weight:700; color:#0f172a;">' + formatMoney(tongTienMon) + '</div>';
        htmlMon += '</div>';
      }
    } else {
      htmlMon = "<p style='padding:15px; color:#64748b; text-align:center;'>Không có thông tin chi tiết từng mặt hàng.</p>";
    }
    khungMon.innerHTML = htmlMon;
  }

  //Mở Popup hiển thị lên màn hình
  var modal = document.getElementById("modal-order-detail");
  if (modal) {
    modal.classList.add("show");
  }
}

function layDanhSachDiaChiUser() {
  var user = layUserHienTai();
  if (!user) return [];

  var key = "sport_addresses_" + (user.id || user.customerId || "user");
  var chuoi = localStorage.getItem(key);
  var danhSach = chuoi ? JSON.parse(chuoi) : [];

  // Nếu trong danh sách chưa có gì nhưng trong hồ sơ user có địa chỉ, lấy làm mặc định
  if (danhSach.length === 0 && user.address && user.address !== "Chưa cập nhật") {
    danhSach.push({
      recipient: user.name || "Người nhận",
      phone: user.phone || "",
      line: user.address,
      district: "",
      city: "",
      isDefault: true
    });
    localStorage.setItem(key, JSON.stringify(danhSach));
  }
  return danhSach;
}

function hienThiDiaChi() {
  var khung = document.querySelector("[data-addresses]");
  if (!khung) return;

  var danhSach = layDanhSachDiaChiUser();

  // Cập nhật số lượng địa chỉ lên Tab 1
  var theDemDiaChi = document.querySelector("[data-address-count]");
  if (theDemDiaChi) {
    theDemDiaChi.textContent = danhSach.length;
  }

  // Nếu rỗng, hiển thị đúng thông báo như Ảnh 3 của bạn
  if (danhSach.length === 0) {
    khung.innerHTML = '<p class="dev5-muted">Bạn chưa lưu địa chỉ nhận hàng nào. Bấm nút "+ Thêm địa chỉ" ở trên để tạo.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < danhSach.length; i++) {
    var dc = danhSach[i];
    var diaChiChiTiet = dc.line;
    if (dc.district) diaChiChiTiet += ", " + dc.district;
    if (dc.city) diaChiChiTiet += ", " + dc.city;

    html += '<article class="dev5-address-card" style="margin-bottom:12px; padding:16px; border:1px solid #e2e8f0; border-radius:8px;">';
    html += '  <div class="dev5-address-top">';
    html += '    <strong>Địa chỉ nhận hàng ' + (i + 1) + '</strong>';
    html += '  </div>';
    html += '  <div class="dev5-address-line" style="margin-top:8px; line-height:1.6;">';
    html += '    <div><strong>Người nhận:</strong> ' + dc.recipient + '</div>';
    html += '    <div><strong>SĐT:</strong> ' + dc.phone + '</div>';
    html += '    <div><strong>Địa chỉ:</strong> ' + diaChiChiTiet + '</div>';
    html += '  </div>';
    html += '  <div style="margin-top:10px;">';
    html += '    <button class="dev5-secondary-button" type="button" onclick="xoaDiaChi(' + i + ')">Xóa địa chỉ này</button>';
    html += '  </div>';
    html += '</article>';
  }

  khung.innerHTML = html;
}

function moFormThemDiaChi() {
  var form = document.querySelector("[data-address-form]");
  if (form) {
    form.reset();
    var user = layUserHienTai();
    if (user) {
      if (form.querySelector('[name="recipient"]')) form.querySelector('[name="recipient"]').value = user.name || "";
      if (form.querySelector('[name="phone"]')) form.querySelector('[name="phone"]').value = user.phone || "";
    }
    form.classList.remove("dev5-hidden");
  }
}

function dongFormDiaChi() {
  var form = document.querySelector("[data-address-form]");
  if (form) {
    form.classList.add("dev5-hidden");
  }
}

function luuDiaChi(event) {
  event.preventDefault();
  var form = document.querySelector("[data-address-form]");
  if (!form) return;

  var user = layUserHienTai();
  if (!user) return;

  var danhSach = layDanhSachDiaChiUser();
  var diaChiMoi = {
    recipient: form.querySelector('[name="recipient"]').value,
    phone: form.querySelector('[name="phone"]').value,
    line: form.querySelector('[name="line"]').value,
    district: form.querySelector('[name="district"]').value,
    city: form.querySelector('[name="city"]').value,
    isDefault: (danhSach.length === 0)
  };

  danhSach.push(diaChiMoi);
  var key = "sport_addresses_" + (user.id || user.customerId || "user");
  localStorage.setItem(key, JSON.stringify(danhSach));

  alert("Đã lưu địa chỉ nhận hàng thành công!");
  dongFormDiaChi();
  hienThiDiaChi();
}

function xoaDiaChi(viTri) {
  if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;

  var user = layUserHienTai();
  if (!user) return;

  var danhSach = layDanhSachDiaChiUser();
  var danhSachMoi = [];
  for (var i = 0; i < danhSach.length; i++) {
    if (i !== viTri) {
      danhSachMoi.push(danhSach[i]);
    }
  }

  var key = "sport_addresses_" + (user.id || user.customerId || "user");
  localStorage.setItem(key, JSON.stringify(danhSachMoi));
  hienThiDiaChi();
}

function layDanhSachWishlist() {
  var chuoi = localStorage.getItem("sport_wishlist");
  if (!chuoi) return [];
  return JSON.parse(chuoi);
}

function hienThiYeuThich() {
  var khung = document.querySelector("[data-wishlist]");
  if (!khung) return;

  var danhSach = layDanhSachWishlist();

  // Cập nhật số lượng yêu thích lên ô thống kê ở Tab 1
  var theDemWishlist = document.querySelector("[data-wishlist-count]");
  if (theDemWishlist) {
    theDemWishlist.textContent = danhSach.length;
  }

  // Nếu chưa có món yêu thích nào
  if (danhSach.length === 0) {
    khung.innerHTML = '<p class="dev5-muted">Danh sách yêu thích của bạn đang trống.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < danhSach.length; i++) {
    var sp = danhSach[i];
    var hinhAnh = sp.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400";

    html += '<article class="dev5-wishlist-item" style="border:1px solid #e2e8f0; border-radius:10px; padding:12px; background:#fff;">';
    html += '  <img src="' + hinhAnh + '" alt="' + sp.name + '" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:10px;">';
    html += '  <span class="dev5-muted" style="font-size:0.85rem; color:#64748b;">' + (sp.category || sp.tag || "Thể thao") + '</span>';
    html += '  <h3 style="font-size:1rem; margin:6px 0; color:#1e293b;">' + sp.name + '</h3>';
    html += '  <div class="dev5-price" style="font-weight:bold; color:#dc2626; margin-bottom:10px;">' + formatMoney(sp.price) + '</div>';
    html += '  <button class="dev5-secondary-button" type="button" onclick="xoaYeuThich(' + sp.id + ')">Xóa yêu thích</button>';
    html += '</article>';
  }

  khung.innerHTML = html;
}

function xoaYeuThich(idCanXoa) {
  var danhSach = layDanhSachWishlist();
  var danhSachMoi = [];

  // Vòng lặp for lọc bỏ sản phẩm có id trùng
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].id != idCanXoa) {
      danhSachMoi.push(danhSach[i]);
    }
  }

  localStorage.setItem("sport_wishlist", JSON.stringify(danhSachMoi));
  hienThiYeuThich();
}

function hienThiFaq() {
  var khung = document.querySelector("[data-faq]");
  if (!khung) return;

  var dsFaq = [];
  if (typeof faqs !== "undefined" && Array.isArray(faqs)) {
    dsFaq = faqs;
  } else {
    var raw = localStorage.getItem("sport_faqs");
    if (raw) dsFaq = JSON.parse(raw);
  }

  // Nếu không có câu hỏi nào (hiển thị đúng như Ảnh 5 của bạn)
  if (!dsFaq || dsFaq.length === 0) {
    khung.innerHTML = '<p class="dev5-muted">Chưa có câu hỏi hỗ trợ nào.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < dsFaq.length; i++) {
    var cauHoi = dsFaq[i].question || dsFaq[i].q || "";
    var cauTraLoi = dsFaq[i].answer || dsFaq[i].a || "";
    var classMo = (i === 0) ? "is-open" : ""; // Mặc định mở câu đầu tiên

    html += '<article class="dev5-faq-item ' + classMo + '">';
    html += '  <button class="dev5-faq-question" type="button" onclick="dongMoFaq(this)">';
    html += '    <span>' + cauHoi + '</span>';
    html += '    <span>＋</span>';
    html += '  </button>';
    html += '  <div class="dev5-faq-answer">' + cauTraLoi + '</div>';
    html += '</article>';
  }

  khung.innerHTML = html;
}

function dongMoFaq(nutBam) {
  var theCha = nutBam.parentElement;
  if (theCha) {
    theCha.classList.toggle("is-open");
  }
}

/* ==============================================================================
   TOÀN BỘ CHỨC NĂNG QUẢN TRỊ ADMIN (CHUYỂN TỪ PACKAGE ADMIN SANG)
   Viết dạng hàm độc lập tiếng Việt, dùng onclick, chỉ dùng for và if-else
============================================================================== */

// 1. TIỆN ÍCH ĐỌC VÀ GHI DỮ LIỆU LOCALSTORAGE CHO ADMIN
function layDuLieuAdmin(khoa) {
  var chuoi = localStorage.getItem(khoa);
  if (!chuoi) return [];
  try {
    return JSON.parse(chuoi);
  } catch (e) {
    return [];
  }
}

function luuDuLieuAdmin(khoa, duLieu) {
  localStorage.setItem(khoa, JSON.stringify(duLieu));
}

// 2. CHUYỂN TAB VÀ ĐÓNG MỞ POPUP ADMIN
function chuyenTabAdmin(tenTab, nutBam) {
  var cacTab = document.querySelectorAll(".admin-tab-content");
  for (var i = 0; i < cacTab.length; i++) {
    cacTab[i].classList.remove("active");
  }

  var cacNut = document.querySelectorAll(".admin-nav-item");
  for (var j = 0; j < cacNut.length; j++) {
    cacNut[j].classList.remove("active");
  }

  var tabChon = document.getElementById("tab-" + tenTab);
  if (tabChon) tabChon.classList.add("active");

  if (nutBam) {
    nutBam.classList.add("active");
  } else {
    var nutTheoId = document.getElementById("nav-" + tenTab);
    if (nutTheoId) nutTheoId.classList.add("active");
  }

  // Tùy theo tab nào mà gọi hàm vẽ dữ liệu của tab đó
  if (tenTab === "dashboard") hienThiDashboardAdmin();
  else if (tenTab === "customer") hienThiBangKhachHangAdmin();
  else if (tenTab === "category") hienThiBangDanhMucAdmin();
  else if (tenTab === "product") hienThiBangSanPhamAdmin();
  else if (tenTab === "import") hienThiBangNhapHang();
  else if (tenTab === "pricing") hienThiBangGiaBanAdmin();
  else if (tenTab === "order") hienThiBangDonHangAdmin();
  else if (tenTab === "inventory") hienThiBangTonKhoAdmin();

  capNhatSoDemMenuAdmin();
}

function moModalAdmin(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.add("show");
}

function dongModalAdmin(idModal) {
  var modal = document.getElementById(idModal);
  if (modal) modal.classList.remove("show");
}

function capNhatSoDemMenuAdmin() {
  var dsLoai = layDuLieuAdmin("sport_categories");
  var dsSp = layDuLieuAdmin("sport_products");
  var dsNhap = layDuLieuAdmin("sport_imports");
  var dsDon = layDuLieuAdmin("sport_orders");
  var dsKhach = layDuLieuAdmin("sport_customers");

  var bLoai = document.getElementById("badge-count-categories");
  var bSp = document.getElementById("badge-count-products");
  var bNhap = document.getElementById("badge-count-imports");
  var bDon = document.getElementById("badge-count-orders");
  var bKhach = document.getElementById("badge-count-customers");

  if (bLoai) bLoai.textContent = dsLoai.length;
  if (bSp) bSp.textContent = dsSp.length;
  if (bNhap) bNhap.textContent = dsNhap.length;
  if (bDon) bDon.textContent = dsDon.length;
  if (bKhach) bKhach.textContent = dsKhach.length;
}

// 3. TAB 1: BẢNG ĐIỀU KHIỂN & DOANH THU (DASHBOARD)
function hienThiDashboardAdmin() {
  var dsDon = layDuLieuAdmin("sport_orders");
  var dsKhach = layDuLieuAdmin("sport_customers");
  var dsSp = layDuLieuAdmin("sport_products");

  var tongDoanhThu = 0;
  for (var i = 0; i < dsDon.length; i++) {
    if (dsDon[i].status !== "Đã hủy") {
      tongDoanhThu = tongDoanhThu + Number(dsDon[i].total || 0);
    }
  }

  var tongTonKho = 0;
  for (var j = 0; j < dsSp.length; j++) {
    tongTonKho = tongTonKho + Number(dsSp[j].stock || 0);
  }

  if (document.getElementById("kpi-total-revenue")) document.getElementById("kpi-total-revenue").textContent = formatMoney(tongDoanhThu);
  if (document.getElementById("kpi-total-orders")) document.getElementById("kpi-total-orders").textContent = dsDon.length + " Đơn";
  if (document.getElementById("kpi-total-customers")) document.getElementById("kpi-total-customers").textContent = dsKhach.length + " Khách";
  if (document.getElementById("kpi-total-stock")) document.getElementById("kpi-total-stock").textContent = tongTonKho + " Món";

  // Hiển thị 4 đơn hàng mới nhất
  var khungDonGanDay = document.getElementById("dashboard-recent-orders-list");
  if (khungDonGanDay) {
    var html = "";
    var soLuong = dsDon.length > 4 ? 4 : dsDon.length;
    for (var k = dsDon.length - 1; k >= dsDon.length - soLuong; k--) {
      var d = dsDon[k];
      var ten = (d.customer && d.customer.name) ? d.customer.name : (d.fullName || d.customer || "Khách hàng");
      var ngay = d.date || (d.createdAt ? d.createdAt.split("T")[0] : "Hôm nay");
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #e2e8f0;">
          <div>
            <strong>#${d.orderId || d.id}</strong> - ${ten}
            <div style="font-size:12px; color:#64748b;">${ngay} | ${d.paymentMethod || "Tiền mặt"}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700; color:#0284c7;">${formatMoney(d.total)}</div>
            <span class="nav-badge badge-blue">${d.status || "Mới đặt"}</span>
          </div>
        </div>
      `;
    }
    if (dsDon.length === 0) html = "<p style='text-align:center; color:#64748b; padding:15px;'>Chưa có đơn hàng nào.</p>";
    khungDonGanDay.innerHTML = html;
  }
}

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
        <td><strong style="color:#0284c7;">#${ma}</strong></td>
        <td>
          <div style="font-weight:600;">${tenKhach}</div>
          <div style="font-size:12px; color:#64748b;">SĐT: ${sdtKhach}</div>
        </td>
        <td>${ngay || "Hôm nay"}</td>
        <td>${tomTatMon}</td>
        <td><strong style="color:#0284c7;">${formatMoney(o.total)}</strong></td>
        <td><span class="nav-badge badge-gray">${o.paymentMethod || "Tiền mặt"}</span></td>
        <td>
          <select class="filter-select" onchange="doiTrangThaiDonHang('${ma}', this.value)" style="padding:4px 8px; border-radius:6px;">
            <option value="Mới đặt" ${o.status === "Mới đặt" || o.status === "pending" ? "selected" : ""}>Mới đặt</option>
            <option value="Đã xử lý" ${o.status === "Đã xử lý" ? "selected" : ""}>Đã xử lý</option>
            <option value="Đang giao" ${o.status === "Đang giao" ? "selected" : ""}>Đang giao</option>
            <option value="Đã giao" ${o.status === "Đã giao" ? "selected" : ""}>Đã giao</option>
            <option value="Đã hủy" ${o.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
          </select>
        </td>
        <td>
          <!-- GỌI TRỰC TIẾP HÀM xemChiTietDon CỦA DEV5_USER.JS -->
          <button type="button" class="btn-action btn-edit" onclick="xemChiTietDon('${ma}')" style="cursor:pointer; padding:5px 12px; border-radius:6px; background:#e0f2fe; color:#0369a1; border:none; font-weight:600;">
            🔍 Chi Tiết
          </button>
        </td>
      </tr>
    `;
  }

  if (html === "") {
    html = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#64748b;">Không có đơn hàng nào phù hợp với bộ lọc.</td></tr>`;
  }
  tbody.innerHTML = html;
}

function doiTrangThaiDonHang(maDon, trangThaiMoi) {
  var dsDon = layDuLieuAdmin("sport_orders");
  for (var i = 0; i < dsDon.length; i++) {
    if (dsDon[i].orderId === maDon || dsDon[i].id === maDon) {
      dsDon[i].status = trangThaiMoi;
      break;
    }
  }
  luuDuLieuAdmin("sport_orders", dsDon);
  if (typeof showToast === "function") showToast("Đã cập nhật trạng thái đơn [#" + maDon + "] thành: " + trangThaiMoi, "success");
  hienThiBangDonHangAdmin();
  capNhatSoDemMenuAdmin();
}

function locDonHangAdmin() {
  hienThiBangDonHangAdmin();
}

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
        <td>${sdt}</td>
        <td><span class="sport-badge badge-blue">${hang}</span></td>
        <td>${trangThai}</td>
        <td style="display: flex; gap: 6px;">
          <button type="button" class="btn-action btn-reset" onclick="resetMatKhauKhach('${maKhach}')" style="background:#f3e8ff; color:#7e22ce; border:none; padding:5px 8px; border-radius:6px; font-weight:600; cursor:pointer;">
            Reset MK
          </button>
          <button type="button" onclick="khoaMoTaiKhoanKhach('${maKhach}')" style="cursor:pointer; padding:5px 8px; border-radius:6px; font-size:12px; font-weight:600; border:1px solid #cbd5e1; background:${daKhoa ? '#dcfce7' : '#fee2e2'}; color:${daKhoa ? '#15803d' : '#b91c1c'};">
            ${daKhoa ? "Mở Khóa" : "Khóa TK"}
          </button>
        </td>
      </tr>
    `;
  }
  if (html === "") html = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b;">Không tìm thấy khách hàng nào.</td></tr>`;
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

function resetMatKhauKhach(maKhach) {
  if (!confirm("Bạn có chắc chắn muốn đặt lại mật khẩu về mặc định (Sport@123) cho tài khoản #" + maKhach + " không?")) return;
  var dsKhach = layDuLieuAdmin("sport_customers");
  for (var i = 0; i < dsKhach.length; i++) {
    if (dsKhach[i].customerId === maKhach || dsKhach[i].id === maKhach) {
      dsKhach[i].password = "Sport@123";
      showToast("Đã reset mật khẩu của " + dsKhach[i].name + " về mặc định: Sport@123", "success");
      break;
    }
  }
  luuDuLieuAdmin("sport_customers", dsKhach);
}

function locKhachHangAdmin() {
  hienThiBangKhachHangAdmin();
}

// 6. TAB 4: QUẢN LÝ PHÂN LOẠI DANH MỤC (CATEGORY)
var maLoaiDangSua = "";

function hienThiBangDanhMucAdmin() {
  var dsLoai = layDuLieuAdmin("sport_categories");
  var dsSp = layDuLieuAdmin("sport_products");
  var tbody = document.getElementById("category-tbody");
  if (!tbody) return;

  var tuKhoa = document.getElementById("category-search-input") ? document.getElementById("category-search-input").value.trim().toLowerCase() : "";

  var html = "";
  for (var i = 0; i < dsLoai.length; i++) {
    var c = dsLoai[i];
    var ma = c.id || c.code;
    var ten = c.name || "";

    if (tuKhoa !== "") {
      var chuoiTim = (ma + " " + ten).toLowerCase();
      if (chuoiTim.indexOf(tuKhoa) === -1) continue;
    }

    var soSp = 0;
    for (var j = 0; j < dsSp.length; j++) {
      if (dsSp[j].categoryId === ma || dsSp[j].category === ten) soSp++;
    }

    html += `
      <tr>
        <td style="font-size:20px;">${c.icon || "🏷️"}</td>
        <td><strong>${ma}</strong></td>
        <td><strong>${ten}</strong></td>
        <td><span class="nav-badge badge-blue">${soSp} sản phẩm</span></td>
        <td><strong>${c.profitPercent || 25}%</strong></td>
        <td><span class="nav-badge badge-green">Đang áp dụng</span></td>
        <td>
          <button type="button" class="btn-action btn-edit" onclick="moModalSuaDanhMuc('${ma}')">Sửa</button>
          <button type="button" class="btn-action btn-delete" onclick="xoaDanhMucAdmin('${ma}')">Xóa</button>
        </td>
      </tr>
    `;
  }
  if (html === "") html = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b;">Chưa có danh mục nào.</td></tr>`;
  tbody.innerHTML = html;
}

function moModalThemDanhMuc() {
  maLoaiDangSua = "";
  var dsLoai = layDuLieuAdmin("sport_categories");
  if (document.getElementById("modal-category-title")) document.getElementById("modal-category-title").textContent = "Thêm Mới Loại Sản Phẩm";
  if (document.getElementById("cat-id")) document.getElementById("cat-id").value = "CAT0" + (dsLoai.length + 1);
  if (document.getElementById("cat-icon")) document.getElementById("cat-icon").value = "⚡";
  if (document.getElementById("cat-name")) document.getElementById("cat-name").value = "";
  if (document.getElementById("cat-profit")) document.getElementById("cat-profit").value = 30;
  if (document.getElementById("cat-desc")) document.getElementById("cat-desc").value = "";
  moModalAdmin("modal-category");
}

function moModalSuaDanhMuc(maLoai) {
  maLoaiDangSua = maLoai;
  var dsLoai = layDuLieuAdmin("sport_categories");
  var c = null;
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === maLoai || dsLoai[i].code === maLoai) {
      c = dsLoai[i];
      break;
    }
  }
  if (!c) return;

  if (document.getElementById("modal-category-title")) document.getElementById("modal-category-title").textContent = "Chỉnh Sửa Loại Sản Phẩm";
  if (document.getElementById("cat-id")) document.getElementById("cat-id").value = c.id;
  if (document.getElementById("cat-icon")) document.getElementById("cat-icon").value = c.icon || "🏷️";
  if (document.getElementById("cat-name")) document.getElementById("cat-name").value = c.name;
  if (document.getElementById("cat-profit")) document.getElementById("cat-profit").value = c.profitPercent || 25;
  if (document.getElementById("cat-desc")) document.getElementById("cat-desc").value = c.desc || "";
  moModalAdmin("modal-category");
}

function luuDanhMucAdmin() {
  var ten = document.getElementById("cat-name").value.trim();
  if (!ten) {
    alert("Vui lòng nhập tên danh mục!");
    return;
  }
  var icon = document.getElementById("cat-icon").value.trim() || "🏷️";
  var profit = Number(document.getElementById("cat-profit").value) || 25;
  var desc = document.getElementById("cat-desc").value.trim();

  var dsLoai = layDuLieuAdmin("sport_categories");

  if (maLoaiDangSua === "") {
    // Thêm mới
    var maMoi = document.getElementById("cat-id").value;
    dsLoai.push({ id: maMoi, name: ten, icon: icon, profitPercent: profit, desc: desc, status: "active" });
    if (typeof showToast === "function") showToast("Đã thêm danh mục mới: " + ten, "success");
  } else {
    // Cập nhật sửa
    for (var i = 0; i < dsLoai.length; i++) {
      if (dsLoai[i].id === maLoaiDangSua || dsLoai[i].code === maLoaiDangSua) {
        dsLoai[i].name = ten;
        dsLoai[i].icon = icon;
        dsLoai[i].profitPercent = profit;
        dsLoai[i].desc = desc;
        break;
      }
    }
    if (typeof showToast === "function") showToast("Đã cập nhật danh mục: " + ten, "success");
  }

  luuDuLieuAdmin("sport_categories", dsLoai);
  dongModalAdmin("modal-category");
  hienThiBangDanhMucAdmin();
  capNhatSoDemMenuAdmin();
}

function xoaDanhMucAdmin(maLoai) {
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục [" + maLoai + "] không?")) return;
  var dsLoai = layDuLieuAdmin("sport_categories");
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === maLoai || dsLoai[i].code === maLoai) {
      dsLoai.splice(i, 1);
      break;
    }
  }
  luuDuLieuAdmin("sport_categories", dsLoai);
  hienThiBangDanhMucAdmin();
  capNhatSoDemMenuAdmin();
}

function locDanhMucAdmin() {
  hienThiBangDanhMucAdmin();
}

// 7. TAB 5: QUẢN LÝ SẢN PHẨM (PRODUCT)
var maSpDangSua = -1;

function hienThiBangSanPhamAdmin() {
  var dsSp = layDuLieuAdmin("sport_products");
  var tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  var tuKhoa = document.getElementById("product-search-input") ? document.getElementById("product-search-input").value.trim().toLowerCase() : "";
  var locLoai = document.getElementById("product-filter-category") ? document.getElementById("product-filter-category").value : "ALL";
  var locHang = document.getElementById("product-filter-brand") ? document.getElementById("product-filter-brand").value : "ALL";

  var html = "";
  for (var i = 0; i < dsSp.length; i++) {
    var p = dsSp[i];
    if (tuKhoa !== "") {
      var chuoi = (p.name + " " + (p.brand || "") + " " + (p.code || "")).toLowerCase();
      if (chuoi.indexOf(tuKhoa) === -1) continue;
    }
    if (locLoai && locLoai !== "ALL" && p.categoryId !== locLoai && p.category !== locLoai) continue;
    if (locHang && locHang !== "ALL" && p.brand !== locHang) continue;

    // js/dev5_user.js (khoảng dòng 1526 - 1543)
    var ton = Number(p.stock) || 0;
    var canhBaoTon = ton <= 5 ? `<span style="color:#ef4444; font-weight:700;">⚠️ ${ton}</span>` : `<strong>${ton}</strong>`;

    // 1. Kiểm tra trạng thái động
    if( p.stock <= 0 ) p.status = "hidden" ;
    var laDangAn = p.status === "hidden";

    var badgeTrangThai = laDangAn
        ? `<span class="nav-badge badge-gray" style="background:#f1f5f9; color:#64748b; border:1px solid #cbd5e1;">Đang ẩn</span>`
        : `<span class="nav-badge badge-green">Đang bán</span>`;

    // 2. Nút bấm đổi trạng thái nhanh
    var nutDoiTrangThai = laDangAn
        ? `<button type="button" class="btn-action" style="background:#dcfce7; color:#15803d;" onclick="doiTrangThaiSanPhamAdmin(${p.id})">Hiện</button>`
        : `<button type="button" class="btn-action btn-lock" onclick="doiTrangThaiSanPhamAdmin(${p.id})">Ẩn</button>`;

    html += `
      <tr style="${laDangAn ? 'opacity: 0.65; background-color: #f8fafc;' : ''}">
        <td><img src="${p.image || ''}" style="width:44px; height:44px; object-fit:cover; border-radius:6px;"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category || p.categoryId || "Khác"}</td>
        <td>${p.brand || "Sport"}</td>
        <td><strong style="color:#0284c7;">${formatMoney(p.price)}</strong></td>
        <td>${canhBaoTon}</td>
        <td>${badgeTrangThai}</td>
        <td>
          <button type="button" class="btn-action btn-edit" onclick="moModalSuaSanPham(${p.id})">Sửa</button>
          ${nutDoiTrangThai}
          <button type="button" class="btn-action btn-delete" onclick="xoaSanPhamAdmin(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
  }
  if (html === "") html = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#64748b;">Không tìm thấy sản phẩm nào.</td></tr>`;
  tbody.innerHTML = html;
}

function moModalThemSanPham() {
  maSpDangSua = -1;
  napLuaChonDanhMucVaoSelect();
  if (document.getElementById("modal-product-title")) document.getElementById("modal-product-title").textContent = "Thêm Mới Sản Phẩm";
  if (document.getElementById("prod-name")) document.getElementById("prod-name").value = "";
  if (document.getElementById("prod-code")) document.getElementById("prod-code").value = "SP-" + Math.floor(Math.random() * 899 + 100);
  if (document.getElementById("prod-brand")) document.getElementById("prod-brand").value = "Nike";
  if (document.getElementById("prod-cost")) document.getElementById("prod-cost").value = "";
  if (document.getElementById("prod-price")) document.getElementById("prod-price").value = "";
  if (document.getElementById("prod-stock")) document.getElementById("prod-stock").value = 50;
  if (document.getElementById("prod-image")) document.getElementById("prod-image").value = "";
  if (document.getElementById("prod-desc")) document.getElementById("prod-desc").value = "";
  if (document.getElementById("prod-status")) document.getElementById("prod-status").value = "active";
  moModalAdmin("modal-product");
}

function moModalSuaSanPham(maSp) {
  maSpDangSua = maSp;
  napLuaChonDanhMucVaoSelect();
  var dsSp = layDuLieuAdmin("sport_products");
  var p = null;
  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSp) {
      p = dsSp[i];
      break;
    }
  }
  if (!p) return;

  if (document.getElementById("modal-product-title")) document.getElementById("modal-product-title").textContent = "Chỉnh Sửa Sản Phẩm #" + maSp;
  if (document.getElementById("prod-name")) document.getElementById("prod-name").value = p.name;
  if (document.getElementById("prod-code")) document.getElementById("prod-code").value = p.code || ("SP-" + p.id);
  if (document.getElementById("prod-brand")) document.getElementById("prod-brand").value = p.brand || "";
  if (document.getElementById("prod-category")) document.getElementById("prod-category").value = p.categoryId || "";
  if (document.getElementById("prod-cost")) document.getElementById("prod-cost").value = p.cost || "";
  if (document.getElementById("prod-price")) document.getElementById("prod-price").value = p.price || "";
  if (document.getElementById("prod-stock")) document.getElementById("prod-stock").value = p.stock || 0;
  if (document.getElementById("prod-image")) document.getElementById("prod-image").value = p.image || "";
  if (document.getElementById("prod-desc")) document.getElementById("prod-desc").value = p.desc || p.description || "";
  if (document.getElementById("prod-status")) document.getElementById("prod-status").value = p.status || "active";
  moModalAdmin("modal-product");
}

function napLuaChonDanhMucVaoSelect() {
  var dsLoai = layDuLieuAdmin("sport_categories");
  var selectEl = document.getElementById("prod-category");
  if (!selectEl) return;
  var html = "";
  for (var i = 0; i < dsLoai.length; i++) {
    html += `<option value="${dsLoai[i].id}">${dsLoai[i].name}</option>`;
  }
  selectEl.innerHTML = html;
}

function luuSanPhamAdmin() {
  var ten = document.getElementById("prod-name").value.trim();
  if (!ten) {
    alert("Vui lòng nhập tên sản phẩm!");
    return;
  }
  var gia = Number(document.getElementById("prod-price").value) || 0;
  var ton = Number(document.getElementById("prod-stock").value) || 0;
  var hang = document.getElementById("prod-brand").value.trim() || "Sport";
  var catId = document.getElementById("prod-category").value;
  var anh = document.getElementById("prod-image").value.trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400";
  var desc = document.getElementById("prod-desc").value.trim();
  var trangThai = "active";
  if (document.getElementById("prod-status")) {
    trangThai = document.getElementById("prod-status").value;
  }
  var dsSp = layDuLieuAdmin("sport_products");

  if (maSpDangSua === -1) {
    var idMoi = dsSp.length > 0 ? (dsSp[dsSp.length - 1].id + 1) : 1;
    dsSp.push({ id: idMoi, name: ten, price: gia, stock: ton, brand: hang, categoryId: catId, image: anh, desc: desc, status: "active" });
    if (typeof showToast === "function") showToast("Đã thêm sản phẩm mới: " + ten, "success");
  } else {
    for (var i = 0; i < dsSp.length; i++) {
      if (dsSp[i].id === maSpDangSua) {
        dsSp[i].name = ten;
        dsSp[i].price = gia;
        dsSp[i].stock = ton;
        dsSp[i].brand = hang;
        dsSp[i].categoryId = catId;
        dsSp[i].image = anh;
        dsSp[i].desc = desc;
        dsSp[i].status = trangThai
        break;
      }
    }
    if (typeof showToast === "function") showToast("Đã cập nhật sản phẩm: " + ten, "success");
  }

  luuDuLieuAdmin("sport_products", dsSp);
  dongModalAdmin("modal-product");
  hienThiBangSanPhamAdmin();
  capNhatSoDemMenuAdmin();
}

function xoaSanPhamAdmin(maSp) {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm #" + maSp + " không?")) return;
  var dsSp = layDuLieuAdmin("sport_products");
  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSp) {
      dsSp.splice(i, 1);
      break;
    }
  }
  luuDuLieuAdmin("sport_products", dsSp);
  hienThiBangSanPhamAdmin();
  capNhatSoDemMenuAdmin();
}

function locSanPhamAdmin() {
  hienThiBangSanPhamAdmin();
}


function moModalTaoPhieuNhap(maSpChon) {
  var dsSp = layDuLieuAdmin("sport_products");
  var selectEl = document.getElementById("import-product-select");
  if (selectEl) {
    var html = '<option value="">-- Chọn sản phẩm cần nhập --</option>';
    for (var i = 0; i < dsSp.length; i++) {
      var sp = dsSp[i];
      var ma = sp.code || ("SP-" + sp.id);
      var giaGoc = sp.costPrice || sp.cost || Math.round(sp.price * 0.7);
      html += '<option value="' + sp.id + '" data-cost="' + giaGoc + '">' + ma + ' - ' + sp.name + '</option>';
    }
    selectEl.innerHTML = html;

    // Nếu có truyền mã sản phẩm cần nhập vào
    if (maSpChon) {
      selectEl.value = maSpChon;
      if (typeof onImportProductChange === "function") {
        onImportProductChange();
      }
    }
  }
  moModalAdmin("modal-import");
}
function chuyenSangNhapHang(maSp) {
  chuyenTabAdmin("import");
  moModalTaoPhieuNhap(maSp);
}

// Tự động điền đơn giá vốn khi người dùng chọn sản phẩm
function onImportProductChange() {
  var selectEl = document.getElementById("import-product-select");
  var opt = selectEl.options[selectEl.selectedIndex];
  if (opt && opt.dataset.cost) {
    var oGia = document.getElementById("import-unit-price");
    if (oGia) oGia.value = opt.dataset.cost;
  }
}

function themDongMatHangNhap() {
  var bang = document.getElementById("import-items-tbody");
  if (!bang) return;
  var tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" placeholder="Tên trang bị nhập..." style="width:100%; padding:6px;"></td>
    <td><input type="number" value="10" min="1" style="width:80px; padding:6px;"></td>
    <td><input type="number" value="500000" style="width:120px; padding:6px;"></td>
    <td><button type="button" onclick="xoaDongMatHangNhap(this)" style="color:red; background:none; border:none; cursor:pointer;">✕</button></td>
  `;
  bang.appendChild(tr);
}

function xoaDongMatHangNhap(nut) {
  var tr = nut.parentElement.parentElement;
  if (tr) tr.remove();
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
    var maPhieu = p.id || p.slipId || ("PN-" + (i + 1));
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
      nutChiTietHoacSua = '<button type="button" class="btn-action" style="background:#e0f2fe; color:#0284c7; border:1px solid #bae6fd; padding:5px 12px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="xemChiTietPhieuNhap(\'' + maPhieu + '\')">Chi tiết</button>';
    } else {
      nutChiTietHoacSua = '<button type="button" class="btn-action" style="background:#fef3c7; color:#d97706; border:1px solid #fde68a; padding:5px 12px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="moModalSuaPhieuNhap(\'' + maPhieu + '\')">Sửa</button>';
    }

    // 2. Phân biệt cột THAO TÁC:
    // - Chưa hoàn thành -> Nút "Hoàn thành" (bấm được)
    // - Đã hoàn thành -> Nút "Đã hoàn thành" (bị khóa, không bấm được)
    var nutThaoTac = "";
    if (trangThai === "Hoàn thành") {
      nutThaoTac = '<button type="button" class="btn-action" disabled style="background:#f1f5f9; color:#94a3b8; border:1px solid #e2e8f0; padding:6px 14px; border-radius:6px; font-weight:700; cursor:not-allowed;">Đã hoàn thành</button>';
    } else {
      nutThaoTac = '<button type="button" class="btn-action" style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:6px 14px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="xacNhanPhieuNhap(\'' + maPhieu + '\')">Hoàn thành</button>';
    }

    html += `
      <tr>
        <td><strong>#${maPhieu}</strong></td>
        <td>${nhaCc}</td>
        <td>${ngayNhap}</td>
        <td><strong>${soLuongHienThi} món</strong></td>
        <td><strong style="color:#0284c7;">${formatMoney(tongTien)}</strong></td>
        <td>${p.creator || "Admin"}</td>
        <td>${nutChiTietHoacSua}</td>
        <td>${nutThaoTac}</td>
      </tr>
    `;
  }

  if (html === "") {
    html = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#64748b;">Chưa có phiếu nhập hàng nào.</td></tr>`;
  }
  tbody.innerHTML = html;
}



function xemChiTietPhieuNhap(maPhieu) {
  // 1. Tìm phiếu nhập theo mã phiếu
  var dsNhap = layDuLieuAdmin("sport_imports");
  var phieu = null;
  for (var i = 0; i < dsNhap.length; i++) {
    if (String(dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
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
  if (phieu.productId) {
    for (var j = 0; j < dsSp.length; j++) {
      if (String(dsSp[j].id) === String(phieu.productId)) {
        sp = dsSp[j];
        break;
      }
    }
  }

  // Lấy các dữ liệu chi tiết
  var tenSp = sp ? sp.name : (phieu.productName || "Lô dụng cụ thể thao");
  var maSp = sp ? (sp.code || ("SP-" + sp.id)) : (phieu.productId ? ("SP-" + phieu.productId) : "SP-CHUNG");
  var anhSp = sp ? (sp.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200") : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200";
  var hangSp = sp ? (sp.brand || "Chính hãng") : "Chính hãng";
  var tonKho = sp ? Number(sp.stock !== undefined ? sp.stock : (sp.quantity || 0)) : "—";
  var soLuongNhap = Number(phieu.totalQuantity || 1);
  var donGiaNhap = Number(phieu.unitPrice || (phieu.totalCost ? phieu.totalCost / soLuongNhap : 0));
  var tongTien = Number(phieu.totalCost || (soLuongNhap * donGiaNhap));
  var trangThai = phieu.status || "Hoàn thành";

  var nhanTrangThai = trangThai === "Tạm lưu"
      ? '<span class="badge-status" style="background:#fef3c7; color:#d97706; padding:3px 8px; border-radius:10px; font-weight:700;">Chờ duyệt</span>'
      : '<span class="badge-status" style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:10px; font-weight:700;">Đã hoàn thành</span>';

  // 3. Đổ dữ liệu vào Modal chi tiết
  var modalTitle = document.getElementById("import-detail-title");
  if (modalTitle) {
    modalTitle.textContent = "Chi Tiết Phiếu Nhập #" + (phieu.id || phieu.slipId);
  }

  var modalBody = document.getElementById("import-detail-body");
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
        <img src="${anhSp}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div>
          <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #1e293b;">${tenSp}</h4>
          <span class="badge-code-pill" style="margin-right: 6px;">${maSp}</span>
          <span style="color:#64748b; font-size:12px;">Hãng: <strong>${hangSp}</strong></span>
        </div>
      </div>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Mã phiếu:</td><td style="text-align: right; font-weight: 700;">#${phieu.id || phieu.slipId}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Nhà cung cấp:</td><td style="text-align: right; font-weight: 600;">${phieu.supplier || "Tổng Kho Thể Thao"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Ngày nhập:</td><td style="text-align: right;">${phieu.date || "Hôm nay"}</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Số lượng nhập:</td><td style="text-align: right; font-weight: 800; color: #0284c7;">+${soLuongNhap} món</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Đơn giá vốn:</td><td style="text-align: right; font-weight: 600;">${donGiaNhap.toLocaleString("vi-VN")} đ</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Tổng tiền vốn:</td><td style="text-align: right; font-weight: 800; color: #dc2626;">${tongTien.toLocaleString("vi-VN")} đ</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 7px 0; color:#64748b;">Tồn kho hiện tại:</td><td style="text-align: right; font-weight: 700; color: #16a34a;">${tonKho} cái</td></tr>
        <tr><td style="padding: 7px 0; color:#64748b;">Trạng thái phiếu:</td><td style="text-align: right;">${nhanTrangThai}</td></tr>
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
    if (String(dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
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
    document.getElementById("import-id").value = phieu.id || phieu.slipId || maPhieu;
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
  var trangThai = document.getElementById("import-status") ? document.getElementById("import-status").value : "Tạm lưu";
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

  // 2. Nếu trạng thái là "Hoàn thành" -> Cộng hàng vào kho ngay
  if (trangThai === "Hoàn thành") {
    for (var j = 0; j < dsSp.length; j++) {
      if (String(dsSp[j].id) === String(maSpChon)) {
        var tonHienTai = Number(dsSp[j].stock !== undefined ? dsSp[j].stock : (dsSp[j].quantity || 0));
        dsSp[j].stock = tonHienTai + soLuongNhap;
        if (donGiaNhap > 0) {
          dsSp[j].costPrice = donGiaNhap;
          dsSp[j].cost = donGiaNhap;
        }
        if (dsSp[j].status === "hidden" && dsSp[j].stock > 0) {
          dsSp[j].status = "active";
        }
        break;
      }
    }
    luuDuLieuAdmin("sport_products", dsSp);
  }

  // 3. Lưu vào danh sách phiếu nhập sport_imports
  var dsNhap = layDuLieuAdmin("sport_imports");
  var tongTien = soLuongNhap * donGiaNhap;

  if (maPhieuDangSua) {
    // ĐANG SỬA PHIẾU CŨ: Cập nhật lại các thông tin của phiếu đó
    for (var k = 0; k < dsNhap.length; k++) {
      if (String(dsNhap[k].id || dsNhap[k].slipId) === String(maPhieuDangSua)) {
        dsNhap[k].productId = maSpChon;
        dsNhap[k].productName = tenSanPham;
        dsNhap[k].supplier = nhaCungCap;
        dsNhap[k].date = ngayNhap;
        dsNhap[k].totalQuantity = soLuongNhap;
        dsNhap[k].unitPrice = donGiaNhap;
        dsNhap[k].totalCost = tongTien;
        dsNhap[k].note = ghiChu;
        dsNhap[k].status = trangThai;
        break;
      }
    }
    if (typeof showToast === "function") {
      showToast("Đã cập nhật phiếu nhập #" + maPhieuDangSua, "success");
    } else {
      alert("Đã cập nhật phiếu nhập #" + maPhieuDangSua);
    }
  } else {
    // TẠO PHIẾU MỚI
    var maMoi = "PN-00" + (dsNhap.length + 1);
    dsNhap.push({
      id: maMoi,
      slipId: maMoi,
      productId: maSpChon,
      productName: tenSanPham,
      supplier: nhaCungCap || "Tổng Kho Thể Thao",
      date: ngayNhap || new Date().toISOString().split("T")[0],
      totalQuantity: soLuongNhap,
      unitPrice: donGiaNhap,
      totalCost: tongTien,
      note: ghiChu,
      creator: "Admin",
      status: trangThai
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
    if (String(dsNhap[i].id || dsNhap[i].slipId) === String(maPhieu)) {
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
    var phanTram = Number(p.profitPercent !== undefined ? p.profitPercent : 25);

    html += `
      <tr>
        <td><img src="${p.image || ''}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category || p.categoryId || "Khác"}</td>
        <td>${formatMoney(giaVon)}</td>
        <td><strong>${phanTram}%</strong></td>
        <td><strong style="color:#0284c7;">${formatMoney(p.price)}</strong></td>
        <td>
          <button type="button" class="btn-action btn-edit" onclick="moModalSuaGiaBan(${p.id})">Sửa Giá</button>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}
// ==============================================================================
// XỬ LÝ SỬA GIÁ BÁN & % LỢI NHUẬN RIÊNG BIỆT
// ==============================================================================
var maSpDangSuaGia = -1;
var giaVonHienTai = 0;

// 1. Mở popup Sửa Giá và điền dữ liệu sản phẩm
function moModalSuaGiaBan(maSp) {
  maSpDangSuaGia = maSp;
  var dsSp = layDuLieuAdmin("sport_products");
  var p = null;
  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSp) {
      p = dsSp[i];
      break;
    }
  }
  if (!p) return;

  // Cố định giá vốn gốc
  giaVonHienTai = Number(p.costPrice || p.cost || Math.round(p.price * 0.7));
  var phanTram = Number(p.profitPercent !== undefined ? p.profitPercent : 25);

  document.getElementById("pricing-prod-name").value = p.name;
  document.getElementById("pricing-cost-price").value = giaVonHienTai.toLocaleString("vi-VN") + " ₫";
  document.getElementById("pricing-profit-percent").value = phanTram;
  document.getElementById("pricing-sale-price").value = Number(p.price).toLocaleString("vi-VN") + " ₫";

  moModalAdmin("modal-pricing");
}

// 2. Tự động nhảy lại giá bán khi người dùng thay đổi % lợi nhuận
function tinhGiaBanTuDong() {
  var percent = Number(document.getElementById("pricing-profit-percent").value) || 0;
  // Công thức: Giá niêm yết = Giá vốn * (1 + % / 100)
  var giaMoi = Math.round(giaVonHienTai * (1 + percent / 100));
  // Làm tròn đến hàng nghìn (ví dụ 4.550.000)
  giaMoi = Math.round(giaMoi / 1000) * 1000;
  document.getElementById("pricing-sale-price").value = giaMoi.toLocaleString("vi-VN") + " ₫";
}

// 3. Lưu giá bán mới vào danh sách sản phẩm
function luuGiaBanMoi() {
  var percentMoi = Number(document.getElementById("pricing-profit-percent").value) || 0;
  // Tính lại giá mới chính xác
  var giaMoi = Math.round(giaVonHienTai * (1 + percentMoi / 100));
  giaMoi = Math.round(giaMoi / 1000) * 1000;

  var dsSp = layDuLieuAdmin("sport_products");
  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSpDangSuaGia) {
      dsSp[i].price = giaMoi;
      dsSp[i].profitPercent = percentMoi;
      dsSp[i].costPrice = giaVonHienTai; // Cố định vĩnh viễn giá vốn, không bao giờ bị đổi theo giá bán
      break;
    }
  }

  luuDuLieuAdmin("sport_products", dsSp);
  dongModalAdmin("modal-pricing");
  hienThiBangGiaBanAdmin();
  if (typeof showToast === "function") {
    showToast("Đã cập nhật giá bán thành công: " + giaMoi.toLocaleString("vi-VN") + " ₫", "success");
  }
}

function locGiaBanAdmin() {
  hienThiBangGiaBanAdmin();
}

function phanLoaiChuan(sp) {
  var str = ((sp.category || "") + " " + (sp.name || "")).toLowerCase();
  if (str.includes("giày") || str.includes("shoes") || str.includes("vaporfly") || str.includes("predator")) return "Giày Thể Thao";
  if (str.includes("áo") || str.includes("quần") || str.includes("dri-fit") || str.includes("gym")) return "Quần Áo Thể Thao";
  if (str.includes("vợt") || str.includes("bóng") || str.includes("cầu lông") || str.includes("tennis")) return "Dụng Cụ & Vợt";
  return "Balo & Phụ Kiện";
}


function hienThiBangTonKhoAdmin() {
  var dsSp = layDuLieuAdmin("sport_products");
  var tbody = document.getElementById("admin-inventory-tbody");
  if (!tbody) return;

  var loaiLoc = (document.getElementById("snapshotCategorySelect")?.value || "").toLowerCase();
  var tuKhoa = (document.getElementById("snapshotSearchInput")?.value || "").toLowerCase().trim();

  var tongTon = 0, soConHang = 0, soCanhBao = 0, soHetHang = 0;
  var html = "";

  for (var i = 0; i < dsSp.length; i++) {
    var p = dsSp[i];
    var maSP = p.code || ("SP-" + p.id);
    var loaiSP = phanLoaiChuan(p);
    var ton = Number(p.stock !== undefined ? p.stock : (p.quantity || 0));
    var giaVon = Number(p.costPrice || (p.price ? p.price * 0.7 : 0));

    tongTon += ton;
    if (ton === 0) soHetHang++;
    else if (ton <= 5) soCanhBao++;
    else soConHang++;

    if (loaiLoc && loaiSP.toLowerCase() !== loaiLoc) continue;
    if (tuKhoa && !maSP.toLowerCase().includes(tuKhoa) && !p.name.toLowerCase().includes(tuKhoa)) continue;

    var badgeTon = ton === 0 ? `<strong style="color:#dc2626;">0</strong>` : (ton <= 5 ? `<strong style="color:#ea580c;">${ton}</strong>` : `<strong>${ton}</strong>`);
    var statusBadge = ton === 0 ? `<span class="badge-status badge-danger">Hết hàng</span>` : (ton <= 5 ? `<span class="badge-status badge-warning">Cảnh báo</span>` : `<span class="badge-status badge-success">Bình thường</span>`);
// Nếu tồn kho <= 5 thì hiện nút "+ Nhập", ngược lại hiện nút "Xem"
    var nutThaoTac = "";

    if (ton <= 5) {
      // Bấm + Nhập: Gọi hàm chuyenSangNhapHang() và truyền mã sản phẩm
      nutThaoTac = '<button type="button" class="btn-action" style="background:#fee2e2; color:#dc2626; border:none; padding:5px 12px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="chuyenSangNhapHang(\'' + p.id + '\')">+ Nhập</button>';
    } else {
      // Bấm Xem: Gọi hàm xemChiTietTonKho() và truyền mã sản phẩm
      nutThaoTac = '<button type="button" class="btn-action" style="background:#e0f2fe; color:#0284c7; border:none; padding:5px 12px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="xemChiTietTonKho(\'' + p.id + '\')">Xem</button>';
    }
    html += `
      <div class="div-row-inventory">
        <div><span class="badge-code-pill">${maSP}</span></div>
        <div><strong>${p.name}</strong></div>
        <div style="color: #64748b;">${loaiSP}</div>
        <div>${giaVon.toLocaleString("vi-VN")} đ</div>
        <div>${badgeTon}</div>
        <div>${statusBadge}</div>
        <div style="text-align: right;">${nutThaoTac}</div>
      </div>
    `;
  }

  tbody.innerHTML = html;

  // Cập nhật 4 thẻ KPI
  if (document.getElementById("summaryTotalStock")) document.getElementById("summaryTotalStock").textContent = tongTon.toLocaleString("vi-VN");
  if (document.getElementById("summaryInStock")) document.getElementById("summaryInStock").textContent = soConHang;
  if (document.getElementById("summaryLowStock")) document.getElementById("summaryLowStock").textContent = soCanhBao;
  if (document.getElementById("summaryOutOfStock")) document.getElementById("summaryOutOfStock").textContent = soHetHang;
}

function doiTrangThaiSanPhamAdmin(maSp) {
  var dsSp = layDuLieuAdmin("sport_products");
  var tenSp = "";
  var trangThaiMoi = "active";
  var duocHien = true ;

  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSp) {
      tenSp = dsSp[i].name;
      if( dsSp[i].stock <= 0 ){
        dsSp[i].status = "hidden";
        duocHien = false ;
      }else{
        dsSp[i].status = dsSp[i].status === "hidden" ? "active" : "hidden";
      }
      trangThaiMoi = dsSp[i].status;
      break;
    }
  }

  // Lưu lại vào LocalStorage và vẽ lại bảng
  luuDuLieuAdmin("sport_products", dsSp);
  hienThiBangSanPhamAdmin();

  if (typeof showToast === "function") {
    if (trangThaiMoi === "active") {
      showToast(`Đã mở bán lại sản phẩm "${tenSp}"!`, "success");
    } else {
      if( duocHien ){
        showToast(`Đã ẩn sản phẩm "${tenSp}" khỏi cửa hàng!`, "warning");
      }else{
        showToast(`Số lượng sản phẩm "${tenSp}" trong kho không đủ!`, "warning");
      }
    }
  }
}


// ==============================================================================
// 1. HÀM CHUYỂN QUA LẠI GIỮA 2 TAB (BẤM NÚT TRÊN ĐẦU TRANG)
// ==============================================================================
function chuyenTabTonKho(tenTab) {
  var khungTab1 = document.getElementById("viewSnapshotSection");
  var khungTab2 = document.getElementById("viewMovementSection");
  var nutTab1 = document.getElementById("tabBtnSnapshot");
  var nutTab2 = document.getElementById("tabBtnMovement");

  if (tenTab === "snapshot") {
    // Mở Tab 1: Tồn kho theo loại
    khungTab1.style.display = "block";
    khungTab2.style.display = "none";
    nutTab1.classList.add("active");
    nutTab2.classList.remove("active");
    hienThiBangTonKhoAdmin();
  } else {
    // Mở Tab 2: Nhập - Xuất - Tồn
    khungTab1.style.display = "none";
    khungTab2.style.display = "block";
    nutTab1.classList.remove("active");
    nutTab2.classList.add("active");
    hienThiNhapXuatTon();
  }
}

// ==============================================================================
// 3. CÁC THAO TÁC CỦA TAB 1 (XEM CHI TIẾT & NHẬP HÀNG NHANH)
// ==============================================================================
function xemChiTietTonKho(maSp) {
  var dsSp = layDuLieuAdmin("sport_products");
  var sp = null;
  for (var i = 0; i < dsSp.length; i++) {
    if (String(dsSp[i].id) === String(maSp)) {
      sp = dsSp[i];
      break;
    }
  }
  if (!sp) return;

  var ton = Number(sp.stock !== undefined ? sp.stock : 0);
  var giaVon = Number(sp.costPrice || sp.cost || Math.round(sp.price * 0.7));

  var modalBody = document.getElementById("inv-detail-body");
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
        <img src="${sp.image || ''}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px;">${sp.name}</h4>
          <span class="badge-code-pill">${sp.code || ('SP-' + sp.id)}</span>
          <span style="color:#64748b; font-size:12px; margin-left:8px;">Hãng: ${sp.brand || 'Chính hãng'}</span>
        </div>
      </div>
      <table style="width: 100%; font-size: 13px;">
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; color:#64748b;">Giá vốn:</td><td style="text-align: right; font-weight: 700;">${giaVon.toLocaleString('vi-VN')} đ</td></tr>
        <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; color:#64748b;">Giá bán niêm yết:</td><td style="text-align: right; font-weight: 700; color: #0284c7;">${Number(sp.price || 0).toLocaleString('vi-VN')} đ</td></tr>
        <tr><td style="padding: 6px 0; color:#64748b;">Tồn kho hiện tại:</td><td style="text-align: right; font-weight: 800; font-size: 15px; color: ${ton <= 5 ? '#dc2626' : '#16a34a'};">${ton} cái</td></tr>
      </table>
    `;
  }

  var modal = document.getElementById("modal-inventory-detail");
  if (modal) modal.style.display = "flex";
}

function dongPopupChiTiet() {
  var modal = document.getElementById("modal-inventory-detail");
  if (modal) modal.style.display = "none";
}

// ==============================================================================
// 4. HÀM HIỂN THỊ TAB 2: NHẬP – XUẤT – TỒN (ẢNH 2)
// ==============================================================================
function napDanhSachSanPhamVaoSelect() {
  var selectSP = document.getElementById("movementProductSelect");
  if (!selectSP) return;

  if (selectSP.options.length <= 1) {
    var dsSp = layDuLieuAdmin("sport_products");
    var html = '<option value="">Tất cả sản phẩm</option>';
    for (var i = 0; i < dsSp.length; i++) {
      var sp = dsSp[i];
      var ma = sp.code || ("SP-" + sp.id);
      html += '<option value="' + sp.id + '">' + ma + ' - ' + sp.name + '</option>';
    }
    selectSP.innerHTML = html;
  }
}

function hienThiNhapXuatTon() {
  napDanhSachSanPhamVaoSelect();

  var selectSP = document.getElementById("movementProductSelect");
  var oTuNgay = document.getElementById("movementDateFrom");
  var oDenNgay = document.getElementById("movementDateTo");

  var maSPChon = selectSP ? selectSP.value.trim() : "";
  var tuNgay = oTuNgay && oTuNgay.value ? oTuNgay.value : "2026-10-01";
  var denNgay = oDenNgay && oDenNgay.value ? oDenNgay.value : "2026-10-31";

  var dsSp = layDuLieuAdmin("sport_products");
  var dsNhap = layDuLieuAdmin("sport_imports");
  var dsDon = layDuLieuAdmin("sport_orders");

  // 1. Tính tổng tồn kho hiện tại
  var tonHienTai = 0;
  for (var i = 0; i < dsSp.length; i++) {
    var p = dsSp[i];
    if (maSPChon === "" || String(p.id) === String(maSPChon)) {
      tonHienTai = tonHienTai + Number(p.stock !== undefined ? p.stock : 0);
    }
  }

  // 2. Thu thập danh sách các phiếu nhập
  var danhSachGD = [];
  for (var j = 0; j < dsNhap.length; j++) {
    var phieu = dsNhap[j];
    var ngayPhieu = phieu.date || "2026-10-15";
    var maPhieu = phieu.id || phieu.slipId || ("PN-" + (j + 1));
    var soLuongNhap = Number(phieu.totalQuantity || phieu.quantity || 15);

    if (maSPChon === "" || String(phieu.productId) === String(maSPChon)) {
      danhSachGD.push({
        ngay: ngayPhieu,
        ma: maPhieu,
        loai: "Nhập kho",
        slNhap: soLuongNhap,
        slXuat: 0
      });
    }
  }

  // 3. Thu thập danh sách các đơn hàng xuất bán
  for (var k = 0; k < dsDon.length; k++) {
    var don = dsDon[k];
    if (don.status !== "Đã hủy") {
      var ngayDon = (don.createdAt ? don.createdAt.split("T")[0] : don.date) || "2026-10-20";
      var maDon = don.orderId || don.id || ("DH-" + (k + 1));
      var slXuat = 1;

      if (maSPChon === "") {
        slXuat = 1;
      }

      danhSachGD.push({
        ngay: ngayDon,
        ma: maDon,
        loai: "Xuất bán",
        slNhap: 0,
        slXuat: slXuat
      });
    }
  }

  // 4. Lọc các giao dịch nằm trong khoảng từ ngày -> đến ngày
  var tongNhap = 0;
  var tongXuat = 0;
  var gdTrongKy = [];

  for (var n = 0; n < danhSachGD.length; n++) {
    var gd = danhSachGD[n];
    if (gd.ngay >= tuNgay && gd.ngay <= denNgay) {
      gdTrongKy.push(gd);
      tongNhap = tongNhap + gd.slNhap;
      tongXuat = tongXuat + gd.slXuat;
    }
  }

  var tonCuoiKy = tonHienTai;
  var tonDauKy = tonCuoiKy - tongNhap + tongXuat;
  if (tonDauKy < 0) tonDauKy = 0;

  // Hiển thị lên 4 thẻ tóm tắt của Tab 2
  if (document.getElementById("movementBeginningStock")) document.getElementById("movementBeginningStock").textContent = tonDauKy.toLocaleString("vi-VN");
  if (document.getElementById("movementTotalImport")) document.getElementById("movementTotalImport").textContent = "+" + tongNhap.toLocaleString("vi-VN");
  if (document.getElementById("movementTotalExport")) document.getElementById("movementTotalExport").textContent = "-" + tongXuat.toLocaleString("vi-VN");
  if (document.getElementById("movementEndingStock")) document.getElementById("movementEndingStock").textContent = tonCuoiKy.toLocaleString("vi-VN");

  // 5. Vẽ bảng danh sách ra màn hình
  var bang = document.getElementById("movementTableBody");
  if (!bang) return;

  var htmlBang = "";
  var tonLuyKe = tonDauKy;

  htmlBang += '<div style="display: grid; grid-template-columns: 120px 140px 1.5fr 120px 120px 140px; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; background: #fffbeb; font-weight: 700; align-items: center; font-size: 13px;">';
  htmlBang += '  <div>' + tuNgay + '</div>';
  htmlBang += '  <div><span class="badge-code-pill" style="background:#fef3c7; color:#d97706;">ĐẦU KỲ</span></div>';
  htmlBang += '  <div>Tồn ban đầu</div>';
  htmlBang += '  <div style="text-align: center; color:#94a3b8;">—</div>';
  htmlBang += '  <div style="text-align: center; color:#94a3b8;">—</div>';
  htmlBang += '  <div style="text-align: center; font-weight: 800;">' + tonDauKy + ' cái</div>';
  htmlBang += '</div>';

  for (var r = 0; r < gdTrongKy.length; r++) {
    var row = gdTrongKy[r];
    tonLuyKe = tonLuyKe + row.slNhap - row.slXuat;

    var cotNhap = row.slNhap > 0 ? ('<strong style="color:#16a34a;">+' + row.slNhap + '</strong>') : '<span style="color:#cbd5e1;">—</span>';
    var cotXuat = row.slXuat > 0 ? ('<strong style="color:#ea580c;">-' + row.slXuat + '</strong>') : '<span style="color:#cbd5e1;">—</span>';

    htmlBang += '<div style="display: grid; grid-template-columns: 120px 140px 1.5fr 120px 120px 140px; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; align-items: center; font-size: 13px;">';
    htmlBang += '  <div>' + row.ngay + '</div>';
    htmlBang += '  <div><span class="badge-code-pill">' + row.ma + '</span></div>';
    htmlBang += '  <div>' + row.loai + '</div>';
    htmlBang += '  <div style="text-align: center;">' + cotNhap + '</div>';
    htmlBang += '  <div style="text-align: center;">' + cotXuat + '</div>';
    htmlBang += '  <div style="text-align: center; font-weight: 700;">' + tonLuyKe + ' cái</div>';
    htmlBang += '</div>';
  }

  htmlBang += '<div style="display: grid; grid-template-columns: 120px 140px 1.5fr 120px 120px 140px; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; background: #f0fdf4; font-weight: 700; align-items: center; font-size: 13px;">';
  htmlBang += '  <div>' + denNgay + '</div>';
  htmlBang += '  <div><span class="badge-code-pill" style="background:#dcfce7; color:#15803d;">CUỐI KỲ</span></div>';
  htmlBang += '  <div>Tồn cuối kỳ</div>';
  htmlBang += '  <div style="text-align: center; color:#16a34a;">+' + tongNhap + '</div>';
  htmlBang += '  <div style="text-align: center; color:#ea580c;">-' + tongXuat + '</div>';
  htmlBang += '  <div style="text-align: center; font-weight: 800; color:#15803d;">' + tonCuoiKy + ' cái</div>';
  htmlBang += '</div>';

  bang.innerHTML = htmlBang;
}

function renderUserProfile() {
  hienThiThongTinUser();
  hienThiDonHang();
  hienThiDiaChi();
  hienThiYeuThich();
  hienThiFaq();
  chuyenTab("overview");
  let params = new URLSearchParams(window.location.search) ;
  let tab = params.get("tab") ;
  if( tab ){
    chuyenTab("orders");
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderUserProfile();
});

