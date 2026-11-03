// Đọc danh sách sản phẩm và danh mục từ localStorage (hoặc file data/store)
// Anh SVG mac dinh khi san pham chua co file anh that trong kho
var ANH_CHUA_CAP_NHAT = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
  '<rect width="400" height="400" fill="#f8fafc"/>' +
  '<rect x="24" y="24" width="352" height="352" rx="16" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8 6"/>' +
  '<path d="M160 175 L200 135 L240 175 M200 135 L200 215" stroke="#64748b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
  '<rect x="135" y="115" width="130" height="115" rx="12" stroke="#64748b" stroke-width="5" fill="none"/>' +
  '<text x="200" y="268" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#334155" text-anchor="middle">CHƯA CÓ ẢNH THỰC TẾ</text>' +
  '<text x="200" y="292" font-family="Arial, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">(Cần bổ sung đúng ảnh sản phẩm)</text>' +
  '</svg>'
);

function layUrlAnhChuan(url) {
  if (!url || url === "MISSING_IMAGE") {
    return ANH_CHUA_CAP_NHAT;
  }
  return url;
}

function loadAppProducts() {
  var verHienTai = "v2026_multisport_v6_real100";
  try {
    var verLuu = localStorage.getItem("sport_data_version");
    if (verLuu !== verHienTai && typeof products !== "undefined" && Array.isArray(products)) {
      localStorage.setItem("sport_products", JSON.stringify(products));
      localStorage.setItem("sport_data_version", verHienTai);
      return products;
    }
    var stored = localStorage.getItem("sport_products");
    if (stored) {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return (typeof products !== "undefined") ? products : [];
}

function loadAppCategories() {
  try {
    var stored = localStorage.getItem("sport_categories");
    if (stored) {
      var parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Lỗi đọc sport_categories:", e);
  }
  return (typeof categories !== "undefined") ? categories : [];
}

var allProducts = loadAppProducts();
var allCategories = loadAppCategories();

// Cấu hình bộ lọc nâng cao riêng cho từng môn thể thao (tham khảo chuẩn VNB)
var SPORT_ADVANCED_CONFIG = {
  "Cầu Lông": [
    {
      key: "racketLength",
      title: "CHIỀU DÀI VỢT",
      options: ["665 mm", "670 mm", "675 mm"]
    },
    {
      key: "handleLength",
      title: "CHIỀU DÀI CÁN VỢT",
      options: ["200 mm", "205 mm", "210 mm"]
    },
    {
      key: "swingweight",
      title: "SWINGWEIGHT",
      options: [
        "Dưới 82 kg/cm2",
        "82-84 kg/cm2",
        "84-86 kg/cm2",
        "86-88 kg/cm2",
        "Trên 88 kg/cm2"
      ]
    },
    {
      key: "weight",
      title: "TRỌNG LƯỢNG",
      options: [
        "2U: 90 - 94g",
        "3U: 85 - 89g",
        "4U: 80 - 84g",
        "5U: 75 - 79g",
        "F: 70 - 74g",
        "2F: 65 - 69g"
      ]
    },
    {
      key: "balancePoint",
      title: "ĐIỂM CÂN BẰNG",
      options: [
        "Nhẹ Đầu",
        "Cân Bằng",
        "Hơi Nặng Đầu",
        "Nặng Đầu",
        "Siêu Nặng Đầu"
      ]
    },
    {
      key: "shaftFlex",
      title: "ĐỘ CỨNG ĐŨA",
      options: ["Dẻo", "Trung Bình", "Cứng", "Siêu Cứng"]
    },
    {
      key: "playStyle",
      title: "PHONG CÁCH CHƠI",
      options: ["Tấn Công", "Công Thủ Toàn Diện", "Phản Tạt, Phòng Thủ"]
    },
    {
      key: "playContent",
      title: "NỘI DUNG CHƠI",
      options: ["Đánh Đơn", "Đánh Đôi", "Cả Đơn và Đôi"]
    },
    {
      key: "skillLevel",
      title: "TRÌNH ĐỘ CHƠI",
      options: ["Mới Chơi", "Trung Bình", "Khá Tốt"]
    }
  ],
  "Bóng Đá": [
    {
      key: "surfaceType",
      title: "LOẠI MẶT SÂN",
      options: [
        "Sân cỏ nhân tạo (TF)",
        "Sân cỏ tự nhiên (FG)",
        "Sân Futsal (IC)"
      ]
    },
    {
      key: "playPosition",
      title: "VỊ TRÍ THI ĐẤU",
      options: [
        "Tiền đạo / Tốc độ",
        "Tiền vệ / Kiểm soát",
        "Hậu vệ / Toàn diện"
      ]
    },
    {
      key: "footForm",
      title: "FORM CHÂN",
      options: ["Chân bè", "Chân thon / Tiêu chuẩn"]
    },
    {
      key: "collarType",
      title: "CỔ GIÀY & TRANG BỊ",
      options: ["Cổ thấp", "Cổ cao bo chun", "Bóng & Phụ kiện"]
    }
  ],
  "Chạy Bộ": [
    {
      key: "terrain",
      title: "ĐỊA HÌNH CHẠY",
      options: [
        "Chạy đường nhựa (Road)",
        "Chạy địa hình (Trail)",
        "Chạy sân Track & Tập luyện"
      ]
    },
    {
      key: "distance",
      title: "CỰ LY MỤC TIÊU",
      options: ["5km - 10km (Hàng ngày)", "21km - 42km (Marathon)"]
    },
    {
      key: "cushionTech",
      title: "CÔNG NGHỆ ĐỆM",
      options: [
        "Đệm Carbon tăng tốc",
        "Đệm êm tối đa (Max Cushion)",
        "Siêu nhẹ thoáng khí"
      ]
    },
    {
      key: "heelDrop",
      title: "ĐỘ CHÊNH GÓT - MŨI (DROP)",
      options: ["Drop thấp (4-6mm)", "Drop tiêu chuẩn (8-10mm)"]
    }
  ],
  "Tập Gym": [
    {
      key: "workoutType",
      title: "NHÓM BÀI TẬP",
      options: [
        "Tập tạ / Squat / Deadlift",
        "Cardio / HIIT / Đa năng",
        "Yoga / Pilates / Giãn cơ"
      ]
    },
    {
      key: "resistanceLevel",
      title: "MỨC HỖ TRỢ & KHÁNG LỰC",
      options: [
        "Nhẹ - Trung bình (5-15kg)",
        "Nặng - Chuyên sâu (15-35kg)",
        "Ổn định cổ chân & khớp"
      ]
    },
    {
      key: "materialType",
      title: "CHẤT LIỆU CHÍNH",
      options: [
        "Thép bọc cao su / Đế phẳng",
        "Vải co giãn 4 chiều thoáng khí",
        "Cao su TPE / Da tổng hợp"
      ]
    },
    {
      key: "targetUser",
      title: "ĐỐI TƯỢNG TẬP",
      options: ["Nam & Nữ (Unisex)", "Nữ chuyên dụng"]
    }
  ],
  "Bóng Chuyền": [
    {
      key: "volleyballPos",
      title: "VỊ TRÍ THI ĐẤU",
      options: [
        "Chủ công / Đối chuyền (Bật nhảy)",
        "Chuyền hai / Libero (Linh hoạt)"
      ]
    },
    {
      key: "shockAbsorb",
      title: "CÔNG NGHỆ GIẢM CHẤN",
      options: [
        "Đệm GEL / Mizuno Wave êm ái",
        "Đế cao su Non-marking bám sân"
      ]
    },
    {
      key: "courtType",
      title: "LOẠI SÂN",
      options: ["Sân trong nhà (Indoor)", "Sân ngoài trời / Đa năng"]
    }
  ],
  "Bóng Rổ": [
    {
      key: "basketStyle",
      title: "LỐI CHƠI BÓNG RỔ",
      options: [
        "Hậu vệ dẫn bóng (Tốc độ)",
        "Tiền phong / Trung phong (Bật nhảy)"
      ]
    },
    {
      key: "ankleCut",
      title: "THIẾT KẾ CỔ GIÀY",
      options: [
        "Cổ thấp linh hoạt (Low)",
        "Cổ lửng & cao bảo vệ cổ chân (Mid)"
      ]
    },
    {
      key: "courtSurface",
      title: "MẶT SÂN PHÙ HỢP",
      options: [
        "Sân ngoài trời (Outdoor bền bỉ)",
        "Sân gỗ trong nhà (Indoor)"
      ]
    }
  ],
  "Tennis & Pickleball": [
    {
      key: "racketSport",
      title: "BỘ MÔN",
      options: ["Pickleball", "Tennis"]
    },
    {
      key: "coreThickness",
      title: "ĐỘ DÀY / TRỌNG LƯỢNG VỢT",
      options: ["14mm / Siêu nhẹ linh hoạt", "16mm / Đầm tay kiểm soát"]
    },
    {
      key: "tennisPlayStyle",
      title: "LỐI ĐÁNH",
      options: [
        "Kiểm soát & Xoáy (Control/Spin)",
        "Tấn công & Sức mạnh (Power)"
      ]
    },
    {
      key: "playerLevel",
      title: "TRÌNH ĐỘ",
      options: ["Mới chơi & Phong trào", "Bán chuyên & Thi đấu"]
    }
  ],
  "Bóng Bàn": [
    {
      key: "bladeStruct",
      title: "CẤU TRÚC CỐT / MẶT VỢT",
      options: [
        "5 lớp gỗ + 2 lớp Carbon (ALC/ZLC)",
        "Mặt vợt tạo xoáy Tenergy/Hurricane"
      ]
    },
    {
      key: "speedSpin",
      title: "TỐC ĐỘ & ĐỘ XOÁY",
      options: [
        "OFF+ (Tốc độ cao, tấn công áp đảo)",
        "OFF / ALL+ (Kiểm soát & giật bóng xoáy)"
      ]
    },
    {
      key: "pingpongStyle",
      title: "LỐI ĐÁNH BÓNG BÀN",
      options: [
        "Tấn công giật bóng 2 càng",
        "Kiểm soát & Đôi công toàn diện"
      ]
    }
  ]
};

var SPORT_LIST = [
  { code: "ALL", label: '<i class="fa-solid fa-layer-group"></i> Tất cả môn' },
  { code: "Cầu Lông", label: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M9 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"/><path d="M10 15 5 4l4.5 2L12 3l2.5 3L19 4l-5 11"/><path d="M7.5 9.5h9"/></svg> Cầu Lông' },
  { code: "Bóng Đá", label: '<i class="fa-solid fa-futbol"></i> Bóng Đá' },
  { code: "Chạy Bộ", label: '<i class="fa-solid fa-person-running"></i> Chạy Bộ' },
  { code: "Tập Gym", label: '<i class="fa-solid fa-dumbbell"></i> Tập Gym' },
  { code: "Bóng Chuyền", label: '<i class="fa-solid fa-volleyball"></i> Bóng Chuyền' },
  { code: "Bóng Rổ", label: '<i class="fa-solid fa-basketball"></i> Bóng Rổ' },
  { code: "Tennis & Pickleball", label: '<i class="fa-solid fa-baseball"></i> Tennis & Pickleball' },
  { code: "Bóng Bàn", label: '<i class="fa-solid fa-table-tennis-paddle-ball"></i> Bóng Bàn' }
];

var selectedSport = "ALL";
var currentPage = 1;
var productsPerPage = 15;
var ignoreUrlSale = false;
var filteredList = [];

function isItemActive(item) {
  if (!item) return false;
  if (item.status === "inactive" || item.status === "hidden") return false;
  return true;
}

function getProductDisplayPrice(product) {
  if (product.salePrice && Number(product.salePrice) > 0) {
    return Number(product.salePrice);
  }
  return Number(product.price || 0);
}

function getProductOriginalPrice(product) {
  var displayPrice = getProductDisplayPrice(product);
  if (product.originalPrice && Number(product.originalPrice) > displayPrice) {
    return Number(product.originalPrice);
  }
  if (product.price && Number(product.price) > displayPrice) {
    return Number(product.price);
  }
  return 0;
}

// Vẽ các nút chọn môn thể thao bên cột trái
function renderSportPills() {
  var box = document.getElementById("sport-filter-box");
  if (!box) return;
  var html = "";
  for (var i = 0; i < SPORT_LIST.length; i++) {
    var sp = SPORT_LIST[i];
    var isActive = (selectedSport === sp.code) ? "active" : "";
    html += '<button type="button" class="sport-pill-btn ' + isActive + '" onclick="chonMonTheThao(\'' + sp.code + '\')">' + sp.label + '</button>';
  }
  box.innerHTML = html;

  var quickSelect = document.getElementById("sportQuickSelect");
  if (quickSelect) {
    quickSelect.value = selectedSport;
  }
}

// Khi người dùng bấm chọn môn thể thao
function chonMonTheThao(sportName) {
  selectedSport = sportName || "ALL";
  renderSportPills();
  renderCategories();
  renderBrands();
  renderDynamicSportFilters();
  applyAdvancedFilters();
}

// Vẽ danh sách loại sản phẩm (có đếm số lượng theo môn đang chọn)
function renderCategories() {
  var categoryBox = document.getElementById("category-filter");
  if (!categoryBox) return;

  // Lưu lại các danh mục đang được tick
  var oldChecked = [];
  var oldInputs = document.querySelectorAll(".cat-checkbox:checked");
  for (var k = 0; k < oldInputs.length; k++) {
    oldChecked.push(oldInputs[k].value);
  }

  var html = "";
  for (var i = 0; i < allCategories.length; i++) {
    var cat = allCategories[i];
    if (!isItemActive(cat)) continue;

    var catId = cat.code || cat.id || cat.categoryCode;
    var count = 0;
    for (var j = 0; j < allProducts.length; j++) {
      var p = allProducts[j];
      if (!isItemActive(p)) continue;
      if (selectedSport !== "ALL" && p.sport !== selectedSport) continue;
      var pCat = p.categoryId || p.categoryCode || p.category;
      if (pCat === catId || pCat === cat.name || pCat === cat.code) {
        count++;
      }
    }

    var isChecked = (oldChecked.indexOf(catId) !== -1) ? "checked" : "";
    html += '<label class="vnb-check-item">' +
      '<span class="vnb-check-left">' +
      '<input type="checkbox" class="cat-checkbox" value="' + catId + '" ' + isChecked + ' onchange="onCategoryCheckboxChange()">' +
      '<span>' + cat.name + '</span>' +
      '</span>' +
      '<span class="vnb-count-badge">(' + count + ')</span>' +
      '</label>';
  }
  categoryBox.innerHTML = html;
}

function onCategoryCheckboxChange() {
  renderDynamicSportFilters();
  applyAdvancedFilters();
}

// Vẽ danh sách thương hiệu theo môn đang chọn
function renderBrands() {
  var brandBox = document.getElementById("brand-filter-box");
  if (!brandBox) return;

  var oldChecked = [];
  var oldInputs = document.querySelectorAll(".brand-checkbox:checked");
  for (var k = 0; k < oldInputs.length; k++) {
    oldChecked.push(oldInputs[k].value);
  }

  var brandCounts = {};
  for (var i = 0; i < allProducts.length; i++) {
    var p = allProducts[i];
    if (!isItemActive(p)) continue;
    if (selectedSport !== "ALL" && p.sport !== selectedSport) continue;
    var b = p.brand || "Khác";
    brandCounts[b] = (brandCounts[b] || 0) + 1;
  }

  var brands = [];
  for (var tenHang in brandCounts) {
    if (brandCounts.hasOwnProperty(tenHang)) {
      brands.push(tenHang);
    }
  }
  for (var x = 0; x < brands.length - 1; x++) {
    for (var y = x + 1; y < brands.length; y++) {
      if (brandCounts[brands[y]] > brandCounts[brands[x]]) {
        var tam = brands[x];
        brands[x] = brands[y];
        brands[y] = tam;
      }
    }
  }

  var html = "";
  for (var j = 0; j < brands.length; j++) {
    var bName = brands[j];
    var isChecked = (oldChecked.indexOf(bName) !== -1) ? "checked" : "";
    html += '<label class="vnb-check-item">' +
      '<span class="vnb-check-left">' +
      '<input type="checkbox" class="brand-checkbox" value="' + bName + '" ' + isChecked + ' onchange="onSidebarBrandChange()">' +
      '<span>' + bName + '</span>' +
      '</span>' +
      '<span class="vnb-count-badge">(' + brandCounts[bName] + ')</span>' +
      '</label>';
  }
  brandBox.innerHTML = html;
}

function onSidebarBrandChange() {
  var sel = document.getElementById("brandFilterSelect");
  var checked = document.querySelectorAll(".brand-checkbox:checked");
  if (sel) {
    sel.value = (checked.length === 1) ? checked[0].value : "";
  }
  applyAdvancedFilters();
}

function onToolbarBrandChange(val) {
  var boxes = document.querySelectorAll(".brand-checkbox");
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = (val !== "" && boxes[i].value.toLowerCase() === val.toLowerCase());
  }
  applyAdvancedFilters();
}

function onPricePresetChange() {
  // Khi chọn mức giá có sẵn thì xóa 2 ô nhập tay để tránh xung đột
  var checked = document.querySelectorAll(".price-checkbox:checked");
  if (checked.length > 0) {
    if (document.getElementById("minPrice")) document.getElementById("minPrice").value = "";
    if (document.getElementById("maxPrice")) document.getElementById("maxPrice").value = "";
  }
  applyAdvancedFilters();
}

// Xác định môn thể thao để hiển thị bộ lọc nâng cao
function getEffectiveSportForFilters() {
  if (selectedSport !== "ALL") return selectedSport;
  // Nếu chưa chọn môn nhưng chỉ chọn CAT01 (Vợt) thì mặc định gợi ý bộ lọc Cầu Lông
  var checkedCats = document.querySelectorAll(".cat-checkbox:checked");
  if (checkedCats.length === 1 && checkedCats[0].value === "CAT01") {
    return "Cầu Lông";
  }
  return "ALL";
}

// Vẽ bộ lọc nâng cao tương ứng với từng môn thể thao (chuẩn VNB)
function renderDynamicSportFilters() {
  var container = document.getElementById("dynamic-sport-filters");
  if (!container) return;

  var activeSport = getEffectiveSportForFilters();
  if (activeSport === "ALL" || !SPORT_ADVANCED_CONFIG[activeSport]) {
    container.innerHTML =
      '<div class="vnb-sport-hint-box">' +
      '<strong><i class="fa-solid fa-sliders"></i> Tìm kiếm nâng cao theo môn</strong>' +
      '<p>Hãy chọn một môn thể thao ở mục <b>MÔN THỂ THAO</b> phía trên (ví dụ: <b>Cầu Lông</b>, <b>Bóng Đá</b>, <b>Chạy Bộ</b>, <b>Tập Gym</b>...) để mở bộ lọc thông số kỹ thuật chuyên sâu cho môn đó.</p>' +
      '</div>';
    return;
  }

  var groups = SPORT_ADVANCED_CONFIG[activeSport];
  var html = '<div class="vnb-advanced-wrapper">' +
    '<div class="vnb-advanced-banner">BỘ LỌC CHUYÊN SÂU: ' + activeSport.toUpperCase() + '</div>';

  for (var i = 0; i < groups.length; i++) {
    var grp = groups[i];
    html += '<div class="filter-group vnb-spec-group">' +
      '<h4>' + grp.title + '</h4>' +
      '<div class="vnb-checkbox-list">';
    for (var j = 0; j < grp.options.length; j++) {
      var opt = grp.options[j];
      html += '<label class="vnb-check-item">' +
        '<span class="vnb-check-left">' +
        '<input type="checkbox" class="spec-attr-checkbox" data-attr-key="' + grp.key + '" value="' + opt + '" onchange="applyAdvancedFilters()">' +
        '<span>' + opt + '</span>' +
        '</span>' +
        '</label>';
    }
    html += '</div></div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

function removeVietnameseTones(str) {
  str = String(str || "").toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[-/,()._—]/g, " ");
  str = str.replace(/\s+/g, " ").trim();
  return str;
}

function matchProductSearch(productText, rawQuery) {
  var queryStr = String(rawQuery || "").trim();
  if (queryStr === "") return true;

  var textLower = String(productText || "").toLowerCase();
  var textNoTone = removeVietnameseTones(productText);
  var groups = queryStr.split("|");

  for (var i = 0; i < groups.length; i++) {
    var partLow = groups[i].trim().toLowerCase();
    var kwNoTone = removeVietnameseTones(groups[i]);
    if (kwNoTone === "") continue;

    var hasTone = (partLow !== kwNoTone);
    var targetStr = hasTone ? textLower : textNoTone;
    var checkWords = hasTone ? partLow.split(" ") : kwNoTone.split(" ");

    var allMatched = true;
    for (var w = 0; w < checkWords.length; w++) {
      if (checkWords[w] !== "" && targetStr.indexOf(checkWords[w]) === -1) {
        allMatched = false;
        break;
      }
    }
    if (allMatched) return true;
  }

  return false;
}

// Kiểm tra sản phẩm có khớp các khoảng giá được tick không
function matchPricePresets(price, presets) {
  if (!presets || presets.length === 0) return true;
  for (var i = 0; i < presets.length; i++) {
    var code = presets[i];
    if (code === "under500" && price < 500000) return true;
    if (code === "500to1m" && price >= 500000 && price <= 1000000) return true;
    if (code === "1mto2m" && price >= 1000000 && price <= 2000000) return true;
    if (code === "2mto3m" && price >= 2000000 && price <= 3000000) return true;
    if (code === "over3m" && price > 3000000) return true;
  }
  return false;
}

// Hàm lọc sản phẩm tổng hợp (Từ khóa + Môn + Giá + Danh mục + Hãng + Thông số chuyên sâu)
function applyAdvancedFilters() {
  var advKeyword = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
  var toolbarBrand = document.getElementById("brandFilterSelect") ? document.getElementById("brandFilterSelect").value.trim() : "";

  // Danh mục được chọn
  var catBoxes = document.querySelectorAll(".cat-checkbox:checked");
  var selectedCategories = [];
  for (var c = 0; c < catBoxes.length; c++) {
    selectedCategories.push(catBoxes[c].value);
  }

  // Thương hiệu được chọn ở sidebar
  var brandBoxes = document.querySelectorAll(".brand-checkbox:checked");
  var selectedBrands = [];
  for (var b = 0; b < brandBoxes.length; b++) {
    selectedBrands.push(brandBoxes[b].value.toLowerCase());
  }
  if (selectedBrands.length === 0 && toolbarBrand !== "") {
    selectedBrands.push(toolbarBrand.toLowerCase());
  }

  // Mức giá checkbox
  var priceBoxes = document.querySelectorAll(".price-checkbox:checked");
  var selectedPricePresets = [];
  for (var pIdx = 0; pIdx < priceBoxes.length; pIdx++) {
    selectedPricePresets.push(priceBoxes[pIdx].value);
  }

  var minPrice = document.getElementById("minPrice") ? document.getElementById("minPrice").value : "";
  var maxPrice = document.getElementById("maxPrice") ? document.getElementById("maxPrice").value : "";

  // Các thuộc tính nâng cao theo môn thể thao
  var specBoxes = document.querySelectorAll(".spec-attr-checkbox:checked");
  var selectedSpecMap = {};
  for (var s = 0; s < specBoxes.length; s++) {
    var attrKey = specBoxes[s].getAttribute("data-attr-key");
    var attrVal = specBoxes[s].value;
    if (!selectedSpecMap[attrKey]) selectedSpecMap[attrKey] = [];
    selectedSpecMap[attrKey].push(attrVal);
  }
  var specKeys = [];
  for (var kAttr in selectedSpecMap) {
    if (selectedSpecMap.hasOwnProperty(kAttr)) specKeys.push(kAttr);
  }

  var promoOnly = (!ignoreUrlSale) && (layThamSoUrl("sale") === "true");

  filteredList = [];
  for (var i = 0; i < allProducts.length; i++) {
    var product = allProducts[i];
    if (!isItemActive(product)) continue;

    // 1. Lọc theo môn thể thao
    if (selectedSport !== "ALL") {
      if ((product.sport || "Cầu Lông") !== selectedSport) continue;
    }

    // 2. Lọc khuyến mãi nếu có ?sale=true
    var displayPrice = getProductDisplayPrice(product);
    var originalPrice = getProductOriginalPrice(product);
    if (promoOnly && !(originalPrice > displayPrice)) continue;

    // 3. Lọc theo từ khóa
    if (advKeyword !== "") {
      var specStr = product.specs ? JSON.stringify(product.specs) : "";
      var searchTarget = (product.name || "") + " " + (product.brand || "") + " " + (product.sport || "") + " " + (product.category || "") + " " + (product.desc || "") + " " + specStr;
      if (!matchProductSearch(searchTarget, advKeyword)) continue;
    }

    // 4. Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      var pBrand = String(product.brand || "").toLowerCase();
      var brandOk = false;
      for (var bi = 0; bi < selectedBrands.length; bi++) {
        if (pBrand.indexOf(selectedBrands[bi]) !== -1 || selectedBrands[bi].indexOf(pBrand) !== -1) {
          brandOk = true;
          break;
        }
      }
      if (!brandOk) continue;
    }

    // 5. Lọc theo danh mục
    if (selectedCategories.length > 0) {
      var pCat = product.categoryId || product.categoryCode || product.category;
      if (selectedCategories.indexOf(pCat) === -1) continue;
    }

    // 6. Lọc theo mức giá checkbox & ô nhập giá
    if (!matchPricePresets(displayPrice, selectedPricePresets)) continue;
    if (minPrice !== "" && displayPrice < Number(minPrice)) continue;
    if (maxPrice !== "" && displayPrice > Number(maxPrice)) continue;

    // 7. Lọc theo thông số nâng cao của môn thể thao
    var specsOk = true;
    for (var k = 0; k < specKeys.length; k++) {
      var key = specKeys[k];
      var allowedVals = selectedSpecMap[key];
      var prodAttrs = product.filterAttrs || {};
      var prodVal = prodAttrs[key];
      if (!prodVal || allowedVals.indexOf(prodVal) === -1) {
        specsOk = false;
        break;
      }
    }
    if (!specsOk) continue;

    filteredList.push(product);
  }

  applySortLogic();
  currentPage = 1;
  renderProducts();
}

function applySortLogic() {
  var sortEl = document.getElementById("sortSelect");
  var sortValue = sortEl ? sortEl.value : "default";

  if (sortValue === "default") {
    // Uu tien hien thi cac san pham da co anh that len truoc, san pham MISSING_IMAGE xep phía sau
    var coAnh = [];
    var thieuAnh = [];
    for (var idx = 0; idx < filteredList.length; idx++) {
      if (filteredList[idx].image && filteredList[idx].image !== "MISSING_IMAGE") {
        coAnh.push(filteredList[idx]);
      } else {
        thieuAnh.push(filteredList[idx]);
      }
    }
    filteredList = coAnh.concat(thieuAnh);
    return;
  }

  for (var i = 0; i < filteredList.length - 1; i++) {
    for (var j = i + 1; j < filteredList.length; j++) {
      var giaA = getProductDisplayPrice(filteredList[i]);
      var giaB = getProductDisplayPrice(filteredList[j]);
      var canDoiCho = false;
      if (sortValue === "priceAsc" && giaA > giaB) canDoiCho = true;
      if (sortValue === "priceDesc" && giaA < giaB) canDoiCho = true;
      if (canDoiCho) {
        var tam = filteredList[i];
        filteredList[i] = filteredList[j];
        filteredList[j] = tam;
      }
    }
  }
}

function updateFilterStatusSummary() {
  var summaryEl = document.getElementById("filterResultSummary");
  if (!summaryEl) return;

  var advKw = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
  var sportText = (selectedSport !== "ALL") ? (' môn <strong style="color: #0284c7;">' + selectedSport + '</strong>') : "";

  if (advKw !== "") {
    summaryEl.innerHTML = 'Tìm thấy <strong style="color: #0284c7;">' + filteredList.length + '</strong> sản phẩm' + sportText + ' cho từ khóa <em>"' + advKw + '"</em>';
  } else {
    summaryEl.innerHTML = 'Hiển thị <strong style="color: #0284c7;">' + filteredList.length + '</strong> sản phẩm thể thao chính hãng' + sportText;
  }
}

function renderProducts() {
  var grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  updateFilterStatusSummary();

  if (filteredList.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">' +
      '<i class="fa-solid fa-box-open" style="font-size: 44px; color: #0284c7; margin-bottom: 14px;"></i>' +
      '<p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #334155;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>' +
      '<button type="button" class="btn-primary" style="width: auto; padding: 10px 24px; cursor: pointer;" onclick="resetAllFilters()">Xóa bộ lọc & Xem tất cả</button>' +
      '</div>';
    renderPagination();
    return;
  }

  var startIndex = (currentPage - 1) * productsPerPage;
  var endIndex = startIndex + productsPerPage;
  var productsToDisplay = filteredList.slice(startIndex, endIndex);

  var cardsHtml = "";
  for (var i = 0; i < productsToDisplay.length; i++) {
    var product = productsToDisplay[i];
    if (!isItemActive(product)) continue;

    var rawImg = product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "";
    var cardImage = layUrlAnhChuan(rawImg);
    var displayPrice = getProductDisplayPrice(product);
    var formattedPrice = formatMoney(displayPrice);
    var originalPrice = getProductOriginalPrice(product);
    var hasDiscount = originalPrice > displayPrice;
    var originalPriceHtml = hasDiscount
      ? '<span class="original-price" style="text-decoration: line-through; color: #94a3b8; font-size: 12.5px; margin-left: 6px;">' + formatMoney(originalPrice) + '</span>'
      : "";

    var sportLabel = product.sport || "Thể Thao";
    var colorCount = Array.isArray(product.colorVariants) ? product.colorVariants.length : 1;
    var colorBadgeHtml = colorCount > 1
      ? '<span class="card-color-count" title="Có ' + colorCount + ' màu sắc">' + colorCount + ' màu</span>'
      : "";

    cardsHtml +=
      '<div class="product-card">' +
      (hasDiscount ? '<span class="sale-badge">SALE</span>' : '') +
      '<div class="card-meta-top">' +
      '<span class="card-sport-tag">' + sportLabel + '</span>' +
      colorBadgeHtml +
      '</div>' +
      '<a href="javascript:void(0)" onclick="moChiTietSanPham(\'' + product.id + '\')" style="text-decoration: none; color: inherit;">' +
      '<img src="' + cardImage + '" alt="' + product.name + '" loading="lazy">' +
      '<h4>' + product.name + '</h4>' +
      '</a>' +
      '<div class="product-price">' + formattedPrice + ' ' + originalPriceHtml + '</div>' +
      '<div style="display: flex; gap: 8px; margin-top: auto;">' +
      '<button type="button" class="btn-primary" style="flex: 1;" onclick="moChiTietSanPham(\'' + product.id + '\')">Xem chi tiết</button>' +
      '<button type="button" class="btn-primary" style="width: 42px; padding: 10px 0; background-color: #0f172a;" onclick="quickAddToCart(\'' + product.id + '\')" title="Thêm vào giỏ hàng">' +
      '<i class="fa-solid fa-cart-plus"></i>' +
      '</button>' +
      '</div>' +
      '</div>';
  }

  grid.innerHTML = cardsHtml;
  renderPagination();
}

function resetAllFilters() {
  if (document.getElementById("advNameInput")) document.getElementById("advNameInput").value = "";
  if (document.getElementById("minPrice")) document.getElementById("minPrice").value = "";
  if (document.getElementById("maxPrice")) document.getElementById("maxPrice").value = "";
  if (document.getElementById("sortSelect")) document.getElementById("sortSelect").value = "default";
  if (document.getElementById("brandFilterSelect")) document.getElementById("brandFilterSelect").value = "";

  var allChecks = document.querySelectorAll(".cat-checkbox, .brand-checkbox, .price-checkbox, .spec-attr-checkbox");
  for (var i = 0; i < allChecks.length; i++) {
    allChecks[i].checked = false;
  }

  selectedSport = "ALL";
  ignoreUrlSale = true;
  renderSportPills();
  renderCategories();
  renderBrands();
  renderDynamicSportFilters();
  applyAdvancedFilters();
}

function quickAddToCart(productId) {
  var product = null;
  for (var i = 0; i < allProducts.length; i++) {
    if (String(allProducts[i].id) === String(productId) || String(allProducts[i].code) === String(productId)) {
      product = allProducts[i];
      break;
    }
  }
  if (!product) return;

  var defaultColor = (Array.isArray(product.colors) && product.colors[0]) ? product.colors[0] : "Chính hãng";
  var defaultSize = (Array.isArray(product.sizes) && product.sizes[0]) ? product.sizes[0] : "Tiêu chuẩn";

  var item = {
    id: product.id,
    code: product.code || ("SP-" + product.id),
    name: product.name,
    price: getProductDisplayPrice(product),
    image: layUrlAnhChuan(product.image || (Array.isArray(product.gallery) && product.gallery[0]) || ""),
    size: defaultSize,
    color: defaultColor,
    stock: product.stock || 50
  };

  if (typeof addToCart === "function") {
    addToCart(item, 1);
  }
}

function renderPagination() {
  var paginationBox = document.getElementById("pagination");
  if (!paginationBox) return;
  paginationBox.innerHTML = "";

  var totalPages = Math.ceil(filteredList.length / productsPerPage);
  if (totalPages <= 1) return;

  var html = "";
  if (currentPage > 1) {
    html += '<button type="button" class="page-btn page-nav" onclick="changePage(' + (currentPage - 1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
  }

  var previousPage = 0;
  for (var page = 1; page <= totalPages; page++) {
    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
      if (previousPage !== 0 && page - previousPage > 1) {
        html += '<span class="page-ellipsis">...</span>';
      }
      var activeClass = (page === currentPage) ? "active" : "";
      html += '<button type="button" class="page-btn ' + activeClass + '" onclick="changePage(' + page + ')">' + page + '</button>';
      previousPage = page;
    }
  }

  if (currentPage < totalPages) {
    html += '<button type="button" class="page-btn page-nav" onclick="changePage(' + (currentPage + 1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
  }

  paginationBox.innerHTML = html;
}

function changePage(pageNumber) {
  var totalPages = Math.ceil(filteredList.length / productsPerPage);
  if (totalPages < 1) totalPages = 1;

  if (pageNumber < 1) pageNumber = 1;
  if (pageNumber > totalPages) pageNumber = totalPages;

  currentPage = pageNumber;
  renderProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// Quan ly popup xem chi tiet san pham (tach biet ro giua chon Phoi mau va chon Goc chup thumbnail)

var sanPhamDangXem = null;
var sizeDuocChon = "Freesize";
var mauDuocChon = "Nguyên bản";
var giaMauDangChon = 0;
var anhMauDangChon = "";
var danhSachAnhModal = [];
var viTriAnhModal = 0;

// Doi anh chinh khi nguoi dung bam vao thumbnail goc chup hoac mui ten qua lai
function capNhatAnhChinhModal(index) {
  if (!danhSachAnhModal || danhSachAnhModal.length === 0) return;
  if (index < 0) index = danhSachAnhModal.length - 1;
  if (index >= danhSachAnhModal.length) index = 0;
  viTriAnhModal = index;

  var urlChuan = layUrlAnhChuan(danhSachAnhModal[viTriAnhModal]);
  var mainImg = document.getElementById("qv-main-img");
  if (mainImg) {
    mainImg.src = urlChuan;
  }

  var thumbs = document.querySelectorAll("#qv-thumb-list .qv-thumb-item");
  for (var i = 0; i < thumbs.length; i++) {
    if (i === viTriAnhModal) {
      thumbs[i].classList.add("active");
    } else {
      thumbs[i].classList.remove("active");
    }
  }
}

function chuyenAnhModal(step) {
  capNhatAnhChinhModal(viTriAnhModal + step);
}

function chonAnhThumbnailModal(index) {
  capNhatAnhChinhModal(index);
}

// Render danh sach thumbnail goc chup cua phien ban mau dang chon
function veDanhSachThumbnailModal() {
  var thumbList = document.getElementById("qv-thumb-list");
  if (!thumbList) return;
  thumbList.innerHTML = "";

  if (!danhSachAnhModal || danhSachAnhModal.length <= 1) {
    thumbList.style.display = "none";
    return;
  }
  thumbList.style.display = "grid";

  for (var i = 0; i < danhSachAnhModal.length; i++) {
    var imgUrl = layUrlAnhChuan(danhSachAnhModal[i]);
    var activeCls = (i === viTriAnhModal) ? "active" : "";
    thumbList.innerHTML +=
      '<img src="' + imgUrl + '" class="qv-thumb-item ' + activeCls + '" alt="Góc chụp ' + (i + 1) + '" onclick="chonAnhThumbnailModal(' + i + ')">';
  }
}

function veBangThongSoKyThuat(sp) {
  var specsHeading = document.getElementById("qv-specs-heading");
  var specsTbody = document.getElementById("qv-specs-tbody");
  if (!specsTbody) return;

  var sportName = sp.sport || "Thể Thao";
  if (specsHeading) {
    specsHeading.textContent = "Thông số kỹ thuật (" + sportName + "):";
  }

  var rows = [];
  if (Array.isArray(sp.specsRows) && sp.specsRows.length > 0) {
    rows = sp.specsRows;
  } else if (sp.specs && typeof sp.specs === "object") {
    for (var tenThongSo in sp.specs) {
      if (sp.specs.hasOwnProperty(tenThongSo)) {
        rows.push({ label: tenThongSo, value: sp.specs[tenThongSo] });
      }
    }
  }

  var html = "";
  for (var j = 0; j < rows.length; j++) {
    html += '<tr>' +
      '<td class="spec-label">' + rows[j].label + '</td>' +
      '<td class="spec-val">' + rows[j].value + '</td>' +
      '</tr>';
  }
  specsTbody.innerHTML = html;
}

// Khi nguoi dung bam chon 1 phoi mau trong Modal
function chonMauTrongModal(index) {
  if (!sanPhamDangXem) return;
  var variants = Array.isArray(sanPhamDangXem.colorVariants) ? sanPhamDangXem.colorVariants : [];
  if (!variants[index]) return;

  var chosen = variants[index];
  mauDuocChon = chosen.name || "Nguyên bản";
  giaMauDangChon = Number(chosen.price) || getProductDisplayPrice(sanPhamDangXem);
  anhMauDangChon = layUrlAnhChuan(chosen.image || sanPhamDangXem.image);

  var colorLabel = document.getElementById("qv-selected-color-text");
  if (colorLabel) colorLabel.textContent = mauDuocChon;

  var priceEl = document.getElementById("qv-price");
  if (priceEl) priceEl.textContent = formatMoney(giaMauDangChon);

  var cards = document.querySelectorAll("#qv-colors-box .qv-color-card");
  for (var i = 0; i < cards.length; i++) {
    if (i === index) cards[i].classList.add("active");
    else cards[i].classList.remove("active");
  }

  // Cap nhat lai danh sach thumbnail goc chup cua rieng phoi mau vua chon
  if (Array.isArray(chosen.thumbnails) && chosen.thumbnails.length > 0) {
    danhSachAnhModal = chosen.thumbnails.slice(0, 6);
  } else if (chosen.image) {
    danhSachAnhModal = [chosen.image];
  }

  viTriAnhModal = 0;
  veDanhSachThumbnailModal();
  capNhatAnhChinhModal(0);
}

function chonSizeTrongModal(index) {
  if (!sanPhamDangXem) return;
  var sizes = sanPhamDangXem.sizes || ["Freesize"];
  sizeDuocChon = sizes[index] || "Freesize";

  var btns = document.querySelectorAll("#qv-sizes-box .qv-choice-btn");
  for (var i = 0; i < btns.length; i++) {
    if (i === index) btns[i].classList.add("active");
    else btns[i].classList.remove("active");
  }
}

function moChiTietSanPham(productId) {
  sanPhamDangXem = null;
  for (var i = 0; i < allProducts.length; i++) {
    if (String(allProducts[i].id) === String(productId) || String(allProducts[i].code) === String(productId)) {
      sanPhamDangXem = allProducts[i];
      break;
    }
  }

  if (!sanPhamDangXem) {
    if (typeof showToast === "function") {
      showToast("Không tìm thấy thông tin chi tiết của sản phẩm này!", "danger");
    }
    return;
  }

  // Dien ten, thuong hieu, bo mon va ma san pham
  document.getElementById("qv-title").textContent = sanPhamDangXem.name;
  document.getElementById("qv-brand").textContent = (sanPhamDangXem.brand || "CHÍNH HÃNG").toUpperCase();
  var sportBadge = document.getElementById("qv-sport-badge");
  if (sportBadge) {
    sportBadge.textContent = (sanPhamDangXem.sport || "THỂ THAO").toUpperCase();
  }
  document.getElementById("qv-category").textContent = (sanPhamDangXem.categoryName || sanPhamDangXem.category || "TRANG BỊ").toUpperCase();
  document.getElementById("qv-code").textContent = sanPhamDangXem.code || ("SP-" + sanPhamDangXem.id);

  // Dien gia ban va gia goc
  var giaHienThi = getProductDisplayPrice(sanPhamDangXem);
  giaMauDangChon = giaHienThi;
  document.getElementById("qv-price").textContent = formatMoney(giaHienThi);
  var oldPriceEl = document.getElementById("qv-old-price");
  var giaGoc = getProductOriginalPrice(sanPhamDangXem);
  if (giaGoc > giaHienThi) {
    oldPriceEl.textContent = formatMoney(giaGoc);
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }

  // Xử lý khu vực chọn màu sắc (colorVariants)
  var colorGroup = document.getElementById("qv-color-group");
  var colorsBox = document.getElementById("qv-colors-box");
  var variants = Array.isArray(sanPhamDangXem.colorVariants) ? sanPhamDangXem.colorVariants : [];

  if (variants.length > 1) {
    if (colorGroup) colorGroup.style.display = "block";
    colorsBox.innerHTML = "";
    for (var m = 0; m < variants.length; m++) {
      var v = variants[m];
      var vImg = layUrlAnhChuan(v.image || sanPhamDangXem.image);
      var vPrice = Number(v.price) || giaHienThi;
      var activeCls = (m === 0) ? "active" : "";
      colorsBox.innerHTML +=
        '<button type="button" class="qv-color-card ' + activeCls + '" onclick="chonMauTrongModal(' + m + ')">' +
          '<img src="' + vImg + '" alt="' + v.name + '" class="qv-color-card-img">' +
          '<span class="qv-color-card-info">' +
            '<span class="qv-color-card-name">' + v.name + '</span>' +
            '<span class="qv-color-card-price">' + formatMoney(vPrice) + '</span>' +
          '</span>' +
        '</button>';
    }
    chonMauTrongModal(0);
  } else {
    // San pham 1 mau hoac phu kien khong co bien the mau -> an hoan toan khu vuc chon mau
    if (colorGroup) colorGroup.style.display = "none";
    if (colorsBox) colorsBox.innerHTML = "";
    mauDuocChon = (Array.isArray(sanPhamDangXem.colors) && sanPhamDangXem.colors[0]) ? sanPhamDangXem.colors[0] : "Nguyên bản";

    var rawImgs = [];
    if (Array.isArray(sanPhamDangXem.gallery) && sanPhamDangXem.gallery.length > 0) {
      rawImgs = sanPhamDangXem.gallery.slice(0, 6);
    } else if (sanPhamDangXem.image) {
      rawImgs = [sanPhamDangXem.image];
    }
    danhSachAnhModal = rawImgs;
    anhMauDangChon = layUrlAnhChuan(danhSachAnhModal[0] || sanPhamDangXem.image);
    viTriAnhModal = 0;
    veDanhSachThumbnailModal();
    capNhatAnhChinhModal(0);
  }

  // Tinh trang ton kho
  var stockCount = sanPhamDangXem.stock !== undefined ? sanPhamDangXem.stock : 25;
  var stockEl = document.getElementById("qv-stock");
  if (stockCount > 0) {
    stockEl.textContent = "Còn hàng (" + stockCount + " sản phẩm)";
    stockEl.style.color = "#16a34a";
  } else {
    stockEl.textContent = "Tạm hết hàng";
    stockEl.style.color = "#ef4444";
  }

  // Mo ta va bang thong so ky thuat
  document.getElementById("qv-desc").textContent = sanPhamDangXem.desc || sanPhamDangXem.description || "Sản phẩm thể thao chính hãng, tối ưu hiệu năng tập luyện và thi đấu.";
  veBangThongSoKyThuat(sanPhamDangXem);

  // Danh sach kich co (Size)
  var danhSachSize = (Array.isArray(sanPhamDangXem.sizes) && sanPhamDangXem.sizes.length > 0)
    ? sanPhamDangXem.sizes
    : ["Freesize"];
  var sizesBox = document.getElementById("qv-sizes-box");
  sizesBox.innerHTML = "";
  sizeDuocChon = danhSachSize[0];

  for (var s = 0; s < danhSachSize.length; s++) {
    var sActive = (s === 0) ? "active" : "";
    sizesBox.innerHTML +=
      '<button type="button" class="qv-choice-btn ' + sActive + '" onclick="chonSizeTrongModal(' + s + ')">' +
      danhSachSize[s] +
      '</button>';
  }

  document.getElementById("qv-quantity-input").value = 1;
  document.getElementById("modal-quick-view").style.display = "flex";
}

function dongChiTietSanPham() {
  var modal = document.getElementById("modal-quick-view");
  if (modal) modal.style.display = "none";
}

function dongModalKhiBamRaNgoai(event) {
  if (event.target && event.target.id === "modal-quick-view") {
    dongChiTietSanPham();
  }
}

function thayDoiSoLuong(delta) {
  var input = document.getElementById("qv-quantity-input");
  var current = Number(input.value) || 1;
  var nextVal = current + delta;
  if (nextVal >= 1 && nextVal <= 99) {
    input.value = nextVal;
  }
}

function themVaoGioTuModal(muangay) {
  if (!sanPhamDangXem) return;

  var soLuong = Number(document.getElementById("qv-quantity-input").value) || 1;
  var monHang = {
    id: sanPhamDangXem.id || sanPhamDangXem.code,
    code: sanPhamDangXem.code || ("SP-" + sanPhamDangXem.id),
    name: sanPhamDangXem.name,
    price: giaMauDangChon || getProductDisplayPrice(sanPhamDangXem),
    image: layUrlAnhChuan(anhMauDangChon || sanPhamDangXem.image),
    size: sizeDuocChon,
    color: mauDuocChon,
    stock: sanPhamDangXem.stock || 50
  };

  if (typeof addToCart === "function") {
    var ketqua = addToCart(monHang, soLuong);
    if (!ketqua) return;
  }
  dongChiTietSanPham();

  if (muangay) {
    window.location.href = "dev4_checkout.html";
  }
}

// Lay tham so tren thanh dia chi URL bang vong lap co ban
function layThamSoUrl(tenThamSo) {
  var chuoiQuery = window.location.search;
  if (!chuoiQuery || chuoiQuery.length <= 1) return "";
  var cacCap = chuoiQuery.substring(1).split("&");
  for (var i = 0; i < cacCap.length; i++) {
    var phan = cacCap[i].split("=");
    var khoa = decodeURIComponent(phan[0] || "");
    if (khoa === tenThamSo) {
      var giaTri = phan.length > 1 ? phan.slice(1).join("=") : "";
      return decodeURIComponent(giaTri.replace(/\+/g, " "));
    }
  }
  return "";
}

function initPageFromUrl() {
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }

  var productId = layThamSoUrl("id");
  var searchKeyword = layThamSoUrl("search") || layThamSoUrl("keyword");
  var catCode = layThamSoUrl("cat");
  var sportParam = layThamSoUrl("sport");
  var brandParam = layThamSoUrl("brand");

  if (sportParam && SPORT_ADVANCED_CONFIG[sportParam]) {
    selectedSport = sportParam;
  } else {
    selectedSport = "ALL";
  }

  renderSportPills();
  renderCategories();
  renderBrands();

  if (catCode) {
    var targetCheckbox = document.querySelector('.cat-checkbox[value="' + catCode + '"]');
    if (targetCheckbox) targetCheckbox.checked = true;
  }

  if (brandParam) {
    var bSelect = document.getElementById("brandFilterSelect");
    if (bSelect) bSelect.value = brandParam;
    var bChecks = document.querySelectorAll(".brand-checkbox");
    for (var i = 0; i < bChecks.length; i++) {
      if (bChecks[i].value.toLowerCase() === brandParam.toLowerCase()) {
        bChecks[i].checked = true;
      }
    }
  }

  if (searchKeyword) {
    if (document.getElementById("advNameInput")) {
      document.getElementById("advNameInput").value = searchKeyword;
    }
  }

  renderDynamicSportFilters();
  applyAdvancedFilters();

  if (productId) {
    moChiTietSanPham(productId);
  }
}

initPageFromUrl();
