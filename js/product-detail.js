
// lấy cái id sản phẩm trên thanh url xuống (vd: ?id=201 hoặc ?id=SP-201)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Đọc danh sách từ LocalStorage hệ thống chung (sport_products)
let rawProds = [];
try {
    rawProds = JSON.parse(localStorage.getItem("sport_products")) || (typeof products !== "undefined" ? products : []);
} catch(e) {
    rawProds = typeof products !== "undefined" ? products : [];
}

// dò trong mảng xem khách đang bấm coi sp nào
let currentProduct = null;
for (let i = 0; i < rawProds.length; i++) {
    if( String(p.id) === productId ){
        currentProduct = rawProds[i] ;
        break;
    }
}

let currentGalleryImages = [];
let currentGalleryIndex = 0;
const staticGalleries = window.SPORTMAX_GALLERIES || {};

// lấy giá hiển thị của sp
function getProductDisplayPrice(product) {
    let price = product.salePrice || product.price || product.sellingPrice || product.importPrice || 0;
    return Number(price);
}

// kiếm đủ 4 tấm hình cho khung ảnh nhỏ ở dưới, nếu sp ít hình quá thì mượn tạm hình cùng loại đắp vô cho đủ 4 tấm
function buildFourGalleryImages(product) {
    let mainImg = (product.image || "").trim();
    let staticGallery = [];
    if (product.sourceUrl && Array.isArray(staticGalleries[product.sourceUrl])) {
        staticGallery = staticGalleries[product.sourceUrl];
    }
    let storedGallery = Array.isArray(product.images) ? product.images : [];

    // gom hết hình lại rồi lọc bỏ mấy tấm bị trùng link
    let rawList = storedGallery.concat(staticGallery);
    if (mainImg !== "") {
        rawList.push(mainImg);
    }

    let uniqueImages = [];
    for (let i = 0; i < rawList.length; i++) {
        let imgUrl = String(rawList[i] || "").trim();
        if (imgUrl !== "" && uniqueImages.indexOf(imgUrl) === -1) {
            uniqueImages.push(imgUrl);
        }
    }

    // nếu chưa đủ 4 tấm thì lấy thêm hình của sp cùng danh mục bù vô
    if (uniqueImages.length < 4) {
        for (let i = 0; i < products.length; i++) {
            if (uniqueImages.length >= 4) break;
            let item = products[i];
            if (item.categoryCode === product.categoryCode && item.productCode !== product.productCode && !item.isHidden && item.image) {
                if (uniqueImages.indexOf(item.image) === -1) {
                    uniqueImages.push(item.image);
                }
            }
        }
    }

    let fallbackImg = uniqueImages[0] || "https://via.placeholder.com/600x600?text=SPORT+MAX";
    while (uniqueImages.length < 4) {
        uniqueImages.push(fallbackImg);
    }

    return uniqueImages.slice(0, 4);
}

// nếu tìm thấy sp thì bắt đầu đổ thông tin lên giao diện
if (currentProduct) {
    const fallbackImage = "https://via.placeholder.com/600x600?text=SPORT+MAX";
    currentGalleryImages = buildFourGalleryImages(currentProduct);

    // lấy tên loại sp để hiện lên chỗ thông tin
    let catName = "Đồ thể thao";
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === currentProduct.categoryCode) {
            catName = categories[i].name;
            break;
        }
    }

    let brandName = getBrandName(currentProduct) || "SportMax";

    if (document.getElementById("detailName")) {
        document.getElementById("detailName").innerText = currentProduct.name;
    }
    if (document.getElementById("detailBreadcrumbName")) {
        document.getElementById("detailBreadcrumbName").innerText = " / " + currentProduct.name;
    }
    if (document.getElementById("detailCode")) {
        document.getElementById("detailCode").innerText = currentProduct.productCode;
    }
    if (document.getElementById("detailCategory")) {
        document.getElementById("detailCategory").innerText = catName;
    }
    if (document.getElementById("detailBrand")) {
        document.getElementById("detailBrand").innerText = brandName;
    }

    // check số lượng tồn kho để báo còn hàng hay hết hàng
    const stockEl = document.getElementById("detailStock");
    const stockCount = (currentProduct.stock !== undefined && currentProduct.stock !== null) ? currentProduct.stock : 50;
    if (stockEl) {
        if (stockCount > 0) {
            stockEl.innerText = "Còn hàng (" + stockCount + " SP)";
            stockEl.style.color = "#2e7d32";
        } else {
            stockEl.innerText = "Tạm hết hàng";
            stockEl.style.color = "#e0685f";
        }
    }

    // hiện giá bán (nếu có giá cũ cao hơn thì hiện thêm giá gạch ngang)
    const salePrice = getProductDisplayPrice(currentProduct);
    const hasDiscount = currentProduct.originalPrice && Number(currentProduct.originalPrice) > salePrice;
    let priceHtml = salePrice.toLocaleString("vi-VN") + " ₫";
    if (hasDiscount) {
        priceHtml += '<span class="original-price">Giá niêm yết: ' + Number(currentProduct.originalPrice).toLocaleString("vi-VN") + ' ₫</span>';
    }
    document.getElementById("detailPrice").innerHTML = priceHtml;

    // đổ phần mô tả với tách dấu | ở thông số kỹ thuật ra thành danh sách
    document.getElementById("detailDescText").innerText = currentProduct.description || "Sản phẩm thể thao chính hãng phân phối tại SportMax.";
    const specificationBox = document.getElementById("detailSpecifications");
    let rawSpecs = String(currentProduct.specifications || "").split("|");
    let specHtml = "";
    for (let i = 0; i < rawSpecs.length; i++) {
        let s = rawSpecs[i].trim();
        if (s !== "") {
            specHtml += '<li><i class="fa-solid fa-check" style="color: #0284c7; margin-right: 8px;"></i>' + s + '</li>';
        }
    }

    if (specHtml !== "") {
        specificationBox.innerHTML = "<h3>Thông số kỹ thuật</h3><ul>" + specHtml + "</ul>";
    } else {
        specificationBox.innerHTML = "<p>Đang cập nhật thông số...</p>";
    }

    const sourceElement = document.getElementById("detailSource");
    if (sourceElement) {
        if (currentProduct.sourceUrl) {
            sourceElement.innerHTML = 'Nguồn tham khảo sản phẩm chính hãng: <a href="' + currentProduct.sourceUrl + '" target="_blank">' + currentProduct.sourceUrl + '</a>';
        } else {
            sourceElement.innerHTML = "";
        }
    }

    const detailImage = document.getElementById("detailImage");
    detailImage.src = currentGalleryImages[0] || fallbackImage;
    detailImage.onerror = function() {
        detailImage.src = fallbackImage;
    };

    renderGallery();
    updateGalleryIndicator();
    renderProductOptions(currentProduct);
    renderRelatedProducts(currentProduct);
} else {
    document.querySelector(".product-detail-wrapper").innerHTML = "<h2 style='text-align:center; width:100%; padding: 40px 0;'>Sản phẩm không tồn tại!</h2>";
}

// vẽ tấm hình bự ở trên và 4 tấm hình nhỏ bên dưới
function renderGallery() {
    const detailImage = document.getElementById("detailImage");
    const thumbnailList = document.getElementById("thumbnailList");
    const fallbackImage = "https://via.placeholder.com/600x600?text=SPORT+MAX";

    detailImage.src = currentGalleryImages[currentGalleryIndex] || fallbackImage;
    let html = "";
    for (let i = 0; i < currentGalleryImages.length; i++) {
        let activeClass = (i === currentGalleryIndex) ? " active" : "";
        html += `<img class="thumb${activeClass}" src="${currentGalleryImages[i]}" alt="${currentProduct.name} - ảnh ${i + 1}" onerror="this.src='${fallbackImage}'" onclick="changeImage(${i})">`;
    }
    thumbnailList.innerHTML = html;
}

// bấm chuyển qua lại giữa 2 tab Mô tả và Thông số kỹ thuật
function switchDetailTab(tabName, btnElement) {
    let tabButtons = document.querySelectorAll("[data-detail-tab]");
    for (let j = 0; j < tabButtons.length; j++) {
        tabButtons[j].classList.remove("active");
    }
    let panels = document.querySelectorAll("[data-detail-panel]");
    for (let k = 0; k < panels.length; k++) {
        panels[k].classList.remove("active");
    }
    if (btnElement) {
        btnElement.classList.add("active");
    }
    let targetPanel = document.querySelector('[data-detail-panel="' + tabName + '"]');
    if (targetPanel) {
        targetPanel.classList.add("active");
    }
}

// check xem sp thuộc môn nào (giày, quần áo, vợt, bóng...) để hiện ô chọn size cho chuẩn
function renderProductOptions(product) {
    const options = document.getElementById("productOptions");
    if (!options) return;

    const lowerName = String(product.name || "").toLowerCase();

    // dựa vô tên với mã loại để phân biệt từng mặt hàng
    const isBall = (lowerName.indexOf("bóng rổ") !== -1 || lowerName.indexOf("bóng đá") !== -1 || lowerName.indexOf("bóng chuyền") !== -1 || lowerName.indexOf("quả bóng") !== -1)
        && lowerName.indexOf("giày") === -1 && lowerName.indexOf("áo") === -1 && lowerName.indexOf("vợt") === -1 && lowerName.indexOf("túi") === -1;
    const isShoes = product.categoryCode === "CAT02" || lowerName.indexOf("giày") !== -1;
    const isApparel = product.categoryCode === "CAT03" || product.categoryCode === "CAT04" || product.categoryCode === "CAT05"
        || lowerName.indexOf("áo") !== -1 || lowerName.indexOf("quần") !== -1 || lowerName.indexOf("váy") !== -1;
    const isTableTennisRacket = lowerName.indexOf("vợt bóng bàn") !== -1 || lowerName.indexOf("cốt vợt") !== -1;
    const isPickleballRacket = lowerName.indexOf("pickleball") !== -1 && lowerName.indexOf("vợt") !== -1;
    const isTennisRacket = lowerName.indexOf("vợt tennis") !== -1;
    const isBadmintonRacket = (product.categoryCode === "CAT01" && !isBall && !isTableTennisRacket && !isPickleballRacket && !isTennisRacket) || lowerName.indexOf("vợt cầu lông") !== -1;

    const productVariants = findProductVariants(product);
    let variantOptionsHtml = "";
    if (productVariants.length > 1) {
        for (let i = 0; i < productVariants.length; i++) {
            let v = productVariants[i];
            let selectedAttr = (v.productCode === product.productCode) ? "selected" : "";
            variantOptionsHtml += `<option value="${v.productCode}" ${selectedAttr}>${getVariantLabel(v)}</option>`;
        }
    } else {
        variantOptionsHtml = `<option selected>Tiêu chuẩn chính hãng</option>`;
    }

    let html = `
        <div class="option-group">
            <label>Màu sắc / Phiên bản</label>
            <select style="background: #ffffff; color: #0f172a;" id="productVariantSelect" onchange="changeVariant(this.value)">
                ${variantOptionsHtml}
            </select>
        </div>
    `;

    // tuỳ theo từng loại sp mà hiện ô chọn size tương ứng
    if (isBall) {
        let isBasketball = lowerName.indexOf("bóng rổ") !== -1;
        html += `
            <div class="option-group">
                <label>Kích cỡ bóng (Size)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    ${isBasketball
                        ? `<option value="Size 7 (Nam tiêu chuẩn)" selected>Size 7 (Tiêu chuẩn Nam)</option>
                            <option value="Size 6 (Nữ / Thiếu niên)">Size 6 (Tiêu chuẩn Nữ)</option>`
                        : `<option value="Size 5 (Tiêu chuẩn thi đấu)" selected>Size 5 (Tiêu chuẩn thi đấu)</option>
                            <option value="Size 4 (Tập luyện / Sân nhỏ)">Size 4 (Tập luyện / Sân nhỏ)</option>`
                    }
                </select>
            </div>
            <div class="option-group">
                <label>Mặt sân phù hợp</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Indoor & Outdoor (Đa năng)" selected>Indoor & Outdoor (Đa năng)</option>
                    <option value="Chuyên sàn thi đấu (Indoor)">Chuyên sàn thi đấu (Indoor)</option>
                </select>
            </div>
        `;
    } else if (isTableTennisRacket) {
        html += `
            <div class="option-group">
                <label>Kiểu cán cầm (Handle)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="Cán FL (Cán loe phổ biến)" selected>Cán FL (Cán loe phổ biến)</option>
                    <option value="Cán ST (Cán thẳng)">Cán ST (Cán thẳng)</option>
                </select>
            </div>
            <div class="option-group">
                <label>Tùy chọn dán mặt vợt</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Tiêu chuẩn nhà sản xuất" selected>Tiêu chuẩn nhà sản xuất</option>
                    <option value="Cắt dán sẵn viền bảo vệ">Cắt dán sẵn kèm viền bảo vệ</option>
                </select>
            </div>
        `;
    } else if (isPickleballRacket) {
        html += `
            <div class="option-group">
                <label>Độ dày lõi vợt (Core)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="16mm (Control - Kiểm soát)" selected>16mm (Control - Kiểm soát)</option>
                    <option value="14mm (Power - Tấn công)">14mm (Power - Tấn công)</option>
                </select>
            </div>
            <div class="option-group">
                <label>Phụ kiện tặng kèm</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Tặng quấn cán + Dán viền" selected>Tặng quấn cán + Dán viền</option>
                    <option value="Nguyên bản chính hãng">Nguyên bản chính hãng</option>
                </select>
            </div>
        `;
    } else if (isTennisRacket) {
        html += `
            <div class="option-group">
                <label>Kích cỡ cán vợt (Grip Size)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="Grip L2 (4 1/4 inch)" selected>Grip L2 (4 1/4 inch - Chuẩn Châu Á)</option>
                    <option value="Grip L3 (4 3/8 inch)">Grip L3 (4 3/8 inch)</option>
                </select>
            </div>
            <div class="option-group">
                <label>Mức căng dây (LBS)</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Căng 50 LBS (22.5kg)" selected>Căng 50 LBS (22.5kg)</option>
                    <option value="Căng 52 LBS (23.5kg)">Căng 52 LBS (23.5kg)</option>
                    <option value="Khung chưa đan dây">Khung chưa đan dây</option>
                </select>
            </div>
        `;
    } else if (isShoes) {
        html += `
            <div class="option-group">
                <label>Kích cỡ giày (Size)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="Size 38">Size 38</option>
                    <option value="Size 39">Size 39</option>
                    <option value="Size 40" selected>Size 40</option>
                    <option value="Size 41">Size 41</option>
                    <option value="Size 42">Size 42</option>
                    <option value="Size 43">Size 43</option>
                    <option value="Size 44">Size 44</option>
                </select>
            </div>
            <div class="option-group">
                <label>Form giày</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Tiêu chuẩn (Standard)" selected>Tiêu chuẩn (Standard)</option>
                    <option value="Form Wide (Chân bè)">Form Wide (Chân bè)</option>
                </select>
            </div>
        `;
    } else if (isApparel) {
        html += `
            <div class="option-group">
                <label>Kích cỡ quần áo (Size)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="Size S">Size S (45 - 53kg)</option>
                    <option value="Size M" selected>Size M (54 - 62kg)</option>
                    <option value="Size L">Size L (63 - 70kg)</option>
                    <option value="Size XL">Size XL (71 - 78kg)</option>
                    <option value="Size XXL">Size XXL (79 - 86kg)</option>
                </select>
            </div>
            <div class="option-group">
                <label>Kiểu dáng</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Regular Fit (Tiêu chuẩn)" selected>Regular Fit (Tiêu chuẩn)</option>
                    <option value="Slim-Fit (Ôm nhẹ)">Slim-Fit (Ôm nhẹ)</option>
                </select>
            </div>
        `;
    } else if (isBadmintonRacket) {
        html += `
            <div class="option-group">
                <label>Trọng lượng (U)</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="3U (85-89g)">3U (85 - 89g)</option>
                    <option value="4U (80-84g)" selected>4U (80 - 84g)</option>
                    <option value="5U (<80g)">5U (Siêu nhẹ)</option>
                </select>
            </div>
            <div class="option-group">
                <label>Chu vi cán & Mức căng</label>
                <select id="selectSpec" style="background: #ffffff; color: #0f172a;">
                    <option value="Cán G5 - Căng 10.5kg" selected>Cán G5 - Căng 10.5kg</option>
                    <option value="Cán G5 - Căng 11kg">Cán G5 - Căng 11kg</option>
                    <option value="Cán G6 - Khung chưa đan">Cán G6 - Khung chưa đan</option>
                </select>
            </div>
        `;
    } else {
        html += `
            <div class="option-group">
                <label>Quy cách đóng gói</label>
                <select id="selectSize" style="background: #ffffff; color: #0f172a;">
                    <option value="Tiêu chuẩn chính hãng" selected>Tiêu chuẩn chính hãng</option>
                </select>
            </div>
        `;
    }

    options.innerHTML = html;
}

// đổi sang sản phẩm màu khác khi khách chọn trong ô Màu sắc / Phiên bản
function changeVariant(newProductCode) {
    if (newProductCode && currentProduct && newProductCode !== currentProduct.productCode) {
        window.location.href = "product-detail.html?id=" + newProductCode;
    }
}

// lấy 4 sp cùng loại hiện ở khúc cuối trang cho khách tham khảo thêm
function renderRelatedProducts(product) {
    const detailPage = document.querySelector(".product-detail-page");
    if (!detailPage) return;

    let related = [];
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        if (!p.isHidden && p.categoryCode === product.categoryCode && p.productCode !== product.productCode) {
            related.push(p);
            if (related.length >= 4) break;
        }
    }

    if (related.length === 0) return;

    let cardsHtml = "";
    for (let i = 0; i < related.length; i++) {
        let item = related[i];
        let price = getProductDisplayPrice(item).toLocaleString("vi-VN");
        cardsHtml += `
            <div class="product-card">
                <a href="product-detail.html?id=${item.productCode}" style="text-decoration: none; color: inherit;">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200?text=SportMax'">
                    <h4>${item.name}</h4>
                </a>
                <div class="product-price">${price} ₫</div>
                <button class="btn-primary" onclick="window.location.href='product-detail.html?id=${item.productCode}'">Xem chi tiết</button>
            </div>
        `;
    }

    const section = document.createElement("section");
    section.className = "detail-content-card";
    section.style.marginTop = "24px";
    section.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 18px; color: #0f172a; border-bottom: 2px solid #0284c7; display: inline-block; padding-bottom: 6px;">
            SẢN PHẨM CÙNG DANH MỤC
        </h3>
        <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
            ${cardsHtml}
        </div>
    `;
    detailPage.appendChild(section);
}

// dò trong tên sp xem của hãng nào để hiện tên thương hiệu
function getBrandName(product) {
    const knownBrands = [
        "Yonex", "Victor", "Lining", "VS", "VNB", "Kawasaki", "Apacs", "Mizuno",
        "Forza", "Kason", "Donex", "Taro", "SFD", "Alien Armour", "Asics", "Kumpoo",
        "Kamito", "Beyono", "Felet", "Hundred", "Molten", "Mikasa", "Spalding",
        "Babolat", "Nike", "Butterfly", "Joola", "Gosen", "Pili", "Lefus", "Promax",
        "Victec", "Sunbatta"
    ];
    let lowerName = String(product.name || "").toLowerCase();
    for (let i = 0; i < knownBrands.length; i++) {
        if (lowerName.indexOf(knownBrands[i].toLowerCase()) !== -1) {
            return knownBrands[i];
        }
    }
    return "";
}

// lấy 4 chữ đầu của tên sp để gom mấy mẫu cùng dòng nhưng khác màu
function getProductGroupKey(product) {
    let words = String(product.name || "").trim().split(" ");
    return words.slice(0, 4).join(" ").toLowerCase();
}

function findProductVariants(product) {
    const key = getProductGroupKey(product);
    const brand = getBrandName(product);
    if (!key) return [product];

    let list = [];
    for (let i = 0; i < products.length; i++) {
        let candidate = products[i];
        if (!candidate.isHidden && candidate.categoryCode === product.categoryCode && getBrandName(candidate) === brand && getProductGroupKey(candidate) === key) {
            list.push(candidate);
        }
    }
    return list;
}

// lấy tên hiển thị trong ô chọn phiên bản
function getVariantLabel(product) {
    let label = String(product.name || "").replace("Chính Hãng", "").trim();
    return label || product.name;
}

// bấm vô hình nhỏ ở dưới thì đổi tấm hình lớn ở trên
function changeImage(index) {
    if (index >= 0 && index < currentGalleryImages.length) {
        currentGalleryIndex = index;
        renderCurrentGalleryImage();
    }
}

// bấm 2 nút mũi tên trái phải để lướt coi hình
function navigateGallery(direction) {
    if (currentGalleryImages.length < 2) return;
    currentGalleryIndex = (currentGalleryIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    renderCurrentGalleryImage();
}

function renderCurrentGalleryImage() {
    renderGallery();
    let thumbs = document.querySelectorAll(".thumb");
    for (let i = 0; i < thumbs.length; i++) {
        if (i === currentGalleryIndex) {
            thumbs[i].classList.add("active");
        } else {
            thumbs[i].classList.remove("active");
        }
    }
    updateGalleryIndicator();
}

function updateGalleryIndicator() {
    const total = currentGalleryImages.length || 1;
    const counter = document.getElementById("galleryCounter");
    if (counter) {
        counter.textContent = (currentGalleryIndex + 1) + " / " + total;
    }
    let arrows = document.querySelectorAll(".gallery-arrow");
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].hidden = (total < 2);
    }
}

// nút cộng trừ số lượng mua
function increaseQty() {
    let input = document.getElementById("qtyInput");
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    let input = document.getElementById("qtyInput");
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// hàm lưu sản phẩm đang xem vô giỏ hàng trong localStorage
function addToLocalStorageCart(redirect) {
    if (!currentProduct) return;

    let qtyVal = parseInt(document.getElementById("qtyInput").value) || 1;
    if (qtyVal < 1) qtyVal = 1;

    let sizeVal = document.getElementById("selectSize") ? document.getElementById("selectSize").value : "";
    let specVal = document.getElementById("selectSpec") ? document.getElementById("selectSpec").value : "";
    let selectedOptionText = sizeVal;
    if (specVal !== "") {
        selectedOptionText = sizeVal ? (sizeVal + " - " + specVal) : specVal;
    }

    // Chuẩn bị thông tin sản phẩm chuẩn
    let productToAdd = {
        id: currentProduct.id || null ,
        name: currentProduct.name,
        price: getProductDisplayPrice(currentProduct),
        image: (currentGalleryImages && currentGalleryImages[0]) || currentProduct.image,
        size: selectedOptionText || "Tiêu chuẩn",
        color: document.getElementById("productVariantSelect") ? document.getElementById("productVariantSelect").value : "Mặc định",
        stock: currentProduct.stock || 0
    };

    // 1. Gọi hàm chuẩn từ common.js (Nếu người dùng chưa đăng nhập, common.js sẽ tự nhắc đăng nhập)
    if (typeof addToCart === "function") {
        let isSuccess = addToCart(productToAdd, qtyVal);
        if (!isSuccess) return; // Dừng lại nếu chưa đăng nhập
    } else {
        alert("Đang nạp thư viện giỏ hàng, vui lòng thử lại sau giây lát!");
        return;
    }

    // 2. Nếu bấm "Mua Ngay" thì chuyển hướng sang trang thanh toán
    if (redirect) {
        window.location.href = "dev4_checkout.html";
    }
}

// bấm nút Mua ngay (thêm vô giỏ rồi chuyển qua trang giỏ hàng luôn)
function handleBuyNow() {
    addToLocalStorageCart(true);
}

// bấm nút Thêm vào giỏ (thêm vô giỏ và hiện thông báo)
function handleAddToCart() {
    addToLocalStorageCart(false);
}

// tìm kiếm từ thanh search trên header của trang chi tiết
function triggerDetailSearch() {
    let searchInput = document.getElementById("searchInput");
    let kw = searchInput ? searchInput.value.trim() : "";
    window.location.href = "products.html?search=" + encodeURIComponent(kw);
}

// cập nhật lại số lượng giỏ hàng trên header với cột danh mục bên phải
function initDetailSidebar() {
    if (typeof updateCartHeaderBadge === "function") {
        updateCartHeaderBadge();
    }

    let activeCats = [];
    for (let i = 0; i < categories.length; i++) {
        if (!categories[i].isHidden) {
            activeCats.push(categories[i]);
        }
    }

    const sidebarList = document.getElementById("sidebarCategoryList");
    if (sidebarList && activeCats.length > 0) {
        let html = "";
        for (let i = 0; i < activeCats.length; i++) {
            let cat = activeCats[i];
            html += `
                <li>
                    <a href="products.html?cat=${cat.categoryCode}">
                        <span>${cat.name}</span>
                        <i class="fa-solid fa-angle-right plus-icon"></i>
                    </a>
                </li>
            `;
        }
        sidebarList.innerHTML = html;
    }
}

initDetailSidebar();
