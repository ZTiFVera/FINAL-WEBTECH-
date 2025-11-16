 // ============================================
// cart-page.js - Full Cart Page Management
// Load after: products.js, notifications.js, cart.js
// ============================================

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCorrectImagePath(imgPath) {
    if (!imgPath) return '../images/placeholder.jpg';
    
    // Remove any existing path prefixes
    let cleanPath = imgPath.replace(/^\.\.\//, '').replace(/^images\//, '');
    
    // Always use ../ for pages folder
    return `../images/${cleanPath}`;
}

function formatPrice(value) {
    return `₱${value.toLocaleString()}.00`;
}

// ============================================
// CART PAGE RENDERING
// ============================================

function renderCartPage() {
    const container = document.getElementById('cartItemsPage');
    const summary = document.getElementById('cartSummaryPage');
    
    if (!container || !summary) {
        console.warn('Cart page containers not found');
        return;
    }

    // Check if cart is empty
    if (!window.cartItems || window.cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-page">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h2>Your Bag is Empty</h2>
                <p>Looks like you haven't added anything to your bag yet</p>
                <a href="shop.html" class="btn-shop-now">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
                </a>
            </div>
        `;
        
        summary.innerHTML = `
            <div class="summary-empty">
                <p>No items in bag</p>
            </div>
        `;
        return;
    }

    // Render cart items
    container.innerHTML = `
        <div class="cart-items-header">
            <h2>Shopping Bag (${window.cartItems.length} ${window.cartItems.length === 1 ? 'Item' : 'Items'})</h2>
        </div>
        
        <div class="cart-items-list">
            ${window.cartItems.map(item => {
                const imgPath = getCorrectImagePath(item.img || item.image);
                const itemTotal = item.price * item.quantity;
                
                return `
                    <div class="cart-page-item" data-cart-id="${item.cartItemId}">
                        <div class="cart-page-item-image">
                            <img src="${imgPath}" 
                                 alt="${item.name}"
                                 onerror="this.src='${getCorrectImagePath('placeholder.jpg')}'; this.style.backgroundColor='#f0f0f0'">
                        </div>
                        
                        <div class="cart-page-item-details">
                            <div class="item-header">
                                <div class="item-info">
                                    <h3 class="item-brand">${item.brand || 'NESTAR GAZE'}</h3>
                                    <h4 class="item-name">${item.name}</h4>
                                </div>
                                <div class="item-price-mobile">
                                    <span class="price">${formatPrice(itemTotal)}</span>
                                </div>
                            </div>
                            
                            <div class="item-attributes">
                                <div class="attribute">
                                    <span class="label">Size:</span>
                                    <span class="value">${item.size}</span>
                                </div>
                                <div class="attribute">
                                    <span class="label">Color:</span>
                                    <span class="value">${item.color}</span>
                                </div>
                            </div>
                            
                            <div class="item-price-desktop">
                                <span class="unit-price">₱${item.price.toLocaleString()} each</span>
                                ${item.oldPrice ? `<span class="old-price">₱${item.oldPrice.toLocaleString()}</span>` : ''}
                            </div>
                            
                            <div class="item-actions">
                                <div class="quantity-selector-cart">
                                    <label>Qty:</label>
                                    <select onchange="changeQtyFromPage('${item.cartItemId}', this.value)">
                                        ${[...Array(10)].map((_, i) => 
                                            `<option value="${i + 1}" ${item.quantity === i + 1 ? 'selected' : ''}>${i + 1}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <button class="btn-move-wishlist" 
                                        onclick="moveToWishlistFromCart('${item.cartItemId}', ${item.id})"
                                        title="Move to Wishlist">
                                    <i class="far fa-heart"></i>
                                    <span>Move to Wishlist</span>
                                </button>
                                
                                <button class="btn-remove-item" 
                                        onclick="removeFromCartFromPage('${item.cartItemId}')"
                                        title="Remove Item">
                                    <i class="fas fa-trash-alt"></i>
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="cart-page-item-total">
                            ${formatPrice(itemTotal)}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Calculate totals
    const subtotal = window.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12); // 12% tax
    const total = subtotal + shipping + tax;

    // Render order summary
    summary.innerHTML = `
        <div class="order-summary-sticky">
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-details">
                <div class="summary-row">
                    <span>Subtotal (${window.cartItems.length} items)</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                
                <div class="summary-row">
                    <span>Shipping</span>
                    <span class="${shipping === 0 ? 'free-shipping' : ''}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                
                <div class="summary-row">
                    <span>Estimated Tax</span>
                    <span>${formatPrice(tax)}</span>
                </div>
                
                ${subtotal < 5000 ? `
                    <div class="shipping-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${(subtotal / 5000) * 100}%"></div>
                        </div>
                        <p class="progress-text">
                            <i class="fas fa-truck"></i>
                            Add ${formatPrice(5000 - subtotal)} more for <strong>FREE SHIPPING</strong>
                        </p>
                    </div>
                ` : `
                    <div class="free-shipping-achieved">
                        <i class="fas fa-check-circle"></i>
                        <span>You've earned FREE SHIPPING!</span>
                    </div>
                `}
            </div>
            
            <div class="summary-total">
                <span>Total</span>
                <span class="total-amount">${formatPrice(total)}</span>
            </div>
            
            <button class="btn-checkout-full" onclick="proceedToCheckout()">
                <i class="fas fa-lock"></i>
                Secure Checkout
            </button>
            
            <div class="accepted-payments">
                <p>We Accept</p>
                <div class="payment-icons">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-amex"></i>
                    <i class="fab fa-cc-paypal"></i>
                </div>
            </div>
            
            <a href="shop.html" class="continue-shopping">
                <i class="fas fa-arrow-left"></i>
                Continue Shopping
            </a>
        </div>
    `;
}

// ============================================
// CART PAGE ACTIONS
// ============================================

function changeQtyFromPage(cartItemId, newQty) {
    if (typeof window.updateCartQuantity === 'function') {
        window.updateCartQuantity(cartItemId, parseInt(newQty));
        renderCartPage();
    }
}

function removeFromCartFromPage(cartItemId) {
    if (confirm('Remove this item from your bag?')) {
        if (typeof window.removeFromCart === 'function') {
            window.removeFromCart(cartItemId);
            renderCartPage();
        }
    }
}

function moveToWishlistFromCart(cartItemId, productId) {
    // Add to wishlist
    if (typeof window.toggleWishlist === 'function') {
        const item = window.cartItems.find(i => String(i.cartItemId) === String(cartItemId));
        if (item) {
            // Check if already in wishlist
            const isInWishlist = window.wishlistItems.some(w => w.id === productId);
            if (!isInWishlist) {
                window.toggleWishlist(productId);
            }
            // Remove from cart
            if (typeof window.removeFromCart === 'function') {
                window.removeFromCart(cartItemId);
                renderCartPage();
                showNotification('Item moved to wishlist', 'success');
            }
        }
    }
}

function proceedToCheckout() {
    if (!window.cartItems || window.cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const subtotal = window.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    
    showNotification(`Proceeding to checkout - Total: ${formatPrice(total)}`, 'success');
    
    // In a real app, this would navigate to checkout
    setTimeout(() => {
        alert(`Checkout Page\n\nOrder Summary:\nSubtotal: ${formatPrice(subtotal)}\nShipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}\nTax: ${formatPrice(tax)}\nTotal: ${formatPrice(total)}`);
    }, 500);
}

// ============================================
// INITIALIZATION
// ============================================

// Make functions globally available
window.renderCartPage = renderCartPage;
window.changeQtyFromPage = changeQtyFromPage;
window.removeFromCartFromPage = removeFromCartFromPage;
window.moveToWishlistFromCart = moveToWishlistFromCart;
window.proceedToCheckout = proceedToCheckout;

console.log('✅ Cart page system loaded');