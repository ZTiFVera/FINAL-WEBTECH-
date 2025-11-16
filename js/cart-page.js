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
    console.log('🛒 renderCartPage called');
    console.log('Cart items:', window.cartItems);
    
    const container = document.getElementById('cartItemsPage');
    const summary = document.getElementById('cartSummaryPage');
    
    if (!container || !summary) {
        console.error('❌ Cart page containers not found!');
        return;
    }

    // Get cart items from window or localStorage
    let items = window.cartItems || [];
    
    // If window.cartItems is empty, try to load from localStorage
    if (items.length === 0) {
        const saved = localStorage.getItem('nestarGazeCart');
        if (saved) {
            try {
                items = JSON.parse(saved);
                window.cartItems = items;
                console.log('✅ Loaded cart from localStorage:', items);
            } catch (e) {
                console.error('❌ Error parsing cart from localStorage:', e);
                items = [];
            }
        }
    }

    // Check if cart is empty
    if (!items || items.length === 0) {
        console.log('📭 Cart is empty');
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

    console.log('✅ Rendering', items.length, 'cart items');

    // Render cart items
    container.innerHTML = `
        <div class="cart-items-header">
            <h2>Shopping Bag (${items.length} ${items.length === 1 ? 'Item' : 'Items'})</h2>
        </div>
        
        <div class="cart-items-list">
            ${items.map(item => {
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
                                    <span class="value">${item.size || 'M'}</span>
                                </div>
                                <div class="attribute">
                                    <span class="label">Color:</span>
                                    <span class="value">${item.color || 'Black'}</span>
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
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12); // 12% tax
    const total = subtotal + shipping + tax;

    console.log('💰 Totals - Subtotal:', subtotal, 'Shipping:', shipping, 'Tax:', tax, 'Total:', total);

    // Render order summary
    summary.innerHTML = `
        <div class="order-summary-sticky">
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-details">
                <div class="summary-row">
                    <span>Subtotal (${items.length} items)</span>
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
    
    console.log('✅ Cart page rendered successfully');
}

// ============================================
// CART PAGE ACTIONS
// ============================================

function changeQtyFromPage(cartItemId, newQty) {
    console.log('Changing qty for:', cartItemId, 'to:', newQty);
    if (typeof window.updateCartQuantity === 'function') {
        window.updateCartQuantity(cartItemId, parseInt(newQty));
        renderCartPage();
    } else {
        console.error('updateCartQuantity function not available');
    }
}

function removeFromCartFromPage(cartItemId) {
    if (confirm('Remove this item from your bag?')) {
        console.log('Removing item:', cartItemId);
        if (typeof window.removeFromCart === 'function') {
            window.removeFromCart(cartItemId);
            renderCartPage();
        } else {
            console.error('removeFromCart function not available');
        }
    }
}

function moveToWishlistFromCart(cartItemId, productId) {
    console.log('Moving to wishlist:', cartItemId, productId);
    
    // Add to wishlist
    if (typeof window.toggleWishlist === 'function') {
        const item = window.cartItems.find(i => String(i.cartItemId) === String(cartItemId));
        if (item) {
            // Check if already in wishlist
            const isInWishlist = window.wishlistItems && window.wishlistItems.some(w => w.id === productId);
            if (!isInWishlist) {
                window.toggleWishlist(productId);
            }
            // Remove from cart
            if (typeof window.removeFromCart === 'function') {
                window.removeFromCart(cartItemId);
                renderCartPage();
                if (typeof showNotification === 'function') {
                    showNotification('Item moved to wishlist', 'success');
                }
            }
        }
    } else {
        console.error('toggleWishlist function not available');
    }
}

function proceedToCheckout() {
    if (!window.cartItems || window.cartItems.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Your cart is empty', 'error');
        }
        return;
    }
    
    const subtotal = window.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    
    if (typeof showNotification === 'function') {
        showNotification(`Proceeding to checkout - Total: ${formatPrice(total)}`, 'success');
    }
    
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

// Auto-render if on cart page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('cartItemsPage')) {
            console.log('🔄 Auto-rendering cart page on DOMContentLoaded');
            setTimeout(renderCartPage, 100);
        }
    });
} else {
    if (document.getElementById('cartItemsPage')) {
        console.log('🔄 Auto-rendering cart page immediately');
        setTimeout(renderCartPage, 100);
    }
}