 // ============================================
// wishlist.js - FIXED VERSION - Persistent Wishlist
// Load after: products.js, notifications.js, cart.js
// ============================================

(function () {
  window.wishlistItems = [];

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function getCorrectImagePath(imgPath) {
    if (!imgPath) return 'images/placeholder.jpg';
    
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    let cleanPath = imgPath.replace(/^\.\.\//, '').replace(/^images\//, '');
    
    if (isInPagesFolder) {
      return `../images/${cleanPath}`;
    } else {
      return `images/${cleanPath}`;
    }
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ============================================
  // WISHLIST MANAGEMENT
  // ============================================

  window.initWishlist = function() {
    const saved = localStorage.getItem('nestarGazeWishlist');
    try {
      window.wishlistItems = saved ? JSON.parse(saved) : [];
      console.log('✅ Wishlist initialized:', window.wishlistItems.length, 'items');
    } catch (e) {
      console.error('Failed to parse wishlist:', e);
      window.wishlistItems = [];
    }
    
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
    
    // Update all wishlist button states after init
    setTimeout(() => {
      if (typeof window.updateWishlistButtons === 'function') {
        window.updateWishlistButtons();
      }
    }, 100);
  };

  window.saveWishlist = function() {
    localStorage.setItem('nestarGazeWishlist', JSON.stringify(window.wishlistItems || []));
    console.log('💾 Wishlist saved:', window.wishlistItems.length, 'items');
  };

  window.toggleWishlist = function(productId) {
    const id = Number(productId);
    if (Number.isNaN(id)) {
      console.error('Invalid product ID:', productId);
      return;
    }
    
    if (!window.products) {
      console.error('Products array not found');
      return;
    }
    
    const idx = (window.wishlistItems || []).findIndex(i => i.id === id);
    
    if (idx >= 0) {
      // Remove from wishlist
      const item = window.wishlistItems[idx];
      window.wishlistItems.splice(idx, 1);
      showNotification(`Removed "${item.name}" from wishlist`, 'success');
      console.log('❌ Removed from wishlist:', item.name);
    } else {
      // Add to wishlist
      const product = window.products.find(p => p.id === id);
      if (product) {
        window.wishlistItems.push({
          ...product,
          img: product.img || product.image
        });
        showNotification(`"${product.name}" added to wishlist`, 'success');
        console.log('✅ Added to wishlist:', product.name);
      } else {
        showNotification('Product not found', 'error');
        console.error('Product not found:', id);
        return;
      }
    }
    
    window.saveWishlist();
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
    
    // Update all wishlist buttons
    if (typeof window.updateWishlistButtons === 'function') {
      window.updateWishlistButtons();
    }
  };

  window.removeFromWishlist = function(productId) {
    const id = Number(productId);
    if (Number.isNaN(id)) return;
    
    const item = window.wishlistItems.find(i => i.id === id);
    window.wishlistItems = (window.wishlistItems || []).filter(i => i.id !== id);
    window.saveWishlist();
    window.updateWishlistCount();
    window.renderSidebarWishlist();
    window.renderWishlistPage();
    
    if (typeof window.updateWishlistButtons === 'function') {
      window.updateWishlistButtons();
    }
    
    if (item) {
      showNotification(`Removed "${item.name}" from wishlist`, 'success');
    }
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
      showNotification(`Added "${p.name}" to bag`, 'success');
    } else {
      showNotification('Add to cart not available', 'error');
    }
  };

  // ============================================
  // UI RENDERING
  // ============================================

  window.updateWishlistCount = function() {
    const badge = document.getElementById('wishlistCount');
    if (!badge) return;
    
    const count = (window.wishlistItems || []).length;
    
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
      badge.style.width = '18px';
      badge.style.height = '18px';
      badge.style.fontSize = '10px';
      badge.style.lineHeight = '18px';
      badge.style.padding = '0';
      badge.style.borderRadius = '50%';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.position = 'absolute';
      badge.style.top = '-6px';
      badge.style.right = '-6px';
    } else {
      badge.style.display = 'none';
    }
  };

  window.renderSidebarWishlist = function() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    
    if (!window.wishlistItems || window.wishlistItems.length === 0) {
      container.innerHTML = `
        <div class="empty-wishlist" style="text-align: center; padding: 40px 20px; color: var(--text-gray);">
          <i class="far fa-heart" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
          <p>Your wishlist is empty</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = window.wishlistItems.map(item => {
      const imgPath = getCorrectImagePath(item.img || item.image);
      
      return `
        <div class="wishlist-item" style="display: flex; gap: 16px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-gray);">
          <img src="${imgPath}" 
               alt="${escapeHtml(item.name)}" 
               class="wishlist-item-img"
               style="width: 80px; height: 100px; object-fit: cover; border-radius: 6px; background: var(--light-gray);"
               onerror="this.src='${getCorrectImagePath('placeholder.jpg')}'; this.style.backgroundColor='#f0f0f0'">
          
          <div class="wishlist-item-info" style="flex: 1;">
            <div class="wishlist-item-name" style="font-weight: 700; font-size: 14px; margin-bottom: 6px; line-height: 1.3;">
              ${escapeHtml(item.name)}
            </div>
            <div class="wishlist-item-price" style="font-weight: 600; margin-bottom: 12px;">
              ₱${item.price.toLocaleString()}
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn-add-to-cart" 
                      onclick="addToCartFromWishlist(${item.id})"
                      style="padding: 8px 16px; background: var(--primary-dark); color: #fff; border: none; font-size: 12px; font-weight: 700; cursor: pointer; border-radius: 4px; text-transform: uppercase;">
                Add to Cart
              </button>
              <button class="btn-remove" 
                      onclick="removeFromWishlist(${item.id})"
                      style="padding: 8px 16px; background: none; border: 1px solid var(--border-gray); font-size: 12px; font-weight: 600; cursor: pointer; border-radius: 4px; color: #b33;">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
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
    
    grid.innerHTML = window.wishlistItems.map(item => {
      const imgPath = getCorrectImagePath(item.img || item.image);
      
      return `
        <article class="wish-product-card product-card" data-product-id="${item.id}">
          <div class="product-img-wrapper">
            <button class="product-wishlist-btn active" 
                    data-product-id="${item.id}" 
                    title="Remove from wishlist" 
                    aria-label="Remove from wishlist"
                    style="opacity: 1 !important;">
              <i class="fas fa-heart"></i>
            </button>
            <img src="${imgPath}" 
                 alt="${escapeHtml(item.name)}"
                 onerror="this.src='${getCorrectImagePath('placeholder.jpg')}'; this.style.backgroundColor='#f0f0f0'">
          </div>
          <div class="product-info">
            <div class="product-brand">${escapeHtml(item.brand || 'NESTAR GAZE')}</div>
            <div class="product-name">${escapeHtml(item.name)}</div>
            <div class="product-price">
              ₱${item.price.toLocaleString()}
              ${item.oldPrice ? `<span class="old-price">₱${item.oldPrice.toLocaleString()}</span>` : ''}
            </div>
            <div style="margin-top: 12px; display: flex; gap: 12px; align-items: center;">
              <button class="product-quick-add" onclick="addToCartFromWishlist(${item.id});">
                Add to Bag
              </button>
              <button style="background: none; border: none; text-decoration: underline; color: #666; cursor: pointer; font-size: 13px;" 
                      onclick="removeFromWishlist(${item.id})">
                Remove
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  };

  window.openWishlist = function() {
    if (typeof window.goToPagesPage === 'function') {
      const page = window.location.pathname.includes('/pages/') ? 'wishlist.html' : 'pages/wishlist.html';
      window.goToPagesPage(page);
    } else {
      window.location.href = window.location.pathname.includes('/pages/') ? 'wishlist.html' : 'pages/wishlist.html';
    }
  };

  // ============================================
  // EVENT HANDLERS - FIXED WITH PROPER DELEGATION
  // ============================================

  let wishlistHandlerAttached = false;

  function handleWishlistClick(e) {
    const btn = e.target.closest('.product-wishlist-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      let pid = btn.getAttribute('data-product-id') || btn.dataset.productId;
      if (!pid) {
        const parent = btn.closest('[data-product-id]');
        if (parent) pid = parent.getAttribute('data-product-id');
      }
      
      if (pid) {
        window.toggleWishlist(parseInt(pid, 10));
      }
      
      return false;
    }
  }

  // Attach event listener ONLY ONCE
  if (!wishlistHandlerAttached) {
    document.addEventListener('click', handleWishlistClick, true);
    wishlistHandlerAttached = true;
    console.log('✅ Wishlist click handler attached');
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initWishlist);
  } else {
    window.initWishlist();
  }

  console.log('✅ Wishlist system loaded');
})();