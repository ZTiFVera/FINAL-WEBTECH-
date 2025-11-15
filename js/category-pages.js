 // category-pages.js - product rendering updated so product-card hearts navigate to wishlist page
function loadCategory(category, pageName) {
    let filtered = [];
    if (category === 'all') filtered = [...products];
    else if (category === 'sale') filtered = products.filter(p => p.oldPrice > 0);
    else if (category === 'new') filtered = products.filter(p => p.badge === 'NEW');
    else filtered = products.filter(p => p.category === category);
    currentProducts = filtered;
    renderCategoryProducts();
    updateActiveFilterBtn(category);
}

function sortByPrice(direction) {
    if (direction === 'low') currentProducts.sort((a,b) => a.price - b.price);
    else currentProducts.sort((a,b) => b.price - a.price);
    renderCategoryProducts();
}

function sortByRating() {
    currentProducts.sort((a,b) => b.rating - a.rating);
    renderCategoryProducts();
}

function renderCategoryProducts() {
    const productGrid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    if (!productGrid) return;
    if (currentProducts.length === 0) {
        productGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    if (noResults) noResults.style.display = 'none';

    productGrid.innerHTML = currentProducts.map(product => {
        // hearts navigate to wishlist page (ui-interactions intercepts clicks)
        return `
        <div class="product-card" data-product-id="${product.id}" onclick="navigateToProduct(${product.id})">
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
        </div>`;
    }).join('');
    updateWishlistButtons();
}

function updateActiveFilterBtn(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category) || (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(category))) btn.classList.add('active');
    });
}