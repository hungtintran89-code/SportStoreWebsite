(function () {
  'use strict';

  var USER_DATA_PREFIX = 'sportstore_user_data_';
  var userData;

  function formatMoney(value) {
    return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ';
  }

  function getSession() {
    return window.sportStoreAuth
      ? window.sportStoreAuth.session()
      : null;
  }

  // Nạp danh sách đơn hàng ĐỘNG của khách hàng từ data store hoặc LocalStorage
  function getCustomerOrdersFromStore(currentSession) {
    var allOrders = [];
    try {
      allOrders = JSON.parse(localStorage.getItem('sport_orders') || '[]');
    } catch (e) {}
    if (!allOrders || allOrders.length === 0) {
      if (typeof orders !== 'undefined' && Array.isArray(orders)) {
        allOrders = orders;
      }
    }
    return allOrders.filter(function (ord) {
      var sId = currentSession.customerId || currentSession.id;
      return (ord.customerId && ord.customerId === sId) ||
             (ord.userId && ord.userId === sId) ||
             (ord.email && ord.email.toLowerCase() === (currentSession.email || '').toLowerCase()) ||
             (ord.phone && ord.phone === currentSession.phone);
    }).map(function (ord) {
      var itemCount = Array.isArray(ord.items) ? ord.items.length : 1;
      var firstItem = Array.isArray(ord.items) && ord.items[0];
      var itemName = firstItem ? (firstItem.name || firstItem.productName || 'Sản phẩm thể thao') : 'Sản phẩm thể thao';
      var itemsDesc = itemName + (itemCount > 1 ? ' (+' + (itemCount - 1) + ' món khác)' : '');
      var progress = ord.status === 'Đã giao' ? 4 : (ord.status === 'Đang giao' ? 3 : (ord.status === 'Đã xử lý' ? 2 : 1));

      return {
        id: ord.orderId || ord.id || ('ORD-' + Date.now()),
        date: ord.date || new Date().toISOString().split('T')[0],
        items: itemsDesc,
        status: ord.status || 'Mới đặt',
        total: ord.total || 0,
        progress: progress
      };
    });
  }

  // Nạp địa chỉ nhận hàng ĐỘNG của khách hàng từ data store
  function getCustomerAddressesFromStore(currentSession) {
    var addresses = [];
    var allCustomers = [];
    try {
      allCustomers = JSON.parse(localStorage.getItem('sport_customers') || '[]');
    } catch (e) {}
    if (!allCustomers || allCustomers.length === 0) {
      if (typeof customers !== 'undefined' && Array.isArray(customers)) {
        allCustomers = customers;
      }
    }
    var sId = currentSession.customerId || currentSession.id;
    var cust = allCustomers.find(function (c) {
      return (c.customerId && c.customerId === sId) ||
             c.id === sId ||
             (c.email && c.email.toLowerCase() === (currentSession.email || '').toLowerCase()) ||
             (c.phone && c.phone === currentSession.phone);
    });

    var addrText = (cust && cust.address) || currentSession.address;
    if (addrText && addrText !== 'Chưa cập nhật') {
      addresses.push({
        id: 'address-' + (currentSession.id || 'default'),
        label: 'Địa chỉ mặc định',
        recipient: (cust && cust.name) || currentSession.name,
        phone: (cust && cust.phone) || currentSession.phone,
        line: addrText,
        district: '',
        city: '',
        detail: addrText,
        isDefault: true
      });
    }
    return addresses;
  }

  function getUserData() {
    var currentSession = getSession();

    if (!currentSession) {
      return {
        orders: [],
        addresses: [],
        wishlist: []
      };
    }

    var storageKey = USER_DATA_PREFIX + currentSession.id;

    try {
      var savedData = JSON.parse(localStorage.getItem(storageKey) || 'null');
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

    // Nạp ĐỘNG theo tài khoản thực tế từ store
    var initialData = {
      orders: getCustomerOrdersFromStore(currentSession),
      addresses: getCustomerAddressesFromStore(currentSession),
      wishlist: []
    };

    localStorage.setItem(storageKey, JSON.stringify(initialData));
    return initialData;
  }

  function renderUserProfile() {
    var currentSession = getSession();
    if (!currentSession) return;

    var userName = currentSession.name || 'Hội viên';
    var userEmail = document.querySelector('[data-user-email]');
    var userPhone = document.querySelector('[data-user-phone]');
    var userRole = document.querySelector('[data-user-role]');
    var userTier = document.querySelector('[data-user-tier]');
    var editProfileBtn = document.querySelector('[data-edit-profile-btn]');
    var isAdmin = (currentSession && currentSession.role === 'admin') ||
      localStorage.getItem('admin_logged_in') === 'true';

    document.querySelectorAll('[data-user-name]').forEach(function (element) {
      element.textContent = userName;
    });

    if (userEmail) {
      userEmail.textContent = currentSession.email || '';
    }

    var registeredUsers = [];
    try { registeredUsers = JSON.parse(localStorage.getItem('sportstore_registered_users') || '[]'); } catch(e){}
    var regUser = registeredUsers.find(function(u) { return currentSession && (u.id === currentSession.id || u.email === currentSession.email); });
    var phone = (currentSession && currentSession.phone) || (regUser && regUser.phone) || '';
    if (userPhone) {
      userPhone.textContent = phone ? 'SĐT: ' + phone : '';
    }

    if (userRole) {
      userRole.textContent = isAdmin
        ? 'Quản trị viên'
        : 'Thành viên ' + (currentSession.tier || 'Gold');
    }

    if (userTier) {
      userTier.textContent = currentSession.tier || (isAdmin ? 'Administrator' : 'Gold');
    }

    if (editProfileBtn) {
      editProfileBtn.classList.remove('dev5-hidden');
    }
  }

  function renderOverview() {
    document.querySelector('[data-order-count]').textContent = userData.orders.length;
    document.querySelector('[data-address-count]').textContent = userData.addresses.length;
    document.querySelector('[data-wishlist-count]').textContent = userData.wishlist.length;
  }

  function renderOrders() {
    var orderContainer = document.querySelector('[data-orders]');
    var timelineSteps = ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Đã giao'];

    if (!userData.orders.length) {
      orderContainer.innerHTML = '<p class="dev5-muted">Bạn chưa có đơn hàng nào.</p>';
      return;
    }

    orderContainer.innerHTML = userData.orders.map(function (order) {
      var timeline = timelineSteps.map(function (step, index) {
        var completedClass = index < order.progress ? 'is-done' : '';
        return '<span class="dev5-step ' + completedClass + '">' + step + '</span>';
      }).join('');

      return [
        '<article class="dev5-order-card">',
        '  <div class="dev5-order-top">',
        '    <div>',
        '      <strong>' + order.id + '</strong>',
        '      <div class="dev5-muted">' + order.date + ' · ' + order.items + '</div>',
        '    </div>',
        '    <span class="dev5-status">' + order.status + '</span>',
        '  </div>',
        '  <strong>' + formatMoney(order.total) + '</strong>',
        '  <div class="dev5-timeline">' + timeline + '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderAddresses() {
    var addressContainer = document.querySelector('[data-addresses]');
    var editButton = document.querySelector('[data-edit-address]');
    var addButton = document.querySelector('[data-add-address]');
    var addresses = userData.addresses;
    var currentSession = getSession();

    if (!currentSession) {
      addressContainer.innerHTML = '<p class="dev5-private-message">Vui lòng đăng nhập để xem sổ địa chỉ.</p>';
      if (addButton) addButton.classList.add('dev5-hidden');
      if (editButton) editButton.classList.add('dev5-hidden');
      return;
    }

    if (addButton) {
      addButton.classList.toggle('dev5-hidden', addresses.length > 0);
    }
    if (editButton) {
      editButton.classList.toggle('dev5-hidden', addresses.length === 0);
    }

    addressContainer.innerHTML = addresses.length
      ? addresses.map(function (address) {
      var defaultLabel = address.isDefault ? ' · Mặc định' : '';
      var fullAddress = address.detail || [address.line, address.district, address.city].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ';
      var addressLabel = address.label || address.title || 'Địa chỉ nhận hàng';

      return [
        '<article class="dev5-address-card">',
        '  <div class="dev5-address-top">',
        '    <strong>' + addressLabel + defaultLabel + '</strong>',
        '  </div>',
        '  <div class="dev5-address-line">',
        '    <span>' + (address.recipient || currentSession.name) + '</span>',
        '    <span>' + (address.phone || currentSession.phone) + '</span>',
        '    <span>' + fullAddress + '</span>',
        '  </div>',
        '</article>'
      ].join('');
        }).join('')
      : '<p class="dev5-muted">Bạn chưa lưu địa chỉ giao hàng nào.</p>';
  }

  function renderWishlist() {
    var wishlistContainer = document.querySelector('[data-wishlist]');
    var currentSession = getSession();

    if (!currentSession) {
      wishlistContainer.innerHTML = '<p class="dev5-private-message">Vui lòng đăng nhập để xem Wishlist.</p>';
      return;
    }

    wishlistContainer.innerHTML = userData.wishlist.length
      ? userData.wishlist.map(function (item) {
      return [
        '<article class="dev5-wishlist-item">',
        '  <div class="dev5-wishlist-icon"></div>',
        '  <span class="dev5-muted">' + item.tag + '</span>',
        '  <h3>' + item.name + '</h3>',
        '  <span class="dev5-price">' + item.price + '</span>',
        '  <button class="dev5-secondary-button" type="button" data-wishlist-remove="' + item.id + '">Xóa</button>',
        '</article>'
      ].join('');
        }).join('')
      : '<p class="dev5-muted">Wishlist của bạn đang trống.</p>';
  }

  function renderFaq() {
    var faqContainer = document.querySelector('[data-faq]');
    var faqItems = [];

    // Nạp ĐỘNG từ data/store/faqs.js
    if (typeof faqs !== 'undefined' && Array.isArray(faqs)) {
      faqItems = faqs;
    } else if (typeof MOCK_FAQS !== 'undefined' && Array.isArray(MOCK_FAQS)) {
      faqItems = MOCK_FAQS;
    }

    try {
      var savedFaqs = JSON.parse(localStorage.getItem('sport_faqs') || 'null');
      if (Array.isArray(savedFaqs) && savedFaqs.length > 0) faqItems = savedFaqs;
    } catch (e) {}

    faqContainer.innerHTML = faqItems.map(function (faq, index) {
      var openClass = index === 0 ? 'is-open' : '';
      var question = faq.question || faq.q || '';
      var answer = faq.answer || faq.a || '';

      return [
        '<article class="dev5-faq-item ' + openClass + '">',
        '  <button class="dev5-faq-question" type="button">',
        '    ' + question + '<span>＋</span>',
        '  </button>',
        '  <div class="dev5-faq-answer">' + answer + '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function setActiveTab(tabName) {
    if (!tabName) return;
    var targetTabBtn = document.querySelector('[data-tab="' + tabName + '"]');
    var targetPanel = document.querySelector('[data-panel="' + tabName + '"]');
    if (!targetTabBtn || !targetPanel) return;

    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.classList.remove('is-active');
    });
    document.querySelectorAll('[data-panel]').forEach(function (panel) {
      panel.classList.remove('is-active');
    });

    targetTabBtn.classList.add('is-active');
    targetPanel.classList.add('is-active');
  }

  function bindTabEvents() {
    document.querySelectorAll('[data-tab]').forEach(function (button) {
      button.onclick = function () {
        setActiveTab(button.dataset.tab);
      };
    });

    // Lắng nghe sự kiện click trên các mục Dropdown Shopee (Tài khoản của tôi, Đơn mua)
    document.querySelectorAll('[data-action-tab]').forEach(function (link) {
      link.onclick = function (e) {
        var tab = this.getAttribute('data-action-tab');
        if (tab) {
          e.preventDefault();
          setActiveTab(tab);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', 'dev5_user.html?tab=' + tab);
          }
        }
      };
    });

    // Tự động kích hoạt tab dựa theo tham số ?tab=orders hoặc ?tab=overview trên URL
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setActiveTab(tabFromUrl);
      }
    } catch (e) {}
  }

  function bindFaqEvents() {
    document.querySelector('[data-faq]').onclick = function (event) {
      var question = event.target.closest('.dev5-faq-question');

      if (question) {
        question.parentElement.classList.toggle('is-open');
      }
    };
  }

  function bindAddressEvents() {
    var addressForm = document.querySelector('[data-address-form]');
    var editButton = document.querySelector('[data-edit-address]');

    document.querySelector('[data-add-address]').onclick = function () {
      addressForm.classList.remove('dev5-hidden');
    };

    editButton.onclick = function () {
      var address = userData.addresses[0];
      if (!address) return;

      Object.keys(address).forEach(function (field) {
        if (addressForm.elements[field]) {
          addressForm.elements[field].value = address[field] || '';
        }
      });
      addressForm.classList.remove('dev5-hidden');
    };

    document.querySelector('[data-cancel-address]').onclick = function () {
      addressForm.reset();
      addressForm.classList.add('dev5-hidden');
    };

    var saveAddressBtn = addressForm.querySelector('button[type="submit"]');
    if (saveAddressBtn) {
      saveAddressBtn.onclick = function (event) {
        event.preventDefault();

      var values = new FormData(addressForm);
      var addresses = userData.addresses;

      var address = {
        id: 'address-' + Date.now(),
        label: 'Địa chỉ mới',
        recipient: values.get('recipient'),
        phone: values.get('phone'),
        line: values.get('line'),
        district: values.get('district'),
        city: values.get('city'),
        isDefault: true
      };

      userData.addresses = [address];
      localStorage.setItem(
        USER_DATA_PREFIX + getSession().id,
        JSON.stringify(userData)
      );
      // Đồng bộ sổ địa chỉ dùng chung cho module Checkout (Dev 4)
      localStorage.setItem('sport_address', JSON.stringify(address));
      addressForm.reset();
      addressForm.classList.add('dev5-hidden');
      renderAddresses();
      renderOverview();
      };
    }
  }

  function bindProfileEvents() {
    var editBtn = document.querySelector('[data-edit-profile-btn]');
    var cancelBtn = document.querySelector('[data-cancel-profile]');
    var form = document.querySelector('[data-profile-form]');

    if (!editBtn || !form) return;

// Đã loại bỏ oninput, kiểm tra số khi click

    editBtn.onclick = function () {
      var currentSession = getSession();
      if (!currentSession) return;

      var registeredUsers = [];
      try { registeredUsers = JSON.parse(localStorage.getItem('sportstore_registered_users') || '[]'); } catch(e){}
      var regUser = registeredUsers.find(function(u) { return u.id === currentSession.id || u.email === currentSession.email; });
      var phone = currentSession.phone || (regUser && regUser.phone) || '';

      form.elements.profileName.value = currentSession.name || '';
      form.elements.profileEmail.value = currentSession.email || '';
      form.elements.profilePhone.value = phone;
      form.elements.profilePassword.value = '';

      form.classList.remove('dev5-hidden');
    };

    if (cancelBtn) {
      cancelBtn.onclick = function () {
        form.reset();
        form.classList.add('dev5-hidden');
      };
    }

    var saveProfileBtn = form.querySelector('button[type="submit"]');
    if (saveProfileBtn) {
      saveProfileBtn.onclick = function (e) {
        e.preventDefault();
      var currentSession = getSession();
      if (!currentSession) return;

      var newName = form.elements.profileName.value.trim();
      var newEmail = form.elements.profileEmail.value.trim();
      var newPhone = form.elements.profilePhone.value.trim();
      var newPass = form.elements.profilePassword.value;

      currentSession.name = newName;
      currentSession.email = newEmail;
      currentSession.phone = newPhone;

      // Cập nhật session
      localStorage.setItem('sportstore_auth', JSON.stringify(currentSession));

      // Cập nhật trong danh sách đăng ký nếu có
      try {
        var registered = JSON.parse(localStorage.getItem('sportstore_registered_users') || '[]');
        var foundReg = registered.find(function (u) { return u.id === currentSession.id || u.email === currentSession.email; });
        if (foundReg) {
          foundReg.name = newName;
          foundReg.email = newEmail;
          foundReg.phone = newPhone;
          if (newPass) foundReg.password = newPass;
          localStorage.setItem('sportstore_registered_users', JSON.stringify(registered));
        }
      } catch (err) {}

      // Cập nhật giao diện
      renderUserProfile();
      if (window.sportStoreAuth && typeof window.sportStoreAuth.updateButtons === 'function') {
        window.sportStoreAuth.updateButtons();
      }

      form.classList.add('dev5-hidden');
        showToast("Đã cập nhật thông tin cá nhân thành công!", "success");
      };
    }
  }

  function bindWishlistEvents() {
    document.querySelector('[data-wishlist]').onclick = function (event) {
      var removeButton = event.target.closest('[data-wishlist-remove]');
      if (!removeButton) return;

      userData.wishlist = userData.wishlist.filter(function (item) {
        return item.id !== removeButton.dataset.wishlistRemove;
      });
      localStorage.setItem(
        USER_DATA_PREFIX + getSession().id,
        JSON.stringify(userData)
      );
      renderWishlist();
      renderOverview();
    };
  }

  function initializePage() {
    var currentSession = getSession();
    var authGuard = document.querySelector('[data-auth-guard]');
    var authContent = document.querySelector('[data-authorized-content]');

    // KHÓA TRANG NẾU KHÁCH CHƯA ĐĂNG NHẬP
    if (!currentSession) {
      if (authGuard) authGuard.classList.remove('dev5-hidden');
      if (authContent) authContent.classList.add('dev5-hidden');

      setTimeout(function () {
        if (window.sportStoreAuth && typeof window.sportStoreAuth.openModal === 'function') {
          window.sportStoreAuth.openModal('login');
        }
      }, 100);
      return;
    }

    // ĐÃ ĐĂNG NHẬP: Mở khóa và hiển thị toàn bộ giao diện thành viên
    if (authGuard) authGuard.classList.add('dev5-hidden');
    if (authContent) authContent.classList.remove('dev5-hidden');

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

  // Khởi động trang trực tiếp từ dữ liệu động của hệ thống
  initializePage();
}());