// ============================================
// wishlist-buttons.js - Update wishlist button states
// Load after: wishlist.js
// ============================================

(function() {
  // Update all wishlist button states on the page
  window.updateWishlistButtons = function() {
    if (!window.wishlistItems) {
      window.wishlistItems = [];
    }
    
    // Find all product cards with wishlist buttons
    document.querySelectorAll('.product-card').forEach(card => {
      const productId = parseInt(card.dataset.productId);
      if (!productId) return;
      
      const btn = card.querySelector('.product-wishlist-btn');
      if (!btn) return;
      
      const isInWishlist = window.wishlistItems.some(item => item.id === productId);
      
      // Update button appearance
      if (isInWishlist) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        btn.title = 'In wishlist';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
        btn.title = 'Add to wishlist';
      }
    });
  };
  
  // Call on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.updateWishlistButtons);
  } else {
    window.updateWishlistButtons();
  }
  
  console.log('✅ Wishlist buttons handler loaded');
})();