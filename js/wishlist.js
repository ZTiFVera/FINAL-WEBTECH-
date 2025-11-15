 // js/wishlist.js - delegated wishlist toggles (product hearts toggle wishlist), persistence in localStorage
(function () {
  window.wishlistItems = [];

  window.initWishlist = function() {
    const saved = localStorage.getItem('nestarGazeWishlist');
    try {
      window.wishlistItems = saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage', e);
      window.wishlistItems = [];
    }
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
  };

  window.saveWishlist = function() {
    localStorage.setItem('nestarGazeWishlist', JSON.stringify(window.wishlistItems || []));
  };

  window.toggleWishlist = function(productId) {
    const id = Number(productId);
    if (Number.isNaN(id)) return;
    if (!window.products) {
      console.error('products array not found; cannot toggle wishlist');
      return;
    }
    const idx = (window.wishlistItems || []).findIndex(i => i.id === id);
    if (idx >= 0) {
      window.wishlistItems.splice(idx, 1);
      showNotification('Removed from wishlist', 'success');
    } else {
      const product = window.products.find(p => p.id === id);
      if (product) {
        window.wishlistItems.push(product);
        showNotification(`"${product.name}" added to wishlist`, 'success');
      } else {
        showNotification('Product not found', 'error');
      }
    }
    window.saveWishlist();
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
  };

  window.removeFromWishlist = function(productId) {
    const id = Number(productId);
    if (Number.isNaN(id)) return;
    window.wishlistItems = (window.wishlistItems || []).filter(i => i.id !== id);
    window.saveWishlist();
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
    showNotification('Removed from wishlist', 'success');
  };

  window.addToCartFromWishlist = function(productId) {
    const id = Number(productId);
    if (Number.isNaN(id)) return;
    const p = (window.products || []).find(x => x.id === id);
    if (!p) {
      showNotification('Product not found', 'error');
      return;
    }
    const size = (p.sizes && p.sizes[0]) || 'M';
    const color = (p.colors && p.colors[0]) || 'Black';
    if (typeof addToCart === 'function') {
      addToCart(id, 1, size, color);
      showNotification('Added to bag', 'success');
    } else {
      showNotification('Add to cart not available', 'error');
    }
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
  };

  window.updateWishlistCount = function() {
    const badge = document.getElementById('wishlistCount');
    if (!badge) return;
    const count = (window.wishlistItems || []).length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
      badge.style.width = '16px';
      badge.style.height = '16px';
      badge.style.fontSize = '10px';
      badge.style.lineHeight = '16px';
      badge.style.padding = '0';
      badge.style.borderRadius = '50%';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.position = 'absolute';
    } else {
      badge.style.display = 'none';
    }
  };

  window.renderSidebarWishlist = function() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    if (!window.wishlistItems || window.wishlistItems.length === 0) {
      container.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
      return;
    }
    container.innerHTML = window.wishlistItems.map(item => `
      <div class="wishlist-item">
        <img src="${item.img || item.image}" alt="${escapeHtml(item.name)}" class="wishlist-item-img" onerror="this.style.backgroundColor='#f0f0f0'">
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${escapeHtml(item.name)}</div>
          <div class="wishlist-item-price">₱${item.price.toLocaleString()}</div>
          <div class="wishlist-item-actions">
            <button class="btn-add-to-cart" onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
            <button class="btn-remove" onclick="removeFromWishlist(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  window.renderWishlistPage = function() {
    const grid = document.getElementById('wishlistGrid');
    const emptyBox = document.getElementById('wishlistEmpty');
    if (!grid) return;
    if (!window.wishlistItems || window.wishlistItems.length === 0) {
      grid.style.display = 'none';
      if (emptyBox) emptyBox.style.display = 'block';
      return;
    }
    if (emptyBox) emptyBox.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = window.wishlistItems.map(item => `
      <article class="wish-product-card product-card" data-product-id="${item.id}">
        <div class="product-img-wrapper">
          <button class="product-wishlist-btn active" data-product-id="${item.id}" title="Remove from wishlist" aria-label="Remove from wishlist">
            <i class="fas fa-heart"></i>
          </button>
          <img src="${item.img || item.image}" alt="${escapeHtml(item.name)}" onerror="this.style.backgroundColor='#f0f0f0'">
        </div>
        <div class="product-info">
          <div class="product-brand">${escapeHtml(item.brand || 'NESTAR GAZE')}</div>
          <div class="product-name">${escapeHtml(item.name)}</div>
          <div class="product-price">₱${item.price.toLocaleString()}${item.oldPrice ? `<span class="old-price">₱${item.oldPrice.toLocaleString()}</span>` : ''}</div>
          <div style="margin-top:12px; display:flex; gap:12px; align-items:center;">
            <button class="product-quick-add" onclick="addToCartFromWishlist(${item.id});">Add to Bag</button>
            <button style="background:none;border:none;text-decoration:underline;color:#666;cursor:pointer;" onclick="removeFromWishlist(${item.id})">Remove</button>
          </div>
        </div>
      </article>
    `).join('');
  };

  window.openWishlist = function() {
    if (typeof window.goToPagesPage === 'function') {
      const page = window.location.pathname.includes('/pages/') ? 'wishlist.html' : 'pages/wishlist.html';
      window.goToPagesPage(page);
    } else {
      window.location.href = window.location.pathname.includes('/pages/') ? 'wishlist.html' : 'pages/wishlist.html';
    }
  };

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  // Delegated click for .product-wishlist-btn so hearts toggle wishlist everywhere
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.product-wishlist-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      let pid = btn.getAttribute('data-product-id') || btn.dataset.productId;
      if (!pid) {
        const parent = btn.closest('[data-product-id]');
        if (parent) pid = parent.getAttribute('data-product-id');
      }
      if (pid) {
        window.toggleWishlist(parseInt(pid, 10));
      } else {
        console.warn('product-wishlist-btn clicked but no data-product-id found');
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    window.initWishlist();
  });
})();