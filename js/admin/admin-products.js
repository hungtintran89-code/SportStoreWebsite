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

    var laDangAn = (c.status === "hidden" || c.status === "inactive");
    var badgeTrangThai = laDangAn
        ? `<span class="nav-badge badge-gray badge-status-hidden">Đang ẩn</span>`
        : `<span class="nav-badge badge-green">Đang áp dụng</span>`;

    var nutDoiTrangThai = laDangAn
        ? `<button type="button" class="btn-action btn-action-show" onclick="doiTrangThaiDanhMucAdmin('${ma}')">Hiện</button>`
        : `<button type="button" class="btn-action btn-lock" onclick="doiTrangThaiDanhMucAdmin('${ma}')">Ẩn</button>`;

    html += `
      <tr class="${laDangAn ? 'table-row-hidden' : ''}">
        <td class="cat-icon-cell">${c.icon || "🏷️"}</td>
        <td><strong>${ma}</strong></td>
        <td><strong>${ten}</strong></td>
        <td><span class="nav-badge badge-blue">${soSp} sản phẩm</span></td>
        <td><strong>${c.profitPercent || 25}%</strong></td>
        <td>${badgeTrangThai}</td>
        <td>
          <button type="button" class="btn-action btn-edit" onclick="moModalSuaDanhMuc('${ma}')">Sửa</button>
          ${nutDoiTrangThai}
          <button type="button" class="btn-action btn-delete" onclick="xoaDanhMucAdmin('${ma}')">Xóa</button>
        </td>
      </tr>
    `;
  }
  if (html === "") html = `<tr><td colspan="7" class="table-empty-row">Chưa có danh mục nào.</td></tr>`;
  tbody.innerHTML = html;
}

function doiTrangThaiDanhMucAdmin(maLoai) {
  var dsLoai = layDuLieuAdmin("sport_categories");
  var tenLoai = "";
  var trangThaiMoi = "active";
  var catItem = null;

  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === maLoai || dsLoai[i].code === maLoai) {
      catItem = dsLoai[i];
      tenLoai = dsLoai[i].name || maLoai;
      dsLoai[i].status = (dsLoai[i].status === "hidden") ? "active" : "hidden";
      trangThaiMoi = dsLoai[i].status;
      break;
    }
  }

  luuDuLieuAdmin("sport_categories", dsLoai);

  // ĐỒNG BỘ: Ẩn/Hiện toàn bộ sản phẩm thuộc loại này
  if (catItem) {
    var dsSp = layDuLieuAdmin("sport_products");
    for (var j = 0; j < dsSp.length; j++) {
      if (dsSp[j].categoryId === catItem.id || dsSp[j].category === catItem.name) {
        dsSp[j].status = trangThaiMoi;
      }
    }
    luuDuLieuAdmin("sport_products", dsSp);
  }

  hienThiBangDanhMucAdmin();
  if (typeof hienThiBangSanPhamAdmin === "function") hienThiBangSanPhamAdmin();
  capNhatSoDemMenuAdmin();

  if (typeof showToast === "function") {
    if (trangThaiMoi === "active") {
      showToast('Đã mở bán lại danh mục "' + tenLoai + '" và các sản phẩm liên kết!', "success");
    } else {
      showToast('Đã ẩn danh mục "' + tenLoai + '" và toàn bộ sản phẩm liên kết!', "warning");
    }
  }
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
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục [" + maLoai + "] không? Tất cả các sản phẩm thuộc danh mục này cũng sẽ bị xóa khỏi hệ thống!")) return;

  // 1. Tìm thông tin danh mục cần xóa
  var dsLoai = layDuLieuAdmin("sport_categories");
  var danhMucCanXoa = null;
  for (var i = 0; i < dsLoai.length; i++) {
    if (dsLoai[i].id === maLoai || dsLoai[i].code === maLoai) {
      danhMucCanXoa = dsLoai[i];
      dsLoai.splice(i, 1); // Xóa khỏi danh sách loại
      break;
    }
  }
  luuDuLieuAdmin("sport_categories", dsLoai);

  if (danhMucCanXoa) {
    var dsSp = layDuLieuAdmin("sport_products");
    var idXoa = danhMucCanXoa.id || maLoai;
    var tenXoa = danhMucCanXoa.name || "";

    var dsSpConLai = dsSp.filter(function (sp) {
      var laTrungId = sp.categoryId && (sp.categoryId === idXoa || sp.categoryId === maLoai);
      var laTrungTen = sp.category && sp.category === tenXoa;
      return !laTrungId && !laTrungTen;
    });

    luuDuLieuAdmin("sport_products", dsSpConLai);
  }

  // 3. Vẽ lại bảng và cập nhật số đếm menu (Badge sản phẩm sẽ giảm ngay)
  hienThiBangDanhMucAdmin();
  if (typeof hienThiBangSanPhamAdmin === "function") hienThiBangSanPhamAdmin();
  capNhatSoDemMenuAdmin();
  if (typeof showToast === "function") showToast("Đã xóa danh mục và toàn bộ sản phẩm liên kết!", "success");
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
    var canhBaoTon = ton <= 5 ? `<span class="cell-stock-low">⚠️ ${ton}</span>` : `<strong>${ton}</strong>`;

    // 1. Kiểm tra trạng thái động
    if( p.stock <= 0 ) p.status = "hidden" ;
    var laDangAn = p.status === "hidden";

    var badgeTrangThai = laDangAn
        ? `<span class="nav-badge badge-gray badge-status-hidden">Đang ẩn</span>`
        : `<span class="nav-badge badge-green">Đang bán</span>`;

    // 2. Nút bấm đổi trạng thái nhanh
    var nutDoiTrangThai = laDangAn
        ? `<button type="button" class="btn-action btn-action-success" onclick="doiTrangThaiSanPhamAdmin(${p.id})">Hiện</button>`
        : `<button type="button" class="btn-action btn-lock" onclick="doiTrangThaiSanPhamAdmin(${p.id})">Ẩn</button>`;

    html += `
      <tr class="${laDangAn ? 'table-row-hidden' : ''}">
        <td><img src="${p.image || ''}" class="table-thumb"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category || p.categoryId || "Khác"}</td>
        <td>${p.brand || "Sport"}</td>
        <td><strong class="cell-accent">${formatMoney(p.price)}</strong></td>
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
  if (html === "") html = `<tr><td colspan="8" class="table-empty-row">Không tìm thấy sản phẩm nào.</td></tr>`;
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

  // 1. NẠP TIÊU ĐỀ VÀ CÁC THÔNG TIN CƠ BẢN
  if (document.getElementById("modal-product-title")) document.getElementById("modal-product-title").textContent = "Chỉnh Sửa Sản Phẩm #" + maSp;
  if (document.getElementById("prod-name")) document.getElementById("prod-name").value = p.name || "";
  if (document.getElementById("prod-code")) document.getElementById("prod-code").value = p.code || ("SP-" + p.id);
  if (document.getElementById("prod-brand")) document.getElementById("prod-brand").value = p.brand || "";
  if (document.getElementById("prod-category")) document.getElementById("prod-category").value = p.categoryId || "";

  // 2. NẠP GIÁ VỐN VÀ GIÁ BÁN
  var giaVon = Number(p.costPrice || p.cost || (p.price ? Math.round(p.price * 0.7) : 0));
  if (document.getElementById("prod-cost")) document.getElementById("prod-cost").value = giaVon > 0 ? giaVon : "";
  if (document.getElementById("prod-price")) document.getElementById("prod-price").value = p.price || "";

  // 3. NẠP TỒN KHO, ẢNH, MÔ TẢ VÀ TRẠNG THÁI
  if (document.getElementById("prod-stock")) document.getElementById("prod-stock").value = p.stock || 0;
  if (document.getElementById("prod-image")) document.getElementById("prod-image").value = p.image || "";
  if (document.getElementById("prod-desc")) document.getElementById("prod-desc").value = p.desc || p.description || "";
  if (document.getElementById("prod-status")) document.getElementById("prod-status").value = p.status || "active";

  // 4. NẠP 2 CHECKBOX BÁN CHẠY & MỚI VỀ
  if (document.getElementById("prod-is-hot")) document.getElementById("prod-is-hot").checked = (p.isHot === true);
  if (document.getElementById("prod-is-new")) document.getElementById("prod-is-new").checked = (p.isNew === true);

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
    document.getElementById("prod-name").focus();
    return;
  }

  var gia = Number(document.getElementById("prod-price").value) || 0;
  var giaVon = Number(document.getElementById("prod-cost") ? document.getElementById("prod-cost").value : 0) || 0;

  if (giaVon <= 0) {
    alert("Vui lòng nhập giá vốn (giá đầu vào) lớn hơn 0!");
    if (document.getElementById("prod-cost")) document.getElementById("prod-cost").focus();
    return;
  }

  if (gia <= 0) {
    alert("Vui lòng nhập giá bán niêm yết lớn hơn 0!");
    if (document.getElementById("prod-price")) document.getElementById("prod-price").focus();
    return;
  }

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
    var phanTramTaoMoi = (giaVon > 0 && gia > 0) ? Math.round(((gia - giaVon) / giaVon) * 100) : 25;
    dsSp.push({
      id: idMoi,
      name: ten,
      costPrice: giaVon,
      price: gia,
      originalPrice : giaVon ,
      profitPercent: phanTramTaoMoi,
      stock: ton,
      brand: hang,
      categoryId: catId,
      image: anh,
      desc: desc,
      status: "active"
    });
    if (typeof showToast === "function") showToast("Đã thêm sản phẩm mới: " + ten, "success");
  } else {
    for (var i = 0; i < dsSp.length; i++) {
      if (dsSp[i].id === maSpDangSua) {
        dsSp[i].name = ten;
        dsSp[i].costPrice = giaVon;
        dsSp[i].price = gia;
        dsSp[i].originalPrice = giaVon ,
        dsSp[i].profitPercent = Math.round(((gia - giaVon) / giaVon) * 100);
        dsSp[i].stock = ton;
        dsSp[i].brand = hang;
        dsSp[i].categoryId = catId;
        dsSp[i].image = anh;
        dsSp[i].desc = desc;
        dsSp[i].status = trangThai;
        dsSp[i].isHot = document.getElementById("prod-is-hot") ? document.getElementById("prod-is-hot").checked : false;
        dsSp[i].isNew = document.getElementById("prod-is-new") ? document.getElementById("prod-is-new").checked : false;
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

