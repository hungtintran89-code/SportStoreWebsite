// biến lưu danh sách loại sp và kiểm tra xem đang mở form Thêm mới hay form Sửa
let categories = [];
let isEditMode = false;
let currentEditCode = "";

// 8 loại sp mặc định ban đầu của shop
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

// lấy danh sách loại sp từ localStorage lên, nếu chưa có thì nạp mảng mặc định vô
function loadCategories() {
    let data = localStorage.getItem("categories");
    if (data) {
        categories = JSON.parse(data);
        for (let i = 0; i < categories.length; i++) {
            categories[i].banner = "#";
        }
    } else {
        categories = defaultCategories.slice();
        localStorage.setItem("categories", JSON.stringify(categories));
    }
}

// vẽ bảng danh sách loại sp bên trang admin
function renderCategories() {
    let tbody = document.getElementById("categoryTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        let cCode = cat.categoryCode || cat.id;
        let pMargin = (cat.profitMargin !== undefined) ? cat.profitMargin : cat.profitPercent;
        let hiddenFlag = (cat.isHidden !== undefined) ? cat.isHidden : (cat.status === "hidden");
        let statusText = hiddenFlag ? "Đang ẩn" : "Đang hiện";
        let statusColor = hiddenFlag ? "red" : "green";

        let tr = `
            <tr>
                <td>${cCode}</td>
                <td>${cat.name}</td>
                <td>${pMargin}%</td>
                <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="openEditModal('${cCode}')">Sửa</button>
                    <button class="btn-action" style="background-color: #64748b;" onclick="toggleCategoryStatus('${cCode}')">${hiddenFlag ? 'Hiện' : 'Ẩn'}</button>
                    <button class="btn-action btn-delete" onclick="deleteCategory('${cCode}')">Xóa</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += tr;
    }
}

// bấm nút Thêm Loại SP thì xoá trắng các ô nhập rồi mở popup lên
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

// bấm dấu X thì đóng popup lại
function closeCategoryModal() {
    document.getElementById("categoryModal").style.display = "none";
}

// xử lý khi bấm nút Lưu thông tin trong popup
function saveCategory() {
    let code = document.getElementById("catCodeInput").value.trim();
    let name = document.getElementById("catNameInput").value.trim();
    let profit = document.getElementById("catProfitInput").value.trim();
    let isHidden = document.getElementById("catStatusInput").value === "true";

    if (code === "" || name === "" || profit === "") {
        alert("Vui lòng nhập đầy đủ các thông tin!");
        return;
    }

    let profitNum = parseInt(profit);

    if (isEditMode) {
        // nếu đang sửa thì tìm đúng mã loại đó để cập nhật lại tên, % lợi nhuận, trạng thái
        for (let i = 0; i < categories.length; i++) {
            let cCode = categories[i].categoryCode || categories[i].id;
            if (cCode === currentEditCode) {
                categories[i].name = name;
                categories[i].profitMargin = profitNum;
                categories[i].profitPercent = profitNum;
                categories[i].isHidden = isHidden;
                categories[i].status = isHidden ? "hidden" : "active";
                categories[i].banner = "#";
                break;
            }
        }

        // cập nhật lại giá bán bên mảng sp luôn khi đổi % lợi nhuận của loại đó
        let pData = localStorage.getItem("products");
        if (pData) {
            let products = JSON.parse(pData);
            for (let j = 0; j < products.length; j++) {
                if (products[j].categoryCode === currentEditCode && products[j].importPrice) {
                    products[j].sellingPrice = Math.round(products[j].importPrice * (1 + profitNum / 100) / 1000) * 1000;
                }
            }
            localStorage.setItem("products", JSON.stringify(products));
        }
    } else {
        // thêm mới thì phải check xem mã loại này có bị trùng chưa
        for (let i = 0; i < categories.length; i++) {
            let cCode = categories[i].categoryCode || categories[i].id;
            if (cCode === code) {
                alert("Mã loại sản phẩm đã tồn tại!");
                return;
            }
        }

        let newCat = {
            id: code,
            code: code,
            categoryCode: code,
            icon: "🏅",
            name: name,
            slug: code.toLowerCase(),
            desc: name,
            profitPercent: profitNum,
            profitMargin: profitNum,
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

// mở popup sửa lên và điền sẵn thông tin cũ của loại sp đó vô các ô
window.openEditModal = function(code) {
    isEditMode = true;
    currentEditCode = code;
    document.getElementById("modalTitle").innerText = "Sửa Loại Sản Phẩm";

    let cat = null;
    for (let i = 0; i < categories.length; i++) {
        let cCode = categories[i].categoryCode || categories[i].id;
        if (cCode === code) {
            cat = categories[i];
            break;
        }
    }

    if (cat) {
        document.getElementById("catCodeInput").value = cat.categoryCode || cat.id;
        document.getElementById("catCodeInput").disabled = true; // khoá ô mã loại lại ko cho sửa mã
        document.getElementById("catNameInput").value = cat.name;
        document.getElementById("catProfitInput").value = (cat.profitMargin !== undefined) ? cat.profitMargin : cat.profitPercent;
        document.getElementById("catStatusInput").value = cat.isHidden ? "true" : "false";

        document.getElementById("categoryModal").style.display = "flex";
    }
};

// xoá loại sp (có hỏi xác nhận trước khi xoá)
window.deleteCategory = function(code) {
    if (confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
        let newList = [];
        for (let i = 0; i < categories.length; i++) {
            let cCode = categories[i].categoryCode || categories[i].id;
            if (cCode !== code) {
                newList.push(categories[i]);
            }
        }
        categories = newList;
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();
    }
};

// bấm nút Ẩn/Hiện để đổi nhanh trạng thái hiển thị
window.toggleCategoryStatus = function(code) {
    for (let i = 0; i < categories.length; i++) {
        let cCode = categories[i].categoryCode || categories[i].id;
        if (cCode === code) {
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
