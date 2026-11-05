function loadAppProducts() {
    try {
        let stored = localStorage.getItem("sport_products");
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn("Lỗi đọc sport_products:", e);
    }
    return (typeof products !== "undefined") ? products : [];
}

function loadAppCategories() {
    try {
        let stored = localStorage.getItem("sport_categories");
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn("Lỗi đọc sport_categories:", e);
    }
    return (typeof categories !== "undefined") ? categories : [];
}

let allProducts = loadAppProducts();
let allCategories = loadAppCategories();

function isItemActive(item) {
    if (!item) return false;
    if (item.status === "hidden" || item.status === "inactive") return false;

    if (item.categoryId || item.category) {
        let catFound = null;
        for (let i = 0; i < allCategories.length; i++) {
            let cat = allCategories[i];
            let catId = cat.id || cat.code;
            if (catId === item.categoryId || cat.name === item.category) {
                catFound = cat;
                break;
            }
        }
        if (!catFound || catFound.status === "hidden" || catFound.status === "inactive") {
            return false;
        }
    }
    return true;
}

let filteredList = [];
for (let i = 0; i < allProducts.length; i++) {
    if (isItemActive(allProducts[i])) {
        filteredList.push(allProducts[i]);
    }
}

function getProductDisplayPrice(product) {
    let price = product.price || 0;
    return Number(price);
}

function getProductOriginalPrice(product) {
    if (product.originalPrice) return Number(product.originalPrice);
    // Nếu giá nhập > giá bán thì lấy giá nhập làm giá gạch ngang
    if (product.costPrice && product.price && Number(product.costPrice) > Number(product.price)) {
        return Number(product.costPrice);
    }
    return 0;
}

let currentPage = 1;
const productsPerPage = 15;
let toastTimer = null;
let ignoreUrlSale = false;

function renderCategories() {
    let categoryBox = document.getElementById("category-filter");
    if (!categoryBox) return;
    categoryBox.innerHTML = "";

    for (let i = 0; i < allCategories.length; i++) {
        let cat = allCategories[i];
        if (!isItemActive(cat)) continue;

        let catId = cat.id || cat.code || cat.categoryCode;

        // Đếm số lượng sản phẩm thuộc danh mục này
        let count = 0;
        for (let j = 0; j < allProducts.length; j++) {
            let p = allProducts[j];
            if (!isItemActive(p)) continue;
            let pCat = p.categoryId || p.categoryCode || p.category;
            if (pCat === catId || pCat === cat.name || pCat === cat.code) {
                count++;
            }
        }

        categoryBox.innerHTML += `
            <div class="filter-cat-row">
                <label class="filter-cat-label">
                    <span class="filter-cat-left">
                        <input type="checkbox" class="cat-checkbox filter-cat-input" value="${catId}" onchange="applyAdvancedFilters()">
                        ${cat.name}
                    </span>
                    <span class="filter-cat-count">(${count})</span>
                </label>
            </div>
        `;
    }
}

function updateFilterStatusSummary() {
    let summaryEl = document.getElementById("filterResultSummary");
    if (!summaryEl) return;

    let headerKw = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim() : "";
    let advKw = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
    let kw = advKw || headerKw;

    if (kw !== "") {
        summaryEl.innerHTML = 'Tìm thấy <strong class="highlight-count">' + filteredList.length + '</strong> sản phẩm cho từ khóa <em>"' + kw + '"</em>';
    } else {
        summaryEl.innerHTML = 'Hiển thị <strong class="highlight-count">' + filteredList.length + '</strong> sản phẩm thể thao chính hãng';
    }
}

function renderProducts() {
    let grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";

    updateFilterStatusSummary();

    if (filteredList.length === 0) {
        grid.innerHTML = `
            <div class="empty-products-box">
                <i class="fa-solid fa-box-open empty-products-icon"></i>
                <p class="empty-products-text">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                <button class="btn-primary empty-products-btn" onclick="resetAllFilters()">Xóa bộ lọc & Xem tất cả</button>
            </div>
        `;
        renderPagination();
        return;
    }

    let startIndex = (currentPage - 1) * productsPerPage;
    let endIndex = startIndex + productsPerPage;
    let productsToDisplay = filteredList.slice(startIndex, endIndex);

    for (let i = 0; i < productsToDisplay.length; i++) {
        let product = productsToDisplay[i];
        if (!isItemActive(product)) continue;

        // Lấy mã sản phẩm
        let productCode = product.code || product.productCode || product.id;

        // Lấy ảnh hiển thị
        let cardImage = product.image || (Array.isArray(product.gallery) && product.gallery[0]);

        // Tính toán giá và huy hiệu SALE
        let displayPrice = getProductDisplayPrice(product);
        let formattedPrice = formatMoney(displayPrice) ;
        let originalPrice = getProductOriginalPrice(product);
        let hasDiscount = originalPrice > displayPrice;
        let originalPriceHtml = hasDiscount
            ? `<span class="original-price product-original-price">${formatMoney(originalPrice)}</span>`
            : "";

        let daYeuThich = (typeof isYeuThich === "function") ? isYeuThich(product.id) : false;
        let heartIcon = daYeuThich ? '❤️' : '🤍';
        let activeClass = daYeuThich ? ' active' : '';

        let productCard = `
            <div class="product-card">
                ${hasDiscount ? '<span class="sale-badge">SALE</span>' : ''}
                <button type="button" class="btn-card-wishlist${activeClass}" data-wishlist-btn="${product.id}" onclick="event.stopPropagation(); toggleYeuThich('${product.id}', this)" title="${daYeuThich ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}">
                    <span>${heartIcon}</span>
                </button>
                
                <!-- Bấm vào ảnh hoặc tên sản phẩm sẽ mở Popup Chi Tiết ngay trên trang -->
                <a href="javascript:void(0)" onclick="moChiTietSanPham('${product.id}')" class="product-card-link">
                    <img src="${cardImage}" alt="${product.name}">
                    <h4>${product.name}</h4>
                </a>
                
                <div class="product-price">${formattedPrice}${originalPriceHtml}</div>
                
                <div class="product-card-bottom-actions">
                    <!-- Nút Xem chi tiết: Bật Popup Chi Tiết -->
                    <button class="btn-primary btn-card-view-detail" onclick="moChiTietSanPham('${product.id}')">
                        Xem chi tiết
                    </button>
                    
                    <!-- Nút Thêm nhanh 1 món vào giỏ hàng -->
                    <button class="btn-primary btn-quick-cart" onclick="themNhanhVaoGio('${product.id}')" title="Thêm vào giỏ hàng">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += productCard;

    }
    renderPagination();
}

// Hàm thêm nhanh 1 món vào giỏ hàng khi bấm icon xe đẩy
function themNhanhVaoGio(productCode) {
    // 1. Tìm đúng món hàng trong allProducts
    var product = null;
    for (var i = 0; i < allProducts.length; i++) {
        if (String(allProducts[i].id) === String(productCode)) {
            product = allProducts[i];
            break;
        }
    }
    if (!product) return;

    // 2. Đóng gói thành Object chuẩn
    var monHang = {
        id: product.id,
        name: product.name,
        price: getProductDisplayPrice(product),
        image: product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "",
        size: (product.sizes && product.sizes.length > 0) ? product.sizes[0] : "Tiêu chuẩn",
        color: (product.colors && product.colors.length > 0) ? product.colors[0] : "Mặc định",
        stock: product.stock || 50
    };

    // 3. Gọi hàm addToCart chuẩn của common.js để lưu đúng vào tài khoản
    if (typeof addToCart === "function") {
        addToCart(monHang, 1);
    }
}

function resetAllFilters() {
    if (document.getElementById("searchInput")) document.getElementById("searchInput").value = "";
    if (document.getElementById("advNameInput")) document.getElementById("advNameInput").value = "";
    if (document.getElementById("minPrice")) document.getElementById("minPrice").value = "";
    if (document.getElementById("maxPrice")) document.getElementById("maxPrice").value = "";
    if (document.getElementById("sortSelect")) document.getElementById("sortSelect").value = "default";
    if (document.getElementById("brandFilterSelect")) document.getElementById("brandFilterSelect").value = "";

    let checkedBoxes = document.querySelectorAll(".cat-checkbox:checked");
    for (let i = 0; i < checkedBoxes.length; i++) {
        checkedBoxes[i].checked = false;
    }

    ignoreUrlSale = true;
    applyAdvancedFilters();
}

function renderPagination() {
    let paginationBox = document.getElementById("pagination");
    if (!paginationBox) return;
    paginationBox.innerHTML = "";

    let totalPages = Math.ceil(filteredList.length / productsPerPage);
    if (totalPages <= 1) return;

    let html = "";

    // nút lùi trang
    if (currentPage > 1) {
        html += `<button class="page-btn page-nav" onclick="changePage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
    }

    // hiện trang đầu, trang cuối và các trang kế bên
    let previousPage = 0;
    for (let page = 1; page <= totalPages; page++) {
        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
            if (previousPage !== 0 && page - previousPage > 1) {
                html += `<span class="page-ellipsis">...</span>`;
            }
            let activeClass = (page === currentPage) ? "active" : "";
            html += `<button class="page-btn ${activeClass}" onclick="changePage(${page})">${page}</button>`;
            previousPage = page;
        }
    }

    // nút qua trang kế
    if (currentPage < totalPages) {
        html += `<button class="page-btn page-nav" onclick="changePage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
    }

    paginationBox.innerHTML = html;
}

function changePage(pageNumber) {
    let totalPages = Math.ceil(filteredList.length / productsPerPage);
    if (totalPages < 1) totalPages = 1;

    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    currentPage = pageNumber;
    renderProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    let queryStr = String(rawQuery || "").trim();
    if (queryStr === "") return true;

    let textLower = String(productText || "").toLowerCase();
    let textNoTone = removeVietnameseTones(productText);
    let groups = queryStr.split("|");

    for (let i = 0; i < groups.length; i++) {
        let partLow = groups[i].trim().toLowerCase();
        let kwNoTone = removeVietnameseTones(groups[i]);
        if (kwNoTone === "") continue;

        let hasTone = (partLow !== kwNoTone);
        let targetStr = hasTone ? textLower : textNoTone;
        let checkWords = hasTone ? partLow.split(" ") : kwNoTone.split(" ");

        let allMatched = true;
        for (let w = 0; w < checkWords.length; w++) {
            if (checkWords[w] !== "" && targetStr.indexOf(checkWords[w]) === -1) {
                allMatched = false;
                break;
            }
        }
        if (allMatched) return true;
    }

    return false;
}

function applyAdvancedFilters() {
    let headerKeyword = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim() : "";
    let advKeyword = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
    let brandKeyword = document.getElementById("brandFilterSelect") ? document.getElementById("brandFilterSelect").value.trim() : "";

    let checkboxes = document.querySelectorAll(".cat-checkbox:checked");
    let selectedCategories = [];
    for (let i = 0; i < checkboxes.length; i++) {
        selectedCategories.push(checkboxes[i].value);
    }

    let minPrice = document.getElementById("minPrice") ? document.getElementById("minPrice").value : "";
    let maxPrice = document.getElementById("maxPrice") ? document.getElementById("maxPrice").value : "";

    let params = new URLSearchParams(window.location.search);
    let promoOnly = (!ignoreUrlSale) && (params.get("sale") === "true");

    filteredList = [];
    for (let i = 0; i < allProducts.length; i++) {
        let product = allProducts[i];
        if (!isItemActive(product)) continue;

        let displayPrice = getProductDisplayPrice(product);
        let originalPrice = getProductOriginalPrice(product);
        let hasDiscount = originalPrice > displayPrice;
        if (promoOnly && !hasDiscount) continue;

        // Chuỗi tìm kiếm: Tên + Hãng + Mô tả + Thông số
        let specStr = typeof product.specs === "object" ? JSON.stringify(product.specs) : (product.specifications || "");
        let searchTarget = (product.name || "") + " " + (product.brand || "") + " " + (product.desc || product.description || "") + " " + specStr;

        let matchHeader = matchProductSearch(searchTarget, headerKeyword);
        let matchAdvName = matchProductSearch(searchTarget, advKeyword);

        // Khớp thương hiệu (chính xác hoặc tìm trong tên/thương hiệu)
        let matchBrand = true;
        if (brandKeyword !== "") {
            let pBrand = String(product.brand || "").toLowerCase();
            let bKw = brandKeyword.toLowerCase();
            matchBrand = pBrand.includes(bKw) || bKw.includes(pBrand) || matchProductSearch(searchTarget, brandKeyword);
        }

        // Khớp danh mục
        let matchCategory = true;
        if (selectedCategories.length > 0) {
            let pCat = product.categoryId || product.categoryCode || product.category;
            matchCategory = selectedCategories.includes(pCat) || selectedCategories.some(c => c === product.categoryId);
        }

        let matchMin = (minPrice === "") ? true : (displayPrice >= parseInt(minPrice));
        let matchMax = (maxPrice === "") ? true : (displayPrice <= parseInt(maxPrice));

        if (matchHeader && matchAdvName && matchBrand && matchCategory && matchMin && matchMax) {
            filteredList.push(product);
        }
    }

    applySortLogic();
    currentPage = 1;
    renderProducts();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function triggerDirectSearch() {
    let checkedBoxes = document.querySelectorAll(".cat-checkbox:checked");
    for (let i = 0; i < checkedBoxes.length; i++) {
        checkedBoxes[i].checked = false;
    }
    applyAdvancedFilters();
}

function applySortLogic() {
    let sortEl = document.getElementById("sortSelect");
    let sortValue = sortEl ? sortEl.value : "default";

    if (sortValue === "priceAsc") {
        filteredList.sort(function(a, b) {
            return getProductDisplayPrice(a) - getProductDisplayPrice(b);
        });
    } else if (sortValue === "priceDesc") {
        filteredList.sort(function(a, b) {
            return getProductDisplayPrice(b) - getProductDisplayPrice(a);
        });
    }
}

if (document.getElementById("productGrid")) {
    renderCategories();
    renderProducts();
}

function initPageFromUrl() {
    updateCartBadge();

    let params = new URLSearchParams(window.location.search);
    let productId = params.get("id");
    let searchKeyword = params.get("search") || params.get("keyword");
    let catCode = params.get("cat");
    let saleFlag = params.get("sale");

    if( productId ){
        moChiTietSanPham(productId);
    }

    if (catCode) {
        let targetCheckbox = document.querySelector('.cat-checkbox[value="' + catCode + '"]');
        if (targetCheckbox) targetCheckbox.checked = true;
    }

    if (searchKeyword) {
        if (document.getElementById("searchInput")) {
            document.getElementById("searchInput").value = searchKeyword;
        }
        if (document.getElementById("advNameInput")) {
            document.getElementById("advNameInput").value = searchKeyword;
        }
    }

    if ((catCode || searchKeyword || saleFlag) && document.getElementById("productGrid")) {
        applyAdvancedFilters();
    }
}
var sanPhamDangXem = null ;
var sizeDuocChon = "Tiêu chuẩn" ;
var mauDuocChon = "Mặc định" ;

function moChiTietSanPham( productId ){
    sanPhamDangXem = null;
    for( let i = 0 ; i < allProducts.length ;i++){
        if( String(allProducts[i].id) === String(productId) ){
            sanPhamDangXem = allProducts[i];
            break;
        }
    }

    if( !sanPhamDangXem ){
        showToast("Không tìm thấy thông tin chi tiết của sản phẩm này!", "danger");
        return ;
    }

    //Điền hình ảnh
    var modalImg = document.getElementById("qv-main-img");
    if( modalImg ) modalImg.src = sanPhamDangXem.image;

    //Điền thông tin văn bản
    document.getElementById("qv-title").textContent = sanPhamDangXem.name;
    document.getElementById("qv-brand").textContent = (sanPhamDangXem.brand || "CHÍNH HÃNG").toUpperCase();
    document.getElementById("qv-category").textContent = (sanPhamDangXem.category || "THỂ THAO").toUpperCase();
    document.getElementById("qv-code").textContent = sanPhamDangXem.code || ("SP-" + sanPhamDangXem.id);

    //Điền giá bán
    var giaHienThi = getProductDisplayPrice(sanPhamDangXem);
    document.getElementById("qv-price").textContent = formatMoney(giaHienThi)
    var oldPriceEl = document.getElementById("qv-old-price");
    if (sanPhamDangXem.originalPrice && Number(sanPhamDangXem.originalPrice) > giaHienThi) {
        oldPriceEl.textContent = formatMoney(Number(sanPhamDangXem.originalPrice)) ;
        oldPriceEl.style.display = "inline";
    } else {
        oldPriceEl.style.display = "none";
    }

    //Điền tình trạng tồn kho
    var stockCount = sanPhamDangXem.stock !== undefined ? sanPhamDangXem.stock : 25;
    var stockEl = document.getElementById("qv-stock");
    var btnThemVaoGio = document.querySelector(".qv-btn-add");
    var btnMuaNgay = document.querySelector(".qv-btn-buy");
    var btnColor = document.getElementById("qv-colors-box");
    var btnSize = document.getElementById("qv-sizes-box");
    var oNhapSoLuong = document.getElementById("qv-quantity-input");
    var pickerSoLuong = document.querySelector(".qv-qty-picker");


    //Điền mô tả
    document.getElementById("qv-desc").textContent = sanPhamDangXem.desc || "Sản phẩm thể thao cao cấp chính hãng, tối ưu hóa độ bền và hiệu năng tập luyện thi đấu đỉnh cao.";

    //Điền danh sách Size
    var danhSachSize = sanPhamDangXem.sizes || ["39", "40", "41", "42", "43"];
    var sizesBox = document.getElementById("qv-sizes-box");
    sizesBox.innerHTML = "";
    sizeDuocChon = danhSachSize[0] || "Tiêu chuẩn";
    danhSachSize.forEach(function(s, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "qv-choice-btn" + (index === 0 ? " active" : "");
        btn.textContent = s;
        btn.onclick = function() {
            sizesBox.querySelectorAll(".qv-choice-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            sizeDuocChon = s;
        };
        sizesBox.appendChild(btn);
    });


    // Điền danh sách Màu sắc
    var danhSachMau = sanPhamDangXem.colors || ["Tiêu chuẩn", "Đen Carbon", "Trắng Bạc"];
    var colorsBox = document.getElementById("qv-colors-box");
    colorsBox.innerHTML = "";
    mauDuocChon = danhSachMau[0] || "Mặc định";
    danhSachMau.forEach(function(m, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "qv-choice-btn" + (index === 0 ? " active" : "");
        btn.textContent = m;
        btn.onclick = function() {
            colorsBox.querySelectorAll(".qv-choice-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            mauDuocChon = m;
            var modalImg = document.getElementById("qv-main-img");
            if (modalImg && sanPhamDangXem.gallery && sanPhamDangXem.gallery[index]) {
                modalImg.src = sanPhamDangXem.gallery[index];
            }
        };
        colorsBox.appendChild(btn);
    });

    // TRƯỜNG HỢP 1: HẾT HÀNG
    if (stockCount <= 0) {
        stockEl.textContent = "Tạm hết hàng";
        stockEl.style.color = "#ef4444";
        // Khóa nút Thêm vào giỏ
        if (btnThemVaoGio) {
            btnThemVaoGio.disabled = true;
            btnThemVaoGio.style.opacity = "0.5";
            btnThemVaoGio.style.cursor = "not-allowed";
            btnThemVaoGio.textContent = "Tạm Hết Hàng";
        }
        // Khóa nút Mua ngay
        if (btnMuaNgay) {
            btnMuaNgay.disabled = true;
            btnMuaNgay.style.opacity = "0.5";
            btnMuaNgay.style.cursor = "not-allowed";
        }
        if (btnColor) {
            btnColor.disabled = true;
            btnColor.style.opacity = "0.5";
            btnColor.style.cursor = "not-allowed";
        }
        if (btnSize) {
            btnSize.disabled = true;
            btnSize.style.opacity = "0.5";
            btnSize.style.cursor = "not-allowed";
        }
        if (pickerSoLuong) {
            pickerSoLuong.style.opacity = "0.5";
            pickerSoLuong.style.pointerEvents = "none";
        }
        if (oNhapSoLuong){
            oNhapSoLuong.value = 0;
        }
        // TRƯỜNG HỢP 2: CÒN HÀNG
    } else {
        stockEl.textContent = "Còn hàng (" + stockCount + " món)";
        stockEl.style.color = "#16a34a";
        // Mở khóa lại nút Thêm vào giỏ
        if (btnThemVaoGio) {
            btnThemVaoGio.disabled = false;
            btnThemVaoGio.style.opacity = "1";
            btnThemVaoGio.style.cursor = "pointer";
            btnThemVaoGio.textContent = "🛒 Thêm Vào Giỏ";
        }
        // Mở khóa lại nút Mua ngay
        if (btnMuaNgay) {
            btnMuaNgay.disabled = false;
            btnMuaNgay.style.opacity = "1";
            btnMuaNgay.style.cursor = "pointer";
        }
        if (btnColor) {
            btnColor.disabled = false;
            btnColor.style.opacity = "1";
            btnColor.style.cursor = "pointer";
        }
        if (btnSize) {
            btnSize.disabled = false;
            btnSize.style.opacity = "1";
            btnSize.style.cursor = "pointer";
        }
        if (oNhapSoLuong){
            oNhapSoLuong.disabled = false;
            oNhapSoLuong.style.opacity = "1"; // Làm mờ nút
            oNhapSoLuong.value = 1;
        }
    }

    // Lưu biến toàn cục và cập nhật nút yêu thích trên modal
    window.sanPhamDangXem = sanPhamDangXem;
    var qvBtn = document.getElementById("qv-btn-wishlist");
    if (qvBtn) {
        var daThichModal = (typeof isYeuThich === "function") ? isYeuThich(sanPhamDangXem.id) : false;
        if (daThichModal) {
            qvBtn.classList.add("active");
            qvBtn.innerHTML = "❤️ Đã Thích";
            qvBtn.style.color = "#ef4444";
            qvBtn.style.background = "#ffe4e6";
            qvBtn.style.borderColor = "#fda4af";
        } else {
            qvBtn.classList.remove("active");
            qvBtn.innerHTML = "🤍 Yêu Thích";
            qvBtn.style.color = "#475569";
            qvBtn.style.background = "#ffffff";
            qvBtn.style.borderColor = "#e2e8f0";
        }
    }

    // Đặt lại số lượng về 1 và hiện Modal
    document.getElementById("qv-quantity-input").value = 1;
    document.getElementById("modal-quick-view").style.display = "flex";
}

function toggleYeuThichTuModal() {
    if (!sanPhamDangXem) return;
    toggleYeuThich(sanPhamDangXem.id);
}

function dongChiTietSanPham() {
    var modal = document.getElementById("modal-quick-view");
    if (modal) modal.style.display = "none";
}

function dongModalKhiBamRaNgoai(event) {
    if (event.target.id === "modal-quick-view") {
        dongChiTietSanPham();
    }
}

function thayDoiSoLuong(delta) {
    var input = document.getElementById("qv-quantity-input");
    var current = parseInt(input.value) || 1;
    var nextVal = current + delta;

    var tonKho = (sanPhamDangXem && sanPhamDangXem.stock != undefined ) ? sanPhamDangXem.stock : 0;

    if (nextVal >= 1 && nextVal <= sanPhamDangXem.stock) {
        input.value = nextVal;
    }else if (nextVal > sanPhamDangXem.stock) {
        showToast("Sản phẩm này trong kho chỉ còn " + tonKho + " món!", "danger");
    }
}

function themVaoGioTuModal( muangay ){
    if( !sanPhamDangXem ){
        return ;
    }

    var soLuong = parseInt(document.getElementById("qv-quantity-input").value );
    var monHang = {
        id: sanPhamDangXem.id || sanPhamDangXem.code,
        name: sanPhamDangXem.name,
        price: getProductDisplayPrice(sanPhamDangXem),
        image: sanPhamDangXem.image,
        size: sizeDuocChon,
        color: mauDuocChon,
        stock: sanPhamDangXem.stock || 50
    };
    if( typeof addToCart === "function"){
        var ketqua = addToCart(monHang , soLuong);
        if( !ketqua ){
            return ;
        }
    }
    dongChiTietSanPham();

    if( muangay ){
        window.location.href = "user.html?tab=checkout";
    }
}

initPageFromUrl();
