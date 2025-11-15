// Recently Viewed Products System
let recentlyViewedProducts = [];
const MAX_RECENTLY_VIEWED = 8;

// Initialize recently viewed from localStorage
function initRecentlyViewed() {
    const saved = localStorage.getItem('nestarGazeRecentlyViewed');
    if (saved) {
        try {
            recentlyViewedProducts = JSON.parse(saved);
        } catch (e) {
            recentlyViewedProducts = [];
        }
    }
}

// Save recently viewed to localStorage
function saveRecentlyViewed() {
    localStorage.setItem('nestarGazeRecentlyViewed', JSON.stringify(recentlyViewedProducts));
}

// Add product to recently viewed
function addToRecentlyViewed(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Remove if already exists (to move to front)
    recentlyViewedProducts = recentlyViewedProducts.filter(p => p.id !== productId);
    
    // Add to beginning
    recentlyViewedProducts.unshift(product);
    
    // Keep only MAX_RECENTLY_VIEWED items
    if (recentlyViewedProducts.length > MAX_RECENTLY_VIEWED) {
        recentlyViewedProducts = recentlyViewedProducts.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    saveRecentlyViewed();
}

// Render recently viewed section
function renderRecentlyViewed(containerId = 'recentlyViewedGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (recentlyViewedProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-gray);">
                <p>No recently viewed items</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentlyViewedProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" 
                        onclick="toggleWishlist(${product.id}); event.stopPropagation();" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="product-quick-view" onclick="quickView(${product.id}); event.stopPropagation();">
                    Quick View
                </button>
                <img src="${product.img}" alt="${product.name}" 
                     onerror="this.style.backgroundColor='#f0f0f0'"
                     onclick="openProductDetail(${product.id})">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    ₱${product.price.toLocaleString()}
                    ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-rating">
                    <i class="fas fa-star"></i> ${product.rating} 
                    <span style="color: var(--text-gray);">(${product.reviews})</span>
                </div>
                <button class="product-quick-add" onclick="addToCart(${product.id}); event.stopPropagation();">
                    Quick Add
                </button>
            </div>
        </div>
    `).join('');
    
    updateWishlistButtons();
}

// Clear recently viewed
function clearRecentlyViewed() {
    if (recentlyViewedProducts.length === 0) return;
    
    if (confirm('Clear your recently viewed history?')) {
        recentlyViewedProducts = [];
        saveRecentlyViewed();
        renderRecentlyViewed();
        showNotification('Recently viewed cleared', 'success');
    }
}

// Get related products based on recently viewed
function getRelatedFromRecentlyViewed(currentProductId, limit = 4) {
    return recentlyViewedProducts
        .filter(p => p.id !== currentProductId)
        .slice(0, limit);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initRecentlyViewed();
    
    // Render if container exists
    if (document.getElementById('recentlyViewedGrid')) {
        renderRecentlyViewed();
    }
});