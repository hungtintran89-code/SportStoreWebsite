// biến lưu danh sách loại sp và kiểm tra xem đang mở form Thêm mới hay form Sửa
let categories = [];
let isEditMode = false;
let currentEditCode = "";

// 8 loại sp mặc định ban đầu của shop
const defaultCategories = [
    { categoryCode: "CAT01", name: "Vợt & Dụng Cụ", profitMargin: 20, isHidden: false },
    { categoryCode: "CAT02", name: "Giày Thể Thao", profitMargin: 25, isHidden: false },
    { categoryCode: "CAT03", name: "Áo Thể Thao", profitMargin: 30, isHidden: false },
    { categoryCode: "CAT04", name: "Váy Thể Thao", profitMargin: 30, isHidden: false },
    { categoryCode: "CAT05", name: "Quần Thể Thao", profitMargin: 30, isHidden: false },
    { categoryCode: "CAT06", name: "Balo Thể Thao", profitMargin: 25, isHidden: false },
    { categoryCode: "CAT07", name: "Túi Thể Thao", profitMargin: 25, isHidden: false },
    { categoryCode: "CAT08", name: "Phụ Kiện Thể Thao", profitMargin: 40, isHidden: false }
];

// lấy danh sách loại sp từ localStorage lên, nếu chưa có thì nạp mảng mặc định vô
function loadCategories() {
    let data = localStorage.getItem("categories");
    if (data) {
        categories = JSON.parse(data);
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
        let statusText = cat.isHidden ? "Đang ẩn" : "Đang hiện";
        let statusColor = cat.isHidden ? "red" : "green";

        let tr = `
            <tr>
                <td>${cat.categoryCode}</td>
                <td>${cat.name}</td>
                <td>${cat.profitMargin}%</td>
                <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="openEditModal('${cat.categoryCode}')">Sửa</button>
                    <button class="btn-action" style="background-color: #64748b;" onclick="toggleCategoryStatus('${cat.categoryCode}')">${cat.isHidden ? 'Hiện' : 'Ẩn'}</button>
                    <button class="btn-action btn-delete" onclick="deleteCategory('${cat.categoryCode}')">Xóa</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += tr;
    }
}

// bấm nút Thêm Loại SP thì xoá trắng các ô nhập rồi mở popup lên
document.getElementById("btnAddCategory").addEventListener("click", function() {
    isEditMode = false;
    currentEditCode = "";
    document.getElementById("modalTitle").innerText = "Thêm Loại Sản Phẩm Mới";

    document.getElementById("catCodeInput").value = "";
    document.getElementById("catCodeInput").disabled = false;
    document.getElementById("catNameInput").value = "";
    document.getElementById("catProfitInput").value = "";
    document.getElementById("catStatusInput").value = "false";

    document.getElementById("categoryModal").style.display = "flex";
});

// bấm dấu X thì đóng popup lại
document.getElementById("btnCloseModal").addEventListener("click", function() {
    document.getElementById("categoryModal").style.display = "none";
});

// xử lý khi bấm nút Lưu thông tin trong popup
document.getElementById("btnSaveCategory").addEventListener("click", function() {
    let code = document.getElementById("catCodeInput").value.trim();
    let name = document.getElementById("catNameInput").value.trim();
    let profit = document.getElementById("catProfitInput").value.trim();
    let isHidden = document.getElementById("catStatusInput").value === "true";

    if (code === "" || name === "" || profit === "") {
        alert("Vui lòng nhập đầy đủ các thông tin!");
        return;
    }

    if (isEditMode) {
        // nếu đang sửa thì tìm đúng mã loại đó để cập nhật lại tên, % lợi nhuận, trạng thái
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryCode === currentEditCode) {
                categories[i].name = name;
                categories[i].profitMargin = parseInt(profit);
                categories[i].isHidden = isHidden;
                break;
            }
        }

        // cập nhật lại giá bán bên mảng sp luôn khi đổi % lợi nhuận của loại đó
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
        // thêm mới thì phải check xem mã loại này có bị trùng chưa
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryCode === code) {
                alert("Mã loại sản phẩm đã tồn tại!");
                return;
            }
        }

        let newCat = {
            categoryCode: code,
            name: name,
            profitMargin: parseInt(profit),
            isHidden: isHidden
        };
        categories.push(newCat);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    document.getElementById("categoryModal").style.display = "none";
});

// mở popup sửa lên và điền sẵn thông tin cũ của loại sp đó vô các ô
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
        document.getElementById("catCodeInput").disabled = true; // khoá ô mã loại lại ko cho sửa mã
        document.getElementById("catNameInput").value = cat.name;
        document.getElementById("catProfitInput").value = cat.profitMargin;
        document.getElementById("catStatusInput").value = cat.isHidden ? "true" : "false";

        document.getElementById("categoryModal").style.display = "flex";
    }
};

// xoá loại sp (có hỏi xác nhận trước khi xoá)
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

// bấm nút Ẩn/Hiện để đổi nhanh trạng thái hiển thị
window.toggleCategoryStatus = function(code) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryCode === code) {
            categories[i].isHidden = !categories[i].isHidden;
            break;
        }
    }
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
};

loadCategories();
renderCategories();