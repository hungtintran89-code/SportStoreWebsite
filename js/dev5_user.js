
function layUserHienTai() {
  var user = null;
  try {
    user = JSON.parse(localStorage.getItem('sport_user'));
  } catch (e) {
    user = null;
  }
  // Nếu chưa đăng nhập nhưng có danh sách khách mẫu, lấy người đầu tiên để xem thử giao diện
  if (!user && typeof customers !== 'undefined' && customers.length > 0) {
    user = customers[0];
  }
  return user;
}

function chuyenTab(tenTab) {
  // Bước 1: Bỏ kích hoạt ở tất cả các nút tab
  var cacNut = document.querySelectorAll('.dev5-sidebar .dev5-tab');
  for (var i = 0; i < cacNut.length; i++) {
    cacNut[i].classList.remove('is-active');
  }

  // Bước 2: Ẩn tất cả các bảng nội dung tab
  var cacBang = document.querySelectorAll('.dev5-content .dev5-panel');
  for (var i = 0; i < cacBang.length; i++) {
    cacBang[i].classList.remove('is-active');
  }

  // Bước 3: Đánh dấu nút vừa bấm là đang chọn
  var nutChon = document.querySelector('.dev5-tab[data-tab="' + tenTab + '"]');
  if (nutChon) {
    nutChon.classList.add('is-active');
  }

  // Bước 4: Hiện bảng nội dung tương ứng
  var bangChon = document.querySelector('.dev5-panel[data-panel="' + tenTab + '"]');
  if (bangChon) {
    bangChon.classList.add('is-active');
  }
}

function hienThiThongTinUser() {
  var user = layUserHienTai();
  if (!user) return;

  // Hiển thị tên lên trang
  var cacTheTen = document.querySelectorAll('[data-user-name]');
  for (var i = 0; i < cacTheTen.length; i++) {
    cacTheTen[i].textContent = user.name || 'Hội viên';
  }

  // Hiển thị email
  var theEmail = document.querySelector('[data-user-email]');
  if (theEmail) {
    theEmail.textContent = 'Email: ' + (user.email || 'Chưa cập nhật');
  }

  // Hiển thị số điện thoại
  var theSdt = document.querySelector('[data-user-phone]');
  if (theSdt) {
    theSdt.textContent = 'SĐT: ' + (user.phone || 'Chưa cập nhật');
  }

  // Hiển thị hạng thành viên
  var theTier = document.querySelector('[data-user-tier]');
  if (theTier) {
    theTier.textContent = user.tier || 'Gold Elite';
  }

  var theRole = document.querySelector('[data-user-role]');
  if (theRole) {
    theRole.textContent = 'Thành viên ' + (user.tier || 'Gold Elite');
  }

  // Đảm bảo nút "Chỉnh sửa hồ sơ" hiển thị
  var nutSua = document.querySelector('[data-edit-profile-btn]');
  if (nutSua) {
    nutSua.classList.remove('dev5-hidden');
  }
}

function moFormSuaHoSo() {
  var form = document.querySelector('[data-profile-form]');
  if (!form) return;

  var user = layUserHienTai();
  if (user) {
    if (form.querySelector('[name="profileName"]')) {
      form.querySelector('[name="profileName"]').value = user.name || '';
    }
    if (form.querySelector('[name="profilePhone"]')) {
      form.querySelector('[name="profilePhone"]').value = user.phone || '';
    }
    if (form.querySelector('[name="profileEmail"]')) {
      form.querySelector('[name="profileEmail"]').value = user.email || '';
    }
  }
  form.classList.remove('dev5-hidden');
}

function dongFormSuaHoSo() {
  var form = document.querySelector('[data-profile-form]');
  if (form) {
    form.classList.add('dev5-hidden');
  }
}

function luuHoSo(event) {
  event.preventDefault(); // Chặn trang web tải lại khi submit form

  var form = document.querySelector('[data-profile-form]');
  if (!form) return;

  var user = layUserHienTai() || {};
  user.name = form.querySelector('[name="profileName"]').value;
  user.phone = form.querySelector('[name="profilePhone"]').value;
  user.email = form.querySelector('[name="profileEmail"]').value;

  var matKhauMoi = form.querySelector('[name="profilePassword"]').value;
  if (matKhauMoi && matKhauMoi.trim() !== '') {
    user.password = matKhauMoi;
  }

  // Lưu thông tin mới vào LocalStorage
  localStorage.setItem('sport_user', JSON.stringify(user));

  alert('Cập nhật thông tin cá nhân thành công!');
  dongFormSuaHoSo();
  hienThiThongTinUser();
}

function hienThiDonHang() {
  var user = layUserHienTai();
  var hopChua = document.querySelector('[data-orders]');
  if (!hopChua) return;

  if (!user) {
    hopChua.innerHTML = '<p class="dev5-muted">Vui lòng đăng nhập để xem đơn hàng.</p>';
    return;
  }

  // Lấy đơn hàng từ LocalStorage hoặc file orders.js
  var tatCaDon = [];
  try {
    tatCaDon = JSON.parse(localStorage.getItem('sport_orders')) || [];
  } catch (e) {
    tatCaDon = [];
  }
  if (tatCaDon.length === 0 && typeof orders !== 'undefined') {
    tatCaDon = orders;
  }

  // Tìm các đơn hàng của riêng người này bằng vòng lặp for
  var donCuaUser = [];
  for (var i = 0; i < tatCaDon.length; i++) {
    var d = tatCaDon[i];
    var sId = user.customerId ;

    var trungId = (d.customerId && d.customerId === sId) || (d.userId && d.userId === sId);
    var trungEmail = (d.email && d.email.toLowerCase() === (user.email || '').toLowerCase());
    var trungSdt = (d.phone && d.phone === user.phone);

    if (trungId || trungEmail || trungSdt) {
      donCuaUser.push(d);
    }
  }

  // Cập nhật số lượng đơn lên thẻ thống kê ở Tab 1
  var theSoDon = document.querySelector('[data-order-count]');
  if (theSoDon) {
    theSoDon.textContent = donCuaUser.length;
  }

  // Nếu không có đơn nào
  if (donCuaUser.length === 0) {
    hopChua.innerHTML = '<p class="dev5-muted">Bạn chưa có đơn hàng nào.</p>';
    return;
  }

  // Vẽ danh sách đơn hàng
  var danhSachBuoc = ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Đã giao'];
  var html = '';

  for (var j = 0; j < donCuaUser.length; j++) {
    var don = donCuaUser[j];
    var maDon = don.orderId || don.id || ('ĐH-' + (j + 1));
    var ngayDat = don.date || 'Hôm nay';
    var trangThai = don.status || 'Mới đặt';
    var tongTien = don.total || 0;

    // Lấy tên món hàng trong đơn
    var tenMon = 'Sản phẩm thể thao';
    if (don.items && don.items.length > 0) {
      var monDau = don.items[0];
      var tenSanPham = monDau.name || monDau.productName || 'Sản phẩm';
      if (don.items.length > 1) {
        tenMon = tenSanPham + ' (+' + (don.items.length - 1) + ' món khác)';
      } else {
        tenMon = tenSanPham;
      }
    }

    // Xác định số bước hoàn thành
    var buocDaXong = 1; // Mặc định bước 1: Đặt hàng
    if (trangThai === 'Đã giao') {
      buocDaXong = 4;
    } else if (trangThai === 'Đang giao') {
      buocDaXong = 3;
    } else if (trangThai === 'Đã xử lý' || trangThai === 'Đã xác nhận') {
      buocDaXong = 2;
    }

    // Vẽ thanh 4 bước tiến trình
    var chuoiTienTrinh = '';
    for (var k = 0; k < danhSachBuoc.length; k++) {
      var classXong = (k < buocDaXong) ? 'is-done' : '';
      chuoiTienTrinh += '<span class="dev5-step ' + classXong + '">' + danhSachBuoc[k] + '</span>';
    }

    // Nối vào chuỗi HTML
    html += '<article class="dev5-order-card">';
    html += '  <div class="dev5-order-top">';
    html += '    <div>';
    html += '      <strong>' + maDon + '</strong>';
    html += '      <div class="dev5-muted">' + ngayDat + ' · ' + tenMon + '</div>';
    html += '    </div>';
    html += '    <span class="dev5-status">' + trangThai + '</span>';
    html += '  </div>';
    html += '  <strong style="color: #059669; font-size: 1.1rem; display: block; margin: 10px 0;">' + formatMoney(tongTien) + '</strong>';
    html += '  <div class="dev5-timeline">' + chuoiTienTrinh + '</div>';
    html += '</article>';
  }

  hopChua.innerHTML = html;
}

function layDanhSachDiaChi() {
  var user = layUserHienTai();
  if (!user) return [];

  var key = 'sport_addresses_' + (user.id || user.customerId || 'user');
  var list = [];
  try {
    list = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    list = [];
  }

  // Nếu chưa có địa chỉ nào, lấy địa chỉ mặc định trong hồ sơ
  if (list.length === 0 && user.address && user.address !== 'Chưa cập nhật') {
    list.push({
      recipient: user.name || 'Người nhận',
      phone: user.phone || '',
      line: user.address,
      district: '',
      city: '',
      isDefault: true
    });
    localStorage.setItem(key, JSON.stringify(list));
  }
  return list;
}

function hienThiDiaChi() {
  var user = layUserHienTai();
  var hopChua = document.querySelector('[data-addresses]');
  if (!hopChua) return;

  var danhSach = layDanhSachDiaChi();

  // Cập nhật số lượng địa chỉ lên Tab 1
  var theSoDiaChi = document.querySelector('[data-address-count]');
  if (theSoDiaChi) {
    theSoDiaChi.textContent = danhSach.length;
  }

  if (danhSach.length === 0) {
    hopChua.innerHTML = '<p class="dev5-muted">Bạn chưa lưu địa chỉ nhận hàng nào. Bấm nút "+ Thêm địa chỉ" ở trên để tạo.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < danhSach.length; i++) {
    var dc = danhSach[i];
    var nhanMacDinh = dc.isDefault ? ' <span style="color:#059669; font-size:0.85rem;">(Mặc định)</span>' : '';
    var diaChiChiTiet = dc.line;
    if (dc.district) diaChiChiTiet += ', ' + dc.district;
    if (dc.city) diaChiChiTiet += ', ' + dc.city;

    html += '<article class="dev5-address-card" style="margin-bottom: 12px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">';
    html += '  <div class="dev5-address-top">';
    html += '    <strong>Địa chỉ ' + (i + 1) + nhanMacDinh + '</strong>';
    html += '  </div>';
    html += '  <div class="dev5-address-line" style="margin-top: 8px; line-height: 1.6;">';
    html += '    <div><strong>Người nhận:</strong> ' + (dc.recipient || user.name) + '</div>';
    html += '    <div><strong>Số điện thoại:</strong> ' + (dc.phone || user.phone) + '</div>';
    html += '    <div><strong>Địa chỉ:</strong> ' + diaChiChiTiet + '</div>';
    html += '  </div>';
    html += '  <div style="margin-top: 10px;">';
    html += '    <button class="dev5-secondary-button" type="button" onclick="xoaDiaChi(' + i + ')">Xóa địa chỉ này</button>';
    html += '  </div>';
    html += '</article>';
  }

  hopChua.innerHTML = html;
}

function moFormThemDiaChi() {
  var form = document.querySelector('[data-address-form]');
  if (form) {
    form.reset();
    var user = layUserHienTai();
    if (user) {
      if (form.querySelector('[name="recipient"]')) form.querySelector('[name="recipient"]').value = user.name || '';
      if (form.querySelector('[name="phone"]')) form.querySelector('[name="phone"]').value = user.phone || '';
    }
    form.classList.remove('dev5-hidden');
  }
}

function dongFormDiaChi() {
  var form = document.querySelector('[data-address-form]');
  if (form) {
    form.classList.add('dev5-hidden');
  }
}

function luuDiaChi(event) {
  event.preventDefault();

  var form = document.querySelector('[data-address-form]');
  if (!form) return;

  var user = layUserHienTai();
  if (!user) return;

  var danhSach = layDanhSachDiaChi();
  var diaChiMoi = {
    recipient: form.querySelector('[name="recipient"]').value,
    phone: form.querySelector('[name="phone"]').value,
    line: form.querySelector('[name="line"]').value,
    district: form.querySelector('[name="district"]').value,
    city: form.querySelector('[name="city"]').value,
    isDefault: (danhSach.length === 0)
  };

  danhSach.push(diaChiMoi);
  var key = 'sport_addresses_' + (user.id || user.customerId || 'user');
  localStorage.setItem(key, JSON.stringify(danhSach));

  alert('Đã thêm địa chỉ giao hàng thành công!');
  dongFormDiaChi();
  hienThiDiaChi();
}

function xoaDiaChi(viTriCanXoa) {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

  var user = layUserHienTai();
  if (!user) return;

  var danhSach = layDanhSachDiaChi();
  var danhSachMoi = [];
  for (var i = 0; i < danhSach.length; i++) {
    if (i !== viTriCanXoa) {
      danhSachMoi.push(danhSach[i]);
    }
  }

  var key = 'sport_addresses_' + (user.id || user.customerId || 'user');
  localStorage.setItem(key, JSON.stringify(danhSachMoi));

  hienThiDiaChi();
}

function layDanhSachYeuThich() {
  var list = [];
  try {
    list = JSON.parse(localStorage.getItem('sport_wishlist')) || [];
  } catch (e) {
    list = [];
  }

  // Nếu rỗng, tạo sẵn 2 sản phẩm mẫu từ kho hàng products.js để giao diện không bị trống
  if (list.length === 0 && typeof products !== 'undefined' && products.length >= 2) {
    list = [
      {
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
        tag: products[0].category || 'Thể thao',
        image: products[0].image || products[0].img
      },
      {
        id: products[1].id,
        name: products[1].name,
        price: products[1].price,
        tag: products[1].category || 'Thể thao',
        image: products[1].image || products[1].img
      }
    ];
    localStorage.setItem('sport_wishlist', JSON.stringify(list));
  }
  return list;
}

function hienThiYeuThich() {
  var hopChua = document.querySelector('[data-wishlist]');
  if (!hopChua) return;

  var danhSach = layDanhSachYeuThich();

  // Cập nhật số lượng lên Tab 1
  var theSoYeuThich = document.querySelector('[data-wishlist-count]');
  if (theSoYeuThich) {
    theSoYeuThich.textContent = danhSach.length;
  }

  if (danhSach.length === 0) {
    hopChua.innerHTML = '<p class="dev5-muted">Danh sách yêu thích của bạn đang trống.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < danhSach.length; i++) {
    var sp = danhSach[i];
    var linkAnh = sp.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

    html += '<article class="dev5-wishlist-item" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fff;">';
    html += '  <img src="' + linkAnh + '" alt="' + sp.name + '" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;">';
    html += '  <span class="dev5-muted" style="font-size: 0.85rem; color: #64748b;">' + (sp.tag || 'Sản phẩm') + '</span>';
    html += '  <h3 style="font-size: 1rem; margin: 6px 0; color: #1e293b;">' + sp.name + '</h3>';
    html += '  <div class="dev5-price" style="font-weight: bold; color: #dc2626; margin-bottom: 10px;">' + formatMoney(sp.price) + '</div>';
    html += '  <button class="dev5-secondary-button" type="button" onclick="xoaYeuThich(' + sp.id + ')">Xóa yêu thích</button>';
    html += '</article>';
  }

  hopChua.innerHTML = html;
}

function xoaYeuThich(idCanXoa) {
  var danhSach = layDanhSachYeuThich();
  var danhSachMoi = [];
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].id != idCanXoa) {
      danhSachMoi.push(danhSach[i]);
    }
  }
  localStorage.setItem('sport_wishlist', JSON.stringify(danhSachMoi));
  hienThiYeuThich();
}

function hienThiFaq() {
  var hopChua = document.querySelector('[data-faq]');
  if (!hopChua) return;

  var danhSachFaq = [];
  if (typeof faqs !== 'undefined' && Array.isArray(faqs)) {
    danhSachFaq = faqs;
  }

  if (danhSachFaq.length === 0) {
    hopChua.innerHTML = '<p class="dev5-muted">Chưa có câu hỏi hỗ trợ nào.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < danhSachFaq.length; i++) {
    var cauHoi = danhSachFaq[i].question || danhSachFaq[i].q || '';
    var traLoi = danhSachFaq[i].answer || danhSachFaq[i].a || '';
    var classMo = (i === 0) ? 'is-open' : ''; // Mặc định mở câu hỏi đầu tiên

    html += '<article class="dev5-faq-item ' + classMo + '">';
    html += '  <button class="dev5-faq-question" type="button" onclick="dongMoFaq(this)">';
    html += '    <span>' + cauHoi + '</span>';
    html += '    <span>＋</span>';
    html += '  </button>';
    html += '  <div class="dev5-faq-answer">' + traLoi + '</div>';
    html += '</article>';
  }

  hopChua.innerHTML = html;
}

// Hàm bật / tắt câu trả lời FAQ
function dongMoFaq(nutBam) {
  var theCha = nutBam.parentElement;
  if (theCha) {
    theCha.classList.toggle('is-open');
  }
}

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

function renderUserProfile() {

  let tab =

  hienThiThongTinUser();
  hienThiDonHang();
  hienThiDiaChi();
  hienThiYeuThich();
  hienThiFaq();
}

document.addEventListener('DOMContentLoaded', function () {
  renderUserProfile();
});
