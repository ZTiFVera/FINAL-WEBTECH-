  let wishlistItems = [];

function toggleWishlist(productId) {
    const existingItem = wishlistItems.find(item => item.id === productId);
    
    if (existingItem) {
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        showNotification('Removed from wishlist', 'success');
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            wishlistItems.push(product);
            showNotification(`"${product.name}" added to wishlist!`, 'success');
        }
    }
    
    updateWishlistCount();
    renderWishlist();
    updateWishlistButtons();
}

function updateWishlistCount() {
    const count = wishlistItems.length;
    const badge = document.getElementById('wishlistCount');
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlistItems');
    
    if (wishlistItems.length === 0) {
        wishlistContainer.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
        return;
    }
    
    wishlistContainer.innerHTML = wishlistItems.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-details">
                <h4>${item.name}</h4>
                <p class="wishlist-item-price">₱${item.price.toLocaleString()}</p>
                <button onclick="addToCartFromWishlist(${item.id})" class="btn-add-to-cart">Add to Cart</button>
                <button onclick="removeFromWishlist(${item.id})" class="btn-remove">Remove</button>
            </div>
        </div>
    `).join('');
}

function openWishlist() {
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const backdrop = document.getElementById('backdrop');
    
    wishlistSidebar.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ✅ ADD THIS FUNCTION - This is what was missing!
function closeWishlist() {
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const backdrop = document.getElementById('backdrop');
    
    wishlistSidebar.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
}

function removeFromWishlist(productId) {
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    showNotification('Removed from wishlist', 'success');
    
    updateWishlistCount();
    renderWishlist();
    updateWishlistButtons();
}

function addToCartFromWishlist(productId) {
    // Add to cart logic here
    addToCart(productId);
    showNotification('Added to cart!', 'success');
}

function updateWishlistButtons() {
    const wishlistIds = wishlistItems.map(item => item.id);
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        if (wishlistIds.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// ✅ ADD EVENT LISTENERS FOR CLOSING
document.addEventListener('DOMContentLoaded', function() {
    // Close button (X)
    const closeBtn = document.querySelector('.close-wishlist');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWishlist);
    }
    
    // Backdrop click
    const backdrop = document.getElementById('backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeWishlist);
    }
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeWishlist();
        }
    });
});

/* 
HTML STRUCTURE SHOULD BE:
<div id="wishlistSidebar" class="wishlist-sidebar">
    <div class="wishlist-header">
        <h2>My Wishlist</h2>
        <button class="close-wishlist" onclick="closeWishlist()">×</button>
    </div>
    <div id="wishlistItems"></div>
</div>
<div id="backdrop" class="backdrop" onclick="closeWishlist()"></div>
*/