 // related-products.js - hearts navigate to wishlist page (ui-interactions intercepts)
function getRelatedProducts(productId, limit = 4) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    let related = products.filter(p => p.category === product.category && p.id !== productId);
    if (related.length < limit) {
        const others = products.filter(p => p.category !== product.category && p.id !== productId);
        related = [...related, ...others];
    }
    return shuffleArray(related).slice(0, limit);
}

function getYouMayLike(productId, limit = 4) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    const priceRange = product.price * 0.3;
    const similar = products.filter(p => {
        if (p.id === productId) return false;
        const priceDiff = Math.abs(p.price - product.price);
        return priceDiff <= priceRange;
    });
    return shuffleArray(similar).slice(0, limit);
}

function getBestsellers(limit = 4) {
    return [...products]
        .filter(p => p.badge === 'BESTSELLER' || p.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

function getTrendingProducts(limit = 4) {
    return [...products]
        .filter(p => p.badge === 'HOT' || p.badge === 'NEW')
        .sort((a, b) => {
            if (a.badge === 'HOT' && b.badge !== 'HOT') return -1;
            if (b.badge === 'HOT' && a.badge !== 'HOT') return 1;
            return b.rating - a.rating;
        })
        .slice(0, limit);
}

function getCompleteTheLook(productId, limit = 3) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    const categories = ['hoodies', 'tees', 'pants'];
    const differentCategories = categories.filter(cat => cat !== product.category);
    const recommendations = [];
    differentCategories.forEach(category => {
        const items = products.filter(p => p.category === category);
        if (items.length > 0) {
            recommendations.push(items[Math.floor(Math.random() * items.length)]);
        }
    });
    return recommendations.slice(0, limit);
}

function renderRelatedProducts(productId, containerId = 'relatedProductsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const related = getRelatedProducts(productId, 4);
    if (related.length === 0) {
        container.style.display = 'none';
        return;
    }
    container.innerHTML = related.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" title="Go to Wishlist"><i class="far fa-heart"></i></button>
                <button class="product-quick-view" onclick="quickView(${product.id}); event.stopPropagation();">Quick View</button>
                <img src="${product.img}" alt="${product.name}" onerror="this.style.backgroundColor='#f0f0f0'" onclick="openProductDetail(${product.id})">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₱${product.price.toLocaleString()} ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}</div>
                <div class="product-rating"><i class="fas fa-star"></i> ${product.rating} <span style="color: var(--text-gray);">(${product.reviews})</span></div>
                <button class="product-quick-add" onclick="addToCart(${product.id}); event.stopPropagation();">Quick Add</button>
            </div>
        </div>
    `).join('');
    updateWishlistButtons();
}