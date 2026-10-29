// biến lưu ds loại sp và kiểm tra trạng thái đang thêm hay sửa
let categories = [];
let isEditMode = false;
let currentEditCode = "";

// 8 loại sp mặc định của shop
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

// quay về trang cửa hàng khách mua
function goToStorePage() {
    let path = window.location.pathname;
    if (path.indexOf("/admin/") !== -1) {
        window.location.href = "../products.html";
    } else {
        window.location.href = "products.html";
    }
}

// lấy ds loại sp từ localStorage lên, nếu chưa có thì nạp mảng mặc định
function loadCategories() {
    let data = localStorage.getItem("categories");
    if (data) {
        categories = JSON.parse(data);
        for (let i = 0; i < categories.length; i++) {
            let c = categories[i];
            if (!c.categoryCode && c.id) c.categoryCode = c.id;
            if (!c.id && c.categoryCode) c.id = c.categoryCode;
            if (c.profitMargin === undefined && c.profitPercent !== undefined) c.profitMargin = c.profitPercent;
            if (c.profitPercent === undefined && c.profitMargin !== undefined) c.profitPercent = c.profitMargin;
            if (c.isHidden === undefined && c.status !== undefined) c.isHidden = (c.status === "hidden" || c.status === "inactive");
            if (c.status === undefined) c.status = c.isHidden ? "hidden" : "active";
            c.banner = "#";
        }
    } else {
        categories = defaultCategories.slice();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
}

// vẽ bảng danh sách loại sp ra màn hình
function renderCategories() {
    let tbody = document.getElementById("categoryTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let navCatCount = document.getElementById("navCatCount");
    if (navCatCount) navCatCount.innerText = categories.length;

    let kwInput = document.getElementById("adminCatSearchInput");
    let statusSelect = document.getElementById("adminCatStatusFilter");
    let kw = kwInput ? kwInput.value.trim().toLowerCase() : "";
    let statusFilter = statusSelect ? statusSelect.value : "";

    let rowsHtml = "";
    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        let codeStr = String(cat.categoryCode || "").toLowerCase();
        let nameStr = String(cat.name || "").toLowerCase();

        // lọc theo từ khoá và trạng thái
        if (kw !== "" && codeStr.indexOf(kw) === -1 && nameStr.indexOf(kw) === -1) {
            continue;
        }
        if (statusFilter === "active" && cat.isHidden) continue;
        if (statusFilter === "hidden" && !cat.isHidden) continue;

        let statusText = cat.isHidden ? "Đang ẩn" : "Đang bán";
        let statusClass = cat.isHidden ? "hidden" : "active";

        rowsHtml += `
            <tr>
                <td><span class="badge-category-pill">${cat.categoryCode}</span></td>
                <td>
                    <div class="admin-prod-info">
                        <strong>${cat.name}</strong>
                        <span>${cat.desc || ""}</span>
                    </div>
                </td>
                <td><span class="admin-price-col">${cat.profitMargin}%</span></td>
                <td><span class="status-badge-pill ${statusClass}">${statusText}</span></td>
                <td style="white-space: nowrap;">
                    <button class="btn-action btn-edit" onclick="openEditModal('${cat.categoryCode}')">Sửa</button>
                    <button class="btn-action btn-toggle-status" onclick="toggleCategoryStatus('${cat.categoryCode}')">${cat.isHidden ? 'Hiện' : 'Ẩn'}</button>
                    <button class="btn-action btn-delete" onclick="deleteCategory('${cat.categoryCode}')">Xóa</button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = rowsHtml;
}

// bấm nút thêm mới thì xoá trắng các ô nhập rồi mở popup
function openAddCategoryModal() {
    isEditMode = false;
    currentEditCode = "";
    document.getElementById("modalTitle").innerText = "Thêm Loại Sản Phẩm Mới";

    document.getElementById("catCodeInput").value = "";
    document.getElementById("catCodeInput").disabled = false;
    document.getElementById("catNameInput").value = "";
    document.getElementById("catProfitInput").value = "";
    document.getElementById("catStatusInput").value = "false";

    document.getElementById("categoryModal").style.display = "flex";
}

// đóng popup loại sp
function closeCategoryModal() {
    document.getElementById("categoryModal").style.display = "none";
}

// lưu thông tin khi bấm nút Lưu trong popup
function saveCategory() {
    let code = document.getElementById("catCodeInput").value.trim();
    let name = document.getElementById("catNameInput").value.trim();
    let profit = document.getElementById("catProfitInput").value.trim();
    let isHidden = document.getElementById("catStatusInput").value === "true";

    if (code === "" || name === "" || profit === "") {
        alert("Vui lòng nhập đầy đủ các thông tin!");
        return;
    }

    if (isEditMode) {
        // đang ở chế độ sửa thì tìm đúng mã loại đó để cập nhật
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryCode === currentEditCode) {
                categories[i].name = name;
                categories[i].profitMargin = parseInt(profit);
                categories[i].profitPercent = parseInt(profit);
                categories[i].isHidden = isHidden;
                categories[i].status = isHidden ? "hidden" : "active";
                break;
            }
        }

        // tính lại giá bán bên ds sp theo % lợi nhuận mới
        let pData = localStorage.getItem("products");
        if (pData) {
            let products = JSON.parse(pData);
            for (let j = 0; j < products.length; j++) {
                if (products[j].categoryCode === currentEditCode && products[j].importPrice) {
                    products[j].sellingPrice = Math.round(products[j].importPrice * (1 + parseInt(profit) / 100) / 1000) * 1000;
                }
            }
            localStorage.setItem("products", JSON.stringify(products));
        }
    } else {
        // thêm mới thì kiểm tra xem mã loại đã có chưa
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryCode === code) {
                alert("Mã loại sản phẩm đã tồn tại!");
                return;
            }
        }

        let newCat = {
            id: code,
            categoryCode: code,
            code: code,
            icon: "🏅",
            name: name,
            slug: code.toLowerCase(),
            desc: name,
            profitPercent: parseInt(profit),
            profitMargin: parseInt(profit),
            itemCount: 0,
            status: isHidden ? "hidden" : "active",
            isHidden: isHidden,
            banner: "#"
        };
        categories.push(newCat);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    document.getElementById("categoryModal").style.display = "none";
}

// bấm nút Sửa thì đổ thông tin cũ của loại sp đó lên popup
window.openEditModal = function(code) {
    isEditMode = true;
    currentEditCode = code;
    document.getElementById("modalTitle").innerText = "Sửa Loại Sản Phẩm";

    let cat = null;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === code) {
            cat = categories[i];
            break;
        }
    }

    if (cat) {
        document.getElementById("catCodeInput").value = cat.categoryCode;
        document.getElementById("catCodeInput").disabled = true; // khoá ô mã ko cho sửa
        document.getElementById("catNameInput").value = cat.name;
        document.getElementById("catProfitInput").value = cat.profitMargin;
        document.getElementById("catStatusInput").value = cat.isHidden ? "true" : "false";

        document.getElementById("categoryModal").style.display = "flex";
    }
};

// xoá loại sp
window.deleteCategory = function(code) {
    if (confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
        let newList = [];
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryCode !== code) {
                newList.push(categories[i]);
            }
        }
        categories = newList;
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();
    }
};

// đổi nhanh trạng thái ẩn / hiện của loại sp
window.toggleCategoryStatus = function(code) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === code) {
            categories[i].isHidden = !categories[i].isHidden;
            categories[i].status = categories[i].isHidden ? "hidden" : "active";
            break;
        }
    }
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
};

loadCategories();
renderCategories();
