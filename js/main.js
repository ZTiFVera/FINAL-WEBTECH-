 // main.js - homepage rendering updated so product hearts navigate to wishlist page (not toggle)
function renderHomepageProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    const homepageProducts = products.slice(0, 4);
    productGrid.innerHTML = homepageProducts.map(product => {
        return `
        <div class="product-card" data-product-id="${product.id}" onclick="openProductDetail(${product.id})">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" title="Go to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <img src="${product.img}" alt="${product.name}" onerror="this.style.backgroundColor='#f0f0f0'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₱${product.price.toLocaleString()} ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}</div>
                <div style="font-size:12px;color:#999;margin-top:5px;"><i class="fas fa-star" style="color:#ffc107;"></i> ${product.rating} (${product.reviews} reviews)</div>
                <button class="product-quick-add" onclick="event.stopPropagation(); addToCart(${product.id});">Quick Add</button>
            </div>
        </div>
        `;
    }).join('');
    updateWishlistButtons();
}

function navigateToProduct(productId) {
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const path = isInPagesFolder ? `product-detail.html?id=${productId}` : `pages/product-detail.html?id=${productId}`;
    window.location.href = path;
}
document.addEventListener('DOMContentLoaded', function() {
    renderHomepageProducts();
    document.addEventListener('click', function(event) {
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchDropdown && !event.target.closest('.search-bar-custom')) searchDropdown.style.display = 'none';
    });
    document.addEventListener('keydown', function(event) { if (event.key === 'Escape') closeAllSidebars(); });
});