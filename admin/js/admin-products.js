// biến lưu danh sách sp, loại sp và trạng thái đang thêm mới hay đang sửa
let products = [];
let categories = [];
let isEditMode = false;
let currentEditCode = "";

const defaultCategories = [
    {
        id: "CAT01",
        code: "RACKET",
        categoryCode: "CAT01",
        icon: "🏸",
        name: "Vợt & Dụng Cụ",
        slug: "vot-dung-cu",
        desc: "Vợt cầu lông, bóng bàn, tennis, pickleball và dụng cụ thi đấu chính hãng",
        profitPercent: 20,
        profitMargin: 20,
        itemCount: 165,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT02",
        code: "SHOES",
        categoryCode: "CAT02",
        icon: "👟",
        name: "Giày Thể Thao",
        slug: "giay-the-thao",
        desc: "Giày chạy bộ, cầu lông, bóng đá, bóng rổ, bóng chuyền bám sân chống trượt",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 118,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT03",
        code: "SHIRT",
        categoryCode: "CAT03",
        icon: "👕",
        name: "Áo Thể Thao",
        slug: "ao-the-thao",
        desc: "Áo đấu cầu lông, bóng đá, bóng rổ, tập gym chất vải thoáng khí",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 65,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT04",
        code: "SKIRT",
        categoryCode: "CAT04",
        icon: "👗",
        name: "Váy Thể Thao",
        slug: "vay-the-thao",
        desc: "Váy cầu lông, tennis co giãn 4 chiều kèm quần bảo hộ bên trong",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 25,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT05",
        code: "PANTS",
        categoryCode: "CAT05",
        icon: "🩳",
        name: "Quần Thể Thao",
        slug: "quan-the-thao",
        desc: "Quần short thể thao, quần dài jogger và trackpant vận động thoải mái",
        profitPercent: 30,
        profitMargin: 30,
        itemCount: 78,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT06",
        code: "BACKPACK",
        categoryCode: "CAT06",
        icon: "🎒",
        name: "Balo Thể Thao",
        slug: "balo-the-thao",
        desc: "Balo đựng vợt và đồ tập nhiều ngăn chống thấm nước",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 42,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT07",
        code: "BAG",
        categoryCode: "CAT07",
        icon: "👜",
        name: "Túi Thể Thao",
        slug: "tui-the-thao",
        desc: "Túi đựng vợt chuyên dụng và túi trống tập gym sức chứa lớn",
        profitPercent: 25,
        profitMargin: 25,
        itemCount: 47,
        status: "active",
        isHidden: false,
        banner: "#"
    },
    {
        id: "CAT08",
        code: "ACCESSORY",
        categoryCode: "CAT08",
        icon: "🧦",
        name: "Phụ Kiện Thể Thao",
        slug: "phu-kien-the-thao",
        desc: "Vớ chống trượt, băng bảo hộ, cước đan vợt, quấn cán, thảm tập và bình nước",
        profitPercent: 40,
        profitMargin: 40,
        itemCount: 34,
        status: "active",
        isHidden: false,
        banner: "#"
    }
];

// lấy dữ liệu sp và loại sp từ dưới localStorage lên
function loadData() {
    let pData = localStorage.getItem("products");
    let cData = localStorage.getItem("categories");

    products = pData ? JSON.parse(pData) : (typeof mockProducts !== "undefined" ? mockProducts.slice() : []);
    if (cData) {
        categories = JSON.parse(cData);
    } else {
        categories = defaultCategories.slice();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
}

// đổ các loại sp vô ô select trong popup thêm/sửa sp
function populateCategorySelect() {
    let select = document.getElementById("proCategoryInput");
    if (!select) return;
    select.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        select.innerHTML += `<option value="${categories[i].categoryCode}">${categories[i].name}</option>`;
    }
}

// tìm tên loại sp dựa theo mã loại (vd CAT01 -> Vợt & Dụng Cụ)
function getCategoryName(code) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === code) {
            return categories[i].name;
        }
    }
    return "Không xác định";
}

// vẽ bảng danh sách sp (có hỗ trợ gõ tìm nhanh theo mã hoặc tên)
function renderProducts(filterKeyword) {
    let tbody = document.getElementById("productTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let kw = String(filterKeyword || "").trim().toLowerCase();
    let list = [];

    if (kw !== "") {
        for (let i = 0; i < products.length; i++) {
            let p = products[i];
            let pCode = String(p.productCode || "").toLowerCase();
            let pName = String(p.name || "").toLowerCase();
            let cName = getCategoryName(p.categoryCode).toLowerCase();

            if (pCode.indexOf(kw) !== -1 || pName.indexOf(kw) !== -1 || cName.indexOf(kw) !== -1) {
                list.push(p);
            }
        }
    } else {
        list = products;
    }

    let rowsHtml = "";
    for (let i = 0; i < list.length; i++) {
        let p = list[i];
        let statusText = p.isHidden ? "Đang ẩn" : "Đang hiện";
        let statusColor = p.isHidden ? "#e0685f" : "#2e7d32";
        let displayPrice = Number(p.salePrice || p.price || p.sellingPrice || p.importPrice || 0);
        let formattedPrice = displayPrice.toLocaleString("vi-VN");
        let thumbUrl = p.image || "https://via.placeholder.com/50?text=SP";
        let stockCount = (p.stock !== undefined && p.stock !== null) ? p.stock : 50;

        rowsHtml += `
            <tr>
                <td><img src="${thumbUrl}" alt="img" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/50?text=SP'"></td>
                <td><strong>${p.productCode}</strong></td>
                <td>${p.name}</td>
                <td>${getCategoryName(p.categoryCode)}</td>
                <td style="color: #e0685f; font-weight: 600;">${formattedPrice} đ</td>
                <td>${stockCount}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                <td style="white-space: nowrap;">
                    <button class="btn-action btn-edit" onclick="openEditModal('${p.productCode}')">Sửa</button>
                    <button class="btn-action" style="background-color: #64748b;" onclick="toggleProductStatus('${p.productCode}')">${p.isHidden ? 'Hiện' : 'Ẩn'}</button>
                    <button class="btn-action btn-delete" onclick="deleteProduct('${p.productCode}')">Xóa</button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = rowsHtml;
}

// bấm nút + Thêm Sản Phẩm thì làm trống form rồi mở popup lên
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

// bấm nút X để tắt popup
function closeProductModal() {
    document.getElementById("productModal").style.display = "none";
}

// xử lý khi bấm nút Lưu Sản Phẩm trong form
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

    // lấy % lợi nhuận của loại sp đó để tính ra giá bán tự động
    let margin = 0;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === catCode) {
            margin = categories[i].profitMargin;
            break;
        }
    }
    let computedSellingPrice = Math.round(priceNum * (1 + margin / 100) / 1000) * 1000;

    // nếu nhập nhiều link hình cách nhau bằng dấu phẩy thì tách ra thành mảng
    let imgArray = [];
    if (image !== "") {
        let parts = image.split(",");
        for (let i = 0; i < parts.length; i++) {
            let s = parts[i].trim();
            if (s !== "") imgArray.push(s);
        }
    }
    let firstImage = imgArray.length > 0 ? imgArray[0] : "https://via.placeholder.com/200?text=SportMax";

    if (isEditMode) {
        // nếu đang ở chế độ Sửa thì cập nhật lại thông tin cho sp đó
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
        // nếu thêm mới thì check xem mã sp có bị trùng với sp cũ ko
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
        products.unshift(newPro); // nhét sp mới thêm lên đầu bảng cho dễ thấy
    }

    localStorage.setItem("products", JSON.stringify(products));
    let searchBox = document.getElementById("adminSearchInput");
    renderProducts(searchBox ? searchBox.value : "");
    document.getElementById("productModal").style.display = "none";
}

// bấm nút Sửa thì mở popup lên và điền lại đầy đủ thông tin cũ vào các ô
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

// bấm nút Ẩn/Hiện để tạm ẩn sp ngoài trang khách mà ko cần xoá mất dữ liệu
window.toggleProductStatus = function(code) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].productCode === code) {
            products[i].isHidden = !products[i].isHidden;
            break;
        }
    }
    localStorage.setItem("products", JSON.stringify(products));
    let searchBox = document.getElementById("adminSearchInput");
    renderProducts(searchBox ? searchBox.value : "");
};

// xoá hẳn sp khỏi danh sách (có hỏi confirm trước)
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
        let searchBox = document.getElementById("adminSearchInput");
        renderProducts(searchBox ? searchBox.value : "");
    }
};

loadData();
populateCategorySelect();
renderProducts();
