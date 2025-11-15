  // Product Detail Page Handler
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

// Get product ID from URL
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Load product details
function loadProductDetails() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        window.location.href = '../index.html';
        return;
    }

    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        window.location.href = '../index.html';
        return;
    }

    // Update page title
    document.title = `${currentProduct.name} - NESTAR GAZE`;

    // Update breadcrumb
    updateBreadcrumb();

    // Populate product info
    populateProductInfo();

    // Load related products
    loadRelatedProducts();

    // Track recently viewed
    addToRecentlyViewed(productId);

    // Update wishlist button state
    updateWishlistButtonState();
}

// Update breadcrumb
function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    const categoryName = currentProduct.category.charAt(0).toUpperCase() + currentProduct.category.slice(1);
    
    breadcrumb.innerHTML = `
        <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
        <li class="breadcrumb-item"><a href="${currentProduct.category}.html">${categoryName}</a></li>
        <li class="breadcrumb-item active">${currentProduct.name}</li>
    `;
}

// Populate product information
function populateProductInfo() {
    // Brand and title
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productTitle').textContent = currentProduct.name;

    // Price
    document.getElementById('currentPrice').textContent = `₱${currentProduct.price.toLocaleString()}.00`;
    
    if (currentProduct.oldPrice > 0) {  
        document.getElementById('oldPrice').textContent = `₱${currentProduct.oldPrice.toLocaleString()}.00`;
        document.getElementById('oldPrice').style.display = 'block';

        const discount = Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100);
        document.getElementById('discountBadge').textContent = `-${discount}%`;
        document.getElementById('discountBadge').style.display = 'block';
    }

    // Rating
    const stars = '★'.repeat(Math.floor(currentProduct.rating)) + '☆'.repeat(5 - Math.floor(currentProduct.rating));  
    document.getElementById('ratingSection').innerHTML = `
        <div class="stars">${stars}</div>
        <span class="rating-count">(${currentProduct.reviews} reviews)</span>
    `;

    // Trending badge
    if (currentProduct.badge === 'HOT' || currentProduct.badge === 'NEW') {
        const views = Math.floor(Math.random() * 200) + 100;
        document.getElementById('trendingViews').textContent = views;
        document.getElementById('trendingBadge').style.display = 'flex';
    }

    // Images
    populateImages();

    // Colors
    populateColors();

    // Sizes
    populateSizes();

    // Description
    document.getElementById('productDescription').textContent = currentProduct.description || 'Premium quality streetwear designed for comfort and style.';

    // Features
    if (currentProduct.features && currentProduct.features.length > 0) {
        const featuresHTML = currentProduct.features.map(f => `<li>${f}</li>`).join('');
        document.getElementById('productFeatures').innerHTML = featuresHTML;
    }
}

// Populate images
function populateImages() {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = currentProduct.img;
    mainImage.alt = currentProduct.name;

    // Create 4 thumbnails (same image for demo)
    const thumbnailsContainer = document.getElementById('thumbnailImages');
    thumbnailsContainer.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail-image ${i === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${currentProduct.img}" alt="${currentProduct.name}">`;
        thumb.onclick = () => selectThumbnail(thumb, i);
        thumbnailsContainer.appendChild(thumb);
    }
}

function selectThumbnail(element, index) {
    document.querySelectorAll('.thumbnail-image').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('mainImage').src = currentProduct.img;
}

// Populate colors
function populateColors() {
    const colors = currentProduct.colors || ['Black', 'White', 'Gray'];
    const colorOptions = document.getElementById('colorOptions');
    
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Gray': '#808080',
        'Navy': '#001f3f',
        'Red': '#FF4136',
        'Olive': '#3D9970',
        'Cream': '#F5E6D3',
        'Burgundy': '#85144b',
        'Charcoal': '#3a3a3a',
        'Tan': '#D2B48C',
        'Khaki': '#C3B091',
        'Dark Blue': '#0074D9',
        'Light Blue': '#7FDBFF',
        'Beige': '#F5F5DC',
        'Light Wash': '#A8B8C8',
        'Dark Wash': '#2C3E50'
    };

    colorOptions.innerHTML = colors.map((color, index) => {
        const hexColor = colorMap[color] || '#000000';
        const borderStyle = color === 'White' ? 'border: 2px solid #e0e0e0;' : '';
        return `
            <div class="color-option ${index === 0 ? 'active' : ''}" 
                 style="background: ${hexColor}; ${borderStyle}" 
                 onclick="selectColor('${color}', this)"
                 title="${color}"></div>
        `;
    }).join('');

    selectedColor = colors[0];
    document.getElementById('selectedColorName').textContent = selectedColor;
}

function selectColor(color, element) {
    selectedColor = color;
    document.getElementById('selectedColorName').textContent = color;
    
    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
}

// Populate sizes
function populateSizes() {
    const sizes = currentProduct.sizes || ['S', 'M', 'L', 'XL'];
    const sizeOptions = document.getElementById('sizeOptions');
    
    sizeOptions.innerHTML = sizes.map(size => {
        const unavailable = Math.random() > 0.8; // 20% chance unavailable
        return `
            <div class="size-option ${unavailable ? 'unavailable' : ''}" 
                 onclick="selectSize('${size}', this, ${unavailable})">${size}</div>
        `;
    }).join('');
}

function selectSize(size, element, unavailable) {
    if (unavailable) {
        document.getElementById('sizeUnavailableMsg').style.display = 'block';
        return;
    }

    selectedSize = size;
    document.getElementById('selectedSizeName').textContent = size;
    document.getElementById('sizeUnavailableMsg').style.display = 'none';
    
    document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
    element.classList.add('active');
}

// Change quantity
function changeQuantity(change) {
    quantity = Math.max(1, Math.min(10, quantity + change));
    document.getElementById('quantityInput').value = quantity;
}

// Add to bag from page
function addToBagFromPage() {
    if (!selectedSize) {
        showNotification('Please select a size', 'error');
        return;
    }

    addToCart(currentProduct.id, quantity, selectedSize, selectedColor);
    showNotification(`Added ${quantity}x ${currentProduct.name} to bag!`, 'success');
}

// Toggle wishlist from page
function toggleWishlistFromPage() {
    toggleWishlist(currentProduct.id);
    updateWishlistButtonState();
}

function updateWishlistButtonState() {
    const btn = document.getElementById('wishlistFloatingBtn');
    const isInWishlist = wishlistItems.some(item => item.id === currentProduct.id);
    
    if (isInWishlist) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// Accordion toggle
function toggleAccordion(button) {
    const item = button.parentElement;
    const content = item.querySelector('.accordion-content-detail');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.accordion-item-detail').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-content-detail').style.display = 'none';
    });

    // Open clicked if it was closed
    if (!isActive) {
        item.classList.add('active');
        content.style.display = 'block';
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('relatedProducts');
    
    // Get 4 random products from same category
    let related = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
    
    if (related.length < 4) {
        const others = products.filter(p => p.category !== currentProduct.category && p.id !== currentProduct.id);
        related = [...related, ...others];
    }
    
    // Shuffle and take 4
    related = related.sort(() => Math.random() - 0.5).slice(0, 4);
    
    relatedContainer.innerHTML = related.map(product => `
        <div class="product-card" onclick="navigateToProduct(${product.id})">
            <div class="product-img-wrapper">
                ${product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn" data-product-id="${product.id}" 
                        onclick="event.stopPropagation(); toggleWishlist(${product.id}); updateWishlistButtons();" 
                        title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    ₱${product.price.toLocaleString()}
                    ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}
                </div>
                <button class="product-quick-add" onclick="event.stopPropagation(); addToCart(${product.id});">Quick Add</button>
            </div>
        </div>
    `).join('');
    
    updateWishlistButtons();
}

// Navigate to product
function navigateToProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllSidebars();
        }
    });
});