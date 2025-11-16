 // js/cart.js - FIXED: Image paths and rendering
let cartItems = [];

// Helper function to fix image paths based on current location
function getCorrectImagePath(imgPath) {
    if (!imgPath) return 'images/placeholder.jpg';
    
    // If already has ../ or starts with images/, handle accordingly
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    
    // Remove any existing path prefixes
    let cleanPath = imgPath.replace(/^\.\.\//, '').replace(/^images\//, '');
    
    // Return correct path based on location
    if (isInPagesFolder) {
        return `../images/${cleanPath}`;
    } else {
        return `images/${cleanPath}`;
    }
}

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
    
    const existingItem = cartItems.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const cartItemId = String(Date.now() + Math.random());
        cartItems.push({ 
            ...product, 
            quantity,
            size: size,
            color: color,
            cartItemId: cartItemId,
            // Ensure image property exists
            img: product.img || product.image
        });
    }
    
    updateCartCount();
    renderCart();
    saveCart();
    showNotification(`Added "${product.name}" to cart!`, 'success');
}

// Remove from cart by cart item ID
function removeFromCart(cartItemId) {
    const idStr = String(cartItemId);
    const item = cartItems.find(i => String(i.cartItemId) === idStr);
    if (item) {
        cartItems = cartItems.filter(i => String(i.cartItemId) !== idStr);
        updateCartCount();
        renderCart();
        saveCart();
        showNotification('Item removed from cart', 'success');
    }
}

// Update cart quantity
function updateCartQuantity(cartItemId, newQuantity) {
    const idStr = String(cartItemId);
    const item = cartItems.find(i => String(i.cartItemId) === idStr);
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

// Render cart sidebar with FIXED image paths
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
    
    cartItemsContainer.innerHTML = cartItems.map(item => {
        const imgPath = getCorrectImagePath(item.img || item.image);
        
        return `
        <div class="cart-item">
            <img src="${imgPath}" alt="${item.name}" class="cart-item-img" 
                 onerror="this.src='${getCorrectImagePath('placeholder.jpg')}'; this.style.backgroundColor='#f0f0f0'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
                <div class="cart-item-size" style="font-size: 12px; color: var(--text-gray); margin: 4px 0;">
                    Size: ${item.size} • Color: ${item.color}
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')">
                    Remove
                </button>
            </div>
        </div>
    `}).join('');
    
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
    
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter && cartItems.length > 0) {
        cartFooter.innerHTML = `
            <div style="padding: 0 0 12px 0; border-bottom: 1px solid var(--border-gray);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                    <span>Subtotal:</span>
                    <span>₱${subtotal.toLocaleString()}.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '₱' + shipping + '.00'}</span>
                </div>
                ${subtotal < 5000 ? `
                    <div style="font-size: 12px; color: var(--text-gray); margin-top: 8px;">
                        <i class="fas fa-truck"></i> Add ₱${(5000 - subtotal).toLocaleString()} more for free shipping
                    </div>
                ` : ''}
            </div>
            <div class="cart-total" style="padding-top: 12px;">
                <strong>Total:</strong>
                <span>₱${total.toLocaleString()}.00</span>
            </div>
            <button class="btn-checkout" onclick="checkout()">Checkout</button>
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
    
    // Navigate to cart page
    if (typeof window.goToPagesPage === 'function') {
        const page = window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
        window.goToPagesPage(page);
    } else {
        window.location.href = window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

// Auto-save cart when page unloads
window.addEventListener('beforeunload', function() {
    saveCart();
});

// Make functions available globally
window.initCart = initCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.checkout = checkout;