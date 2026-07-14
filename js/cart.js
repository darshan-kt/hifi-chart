/* ====================================
   cart.js – Shared cart, drawer & checkout
   Persists across every page via localStorage so the
   nav badge, chat, and menu all stay in sync.
   ==================================== */

const Cart = (() => {
  const STORAGE_KEY = 'hifiCart';
  const COUPONS = { HIFICHAT20: 0.20 };

  let items = load();
  let appliedCoupon = sessionStorage.getItem('hifiCoupon') || null;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadges();
    renderDrawer();
  }

  function addItem({ id, name, price }) {
    price = parseFloat(price);
    const existing = items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price, qty: 1 });
    }
    persist();
    openDrawer();
  }

  function changeQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) items = items.filter(i => i.id !== id);
    persist();
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    persist();
  }

  function clear() {
    items = [];
    appliedCoupon = null;
    sessionStorage.removeItem('hifiCoupon');
    persist();
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function subtotal() {
    return items.reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function discount() {
    if (!appliedCoupon || !COUPONS[appliedCoupon]) return 0;
    return subtotal() * COUPONS[appliedCoupon];
  }

  function total() {
    return Math.max(0, subtotal() - discount());
  }

  function applyCoupon(code) {
    code = (code || '').trim().toUpperCase();
    if (COUPONS[code]) {
      appliedCoupon = code;
      sessionStorage.setItem('hifiCoupon', code);
      persist();
      return true;
    }
    return false;
  }

  function updateBadges() {
    const c = count();
    document.querySelectorAll('.order-badge').forEach(el => {
      el.textContent = c;
      el.style.transform = 'scale(1.4)';
      setTimeout(() => { el.style.transform = ''; }, 200);
    });
  }

  function fmt(n) {
    return `$${n.toFixed(2)}`;
  }

  // ── Drawer DOM ──────────────────────
  let drawerBuilt = false;

  function buildDrawer() {
    if (drawerBuilt) return;
    drawerBuilt = true;

    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cart-overlay';

    const drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.id = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h3>Your Order <span class="cart-drawer-count">0</span></h3>
        <button class="cart-close-btn" id="cart-close-btn" aria-label="Close cart">×</button>
      </div>
      <div class="cart-drawer-body" id="cart-drawer-body"></div>
      <div class="cart-drawer-footer" id="cart-drawer-footer">
        <div class="cart-coupon-row">
          <input type="text" id="cart-coupon-input" class="cart-coupon-input" placeholder="Promo code">
          <button type="button" id="cart-coupon-btn" class="cart-coupon-btn">Apply</button>
        </div>
        <p class="cart-coupon-msg" id="cart-coupon-msg"></p>
        <div class="cart-summary-row">
          <span>Subtotal</span><span id="cart-subtotal">$0.00</span>
        </div>
        <div class="cart-summary-row cart-discount-row" id="cart-discount-row">
          <span>Discount</span><span id="cart-discount">-$0.00</span>
        </div>
        <div class="cart-summary-row cart-total-row">
          <span>Total</span><span id="cart-total">$0.00</span>
        </div>
        <button type="button" class="btn btn-primary cart-checkout-btn" id="cart-checkout-btn">Checkout</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener('click', closeDrawer);
    document.getElementById('cart-close-btn').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    document.getElementById('cart-coupon-btn').addEventListener('click', () => {
      const input = document.getElementById('cart-coupon-input');
      const msg = document.getElementById('cart-coupon-msg');
      if (applyCoupon(input.value)) {
        msg.textContent = `🎉 Code ${appliedCoupon} applied — 20% off!`;
        msg.classList.add('success');
      } else {
        msg.textContent = '❌ That code isn\'t valid.';
        msg.classList.remove('success');
      }
    });

    document.getElementById('cart-checkout-btn').addEventListener('click', handleCheckout);
  }

  function renderDrawer() {
    if (!drawerBuilt) return;
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');
    document.querySelectorAll('.cart-drawer-count').forEach(el => el.textContent = count());

    if (!items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">🛒</span>
          <p>Your cart is empty.</p>
          <a href="menu.html" class="btn btn-secondary btn-sm" data-nav>Browse Menu</a>
        </div>
      `;
      footer.style.display = 'none';
      return;
    }

    footer.style.display = '';
    body.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${fmt(item.price)}</span>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="cart-qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" class="cart-qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="cart-remove-btn" data-id="${item.id}" aria-label="Remove ${item.name}">🗑</button>
      </div>
    `).join('');

    body.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.id, btn.dataset.action === 'inc' ? 1 : -1);
      });
    });
    body.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });

    document.getElementById('cart-subtotal').textContent = fmt(subtotal());
    const discRow = document.getElementById('cart-discount-row');
    if (discount() > 0) {
      discRow.style.display = 'flex';
      document.getElementById('cart-discount').textContent = `-${fmt(discount())}`;
    } else {
      discRow.style.display = 'none';
    }
    document.getElementById('cart-total').textContent = fmt(total());
  }

  function handleCheckout() {
    if (!items.length) return;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderTotal = total();
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');

    // Empty the cart's data/badge right away, but keep the confirmation
    // panel on screen until the user dismisses it (a full persist() here
    // would re-render the drawer body and wipe the confirmation instantly).
    items = [];
    appliedCoupon = null;
    sessionStorage.removeItem('hifiCoupon');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadges();
    document.querySelectorAll('.cart-drawer-count').forEach(el => el.textContent = 0);

    body.innerHTML = `
      <div class="cart-confirm">
        <span class="cart-confirm-icon">🎉</span>
        <h4>Order #${orderNum} placed!</h4>
        <p>Total charged: <strong>${fmt(orderTotal)}</strong></p>
        <p class="cart-confirm-sub">Estimated pickup / delivery: 25–35 min. A confirmation has been sent to your chat inbox.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="cart-continue-btn">Continue Browsing</button>
      </div>
    `;
    footer.style.display = 'none';
    document.getElementById('cart-continue-btn').addEventListener('click', () => {
      renderDrawer();
      closeDrawer();
    });
  }

  function openDrawer() {
    buildDrawer();
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawerBuilt) return;
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    buildDrawer();
    updateBadges();
    renderDrawer();

    document.querySelectorAll('.cart-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const mobileNav = document.getElementById('mobile-nav');
        const hamburger = document.getElementById('hamburger');
        if (mobileNav && mobileNav.contains(btn)) {
          mobileNav.classList.remove('open');
          hamburger?.classList.remove('open');
        }
        openDrawer();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return { addItem, removeItem, changeQty, clear, count, subtotal, total, updateBadges, open: openDrawer, close: closeDrawer };
})();

window.Cart = Cart;
