// components.js
import { 
  auth, onAuthStateChanged, signOut, sendPasswordResetEmail,
  signInWithPopup, googleProvider, githubProvider, db, doc, getDoc, setDoc,
  updateDoc, serverTimestamp, collection, addDoc, query, where, onSnapshot,
  deleteDoc, getDocs
} from './firebase-config.js';

// ===== ডার্ক মোড =====
export function initDarkMode() {
  const stored = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored === 'true' || (stored === null && prefersDark);
  if (isDark) document.documentElement.classList.add('dark');
  return isDark;
}

export function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  const icon = document.getElementById('darkModeToggle');
  if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== কার্ট ব্যাজ =====
export function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? 'inline' : 'none';
  } catch (e) {
    cartBadge.textContent = '0';
    cartBadge.style.display = 'none';
  }
}

// ===== নেভবার =====
export function renderNavbar() {
  const navbarHTML = `
    <nav class="fixed top-0 left-0 w-full glass z-50 h-16 md:h-20 flex items-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="index.html" class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          SWD <span class="gradient-text">Store</span>
        </a>
        
        <!-- ডেস্কটপ মেনু -->
        <div class="hidden md:flex items-center gap-6">
          <a href="index.html" class="nav-link">Home</a>
          <a href="get-new-website.html" class="nav-link">Store</a>
          <a href="fix-website.html" class="nav-link">Fix</a>
          <a href="#" onclick="window.toggleDarkModeGlobal()" id="darkModeToggle" class="nav-link"><i class="fas fa-moon"></i></a>
        </div>

        <div class="flex items-center gap-3 md:gap-4">
          <!-- নোটিফিকেশন বেল -->
          <div class="relative">
            <a href="#" onclick="window.toggleNotifications()" class="text-gray-700 dark:text-gray-300 hover:text-blue-500 text-xl relative">
              <i class="fas fa-bell"></i>
              <span id="notificationDot" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full hidden"></span>
            </a>
            <div id="notificationDropdown" class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 hidden max-h-80 overflow-y-auto z-50">
              <div class="p-3 font-semibold border-b dark:border-gray-700 dark:text-white">Notifications</div>
              <div id="notificationList" class="p-2 text-sm text-gray-600 dark:text-gray-300">No notifications</div>
            </div>
          </div>

          <a href="messages.html" class="text-gray-700 dark:text-gray-300 hover:text-blue-500 text-xl" title="Messages">
            <i class="fas fa-envelope"></i>
          </a>
          <a href="#" class="cart-toggle text-gray-700 dark:text-gray-300 hover:text-blue-500 text-xl relative" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-badge" style="display:none;">0</span>
          </a>
          
          <div id="auth-loading" class="flex items-center gap-3">
            <div class="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse hidden md:block"></div>
          </div>

          <div id="auth-buttons" class="hidden flex items-center gap-3">
            <a href="#" onclick="window.openAuthModal('signin')" class="nav-link text-sm">Sign In</a>
            <a href="#" onclick="window.openAuthModal('signup')" class="btn-primary text-sm py-2 px-4 md:px-5">Get Started</a>
          </div>

          <div id="profile-section" class="relative hidden">
            <div class="profile-avatar" id="profileAvatar">U</div>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="my-profile.html"><i class="fas fa-user mr-2"></i> My Profile</a>
              <a href="my-orders.html"><i class="fas fa-box mr-2"></i> My Orders</a>
              <a href="my-fix-requests.html"><i class="fas fa-tools mr-2"></i> My Fix Requests</a>
              <a href="settings.html"><i class="fas fa-cog mr-2"></i> Settings</a>
              <a href="#" onclick="window.handleLogout()"><i class="fas fa-sign-out-alt mr-2"></i> Logout</a>
            </div>
          </div>

          <!-- মোবাইল হ্যাম্বার্গার -->
          <button onclick="window.toggleMobileMenu()" class="md:hidden text-gray-700 dark:text-gray-300 text-2xl">
            <i class="fas fa-bars" id="hamburgerIcon"></i>
          </button>
        </div>
      </div>
    </nav>
    <!-- মোবাইল মেনু -->
    <div id="mobileMenu" class="fixed top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-40 hidden md:hidden">
      <div class="flex flex-col p-4 gap-3">
        <a href="index.html" class="nav-link py-2">Home</a>
        <a href="get-new-website.html" class="nav-link py-2">Store</a>
        <a href="fix-website.html" class="nav-link py-2">Fix</a>
        <a href="#" onclick="window.toggleDarkModeGlobal()" class="nav-link py-2"><i class="fas fa-moon"></i> Dark Mode</a>
      </div>
    </div>
  `;
  document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

  // ড্রপডাউন
  const avatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('dropdownMenu');
  if (avatar) {
    avatar.addEventListener('click', () => dropdown.classList.toggle('show'));
  }
  document.addEventListener('click', (e) => {
    if (avatar && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // কার্ট টগল
  const cartToggle = document.querySelector('#navbar-placeholder .cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.toggleCart === 'function') window.toggleCart();
    });
  }

  updateCartBadge();
  initDarkMode();
}

// ===== নেভবার অথ আপডেট =====
export function updateNavbarAuth(user, displayName) {
  const authBtns = document.getElementById('auth-buttons');
  const profileSection = document.getElementById('profile-section');
  const loadingEl = document.getElementById('auth-loading');
  const avatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('dropdownMenu');

  if (loadingEl) loadingEl.style.display = 'none';

  if (user) {
    if (authBtns) authBtns.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (avatar) avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
    // অ্যাডমিন চেক
    const isAdmin = user.email === 'shovon@admin.com';
    if (dropdown) {
      let adminLink = dropdown.querySelector('a[href="admin-panel.html"]');
      if (isAdmin) {
        if (!adminLink) {
          adminLink = document.createElement('a');
          adminLink.href = 'admin-panel.html';
          adminLink.innerHTML = '<i class="fas fa-shield-alt mr-2"></i> Admin Panel';
          dropdown.insertBefore(adminLink, dropdown.querySelector('a[href="#"]'));
        }
      } else if (adminLink) {
        adminLink.remove();
      }
    }
  } else {
    if (authBtns) authBtns.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
  }
}

// ===== ফুটার =====
export function renderFooter() {
  const footerHTML = `
    <footer class="glass border-t border-gray-200/30 dark:border-gray-800/30 py-8 px-6 sm:px-8 lg:px-12 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div class="font-medium text-gray-700 dark:text-gray-300">&copy; 2026 SWD Store. All rights reserved.</div>
        <div class="flex items-center gap-4">
          <a href="https://shovon337.github.io/web-developer" target="_blank" class="text-blue-600 hover:underline font-medium">Portfolio</a>
          <a href="https://github.com/shovon337" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/shovon-s-mind-67aa4b260/" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  `;
  document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

// ===== কার্ট সাইডবার =====
export function renderCartSidebar() {
  if (document.getElementById('cartSidebar')) return;
  const html = `
    <div class="cart-overlay" id="cartOverlay" onclick="window.toggleCart()"></div>
    <div class="cart-sidebar" id="cartSidebar">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold dark:text-white">Your Cart</h2>
        <button onclick="window.toggleCart()" class="text-gray-500"><i class="fas fa-times"></i></button>
      </div>
      <div id="cartItems" class="space-y-4"></div>
      <div class="mt-6 border-t dark:border-gray-700 pt-4">
        <div class="flex justify-between font-bold dark:text-white">
          <span>Total:</span>
          <span id="cartTotal">$0</span>
        </div>
        <button onclick="window.checkout()" class="btn-primary w-full mt-4 justify-center">Proceed to Checkout</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  updateCartUI();
}

export function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

export function updateCartUI() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container || !totalEl) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Your cart is empty.</p>';
    totalEl.textContent = '$0';
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = qty * price;
      total += subtotal;
      return `
        <div class="flex items-center gap-3 border-b dark:border-gray-700 pb-3">
          <img src="${item.imageUrl || 'https://via.placeholder.com/50?text=No+Img'}" alt="${item.name}" class="w-12 h-12 object-cover rounded" />
          <div class="flex-1">
            <span class="font-medium dark:text-white block">${item.name}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 block">$${price} × ${qty} = $${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="window.updateQuantity(${idx}, -1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">−</button>
            <span class="w-6 text-center font-medium dark:text-white">${qty}</span>
            <button onclick="window.updateQuantity(${idx}, 1)" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">+</button>
          </div>
          <button onclick="window.removeFromCart(${idx})" class="text-red-500 ml-1"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }).join('');
    totalEl.textContent = `$${total.toFixed(2)}`;
  }
  updateCartBadge();
}

window.toggleCart = toggleCart;
window.updateCartUI = updateCartUI;

window.updateQuantity = function(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;
  cart[index].quantity = (cart[index].quantity || 1) + delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
};

window.removeFromCart = function(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
};

// ===== লোডিং =====
export function setLoading(button, isLoading, originalText = null) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button._originalText = originalText || button.innerHTML;
    button.innerHTML = `<span class="spinner"></span> Loading...`;
  } else {
    button.disabled = false;
    if (button._originalText) {
      button.innerHTML = button._originalText;
      delete button._originalText;
    }
  }
}

// ===== ফরগট পাসওয়ার্ড (গ্লোবাল) =====
export function showResetPasswordModal() {
  const email = prompt('Enter your email address to reset password:');
  if (!email) return;
  setLoading(document.activeElement, true);
  sendPasswordResetEmail(auth, email)
    .then(() => alert('✅ Password reset link sent to your email.'))
    .catch((error) => alert('⚠️ ' + error.message))
    .finally(() => setLoading(document.activeElement, false));
}
window.showResetPasswordModal = showResetPasswordModal;

// ===== নোটিফিকেশন =====
let notificationUnsub = null;
export function initNotifications(userId) {
  if (notificationUnsub) notificationUnsub();
  const q = query(collection(db, 'orders'), where('userId', '==', userId), where('status', '==', 'processing'));
  notificationUnsub = onSnapshot(q, (snapshot) => {
    const dot = document.getElementById('notificationDot');
    const list = document.getElementById('notificationList');
    if (dot) dot.classList.toggle('hidden', snapshot.empty);
    if (list) {
      if (snapshot.empty) {
        list.innerHTML = 'No new notifications';
      } else {
        let html = '';
        snapshot.forEach(doc => {
          html += `<div class="p-2 border-b dark:border-gray-700">Order #${doc.id.slice(0,8)} is processing</div>`;
        });
        list.innerHTML = html;
      }
    }
  });
}

window.toggleNotifications = () => {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
};

window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('hamburgerIcon');
  if (menu) {
    menu.classList.toggle('hidden');
    icon.className = menu.classList.contains('hidden') ? 'fas fa-bars' : 'fas fa-times';
  }
};