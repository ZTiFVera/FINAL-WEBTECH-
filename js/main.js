 // ✅ FIXED: Now navigates to product-detail.html page instead of modal
function renderHomepageProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const homepageProducts = products.slice(0, 4);
    
    productGrid.innerHTML = homepageProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}" onclick="navigateToProduct(${product.id})">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" onclick="event.stopPropagation(); toggleWishlist(${product.id}); updateWishlistButtons();" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <img src="${product.img}" alt="${product.name}" onerror="this.style.backgroundColor='#f0f0f0'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    ₱${product.price.toLocaleString()}
                    ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}
                </div>
                <div style="font-size: 12px; color: #999; margin-top: 5px;">
                    <i class="fas fa-star" style="color: #ffc107;"></i> ${product.rating} (${product.reviews} reviews)
                </div>
                <button class="product-quick-add" onclick="event.stopPropagation(); addToCart(${product.id});">Quick Add</button>
            </div>
        </div>
    `).join('');
    
    updateWishlistButtons();
}

// Navigate to product detail page
function navigateToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function closePromo() {
    const promoBar = document.querySelector('.promo-bar');
    if (promoBar) {
        promoBar.style.display = 'none';
    }
}

function closeAllSidebars() {
    const cartSidebar = document.getElementById('cartSidebar');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const backdrop = document.getElementById('backdrop');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (wishlistSidebar) wishlistSidebar.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('emailInput');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    if (email && email.includes('@')) {
        showNotification(`Thanks for subscribing! Check ${email} for updates.`, 'success');
        emailInput.value = '';
    } else {
        showNotification('Please enter a valid email', 'error');
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllSidebars();
        }
    });
});