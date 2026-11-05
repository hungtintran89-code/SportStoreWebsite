function dangXuat() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất hoặc đổi tài khoản?')) {
    localStorage.removeItem('sport_user');
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
    var classCardExtra = "";
    var classHuyHieuExtra = "";
    var classGiaExtra = "order-price-normal";
    var chuoiTienTrinh = "";

    // 1. NẾU LÀ ĐƠN BỊ HỦY -> ĐỎ TOÀN BỘ Ô
    if (trangThai === "Đã hủy" || trangThai === "cancelled") {
      // Đỏ toàn bộ khung: nền đỏ nhạt + viền đỏ + bóng đỏ nhẹ
      classCardExtra = "order-card-cancelled";
      // Nhãn "Đã hủy" màu đỏ
      classHuyHieuExtra = "order-badge-cancelled";
      // Giá tiền màu đỏ
      classGiaExtra = "order-price-cancelled";
      // Thanh thông báo đơn bị hủy
      chuoiTienTrinh = '<span class="dev5-step order-step-cancelled">❌ Đơn hàng này đã bị hủy</span>';
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

    html += '<article class="dev5-order-card ' + classCardExtra + '">';
    html += '  <div class="dev5-order-top">';
    html += '    <div>';
    html += '      <strong>' + maDon + '</strong>';
    html += '      <div class="dev5-muted">' + ngayDat + ' · ' + tenMon + '</div>';
    html += '    </div>';
    html += '    <span class="dev5-status ' + classHuyHieuExtra + '">' + trangThai + '</span>';
    html += '  </div>';
    html += '  <div class="order-card-middle">';
    html += '    <strong class="dev5-order-price ' + classGiaExtra + '">' + formatMoney(tongTien) + '</strong>';
    html += '    <button type="button" class="dev5-secondary-button btn-view-order-detail" onclick="xemChiTietDon(\'' + maDon + '\')">🔍 Xem chi tiết</button>';
    html += '  </div>';
    html += '  <div class="dev5-timeline">' + chuoiTienTrinh + '</div>';
    html += '</article>';
  }
  khungDonHang.innerHTML = html;
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

    html += '<article class="dev5-address-card">';
    html += '  <div class="dev5-address-top">';
    html += '    <strong>Địa chỉ nhận hàng ' + (i + 1) + '</strong>';
    html += '  </div>';
    html += '  <div class="dev5-address-line">';
    html += '    <div><strong>Người nhận:</strong> ' + dc.recipient + '</div>';
    html += '    <div><strong>SĐT:</strong> ' + dc.phone + '</div>';
    html += '    <div><strong>Địa chỉ:</strong> ' + diaChiChiTiet + '</div>';
    html += '  </div>';
    html += '  <div class="dev5-address-actions">';
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

function hienThiYeuThich() {
  var khung = document.querySelector("[data-wishlist]");
  if (!khung) return;

  var danhSach = layDanhSachWishlist();

  // Cập nhật số lượng yêu thích lên ô thống kê ở Tab 1
  var theDemWishlist = document.querySelector("[data-wishlist-count]");
  if (theDemWishlist) {
    theDemWishlist.textContent = danhSach.length;
  }

  // Nếu chưa có món yêu thích nào -> Hiển thị Empty State đẹp mắt
  if (danhSach.length === 0) {
    khung.innerHTML = `
      <div class="dev5-wishlist-empty">
        <div class="wishlist-empty-icon">🤍</div>
        <h4 class="wishlist-empty-title">Danh sách yêu thích của bạn đang trống</h4>
        <p class="wishlist-empty-desc">Hãy dạo qua các bộ sưu tập và bấm vào nút biểu tượng trái tim để lưu lại những sản phẩm ưng ý mua sau nhé!</p>
        <a href="products.html" class="btn-sport btn-primary btn-wishlist-explore">
          🏃 Khám Phá Sản Phẩm Ngay
        </a>
      </div>
    `;
    return;
  }

  var html = "";
  for (var i = 0; i < danhSach.length; i++) {
    var sp = danhSach[i];
    var hinhAnh = sp.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400";
    var brandOrCat = (sp.brand || sp.category || "Thể Thao").toUpperCase();

    html += '<article class="dev5-wishlist-item">';
    html += '  <div class="dev5-wishlist-thumb-wrap">';
    html += '    <img src="' + hinhAnh + '" alt="' + sp.name + '" class="dev5-wishlist-thumb">';
    html += '  </div>';
    html += '  <span class="dev5-wishlist-cat">' + brandOrCat + '</span>';
    html += '  <h3 class="dev5-wishlist-title" title="' + sp.name + '">' + sp.name + '</h3>';
    html += '  <div class="dev5-wishlist-price">' + formatMoney(sp.price) + '</div>';
    html += '  <div class="dev5-wishlist-actions">';
    html += '    <button type="button" class="btn-sport btn-primary btn-wishlist-buy" onclick="themVaoGioTuWishlist(\'' + sp.id + '\')">🛒 Mua Ngay</button>';
    html += '    <button type="button" class="btn-sport btn-outline btn-wishlist-remove" onclick="xoaYeuThich(\'' + sp.id + '\')" title="Bỏ yêu thích">🗑️</button>';
    html += '  </div>';
    html += '</article>';
  }

  khung.innerHTML = html;
}

function xoaYeuThich(idCanXoa) {
  var danhSach = layDanhSachWishlist();
  var danhSachMoi = [];
  var tenSp = "sản phẩm";

  for (var i = 0; i < danhSach.length; i++) {
    if (String(danhSach[i].id) !== String(idCanXoa)) {
      danhSachMoi.push(danhSach[i]);
    } else {
      tenSp = danhSach[i].name || tenSp;
    }
  }

  luuDanhSachWishlist(danhSachMoi);
  if (typeof showToast === "function") {
    showToast("🤍 Đã bỏ '" + tenSp + "' khỏi danh sách yêu thích.", "info");
  }
  hienThiYeuThich();
}
// ============================================================
// DEV 5 - DỮ LIỆU FAQ & CHÍNH SÁCH HỖ TRỢ
// ============================================================

function hienThiFaq() {
  var khung = document.querySelector("[data-faq]");

  if (!khung) return;

  var html = `
    <div class="dev5-support-layout">

      <!-- MENU CHÍNH SÁCH BÊN TRÁI -->
      <aside class="dev5-support-menu">

        <h3 class="dev5-support-menu-title">
          Hỗ Trợ &amp; Chính Sách
        </h3>

        <nav class="dev5-support-nav" aria-label="Danh mục hỗ trợ">
  `;

  // Tạo các nút danh mục
  for (var i = 0; i < DEV5_SUPPORT_DATA.length; i++) {
    var muc = DEV5_SUPPORT_DATA[i];

    html += `
      <button
        type="button"
        class="dev5-support-nav-btn"
        data-support-id="${muc.id}"
        onclick="chonMucHoTro('${muc.id}')"
      >
        <span class="dev5-support-nav-icon">${muc.icon}</span>
        <span>${muc.label}</span>
      </button>
    `;
  }

  html += `
        </nav>
      </aside>

      <!-- NỘI DUNG CHÍNH BÊN PHẢI -->
      <div
        class="dev5-support-content"
        id="dev5-support-content"
      ></div>

    </div>
  `;

  khung.innerHTML = html;

  // Mặc định mở chính sách bảo hành
  chonMucHoTro("warranty");
}
// ============================================================
// CHUYỂN ĐỔI NỘI DUNG KHI CHỌN DANH MỤC
// ============================================================

function chonMucHoTro(idMuc) {
  var khung = document.querySelector("[data-faq]");

  if (!khung) return;

  var mucDuocChon = null;

  // Tìm danh mục theo ID
  for (var i = 0; i < DEV5_SUPPORT_DATA.length; i++) {
    if (DEV5_SUPPORT_DATA[i].id === idMuc) {
      mucDuocChon = DEV5_SUPPORT_DATA[i];
      break;
    }
  }

  if (!mucDuocChon) return;

  // Cập nhật trạng thái active của menu
  var cacNut = khung.querySelectorAll("[data-support-id]");

  for (var j = 0; j < cacNut.length; j++) {
    var dangChon =
      cacNut[j].getAttribute("data-support-id") === idMuc;

    if (dangChon) {
      cacNut[j].classList.add("is-active");
      cacNut[j].setAttribute("aria-current", "page");
    } else {
      cacNut[j].classList.remove("is-active");
      cacNut[j].removeAttribute("aria-current");
    }
  }

  // Tạo phần tiêu đề nội dung
  var html = `
    <div class="dev5-support-article">

      <div class="dev5-support-article-header">

        <div class="dev5-support-article-icon">
          ${mucDuocChon.icon}
        </div>

        <div>
          <span class="dev5-support-kicker">
            SPORTSTORE SUPPORT CENTER
          </span>

          <h3>${mucDuocChon.title}</h3>

          <p>${mucDuocChon.intro}</p>
        </div>

      </div>

      <div class="dev5-support-cards">
  `;

  // Hiển thị từng nội dung chính sách
  for (var k = 0; k < mucDuocChon.blocks.length; k++) {
    var block = mucDuocChon.blocks[k];

    html += `
      <article class="dev5-support-card">

        <h4>
          <span>${block.icon || "•"}</span>
          ${block.title}
        </h4>
    `;

    // Đoạn mô tả
    if (block.text) {
      html += `
        <p>${block.text}</p>
      `;
    }

    // Danh sách nội dung
    if (block.items && block.items.length > 0) {
      html += `<ul>`;

      for (var m = 0; m < block.items.length; m++) {
        html += `<li>${block.items[m]}</li>`;
      }

      html += `</ul>`;
    }

    // Danh sách các bước thực hiện
    if (block.steps && block.steps.length > 0) {
      html += `<ol>`;

      for (var n = 0; n < block.steps.length; n++) {
        html += `<li>${block.steps[n]}</li>`;
      }

      html += `</ol>`;
    }

    html += `
      </article>
    `;
  }

  html += `
      </div>

      <!-- CÂU HỎI THƯỜNG GẶP -->
      <section class="dev5-support-faq">

        <div class="dev5-support-faq-heading">
          <div>
            <span class="dev5-support-kicker">FREQUENTLY ASKED QUESTIONS</span>
            <h3>Câu hỏi thường gặp</h3>
            <p>Giải đáp những thắc mắc phổ biến khi mua sắm tại SportStore.</p>
          </div>
        </div>

  `;

  // Tạo danh sách câu hỏi
  for (var p = 0; p < DEV5_SUPPORT_FAQS.length; p++) {
    var faq = DEV5_SUPPORT_FAQS[p];
    var moSan = p === 0;

    html += `
      <article class="dev5-faq-item ${moSan ? "is-open" : ""}">

        <button
          type="button"
          class="dev5-faq-question"
          aria-expanded="${moSan}"
          onclick="dongMoFaq(this)"
        >
          <strong>${faq.question}</strong>

          <span class="dev5-faq-toggle-icon">
            ${moSan ? "−" : "＋"}
          </span>
        </button>

        <div class="dev5-faq-answer">
          ${faq.answer}
        </div>

      </article>
    `;
  }

  html += `
      </section>

    </div>
  `;

  // Cập nhật nội dung bên phải
  var khungNoiDung = khung.querySelector("#dev5-support-content");

  if (khungNoiDung) {
    khungNoiDung.innerHTML = html;
  }
}
// ============================================================
// ĐÓNG / MỞ CÂU HỎI FAQ
// ============================================================

function dongMoFaq(nutBam) {
  var theCha = nutBam.parentElement;

  if (!theCha) return;

  var dangMo = theCha.classList.toggle("is-open");

  // Cập nhật trạng thái hỗ trợ truy cập
  nutBam.setAttribute("aria-expanded", dangMo);

  // Thay đổi biểu tượng
  var icon = nutBam.querySelector(".dev5-faq-toggle-icon");

  if (icon) {
    icon.textContent = dangMo ? "−" : "＋";
  }
}

/* ==============================================================================
   KHỞI TẠO VÀ ĐIỀU PHỐI GIAO DIỆN HỘI VIÊN
============================================================================== */


function renderUserProfile() {
  hienThiThongTinUser();
  hienThiDonHang();
  hienThiDiaChi();
  hienThiYeuThich();
  hienThiFaq();
  chuyenTab("overview");
  let params = new URLSearchParams(window.location.search);
  let tab = params.get("tab");
  if (tab) {
    if (tab === "cart") tab = "checkout";
    chuyenTab(tab);
  }
}

function dieuPhoiGiaoDienTheoRole() {
  var session = null;
  try {
    session = JSON.parse(localStorage.getItem("sport_user"));
  } catch (e) {
    session = null;
  }
  var viewGuest = document.getElementById("view-auth-guard");
  var viewUser = document.getElementById("view-user");
  var root = document.documentElement;

  // 1. Chưa đăng nhập -> Hiện hộp khóa
  if (!session) {
    if (viewGuest) viewGuest.classList.remove("dev5-hidden");
    if (viewUser) viewUser.classList.add("dev5-hidden");
    return;
  }

  // 2. Đã đăng nhập -> Hiển thị trang hội viên
  root.classList.add("dev5-scroll-page");
  if (viewGuest) viewGuest.classList.add("dev5-hidden");
  if (viewUser) viewUser.classList.remove("dev5-hidden");
  renderUserProfile();
  if (typeof khoiTaoTrang === "function") khoiTaoTrang();
}

document.addEventListener('DOMContentLoaded', function () {
  dieuPhoiGiaoDienTheoRole();
});

