 // main.js - Homepage rendering with fixed heart click handling
function renderHomepageProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const homepageProducts = products.slice(0, 4);
    productGrid.innerHTML = homepageProducts.map(product => {
        return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <img src="${product.img}" alt="${product.name}" onerror="this.style.backgroundColor='#f0f0f0'" onclick="openProductDetail(${product.id})">
            </div>
            <div class="product-info" onclick="openProductDetail(${product.id})">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₱${product.price.toLocaleString()} ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}</div>
                <div style="font-size:12px;color:#999;margin-top:5px;"><i class="fas fa-star" style="color:#ffc107;"></i> ${product.rating} (${product.reviews} reviews)</div>
                <button class="product-quick-add" onclick="event.stopPropagation(); addToCart(${product.id});">Quick Add</button>
            </div>
        </div>
        `;
    }).join('');
    
    // Update wishlist button states
    if (typeof updateWishlistButtons === 'function') {
        updateWishlistButtons();
    }
}

function navigateToProduct(productId) {
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const path = isInPagesFolder ? `product-detail.html?id=${productId}` : `pages/product-detail.html?id=${productId}`;
    window.location.href = path;
}

function closePromo() {
    const promo = document.querySelector('.promo-bar');
    if (promo) promo.style.display = 'none';
}

function closeAllSidebars() {
    const cart = document.getElementById('cartSidebar');
    const wishlist = document.getElementById('wishlistSidebar');
    const backdrop = document.getElementById('backdrop');
    
    if (cart) cart.classList.remove('active');
    if (wishlist) wishlist.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    
    document.body.style.overflow = '';
}

function subscribeNewsletter() {
    const input = document.getElementById('emailInput');
    const email = input?.value.trim();
    
    if (email && email.includes('@')) {
        if (typeof showNotification === 'function') {
            showNotification('Thanks for subscribing!', 'success');
        } else {
            alert('Thanks for subscribing!');
        }
        if (input) input.value = '';
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a valid email', 'error');
        } else {
            alert('Please enter a valid email');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderHomepageProducts();
    
    // Close search dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchDropdown && !event.target.closest('.search-bar-custom')) {
            searchDropdown.style.display = 'none';
        }
    });
    
    // Close sidebars on Escape key
    document.addEventListener('keydown', function(event) { 
        if (event.key === 'Escape') closeAllSidebars(); 
    });
});

console.log('✅ Main.js loaded');