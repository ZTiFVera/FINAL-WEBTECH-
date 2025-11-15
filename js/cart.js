 // Enhanced Cart System with localStorage
let cartItems = [];

// Initialize cart from localStorage
function initCart() {
    const saved = localStorage.getItem('nestarGazeCart');
    if (saved) {
        try {
            cartItems = JSON.parse(saved);
            updateCartCount();
            renderCart();
        } catch (e) {
            console.error('Error loading cart:', e);
            cartItems = [];
        }
    }
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('nestarGazeCart', JSON.stringify(cartItems));
}

// Add to cart with size and color
function addToCart(productId, quantity = 1, size = 'M', color = 'Black') {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Check if exact item exists
    const existingItem = cartItems.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ 
            ...product, 
            quantity,
            size: size,
            color: color,
            cartItemId: Date.now() + Math.random()
        });
    }
    
    updateCartCount();
    renderCart();
    saveCart();
    showNotification(`Added "${product.name}" to cart!`, 'success');
}

// Remove from cart by cart item ID
function removeFromCart(cartItemId) {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
        cartItems = cartItems.filter(i => i.cartItemId !== cartItemId);
        updateCartCount();
        renderCart();
        saveCart();
        showNotification('Item removed from cart', 'success');
    }
}

// Update cart quantity
function updateCartQuantity(cartItemId, newQuantity) {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
        item.quantity = Math.max(1, Math.min(10, newQuantity));
        renderCart();
        updateCartCount();
        saveCart();
    }
}

// Update cart count badge
function updateCartCount() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Render cart with enhanced item display
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 12px; color: var(--text-gray); margin-top: 8px;">Add some items to get started!</p>
            </div>
        `;
        updateCartTotal();
        return;
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img" 
                 onerror="this.style.backgroundColor='#f0f0f0'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
                <div class="cart-item-variants">
                    <span class="cart-item-size">Size: ${item.size}</span>
                    <span class="cart-item-color">Color: ${item.color}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    ₱${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = `₱${total.toLocaleString()}.00`;
    }
    
    // Update footer if it exists
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        cartFooter.innerHTML = `
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span>Subtotal:</span>
                    <span>₱${subtotal.toLocaleString()}.00</span>
                </div>
                <div class="cart-summary-row">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '₱' + shipping + '.00'}</span>
                </div>
                ${subtotal < 5000 ? `
                    <div class="shipping-notice">
                        <i class="fas fa-truck"></i> Add ₱${(5000 - subtotal).toLocaleString()} more for free shipping
                    </div>
                ` : ''}
            </div>
            <div class="cart-total">
                <strong>Total:</strong>
                <span>₱${total.toLocaleString()}.00</span>
            </div>
            <button class="btn-checkout" onclick="checkout()">
                <i class="fas fa-lock"></i> Checkout
            </button>
            <button class="btn-continue" onclick="toggleCart()">Continue Shopping</button>
        `;
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const backdrop = document.getElementById('backdrop');
    
    if (!cartSidebar || !backdrop) return;
    
    cartSidebar.classList.toggle('active');
    backdrop.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        renderCart();
    } else {
        document.body.style.overflow = '';
    }
}

// Checkout function
function checkout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;
    
    showNotification(`Proceeding to checkout - Total: ₱${total.toLocaleString()}.00`, 'success');
    
    // In production, redirect to checkout page
    console.log('Checkout initiated:', {
        items: cartItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total
    });
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

// Auto-save cart when page unloads
window.addEventListener('beforeunload', function() {
    saveCart();
});