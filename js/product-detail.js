// Product Detail Modal System
let currentProductDetail = null;
let selectedSize = null;
let selectedColor = null;
let productQuantity = 1;
let currentImageIndex = 0;

// Product images database (multiple images per product)
const productImages = {
    1: [
        "https://images.unsplash.com/photo-1556821552-5d0d30e7e350?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1574886520019-57099dba0bcc?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop"
    ],
    2: [
        "https://images.unsplash.com/photo-1574886520019-57099dba0bcc?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1556821552-5d0d30e7e350?w=600&h=800&fit=crop"
    ]
    // Add more product images as needed
};

// Available sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Available colors
const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#001f3f' },
    { name: 'Red', hex: '#FF4136' }
];

// Open product detail modal
function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProductDetail = product;
    selectedSize = null;
    selectedColor = colors[0]; // Default first color
    productQuantity = 1;
    currentImageIndex = 0;
    
    // Track recently viewed
    addToRecentlyViewed(productId);
    
    renderProductModal();
    
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close product detail modal
function closeProductDetail() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    currentProductDetail = null;
    selectedSize = null;
    selectedColor = null;
    productQuantity = 1;
}

// Render product modal
function renderProductModal() {
    let modalContainer = document.getElementById('productModal');
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'productModal';
        modalContainer.className = 'product-modal';
        document.body.appendChild(modalContainer);
    }
    
    const product = currentProductDetail;
    const images = productImages[product.id] || [product.img, product.img, product.img];
    
    // Generate star rating
    const stars = generateStars(product.rating);
    
    modalContainer.innerHTML = `
        <div class="product-modal-backdrop" onclick="closeProductDetail()"></div>
        <div class="product-modal-content">
            <button class="product-modal-close" onclick="closeProductDetail()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="product-modal-body">
                <!-- Image Gallery -->
                <div class="product-gallery">
                    <div class="product-gallery-main" id="mainImage">
                        <img src="${images[currentImageIndex]}" alt="${product.name}" onclick="zoomImage(this)">
                    </div>
                    <div class="product-gallery-thumbs">
                        ${images.map((img, index) => `
                            <div class="gallery-thumb ${index === currentImageIndex ? 'active' : ''}" 
                                 onclick="changeImage(${index})">
                                <img src="${img}" alt="${product.name}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Product Details -->
                <div class="product-details">
                    <div class="product-details-brand">${product.brand}</div>
                    <h2 class="product-details-name">${product.name}</h2>
                    
                    <div class="product-details-price">
                        ₱${product.price.toLocaleString()}
                        ${product.oldPrice ? `<span class="old-price">₱${product.oldPrice.toLocaleString()}</span>` : ''}
                    </div>
                    
                    <div class="product-details-rating">
                        <div class="stars">${stars}</div>
                        <span class="reviews-count">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    
                    <!-- Stock Status -->
                    <div class="stock-badge in-stock" style="margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i> In Stock - Ready to Ship
                    </div>
                    
                    <!-- Color Selector -->
                    <div class="product-option-group">
                        <label class="product-option-label">
                            Color: <span id="selectedColorName">${selectedColor.name}</span>
                        </label>
                        <div class="product-color-selector">
                            ${colors.map((color, index) => `
                                <div class="color-btn ${index === 0 ? 'active' : ''}" 
                                     style="background-color: ${color.hex}; ${color.hex === '#FFFFFF' ? 'border: 2px solid #e0e0e0;' : ''}"
                                     onclick="selectColor(${index})"
                                     title="${color.name}"></div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Size Selector -->
                    <div class="product-option-group">
                        <label class="product-option-label">
                            Select Size: <span id="selectedSizeName">${selectedSize || 'Please select'}</span>
                        </label>
                        <div class="product-size-selector">
                            ${sizes.map(size => `
                                <button class="size-btn ${selectedSize === size ? 'active' : ''}" 
                                        onclick="selectSize('${size}')"
                                        ${Math.random() > 0.8 ? 'disabled' : ''}>
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                        <a href="#" style="font-size: 12px; text-decoration: underline; margin-top: 8px; display: inline-block;">Size Guide</a>
                    </div>
                    
                    <!-- Quantity Selector -->
                    <div class="product-quantity">
                        <label class="product-option-label">Quantity:</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="updateQuantity(-1)">−</button>
                            <span class="quantity-value" id="quantityValue">${productQuantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(1)">+</button>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="product-actions">
                        <button class="btn-add-to-cart" onclick="addToCartFromModal()">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn-add-wishlist ${isInWishlist(product.id) ? 'active' : ''}" 
                                onclick="toggleWishlist(${product.id}); updateWishlistButtonState()">
                            <i class="${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                    
                    <!-- Product Description -->
                    <div class="product-description">
                        <h4>Product Details</h4>
                        <p>Premium quality streetwear designed for comfort and style. Made with high-quality materials and attention to detail.</p>
                        
                        <ul class="product-features">
                            <li>100% Premium Cotton</li>
                            <li>Pre-shrunk fabric</li>
                            <li>Reinforced stitching</li>
                            <li>Machine washable</li>
                            <li>True to size fit</li>
                        </ul>
                        
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-gray);">
                            <p style="font-size: 12px; color: #999;">
                                <i class="fas fa-shipping-fast"></i> Free shipping on orders over ₱5,000<br>
                                <i class="fas fa-undo"></i> 30-day return policy<br>
                                <i class="fas fa-shield-alt"></i> 1-year warranty
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Change product image
function changeImage(index) {
    currentImageIndex = index;
    const images = productImages[currentProductDetail.id] || [currentProductDetail.img];
    
    const mainImage = document.querySelector('#mainImage img');
    if (mainImage) {
        mainImage.src = images[index];
    }
    
    // Update active thumb
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Zoom image (simple implementation)
function zoomImage(img) {
    // Could implement a lightbox/zoom feature here
    showNotification('Image zoom feature', 'success');
}

// Select size
function selectSize(size) {
    selectedSize = size;
    
    // Update UI
    document.querySelectorAll('.size-btn').forEach(btn => {
        if (btn.textContent.trim() === size) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const sizeName = document.getElementById('selectedSizeName');
    if (sizeName) {
        sizeName.textContent = size;
    }
}

// Select color
function selectColor(index) {
    selectedColor = colors[index];
    
    // Update UI
    document.querySelectorAll('.color-btn').forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const colorName = document.getElementById('selectedColorName');
    if (colorName) {
        colorName.textContent = selectedColor.name;
    }
}

// Update quantity
function updateQuantity(change) {
    productQuantity = Math.max(1, Math.min(10, productQuantity + change));
    
    const quantityValue = document.getElementById('quantityValue');
    if (quantityValue) {
        quantityValue.textContent = productQuantity;
    }
}

// Add to cart from modal
function addToCartFromModal() {
    if (!selectedSize) {
        showNotification('Please select a size', 'error');
        return;
    }
    
    const product = { 
        ...currentProductDetail, 
        quantity: productQuantity,
        size: selectedSize,
        color: selectedColor.name
    };
    
    addToCart(currentProductDetail.id, productQuantity, selectedSize, selectedColor.name);
    showNotification(`Added ${productQuantity}x ${product.name} (${selectedSize}, ${selectedColor.name}) to cart!`, 'success');
    
    // Optionally close modal after adding
    // closeProductDetail();
}

// Check if product is in wishlist
function isInWishlist(productId) {
    return wishlistItems.some(item => item.id === productId);
}

// Update wishlist button state in modal
function updateWishlistButtonState() {
    const btn = document.querySelector('.btn-add-wishlist');
    if (btn && currentProductDetail) {
        const inWishlist = isInWishlist(currentProductDetail.id);
        if (inWishlist) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Quick view function (lighter version of product detail)
function quickView(productId) {
    openProductDetail(productId);
}

// Make product cards clickable
function initProductCardClicks() {
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.closest('button') && !e.target.closest('.product-wishlist-btn')) {
            const productId = parseInt(productCard.dataset.productId);
            if (productId) {
                openProductDetail(productId);
            }
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('productModal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeProductDetail();
        } else if (e.key === 'ArrowLeft') {
            const images = productImages[currentProductDetail.id] || [currentProductDetail.img];
            if (currentImageIndex > 0) {
                changeImage(currentImageIndex - 1);
            }
        } else if (e.key === 'ArrowRight') {
            const images = productImages[currentProductDetail.id] || [currentProductDetail.img];
            if (currentImageIndex < images.length - 1) {
                changeImage(currentImageIndex + 1);
            }
        }
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductCardClicks);
} else {
    initProductCardClicks();
}