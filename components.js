// components.js
import { auth, onAuthStateChanged, signOut, sendPasswordResetEmail } from './firebase-config.js';

// ===== কার্ট ব্যাজ আপডেট =====
export function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalQty;
  } catch (e) {
    cartBadge.textContent = '0';
  }
}

// ===== নেভবার রেন্ডার (লোডিং স্কেলেটন সহ) =====
export function renderNavbar() {
  const navbarHTML = `
    <nav class="fixed top-0 left-0 w-full glass z-50 h-16 md:h-20 flex items-center px-6 sm:px-8 lg:px-12">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <a href="index.html" class="text-xl md:text-2xl font-bold text-gray-900">
          SWD <span class="gradient-text">Store</span>
        </a>
        <div class="hidden md:flex items-center gap-6">
          <a href="index.html" class="nav-link text-sm">Home</a>
          <a href="get-new-website.html" class="nav-link text-sm">Store</a>
          <a href="fix-website.html" class="nav-link text-sm">Fix</a>
        </div>
        <div class="flex items-center gap-4">
          <a href="messages.html" class="text-gray-700 hover:text-blue-500 text-xl" title="Messages">
            <i class="fas fa-envelope"></i>
          </a>
          <a href="#" class="cart-toggle text-gray-700 hover:text-blue-500 text-xl relative" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-badge">0</span>
          </a>
          
          <!-- ✅ লোডিং স্টেট -->
          <div id="auth-loading" class="flex items-center gap-3">
            <div class="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div class="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          <!-- লগআউট স্টেট -->
          <div id="auth-buttons" class="hidden flex items-center gap-3">
            <a href="#" onclick="window.openAuthModal('signin')" class="nav-link text-sm">Sign In</a>
            <a href="#" onclick="window.openAuthModal('signup')" class="btn-primary text-sm py-2 px-5">Get Started</a>
          </div>

          <!-- লগইন স্টেট -->
          <div id="profile-section" class="relative hidden">
            <div class="profile-avatar" id="profileAvatar">S</div>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="my-profile.html"><i class="fas fa-user mr-2"></i> My Profile</a>
              <a href="my-orders.html"><i class="fas fa-box mr-2"></i> My Orders</a>
              <a href="my-fix-requests.html"><i class="fas fa-tools mr-2"></i> My Fix Requests</a>
              <a href="settings.html"><i class="fas fa-cog mr-2"></i> Settings</a>
              <a href="#" onclick="window.handleLogout()"><i class="fas fa-sign-out-alt mr-2"></i> Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
  document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

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

  const cartToggle = document.querySelector('#navbar-placeholder .cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.toggleCart === 'function') {
        window.toggleCart();
      }
    });
  }

  updateCartBadge();
}

// ===== নেভবার অথ স্টেট আপডেট (ফ্লিকার মুক্ত) =====
export function updateNavbarAuth(user, displayName) {
  const authBtns = document.getElementById('auth-buttons');
  const profileSection = document.getElementById('profile-section');
  const loadingEl = document.getElementById('auth-loading');
  const avatar = document.getElementById('profileAvatar');

  if (loadingEl) loadingEl.style.display = 'none';

  if (user) {
    if (authBtns) authBtns.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (avatar) avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
  } else {
    if (authBtns) authBtns.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
  }
}

// ===== ফুটার =====
export function renderFooter() {
  const footerHTML = `
    <footer class="glass border-t border-gray-200/30 py-8 px-6 sm:px-8 lg:px-12 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div class="font-medium text-gray-700">&copy; 2026 SWD Store. All rights reserved.</div>
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
        <h2 class="text-xl font-bold">Your Cart</h2>
        <button onclick="window.toggleCart()" class="text-gray-500"><i class="fas fa-times"></i></button>
      </div>
      <div id="cartItems" class="space-y-4"></div>
      <div class="mt-6 border-t pt-4">
        <div class="flex justify-between font-bold">
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
    container.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
    totalEl.textContent = '$0';
  } else {
    let total = 0;
    container.innerHTML = cart.map((item, idx) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = qty * price;
      total += subtotal;
      return `
        <div class="flex items-center gap-3 border-b pb-3">
          <img src="${item.imageUrl || 'https://via.placeholder.com/50?text=No+Img'}" alt="${item.name}" class="w-12 h-12 object-cover rounded" />
          <div class="flex-1">
            <span class="font-medium block">${item.name}</span>
            <span class="text-sm text-gray-500 block">$${price} × ${qty} = $${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="window.updateQuantity(${idx}, -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">−</button>
            <span class="w-6 text-center font-medium">${qty}</span>
            <button onclick="window.updateQuantity(${idx}, 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">+</button>
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

window.checkout = window.checkout || function() {
  alert('Please go to the Store page to checkout.');
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