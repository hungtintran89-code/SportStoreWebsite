let products = [];
let categories = [];
let isEditMode = false;
let currentEditCode = "";

const defaultCategories = [
    {
        id: "CAT01",
        categoryCode: "CAT01",
        code: "RACKET",
        icon: "🏸",
        name: "Vợt & Dụng Cụ",
        slug: "vot-dung-cu",
        desc: "Vợt cầu lông, bóng bàn, tennis, pickleball và bóng thi đấu tiêu chuẩn quốc tế",
        profitPercent: 20,
        profitMargin: 20,
        itemCount: 215,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT02",
        categoryCode: "CAT02",
        code: "SHOES",
        icon: "👟",
        name: "Giày Thể Thao",
        slug: "giay-the-thao",
        desc: "Giày chạy bộ, cầu lông, bóng đá, bóng chuyền, bóng rổ bám sân chống lật cổ chân",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 110,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT03",
        categoryCode: "CAT03",
        code: "SHIRT",
        icon: "👕",
        name: "Áo Thể Thao",
        slug: "ao-the-thao",
        desc: "Áo đấu cầu lông, bóng đá, bóng rổ và đồ tập Gym thoáng khí thoát mồ hôi nhanh",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 82,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT04",
        categoryCode: "CAT04",
        code: "SKIRT",
        icon: "👗",
        name: "Váy Thể Thao",
        slug: "vay-the-thao",
        desc: "Chân váy thể thao cầu lông, tennis, pickleball co giãn 4 chiều kèm quần bảo hộ",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 30,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT05",
        categoryCode: "CAT05",
        code: "PANTS",
        icon: "🩳",
        name: "Quần Thể Thao",
        slug: "quan-the-thao",
        desc: "Quần short thi đấu và quần dài Jogger / Trackpant co giãn thoải mái",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 41,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT06",
        categoryCode: "CAT06",
        code: "BACKPACK",
        icon: "🎒",
        name: "Balo Thể Thao",
        slug: "balo-the-thao",
        desc: "Balo đựng vợt và trang bị thể thao đa năng có ngăn chứa giày riêng biệt",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 42,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT07",
        categoryCode: "CAT07",
        code: "BAG",
        icon: "👜",
        name: "Túi Thể Thao",
        slug: "tui-the-thao",
        desc: "Túi đựng vợt chuyên dụng lót cách nhiệt chống sốc và túi trống tập Gym",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 47,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT08",
        categoryCode: "CAT08",
        code: "ACCESSORY",
        icon: "🧦",
        name: "Phụ Kiện Thể Thao",
        slug: "phu-kien-the-thao",
        desc: "Vớ chống trượt, băng chặn mồ hôi, cước đan vợt, quấn cán, bóng tập cổ tay và bình nước",
        profitPercent: 40,
        profitMargin: 40,
        itemCount: 34,
        status: "active",
        isHidden: false,
        banner: "#"
    }
];

function goToStorePage() {
    let path = window.location.pathname;
    if (path.indexOf("/admin/") !== -1) {
        window.location.href = "../products.html";
    } else {
        window.location.href = "products.html";
    }
}

function loadData() {
    let pData = localStorage.getItem("products");
    let cData = localStorage.getItem("categories");

    products = pData ? JSON.parse(pData) : (typeof mockProducts !== "undefined" ? mockProducts.slice() : []);
    if (cData) {
        categories = JSON.parse(cData);
        for (let i = 0; i < categories.length; i++) {
            let c = categories[i];
            if (!c.categoryCode && c.id) c.categoryCode = c.id;
            if (c.profitMargin === undefined && c.profitPercent !== undefined) c.profitMargin = c.profitPercent;
            if (c.isHidden === undefined && c.status !== undefined) c.isHidden = (c.status === "hidden" || c.status === "inactive");
            c.banner = "#";
        }
    } else {
        categories = defaultCategories.slice();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
}

function populateCategorySelect() {
    let select = document.getElementById("proCategoryInput");
    if (select) {
        select.innerHTML = "";
        for (let i = 0; i < categories.length; i++) {
            select.innerHTML += `<option value="${categories[i].categoryCode}">${categories[i].name}</option>`;
        }
    }

    let filterSelect = document.getElementById("adminFilterCategory");
    if (filterSelect) {
        filterSelect.innerHTML = `<option value="">Tất cả môn thể thao</option>`;
        for (let i = 0; i < categories.length; i++) {
            filterSelect.innerHTML += `<option value="${categories[i].categoryCode}">${categories[i].name}</option>`;
        }
    }
}

function getCategoryName(code) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === code) {
            return categories[i].name;
        }
    }
    return "Trang bị thể thao";
}

function detectBrandName(product) {
    if (product.brand) return product.brand;
    let text = String((product.name || "") + " " + (product.specifications || "")).toLowerCase();
    let brands = [
        { key: "yonex", label: "Yonex" },
        { key: "mizuno", label: "Mizuno" },
        { key: "lining", label: "Li-Ning" },
        { key: "li-ning", label: "Li-Ning" },
        { key: "victor", label: "Victor" },
        { key: "asics", label: "Asics" },
        { key: "nike", label: "Nike" },
        { key: "adidas", label: "Adidas" },
        { key: "kamito", label: "Kamito" },
        { key: "kumpoo", label: "Kumpoo" },
        { key: "molten", label: "Molten" },
        { key: "wilson", label: "Wilson" },
        { key: "joola", label: "Joola" },
        { key: "butterfly", label: "Butterfly" }
    ];
    for (let i = 0; i < brands.length; i++) {
        if (text.indexOf(brands[i].key) !== -1) {
            return brands[i].label;
        }
    }
    return "SportStore";
}

function renderProducts(filterKeyword) {
    let tbody = document.getElementById("productTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let navCatCount = document.getElementById("navCatCount");
    if (navCatCount) navCatCount.innerText = categories.length;
    let navProdCount = document.getElementById("navProdCount");
    if (navProdCount) navProdCount.innerText = products.length;

    let searchBox = document.getElementById("adminSearchInput");
    let kw = String(filterKeyword !== undefined ? filterKeyword : (searchBox ? searchBox.value : "")).trim().toLowerCase();
    let catFilterEl = document.getElementById("adminFilterCategory");
    let brandFilterEl = document.getElementById("adminFilterBrand");
    let selectedCat = catFilterEl ? catFilterEl.value : "";
    let selectedBrand = brandFilterEl ? brandFilterEl.value.toLowerCase() : "";

    let list = [];
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        let pCode = String(p.productCode || "").toLowerCase();
        let pName = String(p.name || "").toLowerCase();
        let cName = getCategoryName(p.categoryCode).toLowerCase();
        let bName = detectBrandName(p).toLowerCase();

        if (kw !== "" && pCode.indexOf(kw) === -1 && pName.indexOf(kw) === -1 && cName.indexOf(kw) === -1 && bName.indexOf(kw) === -1) {
            continue;
        }
        if (selectedCat !== "" && p.categoryCode !== selectedCat) {
            continue;
        }
        if (selectedBrand !== "" && bName.indexOf(selectedBrand) === -1 && pName.indexOf(selectedBrand) === -1) {
            continue;
        }
        list.push(p);
    }

    let rowsHtml = "";
    for (let i = 0; i < list.length; i++) {
        let p = list[i];
        let statusText = p.isHidden ? "Đang ẩn" : "Đang bán";
        let statusClass = p.isHidden ? "hidden" : "active";
        let displayPrice = Number(p.salePrice || p.price || p.sellingPrice || p.importPrice || 0);
        let formattedPrice = displayPrice.toLocaleString("vi-VN");
        let thumbUrl = p.image || "https://via.placeholder.com/50?text=SP";
        let stockCount = (p.stock !== undefined && p.stock !== null) ? p.stock : 50;
        let brandLabel = detectBrandName(p);

        rowsHtml += `
            <tr>
                <td><img src="${thumbUrl}" alt="${p.name}" class="admin-thumb" onerror="this.src='https://via.placeholder.com/50?text=SP'"></td>
                <td>
                    <div class="admin-prod-info">
                        <strong>${p.name}</strong>
                        <span>Mã: ${p.productCode}</span>
                    </div>
                </td>
                <td><span class="badge-category-pill">${getCategoryName(p.categoryCode)}</span></td>
                <td><strong>${brandLabel}</strong></td>
                <td><span class="admin-price-col">${formattedPrice} ₫</span></td>
                <td><strong>${stockCount}</strong></td>
                <td><span class="status-badge-pill ${statusClass}">${statusText}</span></td>
                <td style="white-space: nowrap;">
                    <button class="btn-action btn-edit" onclick="openEditModal('${p.productCode}')">Sửa</button>
                    <button class="btn-action btn-toggle-status" onclick="toggleProductStatus('${p.productCode}')">${p.isHidden ? 'Hiện' : 'Ẩn'}</button>
                    <button class="btn-action btn-delete" onclick="deleteProduct('${p.productCode}')">Xóa</button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = rowsHtml;
}

function openAddProductModal() {
    isEditMode = false;
    currentEditCode = "";
    document.getElementById("modalTitle").innerText = "Thêm Sản Phẩm Mới";

    document.getElementById("proCodeInput").value = "";
    document.getElementById("proCodeInput").disabled = false;
    document.getElementById("proNameInput").value = "";
    document.getElementById("proImageInput").value = "";
    document.getElementById("proPriceInput").value = "";
    document.getElementById("proStockInput").value = "50";
    document.getElementById("proDescInput").value = "";
    document.getElementById("proStatusInput").value = "false";

    document.getElementById("productModal").style.display = "flex";
}

function closeProductModal() {
    document.getElementById("productModal").style.display = "none";
}

function saveProduct() {
    let code = document.getElementById("proCodeInput").value.trim();
    let name = document.getElementById("proNameInput").value.trim();
    let catCode = document.getElementById("proCategoryInput").value;
    let image = document.getElementById("proImageInput").value.trim();
    let price = document.getElementById("proPriceInput").value;
    let stock = document.getElementById("proStockInput").value;
    let desc = document.getElementById("proDescInput").value.trim();
    let isHidden = document.getElementById("proStatusInput").value === "true";

    if (!code || !name || !price || !stock) {
        alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
        return;
    }

    let priceNum = parseInt(price);
    let stockNum = parseInt(stock);

    let margin = 0;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === catCode) {
            margin = categories[i].profitMargin;
            break;
        }
    }
    let computedSellingPrice = Math.round(priceNum * (1 + margin / 100) / 1000) * 1000;

    let imgArray = [];
    if (image !== "") {
        let parts = image.split(",");
        for (let i = 0; i < parts.length; i++) {
            let s = parts[i].trim();
            if (s !== "") imgArray.push(s);
        }
    }
    let firstImage = imgArray.length > 0 ? imgArray[0] : "https://via.placeholder.com/200?text=SportStore";

    if (isEditMode) {
        for (let i = 0; i < products.length; i++) {
            if (products[i].productCode === currentEditCode) {
                products[i].name = name;
                products[i].categoryCode = catCode;
                products[i].image = firstImage;
                products[i].images = imgArray.length > 0 ? imgArray : [firstImage];
                products[i].importPrice = priceNum;
                products[i].salePrice = priceNum;
                products[i].sellingPrice = computedSellingPrice;
                products[i].stock = stockNum;
                products[i].description = desc;
                products[i].isHidden = isHidden;
                break;
            }
        }
    } else {
        for (let i = 0; i < products.length; i++) {
            if (products[i].productCode === code) {
                alert("Mã sản phẩm đã tồn tại trong hệ thống!");
                return;
            }
        }

        let newPro = {
            productCode: code,
            name: name,
            categoryCode: catCode,
            image: firstImage,
            images: imgArray.length > 0 ? imgArray : [firstImage],
            importPrice: priceNum,
            sellingPrice: computedSellingPrice,
            salePrice: priceNum,
            originalPrice: null,
            stock: stockNum,
            description: desc,
            profitMarginOverride: 0,
            isHidden: isHidden
        };
        products.unshift(newPro);
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    document.getElementById("productModal").style.display = "none";
}

window.openEditModal = function(code) {
    isEditMode = true;
    currentEditCode = code;
    document.getElementById("modalTitle").innerText = "Sửa Thông Tin Sản Phẩm";

    let p = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].productCode === code) {
            p = products[i];
            break;
        }
    }

    if (p) {
        document.getElementById("proCodeInput").value = p.productCode;
        document.getElementById("proCodeInput").disabled = true;
        document.getElementById("proNameInput").value = p.name || "";
        document.getElementById("proCategoryInput").value = p.categoryCode;
        document.getElementById("proImageInput").value = (p.images && p.images.length > 0) ? p.images.join(", ") : (p.image || "");
        document.getElementById("proPriceInput").value = p.salePrice || p.importPrice || 0;
        document.getElementById("proStockInput").value = (p.stock !== undefined && p.stock !== null) ? p.stock : 50;
        document.getElementById("proDescInput").value = p.description || "";
        document.getElementById("proStatusInput").value = p.isHidden ? "true" : "false";

        document.getElementById("productModal").style.display = "flex";
    }
};

window.toggleProductStatus = function(code) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].productCode === code) {
            products[i].isHidden = !products[i].isHidden;
            break;
        }
    }
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
};

window.deleteProduct = function(code) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        let newList = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].productCode !== code) {
                newList.push(products[i]);
            }
        }
        products = newList;
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    }
};

loadData();
populateCategorySelect();
renderProducts();
