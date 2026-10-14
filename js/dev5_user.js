(function () {
  'use strict';

  var DATA_URL = '../data/dev5_user.json';
  var USER_DATA_PREFIX = 'sportstore_user_data_';
  var data;
  var userData;

  function formatMoney(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  }

  function getSession() {
    return window.sportStoreAuth
      ? window.sportStoreAuth.session()
      : null;
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

      if (savedData) {
        return {
          orders: Array.isArray(savedData.orders) ? savedData.orders : [],
          addresses: Array.isArray(savedData.addresses) ? savedData.addresses : [],
          wishlist: Array.isArray(savedData.wishlist)
            ? savedData.wishlist.filter(function (item) {
              return item.id !== 'product-demo';
            })
            : []
        };
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    }

    var demoData = currentSession.id === 'u-001'
      ? {
        orders: data.orders || [],
        addresses: data.addresses || [],
        wishlist: data.wishlist || []
      }
      : {
        orders: [],
        addresses: [],
        wishlist: []
      };

    localStorage.setItem(storageKey, JSON.stringify(demoData));
    return demoData;
  }

  function renderUserProfile() {
    var currentSession = getSession();
    var userName = currentSession ? currentSession.name : 'khách hàng';
    var userEmail = document.querySelector('[data-user-email]');
    var userRole = document.querySelector('[data-user-role]');
    var userTier = document.querySelector('[data-user-tier]');

    document.querySelectorAll('[data-user-name]').forEach(function (element) {
      element.textContent = userName;
    });

    if (userEmail) {
      userEmail.textContent = currentSession
        ? currentSession.email
        : 'Đăng nhập để xem thông tin hội viên.';
    }

    if (userRole) {
      userRole.textContent = currentSession
        ? currentSession.role === 'admin'
          ? 'Quản trị viên'
          : 'Thành viên ' + currentSession.tier
        : 'Khách vãng lai';
    }

    if (userTier) {
      userTier.textContent = currentSession ? currentSession.tier : 'Guest';
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
      addButton.classList.add('dev5-hidden');
      editButton.classList.add('dev5-hidden');
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

      return [
        '<article class="dev5-address-card">',
        '  <div class="dev5-address-top">',
        '    <strong>' + address.label + defaultLabel + '</strong>',
        '  </div>',
        '  <div class="dev5-address-line">',
        '    <span>' + address.recipient + '</span>',
        '    <span>' + address.phone + '</span>',
        '    <span>' + address.line + ', ' + address.district + ', ' + address.city + '</span>',
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
        '  <div class="dev5-wishlist-icon">🏅</div>',
        '  <span class="dev5-muted">' + item.tag + '</span>',
        '  <h3>' + item.name + '</h3>',
        '  <span class="dev5-price">' + formatMoney(item.price) + '</span>',
        '  <button class="dev5-secondary-button" type="button" data-wishlist-remove="' + item.id + '">Xóa</button>',
        '</article>'
      ].join('');
        }).join('')
      : '<p class="dev5-muted">Wishlist của bạn đang trống.</p>';
  }

  function renderFaq() {
    var faqContainer = document.querySelector('[data-faq]');
    var faqItems = data.faq || data.faqs || [];

    faqContainer.innerHTML = faqItems.map(function (faq, index) {
      var openClass = index === 0 ? 'is-open' : '';
      var question = faq.q || faq.question;
      var answer = faq.a || faq.answer;

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

  function bindTabEvents() {
    document.querySelectorAll('[data-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-tab], [data-panel]').forEach(function (element) {
          element.classList.remove('is-active');
        });

        button.classList.add('is-active');
        document.querySelector('[data-panel="' + button.dataset.tab + '"]')
          .classList.add('is-active');
      });
    });
  }

  function bindFaqEvents() {
    document.querySelector('[data-faq]').addEventListener('click', function (event) {
      var question = event.target.closest('.dev5-faq-question');

      if (question) {
        question.parentElement.classList.toggle('is-open');
      }
    });
  }

  function bindAddressEvents() {
    var addressForm = document.querySelector('[data-address-form]');
    var editButton = document.querySelector('[data-edit-address]');

    document.querySelector('[data-add-address]').addEventListener('click', function () {
      addressForm.classList.remove('dev5-hidden');
    });

    editButton.addEventListener('click', function () {
      var address = userData.addresses[0];
      if (!address) return;

      Object.keys(address).forEach(function (field) {
        if (addressForm.elements[field]) {
          addressForm.elements[field].value = address[field] || '';
        }
      });
      addressForm.classList.remove('dev5-hidden');
    });

    document.querySelector('[data-cancel-address]').addEventListener('click', function () {
      addressForm.reset();
      addressForm.classList.add('dev5-hidden');
    });

    addressForm.addEventListener('submit', function (event) {
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
      addressForm.reset();
      addressForm.classList.add('dev5-hidden');
      renderAddresses();
      renderOverview();
    });
  }

  function bindWishlistEvents() {
    document.querySelector('[data-wishlist]').addEventListener('click', function (event) {
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
    });
  }

  function initializePage(loadedData) {
    data = loadedData;
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
  }

  fetch(DATA_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu Dev 5.');
      }

      return response.json();
    })
    .then(initializePage)
    .catch(function (error) {
      var content = document.querySelector('.dev5-content');

      if (content) {
        content.innerHTML = '<p role="alert">' + error.message + '</p>';
      }
    });
}());