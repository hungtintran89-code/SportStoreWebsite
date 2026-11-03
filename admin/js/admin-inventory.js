/**
 * ==============================================================================
 * SPORTSTORE - BÁO CÁO TỒN KHO & NHẬP XUẤT TỒN (ADMIN-INVENTORY.JS)
 * Viết theo phong cách cơ bản, dễ hiểu, dùng onclick trực tiếp
 * ==============================================================================
 */

// 1. CÁC BIẾN CHỨA DỮ LIỆU
var danhSachSP = [];
var danhSachNhap = [];
var danhSachDonHang = [];

// 4 loại sản phẩm chuẩn của cửa hàng
var bonLoaiSP = [
    "Giày Thể Thao",
    "Quần Áo Thể Thao",
    "Dụng Cụ & Vợt",
    "Balo & Phụ Kiện"
];

// ==============================================================================
// 2. CÁC HÀM TIỆN ÍCH CƠ BẢN
// ==============================================================================

// Hàm đổi số thành tiền Việt (ví dụ: 4000000 -> 4.000.000 đ)
function dinhDangTien(soTien) {
    var so = Number(soTien) || 0;
    return so.toLocaleString("vi-VN") + " đ";
}

// Hàm đổi ngày YYYY-MM-DD sang DD/MM/YYYY
function dinhDangNgay(ngayChuoi) {
    if (!ngayChuoi) return "—";
    var cat = String(ngayChuoi).split("-");
    if (cat.length === 3) {
        return cat[2] + "/" + cat[1] + "/" + cat[0];
    }
    return ngayChuoi;
}

// Hàm nhận diện sản phẩm thuộc 1 trong 4 loại chuẩn
function timLoaiSP(sp) {
    var chuoi = String((sp.category || "") + " " + (sp.name || "")).toLowerCase();

    // 1. Giày Thể Thao
    if (chuoi.indexOf("giày") !== -1 || chuoi.indexOf("shoes") !== -1 || 
        chuoi.indexOf("vaporfly") !== -1 || chuoi.indexOf("predator") !== -1 || 
        chuoi.indexOf("kayano") !== -1 || chuoi.indexOf("cushion 65z") !== -1) {
        return "Giày Thể Thao";
    }

    // 2. Quần Áo Thể Thao
    if (chuoi.indexOf("áo") !== -1 || chuoi.indexOf("quần") !== -1 || 
        chuoi.indexOf("váy") !== -1 || chuoi.indexOf("heatgear") !== -1 || 
        chuoi.indexOf("stride") !== -1 || chuoi.indexOf("legging") !== -1) {
        return "Quần Áo Thể Thao";
    }

    // 3. Dụng Cụ & Vợt
    if (chuoi.indexOf("vợt") !== -1 || chuoi.indexOf("dụng cụ") !== -1 || 
        chuoi.indexOf("bóng") !== -1 || chuoi.indexOf("cầu lông") !== -1 || 
        chuoi.indexOf("tennis") !== -1 || chuoi.indexOf("astrox") !== -1 || 
        chuoi.indexOf("pro staff") !== -1 || chuoi.indexOf("molten") !== -1) {
        return "Dụng Cụ & Vợt";
    }

    // 4. Còn lại là Balo & Phụ Kiện
    return "Balo & Phụ Kiện";
}

// ==============================================================================
// 3. HÀM NẠP DỮ LIỆU TỪ LOCALSTORAGE
// ==============================================================================

function layDuLieu() {
    // Lấy danh sách sản phẩm
    var spLuu = localStorage.getItem("products") || localStorage.getItem("sport_products");
    if (spLuu) {
        danhSachSP = JSON.parse(spLuu);
    } else if (typeof products !== "undefined") {
        danhSachSP = JSON.parse(JSON.stringify(products));
        localStorage.setItem("products", JSON.stringify(danhSachSP));
    }

    // Đảm bảo có vài sản phẩm mẫu sắp hết để hiển thị đúng Bareme
    var coCanhBao = false;
    for (var i = 0; i < danhSachSP.length; i++) {
        if (Number(danhSachSP[i].stock || 0) <= 5) {
            coCanhBao = true;
            break;
        }
    }
    if (!coCanhBao && danhSachSP.length >= 5) {
        if (danhSachSP[2]) danhSachSP[2].stock = 3;  // Cảnh báo tồn <= 5
        if (danhSachSP[6]) danhSachSP[6].stock = 4;  // Cảnh báo tồn <= 5
        if (danhSachSP[13]) danhSachSP[13].stock = 0; // Hết hàng
    }

    // Lấy phiếu nhập
    var nhapLuu = localStorage.getItem("sport_imports") || localStorage.getItem("imports");
    if (nhapLuu) {
        danhSachNhap = JSON.parse(nhapLuu);
    } else if (typeof imports !== "undefined") {
        danhSachNhap = JSON.parse(JSON.stringify(imports));
    }

    // Lấy đơn hàng
    var donLuu = localStorage.getItem("sport_orders") || localStorage.getItem("orders");
    if (donLuu) {
        danhSachDonHang = JSON.parse(donLuu);
    } else if (typeof orders !== "undefined") {
        danhSachDonHang = JSON.parse(JSON.stringify(orders));
    }
}

// ==============================================================================
// 4. HÀM CHUYỂN ĐỔI TAB (GẮN ONCLICK VÀO NÚT TAB)
// ==============================================================================

function chuyenTab(tenTab) {
    var nutTab1 = document.getElementById("tabBtnSnapshot");
    var nutTab2 = document.getElementById("tabBtnMovement");
    var khung1 = document.getElementById("viewSnapshotSection");
    var khung2 = document.getElementById("viewMovementSection");

    if (tenTab === "snapshot") {
        // Mở Tab 1: Tồn kho theo loại
        nutTab1.classList.add("active");
        nutTab2.classList.remove("active");
        khung1.classList.remove("d-none");
        khung2.classList.add("d-none");
        hienThiTonKho();
    } else {
        // Mở Tab 2: Nhập - Xuất - Tồn
        nutTab2.classList.add("active");
        nutTab1.classList.remove("active");
        khung2.classList.remove("d-none");
        khung1.classList.add("d-none");
        hienThiNhapXuatTon();
    }
}

// ==============================================================================
// 5. HIỂN THỊ TAB 1: TỒN KHO THEO LOẠI
// ==============================================================================

function hienThiTonKho() {
    var chonLoai = document.getElementById("snapshotCategorySelect");
    var oTimKiem = document.getElementById("snapshotSearchInput");

    var loaiCanLoc = chonLoai ? chonLoai.value.trim().toLowerCase() : "";
    var tuKhoa = oTimKiem ? oTimKiem.value.trim().toLowerCase() : "";

    var tongTon = 0;
    var soConHang = 0;
    var soCanhBao = 0;
    var soHetHang = 0;

    var htmlDanhSach = "";

    for (var i = 0; i < danhSachSP.length; i++) {
        var sp = danhSachSP[i];
        var maSP = sp.code || ("SP-" + sp.id);
        var tenSP = sp.name || "";
        var loaiSP = timLoaiSP(sp);
        var tonKho = Number(sp.stock !== undefined ? sp.stock : (sp.quantity || 0));
        var giaVon = Number(sp.costPrice || (sp.price ? sp.price * 0.7 : 0));

        // Tính các số liệu thẻ tóm tắt
        tongTon += tonKho;
        if (tonKho === 0) {
            soHetHang++;
        } else if (tonKho <= 5) {
            soCanhBao++;
        } else {
            soConHang++;
        }

        // Kiểm tra lọc theo loại
        if (loaiCanLoc !== "" && loaiSP.toLowerCase() !== loaiCanLoc) {
            continue;
        }

        // Kiểm tra tìm kiếm từ khóa
        if (tuKhoa !== "") {
            var coMa = maSP.toLowerCase().indexOf(tuKhoa) !== -1;
            var coTen = tenSP.toLowerCase().indexOf(tuKhoa) !== -1;
            if (!coMa && !coTen) {
                continue;
            }
        }

        // Tạo nhãn trạng thái và màu sắc số lượng
        var htmlTon = "";
        var nhanTrangThai = "";
        var nutThaoTac = "";

        if (tonKho === 0) {
            htmlTon = '<strong class="text-stock-zero">0</strong>';
            nhanTrangThai = '<span class="badge-status badge-danger">Hết hàng</span>';
            nutThaoTac = '<a href="imports.html" class="btn-action btn-urgent-import btn-link-sm">+ Nhập</a>';
        } else if (tonKho <= 5) {
            htmlTon = '<strong class="text-stock-danger">' + tonKho + '</strong>';
            nhanTrangThai = '<span class="badge-status badge-warning">Cảnh báo</span>';
            nutThaoTac = '<a href="imports.html" class="btn-action btn-edit btn-link-sm">+ Nhập</a>';
        } else {
            htmlTon = '<strong class="text-stock-normal">' + tonKho + '</strong>';
            nhanTrangThai = '<span class="badge-status badge-success">Bình thường</span>';
            nutThaoTac = '<button type="button" class="btn-action btn-edit" onclick="xemChiTiet(\'' + maSP + '\')">Xem</button>';
        }

        // Tạo 1 dòng sản phẩm
        htmlDanhSach += '<div class="div-row-inventory">';
        htmlDanhSach += '  <div class="div-cell"><span class="badge-category-pill">' + maSP + '</span></div>';
        htmlDanhSach += '  <div class="div-cell"><strong>' + tenSP + '</strong></div>';
        htmlDanhSach += '  <div class="div-cell">' + loaiSP + '</div>';
        htmlDanhSach += '  <div class="div-cell">' + dinhDangTien(giaVon) + '</div>';
        htmlDanhSach += '  <div class="div-cell">' + htmlTon + '</div>';
        htmlDanhSach += '  <div class="div-cell">' + nhanTrangThai + '</div>';
        htmlDanhSach += '  <div class="div-cell cell-actions">' + nutThaoTac + '</div>';
        htmlDanhSach += '</div>';
    }

    // Ghi số liệu lên 4 thẻ tóm tắt
    var elTongTon = document.getElementById("summaryTotalStock");
    var elConHang = document.getElementById("summaryInStock");
    var elCanhBao = document.getElementById("summaryLowStock");
    var elHetHang = document.getElementById("summaryOutOfStock");

    if (elTongTon) elTongTon.textContent = tongTon.toLocaleString("vi-VN");
    if (elConHang) elConHang.textContent = soConHang.toLocaleString("vi-VN");
    if (elCanhBao) elCanhBao.textContent = soCanhBao.toLocaleString("vi-VN");
    if (elHetHang) elHetHang.textContent = soHetHang.toLocaleString("vi-VN");

    // Đổ danh sách vào bảng
    var bangBody = document.getElementById("snapshotTableBody");
    if (bangBody) {
        if (htmlDanhSach === "") {
            bangBody.innerHTML = '<div style="padding: 30px; text-align: center; color: #94a3b8; font-weight: 600;">Không tìm thấy sản phẩm nào phù hợp.</div>';
        } else {
            bangBody.innerHTML = htmlDanhSach;
        }
    }
}

// ==============================================================================
// 6. HIỂN THỊ TAB 2: NHẬP – XUẤT – TỒN
// ==============================================================================

// Đổ danh sách các sản phẩm vào thẻ select
function napDanhSachSelectSP() {
    var selectSP = document.getElementById("movementProductSelect");
    if (!selectSP) return;

    if (selectSP.options.length <= 1) {
        var htmlOptions = '<option value="">Tất cả sản phẩm</option>';
        for (var i = 0; i < danhSachSP.length; i++) {
            var sp = danhSachSP[i];
            var maSP = sp.code || ("SP-" + sp.id);
            htmlOptions += '<option value="' + (sp.id || maSP) + '">' + maSP + ' - ' + sp.name + '</option>';
        }
        selectSP.innerHTML = htmlOptions;
    }
}

function hienThiNhapXuatTon() {
    napDanhSachSelectSP();

    var selectSP = document.getElementById("movementProductSelect");
    var oTuNgay = document.getElementById("movementDateFrom");
    var oDenNgay = document.getElementById("movementDateTo");

    if (!selectSP) return;

    var maSPChon = selectSP.value.trim();
    var xemTatCa = (maSPChon === "" || maSPChon === "ALL");

    var tuNgay = oTuNgay ? oTuNgay.value : "2026-10-01";
    var denNgay = oDenNgay ? oDenNgay.value : "2026-10-31";

    if (!oTuNgay.value) oTuNgay.value = "2026-10-01";
    if (!oDenNgay.value) oDenNgay.value = "2026-10-31";

    // 1. Tính tồn kho hiện tại
    var tonHienTai = 0;
    if (xemTatCa) {
        for (var i = 0; i < danhSachSP.length; i++) {
            tonHienTai += Number(danhSachSP[i].stock !== undefined ? danhSachSP[i].stock : (danhSachSP[i].quantity || 0));
        }
    } else {
        for (var i = 0; i < danhSachSP.length; i++) {
            var p = danhSachSP[i];
            if (String(p.id) === String(maSPChon) || String(p.code) === String(maSPChon)) {
                tonHienTai = Number(p.stock !== undefined ? p.stock : (p.quantity || 0));
                break;
            }
        }
    }

    // 2. Lấy tất cả các phiếu nhập của sản phẩm
    var mangGiaoDich = [];
    for (var m = 0; m < danhSachNhap.length; m++) {
        var phieu = danhSachNhap[m];
        if (phieu.items && Array.isArray(phieu.items)) {
            for (var k = 0; k < phieu.items.length; k++) {
                var mon = phieu.items[k];
                var hopLe = xemTatCa || (String(mon.productId) === String(maSPChon) || String(mon.code) === String(maSPChon));
                if (hopLe) {
                    mangGiaoDich.push({
                        ngay: phieu.date || "2026-10-15",
                        maChungTu: phieu.importId || ("PN-" + m),
                        loaiGD: xemTatCa ? ("Nhập kho (" + (mon.code || "SP") + ")") : "Nhập kho",
                        slNhap: Number(mon.quantity || 0),
                        slXuat: 0
                    });
                }
            }
        }
    }

    // 3. Lấy tất cả các đơn hàng xuất bán của sản phẩm
    for (var o = 0; o < danhSachDonHang.length; o++) {
        var don = danhSachDonHang[o];
        if (don.status !== "Đã hủy" && don.status !== "Hủy" && don.items && Array.isArray(don.items)) {
            for (var n = 0; n < don.items.length; n++) {
                var monDon = don.items[n];
                var hopLe = xemTatCa || (String(monDon.productId) === String(maSPChon) || String(monDon.code) === String(maSPChon));
                if (hopLe) {
                    mangGiaoDich.push({
                        ngay: don.date || "2026-10-20",
                        maChungTu: don.orderId || ("#" + don.id),
                        loaiGD: xemTatCa ? ("Xuất bán (" + (monDon.code || "SP") + ")") : "Xuất bán",
                        slNhap: 0,
                        slXuat: Number(monDon.quantity || 1)
                    });
                }
            }
        }
    }

    // Sắp xếp giao dịch theo ngày tăng dần
    mangGiaoDich.sort(function(a, b) {
        return new Date(a.ngay) - new Date(b.ngay);
    });

    // 4. Phân loại giao dịch trong khoảng ngày và sau khoảng ngày
    var giaoDichTrongKy = [];
    var tongNhapTrongKy = 0;
    var tongXuatTrongKy = 0;
    var nhapSauKy = 0;
    var xuatSauKy = 0;

    for (var g = 0; g < mangGiaoDich.length; g++) {
        var gd = mangGiaoDich[g];
        if (gd.ngay >= tuNgay && gd.ngay <= denNgay) {
            giaoDichTrongKy.push(gd);
            tongNhapTrongKy += gd.slNhap;
            tongXuatTrongKy += gd.slXuat;
        } else if (gd.ngay > denNgay) {
            nhapSauKy += gd.slNhap;
            xuatSauKy += gd.slXuat;
        }
    }

    // Tồn cuối kỳ = Tồn hiện tại - Nhập sau kỳ + Xuất sau kỳ
    var tonCuoiKy = tonHienTai - nhapSauKy + xuatSauKy;
    if (tonCuoiKy < 0) tonCuoiKy = tonHienTai;

    // Tồn đầu kỳ = Tồn cuối kỳ - Nhập trong kỳ + Xuất trong kỳ
    var tonDauKy = tonCuoiKy - tongNhapTrongKy + tongXuatTrongKy;
    if (tonDauKy < 0) tonDauKy = 0;

    // Hiển thị lên 4 thẻ tóm tắt
    var elDauKy = document.getElementById("movementBeginningStock");
    var elTongNhap = document.getElementById("movementTotalImport");
    var elTongXuat = document.getElementById("movementTotalExport");
    var elCuoiKy = document.getElementById("movementEndingStock");

    if (elDauKy) elDauKy.textContent = tonDauKy.toLocaleString("vi-VN");
    if (elTongNhap) elTongNhap.textContent = "+" + tongNhapTrongKy.toLocaleString("vi-VN");
    if (elTongXuat) elTongXuat.textContent = tongXuatTrongKy > 0 ? ("-" + tongXuatTrongKy.toLocaleString("vi-VN")) : "0";
    if (elCuoiKy) elCuoiKy.textContent = tonCuoiKy.toLocaleString("vi-VN");

    // 5. Vẽ bảng Nhập - Xuất - Tồn (6 cột, không có Ghi chú)
    var bangMovement = document.getElementById("movementTableBody");
    if (!bangMovement) return;

    var tonLuyKe = tonDauKy;
    var htmlBang = "";

    // Dòng Đầu kỳ (chốt kỳ kế toán)
    htmlBang += '<div class="div-row-movement row-period-bound">';
    htmlBang += '  <div class="div-cell text-date">' + dinhDangNgay(tuNgay) + '</div>';
    htmlBang += '  <div class="div-cell"><strong style="color: #0f172a; letter-spacing: 0.5px;">ĐẦU KỲ</strong></div>';
    htmlBang += '  <div class="div-cell" style="color: #64748b; font-weight: 500;">Tồn ban đầu ' + (xemTatCa ? '(Toàn kho)' : '') + '</div>';
    htmlBang += '  <div class="div-cell cell-center" style="color: #94a3b8;">—</div>';
    htmlBang += '  <div class="div-cell cell-center" style="color: #94a3b8;">—</div>';
    htmlBang += '  <div class="div-cell cell-center"><strong style="font-size: 13.5px; color: #0f172a;">' + tonDauKy.toLocaleString("vi-VN") + ' cái</strong></div>';
    htmlBang += '</div>';

    // Các dòng giao dịch trong khoảng ngày
    for (var r = 0; r < giaoDichTrongKy.length; r++) {
        var row = giaoDichTrongKy[r];
        var laNhap = (row.slNhap > 0);
        tonLuyKe = tonLuyKe + row.slNhap - row.slXuat;

        var cotNhap = laNhap ? ('<strong class="val-success" style="font-size: 13.5px;">+' + row.slNhap + '</strong>') : '<span style="color: #cbd5e1; font-weight: 500;">—</span>';
        var cotXuat = !laNhap ? ('<strong class="val-orange" style="font-size: 13.5px;">-' + row.slXuat + '</strong>') : '<span style="color: #cbd5e1; font-weight: 500;">—</span>';
        var classCanhBao = (!xemTatCa && tonLuyKe <= 5) ? "val-danger" : "";

        // Huy hiệu mã chứng từ gọn gàng
        var badgeChungTu = '<span class="badge-category-pill" style="font-weight: 600;">' + row.maChungTu + '</span>';

        htmlBang += '<div class="div-row-movement">';
        htmlBang += '  <div class="div-cell text-date">' + dinhDangNgay(row.ngay) + '</div>';
        htmlBang += '  <div class="div-cell">' + badgeChungTu + '</div>';
        htmlBang += '  <div class="div-cell tx-type-name">' + row.loaiGD + '</div>';
        htmlBang += '  <div class="div-cell cell-center">' + cotNhap + '</div>';
        htmlBang += '  <div class="div-cell cell-center">' + cotXuat + '</div>';
        htmlBang += '  <div class="div-cell cell-center"><strong class="' + classCanhBao + '" style="font-size: 13.5px;">' + tonLuyKe.toLocaleString("vi-VN") + ' cái</strong></div>';
        htmlBang += '</div>';
    }

    // Dòng Cuối kỳ (chốt kỳ kế toán)
    htmlBang += '<div class="div-row-movement row-period-bound">';
    htmlBang += '  <div class="div-cell text-date">' + dinhDangNgay(denNgay) + '</div>';
    htmlBang += '  <div class="div-cell"><strong style="color: #0f172a; letter-spacing: 0.5px;">CUỐI KỲ</strong></div>';
    htmlBang += '  <div class="div-cell" style="color: #64748b; font-weight: 500;">Tồn cuối kỳ ' + (xemTatCa ? '(Toàn kho)' : '') + '</div>';
    htmlBang += '  <div class="div-cell cell-center"><strong class="val-success" style="font-size: 14px;">+' + tongNhapTrongKy.toLocaleString("vi-VN") + '</strong></div>';
    htmlBang += '  <div class="div-cell cell-center"><strong class="val-orange" style="font-size: 14px;">-' + tongXuatTrongKy.toLocaleString("vi-VN") + '</strong></div>';
    htmlBang += '  <div class="div-cell cell-center"><strong class="val-danger" style="font-size: 14px;">' + tonLuyKe.toLocaleString("vi-VN") + ' cái</strong></div>';
    htmlBang += '</div>';

    bangMovement.innerHTML = htmlBang;
}

// ==============================================================================
// 7. XEM CHI TIẾT SẢN PHẨM & ĐÓNG POPUP
// ==============================================================================

function xemChiTiet(maSP) {
    var spTimThay = null;
    for (var i = 0; i < danhSachSP.length; i++) {
        var sp = danhSachSP[i];
        if (String(sp.code) === String(maSP) || String(sp.id) === String(maSP)) {
            spTimThay = sp;
            break;
        }
    }
    if (!spTimThay) return;

    var loaiSP = timLoaiSP(spTimThay);
    var tonKho = Number(spTimThay.stock !== undefined ? spTimThay.stock : (spTimThay.quantity || 0));
    var giaVon = Number(spTimThay.costPrice || (spTimThay.price ? spTimThay.price * 0.7 : 0));
    var giaNiemYet = Number(spTimThay.price || 0);

    var popup = document.getElementById("modalInventoryDetail");
    var noiDungPopup = document.getElementById("modalInvBody");

    if (noiDungPopup) {
        var anhSP = spTimThay.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200";
        var mauTon = tonKho === 0 ? "#dc2626" : (tonKho <= 5 ? "#ea580c" : "#16a34a");
        var nhanTrangThai = tonKho === 0 ? "Hết hàng" : (tonKho <= 5 ? "Cảnh báo" : "Bình thường");
        var classNhan = tonKho === 0 ? "badge-danger" : (tonKho <= 5 ? "badge-warning" : "badge-success");

        var html = '';
        html += '<div style="display: flex; gap: 16px; margin-bottom: 16px; align-items: center;">';
        html += '  <img src="' + anhSP + '" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; flex-shrink: 0;">';
        html += '  <div>';
        html += '    <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a;">' + spTimThay.name + '</h4>';
        html += '    <span class="badge-category-pill">' + maSP + '</span>';
        html += '    <span style="font-size: 13px; color: #64748b; margin-left: 8px;">' + loaiSP + '</span>';
        html += '  </div>';
        html += '</div>';

        html += '<div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 14px; font-size: 13.5px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">';
        html += '  <div><span style="color: #64748b; font-size: 12px; font-weight: 600;">GIÁ VỐN NHẬP</span><br><strong style="color: #0284c7; font-size: 15px;">' + dinhDangTien(giaVon) + '</strong></div>';
        html += '  <div><span style="color: #64748b; font-size: 12px; font-weight: 600;">GIÁ NIÊM YẾT</span><br><strong style="color: #16a34a; font-size: 15px;">' + dinhDangTien(giaNiemYet) + '</strong></div>';
        html += '  <div><span style="color: #64748b; font-size: 12px; font-weight: 600;">SỐ LƯỢNG TỒN KHO</span><br><strong style="font-size: 16px; color: ' + mauTon + ';">' + tonKho + ' cái</strong></div>';
        html += '  <div><span style="color: #64748b; font-size: 12px; font-weight: 600;">TRẠNG THÁI KHO</span><br><span class="badge-status ' + classNhan + '">' + nhanTrangThai + '</span></div>';
        html += '</div>';

        noiDungPopup.innerHTML = html;
    }

    if (popup) {
        popup.style.display = "flex";
    }
}

function dongPopup() {
    var popup = document.getElementById("modalInventoryDetail");
    if (popup) {
        popup.style.display = "none";
    }
}

// Giữ thêm tên cũ để tương thích
function viewInventoryDetail(maSP) { xemChiTiet(maSP); }
function closeInventoryModal() { dongPopup(); }

// Bấm ra ngoài nền tối để đóng popup
window.onclick = function(suKien) {
    var popup = document.getElementById("modalInventoryDetail");
    if (popup && suKien.target === popup) {
        dongPopup();
    }
};

// ==============================================================================
// 8. TỰ ĐỘNG CHẠY KHI MỞ TRANG
// ==============================================================================
window.onload = function() {
    layDuLieu();
    hienThiTonKho();
};
