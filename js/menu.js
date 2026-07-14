/* ====================================
   menu.js – Dynamic menu filter & interactions
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenuFilter();
  initMenuSearch();
  initAddToOrder();
  initMenuModal();
});

const menuData = {
  burgers: [
    { id: 'b1', name: 'The HiFi Classic', desc: 'Double smash patty, American cheese, caramelized onions, secret sauce, brioche bun', price: 12.99, badge: 'pop', badgeText: '🔥 Popular', calories: 650, image: 'assets/burger.webp' },
    { id: 'b2', name: 'Spicy Crispy Chick', desc: 'Crispy fried chicken, jalapeños, ghost pepper aioli, slaw, pickles, potato bun', price: 13.49, badge: 'hot', badgeText: '🌶 Hot', calories: 720, image: 'assets/burger.webp' },
    { id: 'b3', name: 'Mushroom Swiss Melt', desc: 'Beef patty, sautéed mushrooms, Swiss cheese, garlic mayo, pretzel bun', price: 11.99, badge: '', badgeText: '', calories: 580, image: 'assets/burger.webp' },
    { id: 'b4', name: 'BBQ Bacon Stack', desc: 'Triple patty, smoked bacon, BBQ sauce, cheddar, crispy onions, sesame bun', price: 15.99, badge: 'new', badgeText: '✨ New', calories: 890, image: 'assets/burger.webp' },
  ],
  wraps: [
    { id: 'w1', name: 'Avocado Chicken Wrap', desc: 'Grilled chicken, avocado, romaine, cherry tomatoes, chipotle ranch, flour tortilla', price: 11.49, badge: 'pop', badgeText: '🔥 Popular', calories: 490, image: 'assets/wrap.webp' },
    { id: 'w2', name: 'Falafel Veg Wrap', desc: 'Crispy falafel, hummus, roasted red pepper, cucumber, tzatziki, whole wheat tortilla', price: 10.99, badge: 'veg', badgeText: '🌿 Veg', calories: 420, image: 'assets/wrap.webp' },
    { id: 'w3', name: 'Steak Teriyaki Wrap', desc: 'Grilled steak strips, teriyaki glaze, pineapple slaw, scallions, sesame seeds', price: 13.99, badge: '', badgeText: '', calories: 560, image: 'assets/wrap.webp' },
    { id: 'w4', name: 'Caesar Club Wrap', desc: 'Rotisserie chicken, bacon, parmesan, romaine, classic Caesar dressing, crouton crumbs', price: 11.99, badge: '', badgeText: '', calories: 510, image: 'assets/wrap.webp' },
  ],
  bowls: [
    { id: 'bo1', name: 'HiFi Poke Bowl', desc: 'Salmon, avocado, mango, edamame, cucumber, pickled ginger, sesame soy, sushi rice', price: 14.49, badge: 'new', badgeText: '✨ New', calories: 580, image: 'assets/bowl.webp' },
    { id: 'bo2', name: 'Mediterranean Bowl', desc: 'Quinoa, falafel, roasted veggies, feta, kalamata olives, lemon tahini dressing', price: 12.99, badge: 'veg', badgeText: '🌿 Veg', calories: 480, image: 'assets/bowl.webp' },
    { id: 'bo3', name: 'BBQ Pulled Pork Bowl', desc: 'Smoked pulled pork, jalapeño corn salsa, pickled onion, cilantro lime rice, BBQ drizzle', price: 13.99, badge: 'pop', badgeText: '🔥 Popular', calories: 620, image: 'assets/bowl.webp' },
    { id: 'bo4', name: 'Teriyaki Salmon Bowl', desc: 'Pan-seared salmon, teriyaki glaze, edamame, broccoli, jasmine rice, sesame seeds', price: 15.49, badge: '', badgeText: '', calories: 540, image: 'assets/bowl.webp' },
  ],
  drinks: [
    { id: 'd1', name: 'Classic Choc Shake', desc: 'Rich Belgian chocolate, premium ice cream, whipped cream, chocolate shavings', price: 6.99, badge: 'pop', badgeText: '🔥 Popular', calories: 480, image: 'assets/milkshake.webp' },
    { id: 'd2', name: 'Berry Blast Shake', desc: 'Strawberry, blueberry, raspberry swirl, vanilla ice cream, fresh berry topping', price: 6.99, badge: '', badgeText: '', calories: 420, image: 'assets/milkshake.webp' },
    { id: 'd3', name: 'HiFi Lemonade', desc: 'Freshly squeezed lemon, mint, sparkling water, cane sugar, a slice of citrus', price: 3.99, badge: 'new', badgeText: '✨ New', calories: 180, image: 'assets/milkshake.webp' },
    { id: 'd4', name: 'Mango Lassi', desc: 'Ripe Alphonso mango, yogurt, cardamom, rose water, pistachios', price: 4.99, badge: 'veg', badgeText: '🌿 Veg', calories: 240, image: 'assets/milkshake.webp' },
  ],
  sides: [
    { id: 's1', name: 'HiFi Signature Fries', desc: 'Hand-cut, double-fried, tossed in our secret spice blend, served with aioli', price: 4.99, badge: 'pop', badgeText: '🔥 Popular', calories: 380, image: 'assets/hero_food_spread.webp' },
    { id: 's2', name: 'Loaded Cheese Fries', desc: 'Crispy fries, cheddar cheese sauce, bacon bits, jalapeños, sour cream', price: 6.99, badge: 'hot', badgeText: '🌶 Hot', calories: 560, image: 'assets/hero_food_spread.webp' },
    { id: 's3', name: 'Onion Rings', desc: 'Beer-battered thick-cut onion rings, served with smoky chipotle dip', price: 5.49, badge: '', badgeText: '', calories: 420, image: 'assets/hero_food_spread.webp' },
    { id: 's4', name: 'Garden Side Salad', desc: 'Mixed greens, cherry tomatoes, cucumber, red onion, choice of dressing', price: 4.49, badge: 'veg', badgeText: '🌿 Veg', calories: 120, image: 'assets/hero_food_spread.webp' },
  ],
};

// ── Menu Filter ───────────────────────
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuGrid = document.getElementById('menu-grid');

  if (!menuGrid) return;

  // Render all items initially
  renderMenuItems('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      renderMenuItems(category);
    });
  });
}

function renderMenuItems(category) {
  const menuGrid = document.getElementById('menu-grid');
  if (!menuGrid) return;

  let items = [];
  if (category === 'all') {
    Object.values(menuData).forEach(arr => items.push(...arr));
  } else {
    items = menuData[category] || [];
  }

  // Animate out
  menuGrid.style.opacity = '0';
  menuGrid.style.transform = 'translateY(10px)';

  setTimeout(() => {
    menuGrid.innerHTML = items.map(item => createMenuCard(item)).join('');

    // Re-attach event listeners
    menuGrid.querySelectorAll('.menu-card-add').forEach(btn => {
      btn.addEventListener('click', handleAddToOrder);
    });
    menuGrid.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-card-add')) {
          openMenuModal(card.dataset.id, category === 'all' ? findCategory(card.dataset.id) : category);
        }
      });
    });

    // Keep the active search query applied across category switches
    applySearchFilter();

    menuGrid.style.opacity = '1';
    menuGrid.style.transform = 'translateY(0)';
  }, 200);
}

function findCategory(id) {
  return Object.keys(menuData).find(cat => menuData[cat].find(item => item.id === id)) || 'burgers';
}

function createMenuCard(item) {
  const badgeHtml = item.badge
    ? `<span class="badge badge-${item.badge} menu-card-badge">${item.badgeText}</span>` : '';

  return `
    <div class="menu-card card img-zoom" data-id="${item.id}" role="button" tabindex="0" aria-label="View ${item.name}">
      <div class="menu-card-img" style="background-image: url('${item.image}')">
        ${badgeHtml}
        <div class="menu-card-overlay">
          <span class="menu-card-view">View Details</span>
        </div>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <div class="menu-card-info">
            <span class="menu-card-price">$${item.price.toFixed(2)}</span>
            <span class="menu-card-cal">${item.calories} cal</span>
          </div>
          <button class="menu-card-add btn-icon-add" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" aria-label="Add ${item.name} to order">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Search ─────────────────────────────
function applySearchFilter() {
  const searchInput = document.getElementById('menu-search');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  document.querySelectorAll('.menu-card').forEach(card => {
    const name = card.querySelector('.menu-card-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.menu-card-desc')?.textContent.toLowerCase() || '';
    card.style.display = (name.includes(query) || desc.includes(query)) ? '' : 'none';
  });
}

function initMenuSearch() {
  const searchInput = document.getElementById('menu-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', applySearchFilter);
}

// ── Add to Order ──────────────────────
function initAddToOrder() {
  document.querySelectorAll('.menu-card-add').forEach(btn => {
    btn.addEventListener('click', handleAddToOrder);
  });
}

function handleAddToOrder(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const { id, name, price } = btn.dataset;

  // Bounce animation
  btn.style.transform = 'scale(1.4) rotate(90deg)';
  setTimeout(() => { btn.style.transform = ''; }, 300);

  // Show toast
  showToast(`🎉 ${name} added to order!`);

  // Persist to shared cart (syncs badge + drawer across every page)
  window.Cart.addItem({ id, name, price });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 5rem; left: 50%; transform: translateX(-50%) translateY(80px);
      background: #1E1E35; border: 1px solid #2E2E50; color: #fff;
      font-family: 'Inter', sans-serif; font-size: 0.9rem; padding: 12px 24px;
      border-radius: 999px; z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
  }, 3000);
}

// ── Menu Modal ────────────────────────
function initMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeMenuModal();
  });

  document.getElementById('modal-close')?.addEventListener('click', closeMenuModal);
  document.getElementById('modal-add-btn')?.addEventListener('click', () => {
    const id = modal.dataset.itemId;
    const name = document.querySelector('.modal-item-name')?.textContent;
    const price = parseFloat(document.querySelector('.modal-price')?.textContent.replace('$',''));
    if (name) {
      showToast(`🎉 ${name} added to order!`);
      window.Cart.addItem({ id, name, price });
    }
    closeMenuModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenuModal();
  });
}

function openMenuModal(id, category) {
  const item = Object.values(menuData).flat().find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('menu-modal');
  if (!modal) return;

  modal.dataset.itemId = item.id;
  modal.querySelector('.modal-item-img').style.backgroundImage = `url('${item.image}')`;
  modal.querySelector('.modal-item-name').textContent = item.name;
  modal.querySelector('.modal-item-desc').textContent = item.desc;
  modal.querySelector('.modal-price').textContent = `$${item.price.toFixed(2)}`;
  modal.querySelector('.modal-calories').textContent = `${item.calories} cal`;

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));
}

function closeMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}
