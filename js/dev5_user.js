// Quan ly trang ho so khach hang, don mua va so dia chi (dev5_user.html)
var USER_DATA_PREFIX = "sportstore_user_data_";
var userData = { orders: [], addresses: [], wishlist: [] };

function formatUserMoney(value) {
  return (Number(value) || 0).toLocaleString("vi-VN") + " đ";
}

function getUserSession() {
  return window.sportStoreAuth ? window.sportStoreAuth.session() : null;
}

// Lay danh sach don hang cua khach hang tu localStorage
function getCustomerOrdersFromStore(currentSession) {
  var allOrders = [];
  try {
    allOrders = JSON.parse(localStorage.getItem("sport_orders") || "[]");
  } catch (e) {}
  if (!allOrders || allOrders.length === 0) {
    if (typeof orders !== "undefined" && Array.isArray(orders)) {
      allOrders = orders;
    }
  }

  var sId = currentSession.customerId || currentSession.id;
  var kq = [];
  for (var i = 0; i < allOrders.length; i++) {
    var ord = allOrders[i];
    var cungId = (ord.customerId && ord.customerId === sId) || (ord.userId && ord.userId === sId);
    var cungEmail = ord.email && currentSession.email && ord.email.toLowerCase() === currentSession.email.toLowerCase();
    var cungPhone = ord.phone && ord.phone === currentSession.phone;

    if (cungId || cungEmail || cungPhone) {
      var itemCount = Array.isArray(ord.items) ? ord.items.length : 1;
      var firstItem = Array.isArray(ord.items) && ord.items[0];
      var itemName = firstItem ? (firstItem.name || firstItem.productName || "Sản phẩm thể thao") : "Sản phẩm thể thao";
      var itemsDesc = itemName + (itemCount > 1 ? " (+" + (itemCount - 1) + " món khác)" : "");
      var progress = ord.status === "Đã giao" ? 4 : (ord.status === "Đang giao" ? 3 : (ord.status === "Đã xử lý" ? 2 : 1));

      kq.push({
        id: ord.orderId || ord.id || ("ORD-" + Date.now()),
        date: ord.date || new Date().toISOString().split("T")[0],
        items: itemsDesc,
        status: ord.status || "Mới đặt",
        total: ord.total || 0,
        progress: progress
      });
    }
  }
  return kq;
}

// Lay dia chi nhan hang cua khach hang
function getCustomerAddressesFromStore(currentSession) {
  var addresses = [];
  var allCustomers = [];
  try {
    allCustomers = JSON.parse(localStorage.getItem("sport_customers") || "[]");
  } catch (e) {}
  if (!allCustomers || allCustomers.length === 0) {
    if (typeof customers !== "undefined" && Array.isArray(customers)) {
      allCustomers = customers;
    }
  }

  var sId = currentSession.customerId || currentSession.id;
  var cust = null;
  for (var i = 0; i < allCustomers.length; i++) {
    var c = allCustomers[i];
    if (
      (c.customerId && c.customerId === sId) ||
      c.id === sId ||
      (c.email && currentSession.email && c.email.toLowerCase() === currentSession.email.toLowerCase()) ||
      (c.phone && c.phone === currentSession.phone)
    ) {
      cust = c;
      break;
    }
  }

  var addrText = (cust && cust.address) || currentSession.address;
  if (addrText && addrText !== "Chưa cập nhật") {
    addresses.push({
      id: "address-" + (currentSession.id || "default"),
      label: "Địa chỉ mặc định",
      recipient: (cust && cust.name) || currentSession.name,
      phone: (cust && cust.phone) || currentSession.phone,
      line: addrText,
      district: "",
      city: "",
      detail: addrText,
      isDefault: true
    });
  }
  return addresses;
}

function getUserData() {
  var currentSession = getUserSession();
  if (!currentSession) {
    return { orders: [], addresses: [], wishlist: [] };
  }

  var storageKey = USER_DATA_PREFIX + currentSession.id;
  try {
    var savedData = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (savedData && (savedData.orders.length > 0 || savedData.addresses.length > 0)) {
      return {
        orders: Array.isArray(savedData.orders) ? savedData.orders : [],
        addresses: Array.isArray(savedData.addresses) ? savedData.addresses : [],
        wishlist: Array.isArray(savedData.wishlist) ? savedData.wishlist : []
      };
    }
  } catch (error) {
    localStorage.removeItem(storageKey);
  }

  var initialData = {
    orders: getCustomerOrdersFromStore(currentSession),
    addresses: getCustomerAddressesFromStore(currentSession),
    wishlist: []
  };

  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
}

function renderUserProfile() {
  var currentSession = getUserSession();
  if (!currentSession) return;

  var userName = currentSession.name || "Hội viên";
  var userEmail = document.querySelector("[data-user-email]");
  var userPhone = document.querySelector("[data-user-phone]");
  var userRole = document.querySelector("[data-user-role]");
  var userTier = document.querySelector("[data-user-tier]");
  var editProfileBtn = document.querySelector("[data-edit-profile-btn]");
  var isAdmin = (currentSession && currentSession.role === "admin") || localStorage.getItem("admin_logged_in") === "true";

  var nameEls = document.querySelectorAll("[data-user-name]");
  for (var i = 0; i < nameEls.length; i++) {
    nameEls[i].textContent = userName;
  }

  if (userEmail) {
    userEmail.textContent = currentSession.email || "";
  }

  var registeredUsers = [];
  try {
    registeredUsers = JSON.parse(localStorage.getItem("sportstore_registered_users") || "[]");
  } catch (e) {}

  var regUser = null;
  for (var j = 0; j < registeredUsers.length; j++) {
    var u = registeredUsers[j];
    if (currentSession && (u.id === currentSession.id || u.email === currentSession.email)) {
      regUser = u;
      break;
    }
  }

  var phone = (currentSession && currentSession.phone) || (regUser && regUser.phone) || "";
  if (userPhone) {
    userPhone.textContent = phone ? "SĐT: " + phone : "";
  }

  if (userRole) {
    userRole.textContent = isAdmin ? "Quản trị viên" : "Thành viên " + (currentSession.tier || "Gold");
  }

  if (userTier) {
    userTier.textContent = currentSession.tier || (isAdmin ? "Administrator" : "Gold");
  }

  if (editProfileBtn) {
    editProfileBtn.classList.remove("dev5-hidden");
  }
}

function renderOverview() {
  var ordCount = document.querySelector("[data-order-count]");
  var addrCount = document.querySelector("[data-address-count]");
  var wishCount = document.querySelector("[data-wishlist-count]");
  if (ordCount) ordCount.textContent = userData.orders.length;
  if (addrCount) addrCount.textContent = userData.addresses.length;
  if (wishCount) wishCount.textContent = userData.wishlist.length;
}

function renderOrders() {
  var orderContainer = document.querySelector("[data-orders]");
  if (!orderContainer) return;
  var timelineSteps = ["Đặt hàng", "Xác nhận", "Đang giao", "Đã giao"];

  if (!userData.orders.length) {
    orderContainer.innerHTML = '<p class="dev5-muted">Bạn chưa có đơn hàng nào.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < userData.orders.length; i++) {
    var order = userData.orders[i];
    var timeline = "";
    for (var s = 0; s < timelineSteps.length; s++) {
      var completedClass = s < order.progress ? "is-done" : "";
      timeline += '<span class="dev5-step ' + completedClass + '">' + timelineSteps[s] + '</span>';
    }

    html +=
      '<article class="dev5-order-card">' +
        '<div class="dev5-order-top">' +
          '<div>' +
            '<strong>' + order.id + '</strong>' +
            '<div class="dev5-muted">' + order.date + ' &middot; ' + order.items + '</div>' +
          '</div>' +
          '<span class="dev5-status">' + order.status + '</span>' +
        '</div>' +
        '<strong>' + formatUserMoney(order.total) + '</strong>' +
        '<div class="dev5-timeline">' + timeline + '</div>' +
      '</article>';
  }
  orderContainer.innerHTML = html;
}

function renderAddresses() {
  var addressContainer = document.querySelector("[data-addresses]");
  if (!addressContainer) return;
  var editButton = document.querySelector("[data-edit-address]");
  var addButton = document.querySelector("[data-add-address]");
  var addresses = userData.addresses;
  var currentSession = getUserSession();

  if (!currentSession) {
    addressContainer.innerHTML = '<p class="dev5-private-message">Vui lòng đăng nhập để xem sổ địa chỉ.</p>';
    if (addButton) addButton.classList.add("dev5-hidden");
    if (editButton) editButton.classList.add("dev5-hidden");
    return;
  }

  if (addButton) {
    if (addresses.length > 0) addButton.classList.add("dev5-hidden");
    else addButton.classList.remove("dev5-hidden");
  }
  if (editButton) {
    if (addresses.length === 0) editButton.classList.add("dev5-hidden");
    else editButton.classList.remove("dev5-hidden");
  }

  if (!addresses.length) {
    addressContainer.innerHTML = '<p class="dev5-muted">Bạn chưa lưu địa chỉ giao hàng nào.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < addresses.length; i++) {
    var address = addresses[i];
    var defaultLabel = address.isDefault ? " &middot; Mặc định" : "";
    var parts = [];
    if (address.line) parts.push(address.line);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    var fullAddress = address.detail || parts.join(", ") || "Chưa cập nhật địa chỉ";
    var addressLabel = address.label || address.title || "Địa chỉ nhận hàng";

    html +=
      '<article class="dev5-address-card">' +
        '<div class="dev5-address-top">' +
          '<strong>' + addressLabel + defaultLabel + '</strong>' +
        '</div>' +
        '<div class="dev5-address-line">' +
          '<span>' + (address.recipient || currentSession.name) + '</span>' +
          '<span>' + (address.phone || currentSession.phone) + '</span>' +
          '<span>' + fullAddress + '</span>' +
        '</div>' +
      '</article>';
  }
  addressContainer.innerHTML = html;
}

function renderWishlist() {
  var wishlistContainer = document.querySelector("[data-wishlist]");
  if (!wishlistContainer) return;
  var currentSession = getUserSession();

  if (!currentSession) {
    wishlistContainer.innerHTML = '<p class="dev5-private-message">Vui lòng đăng nhập để xem danh sách yêu thích.</p>';
    return;
  }

  if (!userData.wishlist.length) {
    wishlistContainer.innerHTML = '<p class="dev5-muted">Danh sách sản phẩm yêu thích của bạn đang trống.</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < userData.wishlist.length; i++) {
    var item = userData.wishlist[i];
    html +=
      '<article class="dev5-wishlist-item">' +
        '<div class="dev5-wishlist-icon"></div>' +
        '<span class="dev5-muted">' + item.tag + '</span>' +
        '<h3>' + item.name + '</h3>' +
        '<span class="dev5-price">' + item.price + '</span>' +
        '<button class="dev5-secondary-button" type="button" data-wishlist-remove="' + item.id + '">Xóa</button>' +
      '</article>';
  }
  wishlistContainer.innerHTML = html;
}

function renderFaq() {
  var faqContainer = document.querySelector("[data-faq]");
  if (!faqContainer) return;
  var faqItems = [];

  if (typeof faqs !== "undefined" && Array.isArray(faqs)) {
    faqItems = faqs;
  } else if (typeof MOCK_FAQS !== "undefined" && Array.isArray(MOCK_FAQS)) {
    faqItems = MOCK_FAQS;
  }

  try {
    var savedFaqs = JSON.parse(localStorage.getItem("sport_faqs") || "null");
    if (Array.isArray(savedFaqs) && savedFaqs.length > 0) faqItems = savedFaqs;
  } catch (e) {}

  var html = "";
  for (var i = 0; i < faqItems.length; i++) {
    var faq = faqItems[i];
    var openClass = i === 0 ? "is-open" : "";
    var question = faq.question || faq.q || "";
    var answer = faq.answer || faq.a || "";

    html +=
      '<article class="dev5-faq-item ' + openClass + '">' +
        '<button class="dev5-faq-question" type="button">' +
          question + '<span><i class="fa-solid fa-plus"></i></span>' +
        '</button>' +
        '<div class="dev5-faq-answer">' + answer + '</div>' +
      '</article>';
  }
  faqContainer.innerHTML = html;
}

function setActiveUserTab(tabName) {
  if (!tabName) return;
  var targetTabBtn = document.querySelector('[data-tab="' + tabName + '"]');
  var targetPanel = document.querySelector('[data-panel="' + tabName + '"]');
  if (!targetTabBtn || !targetPanel) return;

  var allBtns = document.querySelectorAll("[data-tab]");
  for (var i = 0; i < allBtns.length; i++) {
    allBtns[i].classList.remove("is-active");
  }
  var allPanels = document.querySelectorAll("[data-panel]");
  for (var j = 0; j < allPanels.length; j++) {
    allPanels[j].classList.remove("is-active");
  }

  targetTabBtn.classList.add("is-active");
  targetPanel.classList.add("is-active");
}

function bindTabEvents() {
  var tabBtns = document.querySelectorAll("[data-tab]");
  for (var i = 0; i < tabBtns.length; i++) {
    tabBtns[i].onclick = function () {
      setActiveUserTab(this.getAttribute("data-tab"));
    };
  }

  var actionLinks = document.querySelectorAll("[data-action-tab]");
  for (var j = 0; j < actionLinks.length; j++) {
    actionLinks[j].onclick = function (e) {
      var tab = this.getAttribute("data-action-tab");
      if (tab) {
        e.preventDefault();
        setActiveUserTab(tab);
      }
    };
  }

  try {
    var urlParams = new URLSearchParams(window.location.search);
    var tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setActiveUserTab(tabFromUrl);
    }
  } catch (e) {}
}

function bindFaqEvents() {
  var faqBox = document.querySelector("[data-faq]");
  if (!faqBox) return;
  faqBox.onclick = function (event) {
    var question = event.target.closest ? event.target.closest(".dev5-faq-question") : null;
    if (question && question.parentElement) {
      question.parentElement.classList.toggle("is-open");
    }
  };
}

function bindAddressEvents() {
  var addressForm = document.querySelector("[data-address-form]");
  var editButton = document.querySelector("[data-edit-address]");
  var addBtn = document.querySelector("[data-add-address]");
  var cancelBtn = document.querySelector("[data-cancel-address]");
  if (!addressForm) return;

  if (addBtn) {
    addBtn.onclick = function () {
      addressForm.classList.remove("dev5-hidden");
    };
  }

  if (editButton) {
    editButton.onclick = function () {
      var address = userData.addresses[0];
      if (!address) return;

      var fields = ["recipient", "phone", "line", "district", "city"];
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (addressForm.elements[f]) {
          addressForm.elements[f].value = address[f] || "";
        }
      }
      addressForm.classList.remove("dev5-hidden");
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = function () {
      addressForm.reset();
      addressForm.classList.add("dev5-hidden");
    };
  }

  var saveAddressBtn = addressForm.querySelector('button[type="submit"]');
  if (saveAddressBtn) {
    saveAddressBtn.onclick = function (event) {
      event.preventDefault();
      var address = {
        id: "address-" + Date.now(),
        label: "Địa chỉ mặc định",
        recipient: addressForm.elements.recipient ? addressForm.elements.recipient.value.trim() : "",
        phone: addressForm.elements.phone ? addressForm.elements.phone.value.trim() : "",
        line: addressForm.elements.line ? addressForm.elements.line.value.trim() : "",
        district: addressForm.elements.district ? addressForm.elements.district.value.trim() : "",
        city: addressForm.elements.city ? addressForm.elements.city.value.trim() : "",
        isDefault: true
      };

      userData.addresses = [address];
      localStorage.setItem(USER_DATA_PREFIX + getUserSession().id, JSON.stringify(userData));
      localStorage.setItem("sport_address", JSON.stringify(address));
      addressForm.reset();
      addressForm.classList.add("dev5-hidden");
      renderAddresses();
      renderOverview();
    };
  }
}

function bindProfileEvents() {
  var editBtn = document.querySelector("[data-edit-profile-btn]");
  var cancelBtn = document.querySelector("[data-cancel-profile]");
  var form = document.querySelector("[data-profile-form]");

  if (!editBtn || !form) return;

  editBtn.onclick = function () {
    var currentSession = getUserSession();
    if (!currentSession) return;

    var registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem("sportstore_registered_users") || "[]");
    } catch (e) {}

    var regUser = null;
    for (var i = 0; i < registeredUsers.length; i++) {
      if (registeredUsers[i].id === currentSession.id || registeredUsers[i].email === currentSession.email) {
        regUser = registeredUsers[i];
        break;
      }
    }
    var phone = currentSession.phone || (regUser && regUser.phone) || "";

    form.elements.profileName.value = currentSession.name || "";
    form.elements.profileEmail.value = currentSession.email || "";
    form.elements.profilePhone.value = phone;
    form.elements.profilePassword.value = "";

    form.classList.remove("dev5-hidden");
  };

  if (cancelBtn) {
    cancelBtn.onclick = function () {
      form.reset();
      form.classList.add("dev5-hidden");
    };
  }

  var saveProfileBtn = form.querySelector('button[type="submit"]');
  if (saveProfileBtn) {
    saveProfileBtn.onclick = function (e) {
      e.preventDefault();
      var currentSession = getUserSession();
      if (!currentSession) return;

      var newName = form.elements.profileName.value.trim();
      var newEmail = form.elements.profileEmail.value.trim();
      var newPhone = form.elements.profilePhone.value.trim();
      var newPass = form.elements.profilePassword.value;

      currentSession.name = newName;
      currentSession.email = newEmail;
      currentSession.phone = newPhone;

      localStorage.setItem("sport_user", JSON.stringify(currentSession));
      localStorage.setItem("sportstore_auth", JSON.stringify(currentSession));

      try {
        var registered = JSON.parse(localStorage.getItem("sportstore_registered_users") || "[]");
        for (var j = 0; j < registered.length; j++) {
          if (registered[j].id === currentSession.id || registered[j].email === currentSession.email) {
            registered[j].name = newName;
            registered[j].email = newEmail;
            registered[j].phone = newPhone;
            if (newPass) registered[j].password = newPass;
            localStorage.setItem("sportstore_registered_users", JSON.stringify(registered));
            break;
          }
        }
      } catch (err) {}

      renderUserProfile();
      if (window.sportStoreAuth && typeof window.sportStoreAuth.updateButtons === "function") {
        window.sportStoreAuth.updateButtons();
      }

      form.classList.add("dev5-hidden");
      showToast("Đã cập nhật thông tin cá nhân thành công!", "success");
    };
  }
}

function bindWishlistEvents() {
  var wishBox = document.querySelector("[data-wishlist]");
  if (!wishBox) return;
  wishBox.onclick = function (event) {
    var removeButton = event.target.closest ? event.target.closest("[data-wishlist-remove]") : null;
    if (!removeButton) return;
    var removeId = removeButton.getAttribute("data-wishlist-remove");
    var newList = [];
    for (var i = 0; i < userData.wishlist.length; i++) {
      if (String(userData.wishlist[i].id) !== String(removeId)) {
        newList.push(userData.wishlist[i]);
      }
    }
    userData.wishlist = newList;
    localStorage.setItem(USER_DATA_PREFIX + getUserSession().id, JSON.stringify(userData));
    renderWishlist();
    renderOverview();
  };
}

function initializeUserPage() {
  var currentSession = getUserSession();
  var authGuard = document.querySelector("[data-auth-guard]");
  var authContent = document.querySelector("[data-authorized-content]");

  if (!currentSession) {
    if (authGuard) authGuard.classList.remove("dev5-hidden");
    if (authContent) authContent.classList.add("dev5-hidden");

    setTimeout(function () {
      if (window.sportStoreAuth && typeof window.sportStoreAuth.openModal === "function") {
        window.sportStoreAuth.openModal("login");
      }
    }, 100);
    return;
  }

  if (authGuard) authGuard.classList.add("dev5-hidden");
  if (authContent) authContent.classList.remove("dev5-hidden");

  userData = getUserData();

  renderUserProfile();
  renderOverview();
  renderOrders();
  renderAddresses();
  renderWishlist();
  renderFaq();

  bindTabEvents();
  bindFaqEvents();
  bindAddressEvents();
  bindWishlistEvents();
  bindProfileEvents();
}

initializeUserPage();
