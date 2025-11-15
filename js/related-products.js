// Related Products Recommendation System

// Get related products by category
function getRelatedProducts(productId, limit = 4) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    // Find products in same category, excluding current product
    let related = products.filter(p => 
        p.category === product.category && 
        p.id !== productId
    );
    
    // If not enough in same category, add from other categories
    if (related.length < limit) {
        const others = products.filter(p => 
            p.category !== product.category && 
            p.id !== productId
        );
        related = [...related, ...others];
    }
    
    // Shuffle and limit
    return shuffleArray(related).slice(0, limit);
}

// Get products you may also like (based on price range)
function getYouMayLike(productId, limit = 4) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    const priceRange = product.price * 0.3; // 30% price range
    
    const similar = products.filter(p => {
        if (p.id === productId) return false;
        const priceDiff = Math.abs(p.price - product.price);
        return priceDiff <= priceRange;
    });
    
    return shuffleArray(similar).slice(0, limit);
}

// Get bestsellers
function getBestsellers(limit = 4) {
    return [...products]
        .filter(p => p.badge === 'BESTSELLER' || p.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Get trending products (high ratings + recent)
function getTrendingProducts(limit = 4) {
    return [...products]
        .filter(p => p.badge === 'HOT' || p.badge === 'NEW')
        .sort((a, b) => {
            // Prioritize by badge, then rating
            if (a.badge === 'HOT' && b.badge !== 'HOT') return -1;
            if (b.badge === 'HOT' && a.badge !== 'HOT') return 1;
            return b.rating - a.rating;
        })
        .slice(0, limit);
}

// Get complete the look (different categories)
function getCompleteTheLook(productId, limit = 3) {
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    // Get one from each different category
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

// Render related products section
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

// Render "You May Also Like" section
function renderYouMayLike(productId, containerId = 'youMayLikeGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const recommendations = getYouMayLike(productId, 4);
    
    if (recommendations.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.innerHTML = recommendations.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" 
                        onclick="toggleWishlist(${product.id}); event.stopPropagation();" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
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
                </div>
                <button class="product-quick-add" onclick="addToCart(${product.id}); event.stopPropagation();">
                    Quick Add
                </button>
            </div>
        </div>
    `).join('');
    
    updateWishlistButtons();
}

// Render bestsellers
function renderBestsellers(containerId = 'bestsellersGrid', limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const bestsellers = getBestsellers(limit);
    
    container.innerHTML = bestsellers.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                <span class="product-badge">BESTSELLER</span>
                <button class="product-wishlist-btn" data-product-id="${product.id}" 
                        onclick="toggleWishlist(${product.id}); event.stopPropagation();" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
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

// Render complete the look
function renderCompleteTheLook(productId, containerId = 'completeTheLookGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = getCompleteTheLook(productId, 3);
    
    if (items.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.innerHTML = items.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" 
                        onclick="toggleWishlist(${product.id}); event.stopPropagation();" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
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
                </div>
                <button class="product-quick-add" onclick="addToCart(${product.id}); event.stopPropagation();">
                    Quick Add
                </button>
            </div>
        </div>
    `).join('');
    
    updateWishlistButtons();
}

// Utility: Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}