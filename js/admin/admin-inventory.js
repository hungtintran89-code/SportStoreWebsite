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
  document.getElementById("pricing-cost-price").value = giaVonHienTai.toLocaleString("vi-VN") + " đ";
  document.getElementById("pricing-profit-percent").value = phanTram;
  // Điền số nguyên vào ô nhập giá bán (ví dụ 5000000)
  document.getElementById("pricing-sale-price").value = Number(p.price || 0);

  moModalAdmin("modal-pricing");
}

// 2. Tự động tính % lợi nhuận khi người dùng nhập/đổi giá bán niêm yết
// 2b. Tự động tính giá bán khi người dùng nhập/đổi % lợi nhuận
function tinhGiaBanTuDong() {
  var phanTram = Number(document.getElementById("pricing-profit-percent").value) || 0;
  if (giaVonHienTai > 0) {
    var giaBan = Math.round(giaVonHienTai * (1 + phanTram / 100));
    document.getElementById("pricing-sale-price").value = giaBan;
  }
}

function tinhPhanTramTuDong() {
  var giaBan = Number(document.getElementById("pricing-sale-price").value) || 0;
  if (giaVonHienTai > 0 && giaBan > 0) {
    // Công thức: % Lợi nhuận = ((Giá bán - Giá vốn) / Giá vốn) * 100
    var percent = Math.round(((giaBan - giaVonHienTai) / giaVonHienTai) * 100);
    document.getElementById("pricing-profit-percent").value = percent;
  } else {
    document.getElementById("pricing-profit-percent").value = 0;
  }
}

// 3. Lưu giá bán mới vào danh sách sản phẩm
function luuGiaBanMoi() {
  var giaBanMoi = Number(document.getElementById("pricing-sale-price").value) || 0;
  if (giaBanMoi <= 0) {
    showToast("Vui lòng nhập giá bán lớn hơn 0!", "danger");
    return;
  }

  // Tính lại % lợi nhuận theo giá bán mới
  var percentMoi = 0;
  if (giaVonHienTai > 0) {
    percentMoi = Math.round(((giaBanMoi - giaVonHienTai) / giaVonHienTai) * 100);
  }

  var dsSp = layDuLieuAdmin("sport_products");
  for (var i = 0; i < dsSp.length; i++) {
    if (dsSp[i].id === maSpDangSuaGia) {
      dsSp[i].price = giaBanMoi;
      dsSp[i].profitPercent = percentMoi;
      dsSp[i].costPrice = giaVonHienTai; // Cố định vĩnh viễn giá vốn, không bao giờ bị đổi
      break;
    }
  }

  luuDuLieuAdmin("sport_products", dsSp);
  dongModalAdmin("modal-pricing");
  hienThiBangGiaBanAdmin();
  if (typeof showToast === "function") {
    showToast("Đã cập nhật giá bán thành công: " + giaBanMoi.toLocaleString("vi-VN") + " đ", "success");
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
  var trangThaiLoc = (document.getElementById("snapshotStatusSelect")?.value || "");

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

    // Lọc theo trạng thái tồn kho
    if (trangThaiLoc) {
      if (trangThaiLoc === "danger" && ton !== 0) continue;              // Hết hàng (tồn = 0)
      if (trangThaiLoc === "warning" && (ton === 0 || ton > 5)) continue; // Cảnh báo (1 <= tồn <= 5)
      if (trangThaiLoc === "normal" && ton <= 5) continue;               // Bình thường (tồn > 5)
    }

    var badgeTon = ton === 0 ? `<strong class="cell-danger">0</strong>` : (ton <= 5 ? `<strong class="cell-warning">${ton}</strong>` : `<strong>${ton}</strong>`);
    var statusBadge = ton === 0 ? `<span class="badge-status badge-danger">Hết hàng</span>` : (ton <= 5 ? `<span class="badge-status badge-warning">Cảnh báo</span>` : `<span class="badge-status badge-success">Bình thường</span>`);
// Nếu tồn kho <= 5 thì hiện nút "+ Nhập", ngược lại hiện nút "Xem"
    var nutThaoTac = "";

    if (ton <= 5) {
      // Bấm + Nhập: Gọi hàm chuyenSangNhapHang() và truyền mã sản phẩm
      nutThaoTac = '<button type="button" class="btn-action btn-inv-import" onclick="chuyenSangNhapHang(\'' + p.id + '\')">+ Nhập</button>';
    } else {
      // Bấm Xem: Gọi hàm xemChiTietTonKho() và truyền mã sản phẩm
      nutThaoTac = '<button type="button" class="btn-action btn-inv-view" onclick="xemChiTietTonKho(\'' + p.id + '\')">Xem</button>';
    }
    html += `
      <div class="div-row-inventory">
        <div><span class="badge-code-pill">${maSP}</span></div>
        <div><strong>${p.name}</strong></div>
        <div class="inv-cat-text">${loaiSP}</div>
        <div>${giaVon.toLocaleString("vi-VN")} đ</div>
        <div>${badgeTon}</div>
        <div>${statusBadge}</div>
        <div class="table-align-right">${nutThaoTac}</div>
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
      <div class="inv-modal-header">
        <img src="${sp.image || ''}" class="inv-modal-img">
        <div>
          <h4 class="inv-modal-title">${sp.name}</h4>
          <span class="badge-code-pill">${sp.code || ('SP-' + sp.id)}</span>
          <span class="inv-modal-brand">Hãng: ${sp.brand || 'Chính hãng'}</span>
        </div>
      </div>
      <table class="inv-modal-table">
        <tr class="inv-table-row"><td class="inv-col-label">Giá vốn:</td><td class="inv-val-bold">${giaVon.toLocaleString('vi-VN')} đ</td></tr>
        <tr class="inv-table-row"><td class="inv-col-label">Giá bán niêm yết:</td><td class="inv-val-bold inv-val-accent">${Number(sp.price || 0).toLocaleString('vi-VN')} đ</td></tr>
        <tr><td class="inv-col-label">Tồn kho hiện tại:</td><td class="${ton <= 5 ? 'inv-stock-bold-danger' : 'inv-stock-bold-success'}">${ton} cái</td></tr>
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
    var maPhieu = phieu.importId || phieu.id || phieu.slipId || ("PN-" + (j + 1));

    if (maSPChon === "") {
      var soLuongNhap = Number(phieu.totalQuantity || phieu.quantity || 1);
      danhSachGD.push({
        ngay: ngayPhieu,
        ma: maPhieu,
        loai: "Nhập kho",
        slNhap: soLuongNhap,
        slXuat: 0
      });
    } else {
      var slNhapKhop = 0;
      if (String(phieu.productId) === String(maSPChon)) {
        slNhapKhop += Number(phieu.totalQuantity || phieu.quantity || 1);
      } else if (phieu.items && phieu.items.length) {
        for (var mi = 0; mi < phieu.items.length; mi++) {
          if (String(phieu.items[mi].productId || phieu.items[mi].id) === String(maSPChon)) {
            slNhapKhop += Number(phieu.items[mi].quantity || 1);
          }
        }
      }
      if (slNhapKhop > 0) {
        danhSachGD.push({
          ngay: ngayPhieu,
          ma: maPhieu,
          loai: "Nhập kho",
          slNhap: slNhapKhop,
          slXuat: 0
        });
      }
    }
  }

  // 3. Thu thập danh sách các đơn hàng xuất bán
  for (var k = 0; k < dsDon.length; k++) {
    var don = dsDon[k];
    if (don.status !== "Đã hủy") {
      var ngayDon = (don.createdAt ? don.createdAt.split("T")[0] : don.date) || "2026-10-20";
      var maDon = don.orderId || don.id || ("DH-" + (k + 1));
      var dsMon = don.items || don.orderItems || [];

      if (maSPChon === "") {
        var tongSlXuat = 0;
        if (dsMon.length > 0) {
          for (var xi = 0; xi < dsMon.length; xi++) {
            tongSlXuat += Number(dsMon[xi].quantity || 1);
          }
        } else {
          tongSlXuat = Number(don.totalQuantity || 1);
        }
        danhSachGD.push({
          ngay: ngayDon,
          ma: maDon,
          loai: "Xuất bán",
          slNhap: 0,
          slXuat: tongSlXuat
        });
      } else {
        var slXuatKhop = 0;
        for (var xi = 0; xi < dsMon.length; xi++) {
          if (String(dsMon[xi].productId || dsMon[xi].id) === String(maSPChon)) {
            slXuatKhop += Number(dsMon[xi].quantity || 1);
          }
        }
        if (slXuatKhop > 0) {
          danhSachGD.push({
            ngay: ngayDon,
            ma: maDon,
            loai: "Xuất bán",
            slNhap: 0,
            slXuat: slXuatKhop
          });
        }
      }
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

  htmlBang += '<div class="movement-row-initial">';
  htmlBang += '  <div>' + tuNgay + '</div>';
  htmlBang += '  <div><span class="badge-code-pill movement-badge-initial">ĐẦU KỲ</span></div>';
  htmlBang += '  <div>Tồn ban đầu</div>';
  htmlBang += '  <div class="movement-cell-dash">—</div>';
  htmlBang += '  <div class="movement-cell-dash">—</div>';
  htmlBang += '  <div class="movement-cell-ending">' + tonDauKy + ' cái</div>';
  htmlBang += '</div>';

  for (var r = 0; r < gdTrongKy.length; r++) {
    var row = gdTrongKy[r];
    tonLuyKe = tonLuyKe + row.slNhap - row.slXuat;

    var cotNhap = row.slNhap > 0 ? ('<strong class="movement-val-import">+' + row.slNhap + '</strong>') : '<span class="movement-cell-muted">—</span>';
    var cotXuat = row.slXuat > 0 ? ('<strong class="movement-val-export">-' + row.slXuat + '</strong>') : '<span class="movement-cell-muted">—</span>';

    htmlBang += '<div class="movement-row-item">';
    htmlBang += '  <div>' + row.ngay + '</div>';
    htmlBang += '  <div><span class="badge-code-pill">' + row.ma + '</span></div>';
    htmlBang += '  <div>' + row.loai + '</div>';
    htmlBang += '  <div class="movement-cell-center">' + cotNhap + '</div>';
    htmlBang += '  <div class="movement-cell-center">' + cotXuat + '</div>';
    htmlBang += '  <div class="movement-cell-cumul">' + tonLuyKe + ' cái</div>';
    htmlBang += '</div>';
  }

  htmlBang += '<div class="movement-row-final">';
  htmlBang += '  <div>' + denNgay + '</div>';
  htmlBang += '  <div><span class="badge-code-pill movement-badge-final">CUỐI KỲ</span></div>';
  htmlBang += '  <div>Tồn cuối kỳ</div>';
  htmlBang += '  <div class="movement-cell-final-import">+' + tongNhap + '</div>';
  htmlBang += '  <div class="movement-cell-final-export">-' + tongXuat + '</div>';
  htmlBang += '  <div class="movement-cell-final-stock">' + tonCuoiKy + ' cái</div>';
  htmlBang += '</div>';

  bang.innerHTML = htmlBang;
}

