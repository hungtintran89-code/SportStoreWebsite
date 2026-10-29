// lấy ds sp và loại sp ra để chuẩn bị hiện lên web
let allProducts = readStorage("products", mockProducts);
let allCategories = readStorage("categories", mockCategories);

// chỉ lấy mấy sp đang hiện, sp nào bấm ẩn bên admin thì bỏ qua
let filteredList = [];
for (let i = 0; i < allProducts.length; i++) {
    if (!allProducts[i].isHidden) {
        filteredList.push(allProducts[i]);
    }
}

let currentPage = 1;
const productsPerPage = 15; // mỗi trang hiện 15 sp
let toastTimer = null;
let ignoreUrlSale = false;

// lấy giá bán của sp
function getProductDisplayPrice(product) {
    let price = product.salePrice || product.price || product.sellingPrice || product.importPrice || 0;
    return Number(price);
}

// tính tổng sl sp đang có trong giỏ hàng
function getCartTotalCount() {
    let cart = readStorage("cart", []);
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

// đổ ds loại sp ra cột lọc bên trái
function renderCategories() {
    let categoryBox = document.getElementById("category-filter");
    if (!categoryBox) return;
    categoryBox.innerHTML = "";

    for (let i = 0; i < allCategories.length; i++) {
        let cat = allCategories[i];
        if (cat.isHidden) continue;

        // đếm số sp của từng loại
        let count = 0;
        for (let j = 0; j < allProducts.length; j++) {
            if (allProducts[j].categoryCode === cat.categoryCode && !allProducts[j].isHidden) {
                count++;
            }
        }

        if (count > 0) {
            categoryBox.innerHTML += `
                <div style="margin-bottom: 4px;">
                    <label style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 2px 0;">
                        <span style="display: inline-flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="cat-checkbox" value="${cat.categoryCode}" onchange="applyAdvancedFilters()" style="margin: 0;">
                            ${cat.name}
                        </span>
                        <span style="color: #64748b; font-size: 12px;">(${count})</span>
                    </label>
                </div>
            `;
        }
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
function renderProducts() {
    let grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";

    updateFilterStatusSummary();

    // nếu ko tìm thấy sp nào thì báo trống
    if (filteredList.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0;">
                <i class="fa-solid fa-box-open" style="font-size: 40px; color: #0284c7; margin-bottom: 12px;"></i>
                <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                <button class="btn-primary" style="width: auto; padding: 10px 24px;" onclick="resetAllFilters()">Xóa bộ lọc & Xem tất cả</button>
            </div>
        `;
        renderPagination();
        return;
    }

    // cắt lấy 15 sp của trang hiện tại
    let startIndex = (currentPage - 1) * productsPerPage;
    let endIndex = startIndex + productsPerPage;
    let productsToDisplay = filteredList.slice(startIndex, endIndex);

    for (let i = 0; i < productsToDisplay.length; i++) {
        let product = productsToDisplay[i];
        if (product.isHidden) continue;

        // lấy hình đầu tiên trong gallery-data.js, ko có thì lấy hình mặc định của sp
        let cardImage = product.image || "https://via.placeholder.com/200?text=SportStore";
        if (window.SPORTMAX_GALLERIES && product.sourceUrl && window.SPORTMAX_GALLERIES[product.sourceUrl]) {
            let galleryArr = window.SPORTMAX_GALLERIES[product.sourceUrl];
            if (galleryArr.length > 0) {
                cardImage = galleryArr[0];
            }
        }

        let displayPrice = getProductDisplayPrice(product);
        let formattedPrice = displayPrice.toLocaleString("vi-VN");
        let hasDiscount = product.originalPrice && Number(product.originalPrice) > displayPrice;
        let originalPriceHtml = "";
        if (hasDiscount) {
            originalPriceHtml = '<span class="original-price">' + Number(product.originalPrice).toLocaleString("vi-VN") + ' ₫</span>';
        }

        let productCard = `
            <div class="product-card">
                ${hasDiscount ? '<span class="sale-badge">SALE</span>' : ''}
                <a href="product-detail.html?id=${product.productCode}" style="text-decoration: none; color: inherit;">
                    <img src="${cardImage}" alt="${product.name}" onerror="handleProductImageError('${product.productCode}', this)">
                    <h4>${product.name}</h4>
                </a>
                <div class="product-price">${formattedPrice} ₫ ${originalPriceHtml}</div>
                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <button class="btn-primary" style="flex: 1;" onclick="window.location.href='product-detail.html?id=${product.productCode}'">Xem chi tiết</button>
                    <button class="btn-primary" style="width: 42px; padding: 10px 0; background-color: #0f172a;" onclick="quickAddToCart('${product.productCode}')" title="Thêm vào giỏ hàng">
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
    let product = null;
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].productCode === productCode) {
            product = allProducts[i];
            break;
        }
    }
    if (!product) return;

    let cart = readStorage("cart", []);
    let existingItem = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productCode === productCode || cart[i].id === productCode) {
            existingItem = cart[i];
            break;
        }
    }

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || existingItem.qty || 1) + 1;
        existingItem.qty = existingItem.quantity;
    } else {
        cart.push({
            id: product.productCode,
            productCode: product.productCode,
            name: product.name,
            price: getProductDisplayPrice(product),
            image: product.image,
            quantity: 1,
            qty: 1
        });
    }

    saveStorage("cart", cart);
    updateCartHeaderBadge();
    showSportMaxToast('Đã thêm "' + product.name + '" vào giỏ hàng!');
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
function applyAdvancedFilters() {
    let headerKeyword = document.getElementById("searchInput") ? document.getElementById("searchInput").value.trim() : "";
    let advKeyword = document.getElementById("advNameInput") ? document.getElementById("advNameInput").value.trim() : "";
    let brandKeyword = document.getElementById("brandFilterSelect") ? document.getElementById("brandFilterSelect").value.trim() : "";

    // lấy các loại sp đang đc tích chọn bên cột trái
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
        if (product.isHidden) continue;

        let displayPrice = getProductDisplayPrice(product);
        let hasDiscount = product.originalPrice && Number(product.originalPrice) > displayPrice;
        if (promoOnly && !hasDiscount) continue;

        // gộp tên + thông số + mô tả để tìm
        let searchTarget = (product.name || "") + " " + (product.specifications || "") + " " + (product.description || "");

        let matchHeader = matchProductSearch(searchTarget, headerKeyword);
        let matchAdvName = matchProductSearch(searchTarget, advKeyword);
        let matchBrand = (brandKeyword === "") ? true : matchProductSearch(searchTarget, brandKeyword);

        let matchCategory = (selectedCategories.length === 0) || (selectedCategories.indexOf(product.categoryCode) !== -1);
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

initPageFromUrl();
