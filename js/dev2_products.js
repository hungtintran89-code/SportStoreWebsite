// 1. Hàm đọc dữ liệu an toàn từ LocalStorage hoặc mảng biến toàn cục data/store
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

// Lấy danh sách sản phẩm và danh mục chuẩn
let allProducts = loadAppProducts();
let allCategories = loadAppCategories();

// Hàm kiểm tra sản phẩm / danh mục có đang hiển thị không (hỗ trợ cả isHidden và status)
function isItemActive(item) {
    if (!item) return false;
    if ( item.status === "inactive") return false;
    return true;
}

// Khởi tạo danh sách lọc ban đầu gồm các sản phẩm đang bán
let filteredList = [];
for (let i = 0; i < allProducts.length; i++) {
    if (isItemActive(allProducts[i])) {
        filteredList.push(allProducts[i]);
    }
}

// Lấy giá bán thực tế của sản phẩm
function getProductDisplayPrice(product) {
    let price = product.price || 0;
    return Number(price);
}

// Lấy giá niêm yết ban đầu (nếu có giảm giá)
function getProductOriginalPrice(product) {
    if (product.originalPrice) return Number(product.originalPrice);
    if (product.salePrice && product.price && Number(product.price) > Number(product.salePrice)) {
        return Number(product.price);
    }
    return 0;
}

let currentPage = 1;
const productsPerPage = 15; // mỗi trang hiện 15 sp
let toastTimer = null;
let ignoreUrlSale = false;

// lấy giá bán của sp
function getProductDisplayPrice(product) {
    let price = product.price || 0;
    return Number(price);
}

// tính tổng sl sp đang có trong giỏ hàng
function getCartTotalCount() {
    let cart = [];
    try {
        let raw = localStorage.getItem("cart");
        if (raw) cart = JSON.parse(raw);
    } catch (e) {
        cart = [];
    }
    if (!Array.isArray(cart)) return 0;

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += Number(cart[i].quantity || cart[i].qty || 1);
    }
    return total;
}
// cập nhật số lượng trên icon giỏ hàng ở header
function updateCartHeaderBadge() {
    let totalCount = getCartTotalCount();
    let sportBadge = document.getElementById("header-cart-badge-count");
    if (sportBadge) {
        sportBadge.innerText = totalCount;
    }
}

// hiện thông báo nhỏ góc dưới khi bấm thêm giỏ hàng
function showSportMaxToast(message) {
    let toast = document.getElementById("sportmax-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sportmax-toast";
        toast.className = "sportmax-toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>' + message + '</span>';
    toast.classList.add("show");

    if (toastTimer) {
        clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2800);
}
// Đổ danh mục ra cột lọc bên trái
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
            <div style="margin-bottom: 6px;">
                <label style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; padding: 3px 0;">
                    <span style="display: inline-flex; align-items: center; gap: 8px;">
                        <input type="checkbox" class="cat-checkbox" value="${catId}" onchange="applyAdvancedFilters()" style="margin: 0; cursor: pointer;">
                        ${cat.name}
                    </span>
                    <span style="color: #64748b; font-size: 12px; font-weight: 500;">(${count})</span>
                </label>
            </div>
        `;
    }
}

// hiện dòng báo tìm thấy bao nhiêu sp trên thanh lọc
function updateFilterStatusSummary() {
    let summaryEl = document.getElementById("filterResultSummary");
    if (!summaryEl) return;

    let headerKw = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim() : "";
    let advKw = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
    let kw = advKw || headerKw;

    if (kw !== "") {
        summaryEl.innerHTML = 'Tìm thấy <strong style="color: #0284c7;">' + filteredList.length + '</strong> sản phẩm cho từ khóa <em>"' + kw + '"</em>';
    } else {
        summaryEl.innerHTML = 'Hiển thị <strong style="color: #0284c7;">' + filteredList.length + '</strong> sản phẩm thể thao chính hãng';
    }
}

// vẽ danh sách sp ra lưới
// Vẽ danh sách sản phẩm ra lưới
function renderProducts() {
    let grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";

    updateFilterStatusSummary();

    if (filteredList.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
                <i class="fa-solid fa-box-open" style="font-size: 44px; color: #0284c7; margin-bottom: 14px;"></i>
                <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #334155;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                <button class="btn-primary" style="width: auto; padding: 10px 24px; cursor: pointer;" onclick="resetAllFilters()">Xóa bộ lọc & Xem tất cả</button>
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

        // Lấy mã sản phẩm (hỗ trợ cả code, id, productCode)
        let productCode = product.code || product.productCode || product.id;

        // Lấy ảnh hiển thị
        let cardImage = product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600";
        if (window.SPORTMAX_GALLERIES && product.sourceUrl && window.SPORTMAX_GALLERIES[product.sourceUrl]) {
            let galleryArr = window.SPORTMAX_GALLERIES[product.sourceUrl];
            if (galleryArr.length > 0) cardImage = galleryArr[0];
        }

        // Tính toán giá và huy hiệu SALE
        let displayPrice = getProductDisplayPrice(product);
        let formattedPrice = displayPrice.toLocaleString("vi-VN");
        let originalPrice = getProductOriginalPrice(product);
        let hasDiscount = originalPrice > displayPrice;
        let originalPriceHtml = hasDiscount
            ? `<span class="original-price" style="text-decoration: line-through; color: #94a3b8; font-size: 13px; margin-left: 6px;">${originalPrice.toLocaleString("vi-VN")} ₫</span>`
            : "";

        let productCard = `
            <div class="product-card">
                ${hasDiscount ? '<span class="sale-badge">SALE</span>' : ''}
                
                <!-- Bấm vào ảnh hoặc tên sản phẩm sẽ mở Popup Chi Tiết ngay trên trang -->
                <a href="javascript:void(0)" onclick="moChiTietSanPham('${product.id}')" style="text-decoration: none; color: inherit;">
                    <img src="${cardImage}" alt="${product.name}" onerror="handleProductImageError('${product.id}', this)">
                    <h4>${product.name}</h4>
                </a>
                
                <div class="product-price">${formattedPrice} ₫ ${originalPriceHtml}</div>
                
                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <!-- Nút Xem chi tiết: Bật Popup Chi Tiết -->
                    <button class="btn-primary" style="flex: 1;" onclick="moChiTietSanPham('${product.id}')">
                        Xem chi tiết
                    </button>
                    
                    <!-- Nút Thêm nhanh 1 món vào giỏ hàng -->
                    <button class="btn-primary" style="width: 42px; padding: 10px 0; background-color: #0f172a;" onclick="quickAddToCart('${product.id}')" title="Thêm vào giỏ hàng">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += productCard;

    }

    renderPagination();
}

// bấm nút đặt lại bộ lọc thì xoá trắng các ô rồi load lại tất cả sp
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

// bấm icon giỏ hàng trên từng thẻ sp để thêm nhanh 1 món vô giỏ
function quickAddToCart(productCode) {
    let product = null ;
    for( let i = 0 ; i < allProducts.length ; i++){
        let code = allProducts[i].id ;
        if( String(productCode) === String(allProducts[i].id)){
            product = allProducts[i];
            break;
        }
    }
    if( !product ) return ;

    let cart = [] ;
    try {
        let raw = localStorage.getItem("sport_cart") ;
        if( raw ) cart = JSON.parse(raw);
    }catch (e){
        cart = [];
    }

    if( !Array.isArray(cart)) cart = [];

    let pId = product.id ;
    let existingItem  = null ;

    for( let i = 0 ; i < allProducts.length ;i++){
        let itemId = allProducts[i].id ;
        if( String(itemId) === pId ){
            existingItem = cart[i];
        }
    }

    if( existingItem  ){
        existingItem.quantity  = (existingItem.quantity || 1 ) + 1 ;
    }else{
        cart.push({
            id: pId,
            code: pId,
            name: product.name,
            price: getProductDisplayPrice(product),
            image: product.image || (Array.isArray(product.gallery) && product.gallery[0]) || "",
            quantity: 1
        })
    }

    localStorage.setItem("sport_cart" , JSON.stringify(cart)) ;

    updateCartHeaderBadge();

    showSportMaxToast("Đã thêm " + product.name + " vào giỏ hàng")

}

// nếu ảnh bị lỗi link thì đổi qua ảnh mặc định
function handleProductImageError(productCode, imageElement) {
    imageElement.onerror = null;
    imageElement.src = "https://via.placeholder.com/200?text=SportStore";
}

// vẽ các nút phân trang 1, 2, 3... ở dưới lưới sp
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

// đổi trang và cuộn lên đầu danh sách
function changePage(pageNumber) {
    let totalPages = Math.ceil(filteredList.length / productsPerPage);
    if (totalPages < 1) totalPages = 1;

    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;

    currentPage = pageNumber;
    renderProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// bỏ dấu tiếng Việt để gõ ko dấu vẫn tìm đc sp
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

// kiểm tra tên sp có khớp với từ khoá tìm kiếm ko
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

// lọc nâng cao kết hợp: Tên + Loại sp + Hãng + Khoảng giá
// Lọc nâng cao: Tên + Danh mục + Thương hiệu + Khoảng giá
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
}

// bấm tìm trên header thì bỏ tích checkbox cũ để tìm toàn bộ shop
function triggerDirectSearch() {
    let checkedBoxes = document.querySelectorAll(".cat-checkbox:checked");
    for (let i = 0; i < checkedBoxes.length; i++) {
        checkedBoxes[i].checked = false;
    }
    applyAdvancedFilters();
}

// sắp xếp danh sách sp theo giá tăng hoặc giảm
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

// chạy lần đầu khi mở trang ds sp
if (document.getElementById("productGrid")) {
    renderCategories();
    renderProducts();
}

// đọc tham số trên url nếu khách bấm từ menu xổ xuống qua
function initPageFromUrl() {
    updateCartHeaderBadge();

    let params = new URLSearchParams(window.location.search);
    let searchKeyword = params.get("search") || params.get("keyword");
    let catCode = params.get("cat");
    let saleFlag = params.get("sale");

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

    for( let i = 0 ; i < allProducts.length ;i++){
        if( String(allProducts[i].id) === productId ){
            sanPhamDangXem = allProducts[i];
        }
    }

    if( !sanPhamDangXem ){
        alert("Không tìm thấy thông tin chi tiết của sản phẩm này!");
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
    document.getElementById("qv-price").textContent = giaHienThi.toLocaleString("vi-VN") + " ₫";
    var oldPriceEl = document.getElementById("qv-old-price");
    if (sanPhamDangXem.originalPrice && Number(sanPhamDangXem.originalPrice) > giaHienThi) {
        oldPriceEl.textContent = Number(sanPhamDangXem.originalPrice).toLocaleString("vi-VN") + " ₫";
        oldPriceEl.style.display = "inline";
    } else {
        oldPriceEl.style.display = "none";
    }

    //Điền tình trạng tồn kho
    var stockCount = sanPhamDangXem.stock !== undefined ? sanPhamDangXem.stock : 25;
    var stockEl = document.getElementById("qv-stock");
    if (stockCount > 0) {
        stockEl.textContent = "Còn hàng (" + stockCount + " món)";
        stockEl.style.color = "#16a34a";
    } else {
        stockEl.textContent = "Tạm hết hàng";
        stockEl.style.color = "#ef4444";
    }

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
        };
        colorsBox.appendChild(btn);
    });

    // Đặt lại số lượng về 1 và hiện Modal
    document.getElementById("qv-quantity-input").value = 1;
    document.getElementById("modal-quick-view").style.display = "flex";

}

/*** 2. ĐÓNG MODAL*/
function dongChiTietSanPham() {
    var modal = document.getElementById("modal-quick-view");
    if (modal) modal.style.display = "none";
}
function dongModalKhiBamRaNgoai(event) {
    if (event.target.id === "modal-quick-view") {
        dongChiTietSanPham();
    }
}



/*** 3. TĂNG / GIẢM SỐ LƯỢNG MUA*/
function thayDoiSoLuong(delta) {
    var input = document.getElementById("qv-quantity-input");
    var current = parseInt(input.value) || 1;
    var nextVal = current + delta;
    if (nextVal >= 1 && nextVal <= 99) {
        input.value = nextVal;
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
        window.location.href = "dev4_checkout.html";
    }else{
        alert("Đã thêm " + soLuong + " sản phẩm [" + sanPhamDangXem.name + "] vào giỏ hàng!");
    }

}

initPageFromUrl();
