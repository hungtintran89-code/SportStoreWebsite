// --- 1. CÁC BIẾN DÙNG CHUNG ---
let danhSachGioHang = [];
let phuongThucThanhToan = "COD"; // Mặc định là thanh toán khi nhận hàng (COD)
let diaChiMacDinh = null; // Chứa địa chỉ lấy từ tài khoản đã đăng nhập

// --- 2. HÀM TÍNH TỔNG TIỀN GIỎ HÀNG (DÙNG VÒNG LẶP FOR CƠ BẢN) ---
function tinhTongTien() {
  let tong = 0;
  for (let i = 0; i < danhSachGioHang.length; i++) {
    let monHang = danhSachGioHang[i];
    tong = tong + (monHang.price * monHang.quantity);
  }
  return tong;
}

// --- 3. HÀM HIỂN THỊ GIỎ HÀNG RA MÀN HÌNH ---
function hienThiGioHang() {

  // Lấy tài khoản hiện tại đang đăng nhập
  let nguoiDung = getCurrentUser();

  // Lấy các thẻ HTML trên giao diện bằng ID
  let khungChuaDangNhap = document.getElementById("d4Auth");
  let khungGioHangTrong = document.getElementById("d4Empty");
  let khungThanhToan = document.getElementById("d4Layout");
  let khungThanhCong = document.getElementById("d4Success");

  // Nếu người dùng chưa đăng nhập -> Hiển thị khung yêu cầu đăng nhập
  if (!nguoiDung) {
    khungChuaDangNhap.hidden = false;
    khungGioHangTrong.hidden = true;
    khungThanhToan.hidden = true;
    khungThanhCong.hidden = true;
    return;
  }
  khungChuaDangNhap.hidden = true;

  // Nếu đang hiển thị màn hình đặt hàng thành công thì giữ nguyên
  if (khungThanhCong.hidden === false) {
    khungGioHangTrong.hidden = true;
    khungThanhToan.hidden = true;
    return;
  }

  // Nếu giỏ hàng trống (không có sản phẩm nào)
  if (danhSachGioHang.length === 0) {
    khungGioHangTrong.hidden = false;
    khungThanhToan.hidden = true;
    return;
  }

  // Nếu có sản phẩm trong giỏ hàng -> Hiển thị khung thanh toán
  khungGioHangTrong.hidden = true;
  khungThanhToan.hidden = false;

  // Tính tổng số lượng món để hiển thị lên thẻ
  let tongSoLuong = 0;
  for (let i = 0; i < danhSachGioHang.length; i++) {
    tongSoLuong = tongSoLuong + danhSachGioHang[i].quantity;
  }
  document.getElementById("d4ItemCount").textContent = tongSoLuong + " món";

  // Tạo các dòng bảng HTML bằng vòng lặp for
  let chuoiHtmlBang = "";
  for (let i = 0; i < danhSachGioHang.length; i++) {
    let sp = danhSachGioHang[i];
    let thanhTien = sp.price * sp.quantity;

    // Mỗi nút bấm gọi trực tiếp onclick với số thứ tự i của sản phẩm đó
    chuoiHtmlBang += `
      <tr>
        <td data-label="Sản phẩm">
          <div class="d4-prod">
            <img src="${sp.image}" alt="${sp.name}" width="64" height="64">
            <div>
              <p class="d4-prod-name">${sp.name}</p>
              <p class="d4-prod-variant">Size: ${sp.size || "Tiêu chuẩn"} | Màu: ${sp.color || "Mặc định"}</p>
            </div>
          </div>
        </td>
        <td data-label="Đơn giá">${formatMoney(sp.price)}</td>
        <td data-label="Số lượng">
          <div class="d4-qty">
            <button type="button" onclick="giamSoLuong(${i})">−</button>
            <span>${sp.quantity}</span>
            <button type="button" onclick="tangSoLuong(${i})">+</button>
          </div>
        </td>
        <td data-label="Thành tiền" class="d4-line-total">${formatMoney(thanhTien)}</td>
        <td>
          <button type="button" class="d4-remove" onclick="xoaSanPham(${i})">✕</button>
        </td>
      </tr>
    `;
  }

  // Gán chuỗi HTML vừa tạo vào bảng giỏ hàng
  document.getElementById("d4Items").innerHTML = chuoiHtmlBang;

  // Cập nhật tổng tiền lên giao diện
  let tongTien = tinhTongTien();
  document.getElementById("d4Subtotal").textContent = formatMoney(tongTien);
  document.getElementById("d4Total").textContent = formatMoney(tongTien);
}

// Nút bấm tăng số lượng (+)
function tangSoLuong(viTri) {
  let sanPham = danhSachGioHang[viTri];
  // Không cho mua quá 10 cái một sản phẩm
  sanPham.quantity = sanPham.quantity + 1;
  saveCart(danhSachGioHang);
  hienThiGioHang();
}

// Nút bấm giảm số lượng (-)
function giamSoLuong(viTri) {
  let sanPham = danhSachGioHang[viTri];
  if (sanPham.quantity > 1) {
    sanPham.quantity = sanPham.quantity - 1;
    saveCart(danhSachGioHang);
    hienThiGioHang();
  }
}

// Nút bấm xóa sản phẩm (✕)
function xoaSanPham(viTri) {
  danhSachGioHang.splice(viTri, 1);
  saveCart(danhSachGioHang);
  showToast("Đã xóa sản phẩm khỏi giỏ hàng!", "info");
  hienThiGioHang();
}

// --- 5. XỬ LÝ CHỌN ĐỊA CHỈ (CÓ SẴN HOẶC NHẬP MỚI) ---
function chonCheDoDiaChi(cheDo) {
  let nutRadioCoSan = document.getElementById("d4RadioSaved");
  let nutRadioNhapMoi = document.getElementById("d4RadioNew");
  let nhanCoSan = document.getElementById("d4LblAddrSaved");
  let nhanNhapMoi = document.getElementById("d4LblAddrNew");
  let hopThongTinCoSan = document.getElementById("d4SavedBox");
  let hopCacONhapMoi = document.getElementById("d4Fields");

  if (cheDo === "saved" && diaChiMacDinh) {
    nutRadioCoSan.checked = true;
    nutRadioNhapMoi.checked = false;
    nhanCoSan.classList.add("selected");
    nhanNhapMoi.classList.remove("selected");
    hopThongTinCoSan.hidden = false;
    hopCacONhapMoi.hidden = true;

    // Tự động điền dữ liệu có sẵn vào các ô
    document.getElementById("fullName").value = diaChiMacDinh.fullName || "";
    document.getElementById("phone").value = diaChiMacDinh.phone || "";
    document.getElementById("email").value = diaChiMacDinh.email || "";
    document.getElementById("address").value = diaChiMacDinh.address || "";
  } else {
    nutRadioCoSan.checked = false;
    nutRadioNhapMoi.checked = true;
    nhanCoSan.classList.remove("selected");
    nhanNhapMoi.classList.add("selected");
    hopThongTinCoSan.hidden = true;
    hopCacONhapMoi.hidden = false;
  }
}

// Hàm nạp địa chỉ đã lưu trong tài khoản khi mới vào trang
function napDiaChiTaiKhoan() {
  let nguoiDung = getCurrentUser();
  if (!nguoiDung) return;

  let danhSachDiaChi = readJson(STORAGE_ADDR_KEY, []);
  let maNguoiDung = nguoiDung.customerId || nguoiDung.id;

  let diaChiTimDuoc = null;
  if (Array.isArray(danhSachDiaChi)) {
    for (let i = 0; i < danhSachDiaChi.length; i++) {
      let a = danhSachDiaChi[i];
      let maSo = a.customerId || a.userId;
      if (String(maSo) === String(maNguoiDung)) {
        diaChiTimDuoc = a;
        break;
      }
    }
  }

  // Gộp thông tin tài khoản và địa chỉ
  let thongTinGop = Object.assign({}, nguoiDung, diaChiTimDuoc || {});

  // Nếu có đủ thông tin thì kích hoạt chế độ địa chỉ có sẵn
  if (thongTinGop.fullName && thongTinGop.phone && thongTinGop.address) {
    diaChiMacDinh = thongTinGop;
    document.getElementById("d4AddrMode").hidden = false;
    document.getElementById("d4SavedText").innerHTML = `
      <span class="d4-saved-badge">✓ Địa chỉ mặc định trong tài khoản</span><br>
      <strong>${thongTinGop.fullName} • ${thongTinGop.phone} • ${thongTinGop.email || ""}</strong><br>
      🏠 ${thongTinGop.address}
    `;
    chonCheDoDiaChi("saved");
  } else {
    // Nếu chưa có thì chuyển sang chế độ nhập mới
    diaChiMacDinh = null;
    document.getElementById("d4AddrMode").hidden = true;
    chonCheDoDiaChi("new");
    if (thongTinGop.fullName) document.getElementById("fullName").value = thongTinGop.fullName;
    if (thongTinGop.phone) document.getElementById("phone").value = thongTinGop.phone;
    if (thongTinGop.email) document.getElementById("email").value = thongTinGop.email;
  }
}

// --- 6. XỬ LÝ CHỌN PHƯƠNG THỨC THANH TOÁN ---
function chonPhuongThuc(loai) {
  phuongThucThanhToan = loai;

  let hopQR = document.getElementById("d4QrBox");
  let hopOnline = document.getElementById("d4OnlineBox");

  // Ẩn/Hiện khung QR hoặc Thẻ tùy theo người dùng chọn
  if (loai === "QR") {
    hopQR.hidden = false;
    hopOnline.hidden = true;
  } else if (loai === "ONLINE") {
    hopQR.hidden = true;
    hopOnline.hidden = false;
  } else {
    hopQR.hidden = true;
    hopOnline.hidden = true;
  }

  // Đổi viền sáng màu cho lựa chọn đang click
  let tatCaLuaChon = document.querySelectorAll(".d4-pay-option");
  for (let i = 0; i < tatCaLuaChon.length; i++) {
    let inputRadio = tatCaLuaChon[i].querySelector("input");
    if (inputRadio.value === loai) {
      tatCaLuaChon[i].classList.add("selected");
      inputRadio.checked = true;
    } else {
      tatCaLuaChon[i].classList.remove("selected");
    }
  }
}

// --- 7. KIỂM TRA LỖI VÀ ĐẶT HÀNG ---
function datHang(e) {
  if (e) e.preventDefault(); // Ngăn trình duyệt tự load lại trang khi bấm submit form

  let nguoiDung = getCurrentUser();
  if (!nguoiDung) {
    showToast("Vui lòng đăng nhập để đặt hàng!", "danger");
    return;
  }

  if (danhSachGioHang.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "danger");
    return;
  }

  // Lấy giá trị các ô nhập nhận hàng
  let hoTen = document.getElementById("fullName").value.trim();
  let sdt = document.getElementById("phone").value.trim();
  let email = document.getElementById("email").value.trim();
  let diaChi = document.getElementById("address").value.trim();
  let tinhThanh = document.getElementById("province").selectedOptions[0].text;
  let ghiChu = document.getElementById("note").value.trim();

  // Xóa sạch thông báo lỗi cũ
  document.getElementById("err-fullName").textContent = "";
  document.getElementById("err-phone").textContent = "";
  document.getElementById("err-email").textContent = "";
  document.getElementById("err-address").textContent = "";

  let coLoi = false;

  // Kiểm tra Họ tên
  if (hoTen.length < 2) {
    document.getElementById("err-fullName").textContent = "Vui lòng nhập họ tên đầy đủ!";
    coLoi = true;
  }

  // Kiểm tra Số điện thoại (phải 10 số và bắt đầu bằng số 0)
  if (sdt.length !== 10 || sdt.charAt(0) !== "0" || isNaN(sdt)) {
    document.getElementById("err-phone").textContent = "Số điện thoại phải đủ 10 số và bắt đầu bằng số 0!";
    coLoi = true;
  }

  // Kiểm tra Email
  if (email.length < 5 || email.indexOf("@") === -1) {
    document.getElementById("err-email").textContent = "Email chưa đúng định dạng!";
    coLoi = true;
  }

  // Kiểm tra Địa chỉ
  if (diaChi.length < 5) {
    document.getElementById("err-address").textContent = "Vui lòng nhập địa chỉ cụ thể!";
    coLoi = true;
  }

  // Nếu người dùng chọn thanh toán trực tuyến qua thẻ (ONLINE), kiểm tra thêm thông tin thẻ
  if (phuongThucThanhToan === "ONLINE") {
    let soThe = document.getElementById("cardNumber").value.trim();
    let tenThe = document.getElementById("cardHolder").value.trim();
    let hanThe = document.getElementById("cardExpiry").value.trim();
    let maCvv = document.getElementById("cardCvv").value.trim();

    document.getElementById("err-cardNumber").textContent = "";
    document.getElementById("err-cardHolder").textContent = "";
    document.getElementById("err-cardExpiry").textContent = "";
    document.getElementById("err-cardCvv").textContent = "";

    if (soThe.length < 12) {
      document.getElementById("err-cardNumber").textContent = "Số thẻ phải từ 12 số trở lên!";
      coLoi = true;
    }
    if (tenThe.length < 2) {
      document.getElementById("err-cardHolder").textContent = "Vui lòng nhập tên in trên thẻ!";
      coLoi = true;
    }
    if (hanThe.length < 4) {
      document.getElementById("err-cardExpiry").textContent = "Vui lòng nhập hạn thẻ (MM/YY)!";
      coLoi = true;
    }
    if (maCvv.length < 3) {
      document.getElementById("err-cardCvv").textContent = "Mã CVV gồm 3-4 số!";
      coLoi = true;
    }
  }

  // Nếu có bất kỳ ô nào nhập sai -> Báo lỗi và dừng lại
  if (coLoi) {
    showToast("Vui lòng kiểm tra lại các thông tin màu đỏ!", "danger");
    // Nếu đang ở chế độ địa chỉ có sẵn mà bị lỗi, chuyển sang ô nhập mới để người dùng sửa
    chonCheDoDiaChi("new");
    return;
  }

  // --- TẠO ĐƠN HÀNG MỚI NẾU KHÔNG CÓ LỖI ---
  let tongTien = tinhTongTien();
  let danhSachDonHang = readJson("sport_orders", []);
  if (!Array.isArray(danhSachDonHang)) {
    danhSachDonHang = [];
  }

  // Tạo mã đơn hàng tự động tăng, ví dụ: DH-0001, DH-0002...
  let maDonMoi = "DH-" + String(danhSachDonHang.length + 1).padStart(4, "0");
  let maKhachHang = nguoiDung.customerId || nguoiDung.id || "KHACH";

  let donHangMoi = {
    orderId: maDonMoi,
    id: maDonMoi,
    customerId: maKhachHang,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: danhSachGioHang,
    subtotal: tongTien,
    discount: 0,
    shippingFee: 0,
    total: tongTien,
    paymentMethod: phuongThucThanhToan,
    customer: {
      fullName: hoTen,
      phone: sdt,
      email: email,
      province: tinhThanh,
      address: diaChi,
      note: ghiChu
    }
  };

  // Lưu đơn vào mảng đơn hàng trong localStorage
  danhSachDonHang.push(donHangMoi);
  localStorage.setItem("sport_orders", JSON.stringify(danhSachDonHang));

  // Trừ số lượng tồn kho của các sản phẩm vừa mua
  let tatCaSanPham = readJson("sport_products", []);
  if (Array.isArray(tatCaSanPham)) {
    for (let i = 0; i < danhSachGioHang.length; i++) {
      let monVuaMua = danhSachGioHang[i];
      for (let j = 0; j < tatCaSanPham.length; j++) {
        if (String(tatCaSanPham[j].id) === String(monVuaMua.id)) {
          tatCaSanPham[j].stock = Math.max(0, Number(tatCaSanPham[j].stock) - Number(monVuaMua.quantity));
          break;
        }
      }
    }
    localStorage.setItem("sport_products", JSON.stringify(tatCaSanPham));
  }

  // Làm rỗng giỏ hàng sau khi đặt thành công
  danhSachGioHang = [];
  saveCart([]);

  showToast("Đặt hàng thành công!", "success");

  // Ẩn khung giỏ hàng, hiển thị khung thành công
  document.getElementById("d4Empty").hidden = true;
  document.getElementById("d4Layout").hidden = true;
  document.getElementById("d4Success").hidden = false;

  // Điền thông tin lên màn hình thành công
  document.getElementById("d4OrderCode").textContent = donHangMoi.id;
  document.getElementById("d4OrderTotal").textContent = formatMoney(donHangMoi.total);
  document.getElementById("d4OrderNote").textContent = donHangMoi.customer.note ? "Ghi chú: " + donHangMoi.customer.note : "";

  // Tạo bảng tóm tắt đơn vừa mua
  let htmlTomTat = "";
  for (let i = 0; i < donHangMoi.items.length; i++) {
    let item = donHangMoi.items[i];
    htmlTomTat += `
      <div class="d4-review-item">
        <div class="d4-review-item-left">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>
            <small>Size: ${item.size || "Tiêu chuẩn"} • SL: ${item.quantity} × ${formatMoney(item.price)}</small>
          </div>
        </div>
        <strong>${formatMoney(item.price * item.quantity)}</strong>
      </div>
    `;
  }

  document.getElementById("d4OrderReview").innerHTML = `
    <h3>📋 Chi tiết đơn đặt hàng vừa mua</h3>
    <div class="d4-review-info">
      <strong>Người nhận:</strong> ${donHangMoi.customer.fullName} • <strong>SĐT:</strong> ${donHangMoi.customer.phone}<br>
      <strong>Địa chỉ:</strong> ${donHangMoi.customer.address}, ${donHangMoi.customer.province}<br>
      <strong>Hình thức thanh toán:</strong> ${donHangMoi.paymentMethod}
    </div>
    <div class="d4-review-items">${htmlTomTat}</div>
    <div class="d4-review-totals">
      <div class="d4-review-row">
        <span>Tạm tính:</span>
        <strong>${formatMoney(donHangMoi.subtotal)}</strong>
      </div>
      <div class="d4-review-row">
        <span>Phí vận chuyển:</span>
        <strong>Miễn phí</strong>
      </div>
      <div class="d4-review-row grand">
        <span>Tổng thanh toán:</span>
        <strong>${formatMoney(donHangMoi.total)}</strong>
      </div>
    </div>
  `;
}

// --- 8. HÀM CHẠY ĐẦU TIÊN KHI TẢI TRANG (INIT) ---
function khoiTaoTrang() {

  danhSachGioHang = getCart();

  napDiaChiTaiKhoan();

  // Hiển thị giỏ hàng
  hienThiGioHang();

  // Gắn sự kiện click đổi chế độ địa chỉ
  let radioSaved = document.getElementById("d4RadioSaved");
  if (radioSaved) {
    radioSaved.onclick = function() { chonCheDoDiaChi("saved"); };
  }
  let radioNew = document.getElementById("d4RadioNew");
  if (radioNew) {
    radioNew.onclick = function() { chonCheDoDiaChi("new"); };
  }
  let btnSuaDiaChi = document.getElementById("d4EditAddr");
  if (btnSuaDiaChi) {
    btnSuaDiaChi.onclick = function() { chonCheDoDiaChi("new"); };
  }

  // Gắn sự kiện click cho các nút chọn phương thức thanh toán
  let danhSachRadioThanhToan = document.querySelectorAll('#d4PayList input[name="payment"]');
  for (let i = 0; i < danhSachRadioThanhToan.length; i++) {
    danhSachRadioThanhToan[i].onclick = function() {
      chonPhuongThuc(this.value);
    };
  }

  // Gắn sự kiện submit form khi người dùng bấm nút "Xác nhận đặt hàng"
  let formDatHang = document.getElementById("d4Form");
  if (formDatHang) {
    formDatHang.onsubmit = datHang;
  }
}

function xoaTatCaGioHang(){
  if( !danhSachGioHang || danhSachGioHang.length === 0 ){
    showToast("Giỏ hàng của bạn đang trống!", "info");
    return ;
  }

  var xacNhan = confirm("Bạn có chắc chắn muốn xóa TOÀN BỘ sản phẩm trong giỏ hàng không?");

  if(xacNhan){

    danhSachGioHang = [] ;

    saveCart();

    showToast("Đã xóa sạch toàn bộ giỏ hàng!", "info");
    hienThiGioHang();
  }
}

// Chạy khởi tạo ngay khi tải xong file JavaScript
khoiTaoTrang();



