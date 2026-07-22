// components.js
import { auth, onAuthStateChanged, signOut } from './firebase-config.js';

// ===== কার্ট ব্যাজ আপডেট =====
export function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartBadge.textContent = cart.length;
  } catch (e) {
    cartBadge.textContent = '0';
  }
}

// ===== নেভবার রেন্ডার =====
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
          <!-- ✅ কার্ট আইকন: href সরিয়ে onclick যোগ -->
          <a href="#" onclick="toggleCart()" class="text-gray-700 hover:text-blue-500 text-xl relative" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-badge">0</span>
          </a>
          <div id="auth-buttons" class="flex items-center gap-3">
            <a href="#" onclick="window.openAuthModal('signin')" class="nav-link text-sm">Sign In</a>
            <a href="#" onclick="window.openAuthModal('signup')" class="btn-primary text-sm py-2 px-5">Get Started</a>
          </div>
          <div id="profile-section" class="relative hidden">
            <div class="profile-avatar" id="profileAvatar">S</div>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="my-profile.html"><i class="fas fa-user mr-2"></i> My Profile</a>
              <a href="my-orders.html"><i class="fas fa-box mr-2"></i> My Orders</a>
              <a href="settings.html"><i class="fas fa-cog mr-2"></i> Settings</a>
              <a href="#" onclick="window.handleLogout()"><i class="fas fa-sign-out-alt mr-2"></i> Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
  document.getElementById('navbar-placeholder').innerHTML = navbarHTML;

  // প্রোফাইল ড্রপডাউন
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

  updateCartBadge();
}

// ===== ফুটার রেন্ডার =====
export function renderFooter() {
  const footerHTML = `
    <footer class="glass border-t border-gray-200/30 py-8 px-6 sm:px-8 lg:px-12 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div class="font-medium text-gray-700">
          &copy; 2026 SWD Store. All rights reserved.
        </div>
        <div class="flex items-center gap-4">
          <a href="https://shovon337.github.io/web-developer" target="_blank" class="text-blue-600 hover:underline font-medium">Portfolio</a>
          <a href="https://github.com/shovon337" target="_blank" class="social-icon" aria-label="GitHub">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/shovon-s-mind-67aa4b260/" target="_blank" class="social-icon" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  `;
  document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

// ===== অথ স্টেট আপডেট =====
export function updateNavbarAuth(user, displayName) {
  const authBtns = document.getElementById('auth-buttons');
  const profileSection = document.getElementById('profile-section');
  const avatar = document.getElementById('profileAvatar');
  if (user) {
    authBtns.classList.add('hidden');
    profileSection.classList.remove('hidden');
    avatar.textContent = (displayName || user.email).charAt(0).toUpperCase();
  } else {
    authBtns.classList.remove('hidden');
    profileSection.classList.add('hidden');
  }
}