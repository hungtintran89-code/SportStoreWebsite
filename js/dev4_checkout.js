// Bien dung chung trang gio hang va thanh toan
var danhSachGioHang = [];
var phuongThucThanhToan = "COD";
var diaChiMacDinh = null;

// Tinh tong tien gio hang
function tinhTongTien() {
  var tong = 0;
  for (var i = 0; i < danhSachGioHang.length; i++) {
    var monHang = danhSachGioHang[i];
    tong = tong + (monHang.price * monHang.quantity);
  }
  return tong;
}

// Hien thi gio hang ra man hinh
function hienThiGioHang() {
  var nguoiDung = getCurrentUser();

  var khungChuaDangNhap = document.getElementById("d4Auth");
  var khungGioHangTrong = document.getElementById("d4Empty");
  var khungThanhToan = document.getElementById("d4Layout");
  var khungThanhCong = document.getElementById("d4Success");

  if (!nguoiDung) {
    khungChuaDangNhap.hidden = false;
    khungGioHangTrong.hidden = true;
    khungThanhToan.hidden = true;
    khungThanhCong.hidden = true;
    return;
  }
  khungChuaDangNhap.hidden = true;

  if (khungThanhCong.hidden === false) {
    khungGioHangTrong.hidden = true;
    khungThanhToan.hidden = true;
    return;
  }

  if (danhSachGioHang.length === 0) {
    khungGioHangTrong.hidden = false;
    khungThanhToan.hidden = true;
    return;
  }

  khungGioHangTrong.hidden = true;
  khungThanhToan.hidden = false;

  var tongSoLuong = 0;
  for (var i = 0; i < danhSachGioHang.length; i++) {
    tongSoLuong = tongSoLuong + danhSachGioHang[i].quantity;
  }
  document.getElementById("d4ItemCount").textContent = tongSoLuong + " món";

  var chuoiHtmlBang = "";
  for (var j = 0; j < danhSachGioHang.length; j++) {
    var sp = danhSachGioHang[j];
    var thanhTien = sp.price * sp.quantity;

    chuoiHtmlBang +=
      '<tr>' +
        '<td data-label="Sản phẩm">' +
          '<div class="d4-prod">' +
            '<img src="' + sp.image + '" alt="' + sp.name + '" width="64" height="64">' +
            '<div>' +
              '<p class="d4-prod-name">' + sp.name + '</p>' +
              '<p class="d4-prod-variant">Size: ' + (sp.size || "Tiêu chuẩn") + ' | Màu: ' + (sp.color || "Mặc định") + '</p>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td data-label="Đơn giá">' + formatMoney(sp.price) + '</td>' +
        '<td data-label="Số lượng">' +
          '<div class="d4-qty">' +
            '<button type="button" onclick="giamSoLuong(' + j + ')">-</button>' +
            '<span>' + sp.quantity + '</span>' +
            '<button type="button" onclick="tangSoLuong(' + j + ')">+</button>' +
          '</div>' +
        '</td>' +
        '<td data-label="Thành tiền" class="d4-line-total">' + formatMoney(thanhTien) + '</td>' +
        '<td>' +
          '<button type="button" class="d4-remove" onclick="xoaSanPham(' + j + ')"><i class="fa-solid fa-trash-can"></i></button>' +
        '</td>' +
      '</tr>';
  }

  document.getElementById("d4Items").innerHTML = chuoiHtmlBang;

  var tongTien = tinhTongTien();
  document.getElementById("d4Subtotal").textContent = formatMoney(tongTien);
  document.getElementById("d4Total").textContent = formatMoney(tongTien);
}

// Tang so luong (+)
function tangSoLuong(viTri) {
  var sanPham = danhSachGioHang[viTri];
  sanPham.quantity = sanPham.quantity + 1;
  saveCart(danhSachGioHang);
  hienThiGioHang();
}

// Giam so luong (-)
function giamSoLuong(viTri) {
  var sanPham = danhSachGioHang[viTri];
  if (sanPham.quantity > 1) {
    sanPham.quantity = sanPham.quantity - 1;
    saveCart(danhSachGioHang);
    hienThiGioHang();
  }
}

// Xoa san pham khoi gio
function xoaSanPham(viTri) {
  danhSachGioHang.splice(viTri, 1);
  saveCart(danhSachGioHang);
  showToast("Đã xóa sản phẩm khỏi giỏ hàng!", "info");
  hienThiGioHang();
}

// Chon che do dia chi co san hoac nhap moi
function chonCheDoDiaChi(cheDo) {
  var nutRadioCoSan = document.getElementById("d4RadioSaved");
  var nutRadioNhapMoi = document.getElementById("d4RadioNew");
  var nhanCoSan = document.getElementById("d4LblAddrSaved");
  var nhanNhapMoi = document.getElementById("d4LblAddrNew");
  var hopThongTinCoSan = document.getElementById("d4SavedBox");
  var hopCacONhapMoi = document.getElementById("d4Fields");

  if (cheDo === "saved" && diaChiMacDinh) {
    nutRadioCoSan.checked = true;
    nutRadioNhapMoi.checked = false;
    nhanCoSan.classList.add("selected");
    nhanNhapMoi.classList.remove("selected");
    hopThongTinCoSan.hidden = false;
    hopCacONhapMoi.hidden = true;

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

// Nap dia chi da luu trong tai khoan
function napDiaChiTaiKhoan() {
  var nguoiDung = getCurrentUser();
  if (!nguoiDung) return;

  var danhSachDiaChi = readJson(STORAGE_ADDR_KEY, []);
  var maNguoiDung = nguoiDung.customerId || nguoiDung.id;

  var diaChiTimDuoc = null;
  if (Array.isArray(danhSachDiaChi)) {
    for (var i = 0; i < danhSachDiaChi.length; i++) {
      var a = danhSachDiaChi[i];
      var maSo = a.customerId || a.userId;
      if (String(maSo) === String(maNguoiDung)) {
        diaChiTimDuoc = a;
        break;
      }
    }
  } else if (danhSachDiaChi && typeof danhSachDiaChi === "object") {
    diaChiTimDuoc = danhSachDiaChi;
  }

  var hoTenGop = (diaChiTimDuoc && (diaChiTimDuoc.fullName || diaChiTimDuoc.recipient)) || nguoiDung.fullName || nguoiDung.name || "";
  var sdtGop = (diaChiTimDuoc && diaChiTimDuoc.phone) || nguoiDung.phone || "";
  var emailGop = (diaChiTimDuoc && diaChiTimDuoc.email) || nguoiDung.email || "";
  var diaChiGop = (diaChiTimDuoc && (diaChiTimDuoc.address || diaChiTimDuoc.line || diaChiTimDuoc.detail)) || nguoiDung.address || "";

  if (hoTenGop && sdtGop && diaChiGop && diaChiGop !== "Chưa cập nhật") {
    diaChiMacDinh = {
      fullName: hoTenGop,
      phone: sdtGop,
      email: emailGop,
      address: diaChiGop
    };
    document.getElementById("d4AddrMode").hidden = false;
    document.getElementById("d4SavedText").innerHTML =
      '<span class="d4-saved-badge"><i class="fa-solid fa-check"></i> Địa chỉ mặc định trong tài khoản</span><br>' +
      '<strong>' + hoTenGop + ' &bull; ' + sdtGop + ' &bull; ' + emailGop + '</strong><br>' +
      '<i class="fa-solid fa-location-dot" style="color:#0284c7;"></i> ' + diaChiGop;
    chonCheDoDiaChi("saved");
  } else {
    diaChiMacDinh = null;
    document.getElementById("d4AddrMode").hidden = true;
    chonCheDoDiaChi("new");
    if (hoTenGop) document.getElementById("fullName").value = hoTenGop;
    if (sdtGop) document.getElementById("phone").value = sdtGop;
    if (emailGop) document.getElementById("email").value = emailGop;
  }
}

// Chon phuong thuc thanh toan
function chonPhuongThuc(loai) {
  phuongThucThanhToan = loai;

  var hopQR = document.getElementById("d4QrBox");
  var hopOnline = document.getElementById("d4OnlineBox");

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

  var tatCaLuaChon = document.querySelectorAll(".d4-pay-option");
  for (var i = 0; i < tatCaLuaChon.length; i++) {
    var inputRadio = tatCaLuaChon[i].querySelector("input");
    if (inputRadio.value === loai) {
      tatCaLuaChon[i].classList.add("selected");
      inputRadio.checked = true;
    } else {
      tatCaLuaChon[i].classList.remove("selected");
    }
  }
}

// Kiem tra thong tin va xac nhan dat hang
function datHang(e) {
  if (e) e.preventDefault();

  var nguoiDung = getCurrentUser();
  if (!nguoiDung) {
    showToast("Vui lòng đăng nhập để đặt hàng!", "danger");
    return;
  }

  if (danhSachGioHang.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "danger");
    return;
  }

  var hoTen = document.getElementById("fullName").value.trim();
  var sdt = document.getElementById("phone").value.trim();
  var email = document.getElementById("email").value.trim();
  var diaChi = document.getElementById("address").value.trim();
  var selectTinh = document.getElementById("province");
  var tinhThanh = selectTinh.options[selectTinh.selectedIndex].text;
  var ghiChu = document.getElementById("note").value.trim();

  document.getElementById("err-fullName").textContent = "";
  document.getElementById("err-phone").textContent = "";
  document.getElementById("err-email").textContent = "";
  document.getElementById("err-address").textContent = "";

  var coLoi = false;

  if (hoTen.length < 2) {
    document.getElementById("err-fullName").textContent = "Vui lòng nhập họ tên đầy đủ!";
    coLoi = true;
  }

  if (sdt.length !== 10 || sdt.charAt(0) !== "0" || isNaN(sdt)) {
    document.getElementById("err-phone").textContent = "Số điện thoại phải đủ 10 số và bắt đầu bằng số 0!";
    coLoi = true;
  }

  if (email.length < 5 || email.indexOf("@") === -1) {
    document.getElementById("err-email").textContent = "Email chưa đúng định dạng!";
    coLoi = true;
  }

  if (diaChi.length < 5) {
    document.getElementById("err-address").textContent = "Vui lòng nhập địa chỉ cụ thể!";
    coLoi = true;
  }

  if (phuongThucThanhToan === "ONLINE") {
    var soThe = document.getElementById("cardNumber").value.trim();
    var tenThe = document.getElementById("cardHolder").value.trim();
    var hanThe = document.getElementById("cardExpiry").value.trim();
    var maCvv = document.getElementById("cardCvv").value.trim();

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

  if (coLoi) {
    showToast("Vui lòng kiểm tra lại các thông tin màu đỏ!", "danger");
    chonCheDoDiaChi("new");
    return;
  }

  var tongTien = tinhTongTien();
  var danhSachDonHang = readJson("sport_orders", []);
  if (!Array.isArray(danhSachDonHang)) {
    danhSachDonHang = [];
  }

  var soThuTu = danhSachDonHang.length + 1;
  var maDonMoi = "DH-" + (soThuTu < 10 ? "000" + soThuTu : (soThuTu < 100 ? "00" + soThuTu : "0" + soThuTu));
  var maKhachHang = nguoiDung.customerId || nguoiDung.id || "KHACH";

  var donHangMoi = {
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

  danhSachDonHang.push(donHangMoi);
  localStorage.setItem("sport_orders", JSON.stringify(danhSachDonHang));

  var tatCaSanPham = readJson("sport_products", []);
  if (Array.isArray(tatCaSanPham)) {
    for (var i = 0; i < danhSachGioHang.length; i++) {
      var monVuaMua = danhSachGioHang[i];
      for (var j = 0; j < tatCaSanPham.length; j++) {
        if (String(tatCaSanPham[j].id) === String(monVuaMua.id)) {
          tatCaSanPham[j].stock = Math.max(0, Number(tatCaSanPham[j].stock) - Number(monVuaMua.quantity));
          break;
        }
      }
    }
    localStorage.setItem("sport_products", JSON.stringify(tatCaSanPham));
  }

  danhSachGioHang = [];
  saveCart([]);

  showToast("Đặt hàng thành công!", "success");

  document.getElementById("d4Empty").hidden = true;
  document.getElementById("d4Layout").hidden = true;
  document.getElementById("d4Success").hidden = false;

  document.getElementById("d4OrderCode").textContent = donHangMoi.id;
  document.getElementById("d4OrderTotal").textContent = formatMoney(donHangMoi.total);
  document.getElementById("d4OrderNote").textContent = donHangMoi.customer.note ? "Ghi chú: " + donHangMoi.customer.note : "";

  var htmlTomTat = "";
  for (var k = 0; k < donHangMoi.items.length; k++) {
    var item = donHangMoi.items[k];
    htmlTomTat +=
      '<div class="d4-review-item">' +
        '<div class="d4-review-item-left">' +
          '<img src="' + item.image + '" alt="' + item.name + '">' +
          '<div>' +
            '<strong>' + item.name + '</strong><br>' +
            '<small>Size: ' + (item.size || "Tiêu chuẩn") + ' &bull; SL: ' + item.quantity + ' &times; ' + formatMoney(item.price) + '</small>' +
          '</div>' +
        '</div>' +
        '<strong>' + formatMoney(item.price * item.quantity) + '</strong>' +
      '</div>';
  }

  document.getElementById("d4OrderReview").innerHTML =
    '<h3><i class="fa-solid fa-file-invoice" style="color:#0284c7;"></i> Chi tiết đơn đặt hàng vừa mua</h3>' +
    '<div class="d4-review-info">' +
      '<strong>Người nhận:</strong> ' + donHangMoi.customer.fullName + ' &bull; <strong>SĐT:</strong> ' + donHangMoi.customer.phone + '<br>' +
      '<strong>Địa chỉ:</strong> ' + donHangMoi.customer.address + ', ' + donHangMoi.customer.province + '<br>' +
      '<strong>Hình thức thanh toán:</strong> ' + donHangMoi.customer.paymentMethod +
    '</div>' +
    '<div class="d4-review-items">' + htmlTomTat + '</div>' +
    '<div class="d4-review-totals">' +
      '<div class="d4-review-row">' +
        '<span>Tạm tính:</span>' +
        '<strong>' + formatMoney(donHangMoi.subtotal) + '</strong>' +
      '</div>' +
      '<div class="d4-review-row">' +
        '<span>Phí vận chuyển:</span>' +
        '<strong>Miễn phí</strong>' +
      '</div>' +
      '<div class="d4-review-row grand">' +
        '<span>Tổng thanh toán:</span>' +
        '<strong>' + formatMoney(donHangMoi.total) + '</strong>' +
      '</div>' +
    '</div>';
}

// Khoi tao trang gio hang
function khoiTaoTrang() {
  danhSachGioHang = getCart();
  napDiaChiTaiKhoan();
  hienThiGioHang();

  var radioSaved = document.getElementById("d4RadioSaved");
  if (radioSaved) {
    radioSaved.onclick = function () { chonCheDoDiaChi("saved"); };
  }
  var radioNew = document.getElementById("d4RadioNew");
  if (radioNew) {
    radioNew.onclick = function () { chonCheDoDiaChi("new"); };
  }
  var btnSuaDiaChi = document.getElementById("d4EditAddr");
  if (btnSuaDiaChi) {
    btnSuaDiaChi.onclick = function () { chonCheDoDiaChi("new"); };
  }

  var danhSachRadioThanhToan = document.querySelectorAll('#d4PayList input[name="payment"]');
  for (var i = 0; i < danhSachRadioThanhToan.length; i++) {
    danhSachRadioThanhToan[i].onclick = function () {
      chonPhuongThuc(this.value);
    };
  }

  var formDatHang = document.getElementById("d4Form");
  if (formDatHang) {
    formDatHang.onsubmit = datHang;
  }
}

khoiTaoTrang();
