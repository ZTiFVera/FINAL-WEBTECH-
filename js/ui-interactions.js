 // js/ui-interactions.js - simplified: header clicks navigate to pages; hearts are not intercepted here.

(function () {
  // Safe navigation helper to avoid /pages/pages duplication
  window.goToPagesPage = function(filename) {
    if (!filename) return;
    if (filename.startsWith('/')) {
      window.location.href = filename;
      return;
    }
    if (filename.indexOf('pages/') === 0 || filename.indexOf('/pages/') === 0) {
      window.location.href = filename;
      return;
    }
    if (window.location.pathname.includes('/pages/')) {
      window.location.href = filename;
    } else {
      window.location.href = 'pages/' + filename;
    }
  };

  // Wire header buttons so clicks navigate to full pages (no hover behaviour here)
  function wireHeaderClicks() {
    // Wishlist header buttons
    document.querySelectorAll('#headerWishlistBtn, .icon-btn-custom[data-page*="wishlist"]').forEach(btn => {
      if (btn.__wired) return;
      btn.__wired = true;
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const page = btn.getAttribute('data-page') || (window.location.pathname.includes('/pages/') ? 'wishlist.html' : 'pages/wishlist.html');
        window.goToPagesPage(page);
      });
    });

    // Cart header buttons
    document.querySelectorAll('#headerCartBtn, .icon-btn-custom[data-page*="cart"]').forEach(btn => {
      if (btn.__wired) return;
      btn.__wired = true;
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const page = btn.getAttribute('data-page') || (window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html');
        window.goToPagesPage(page);
      });
    });
  }

  // Ensure checkout buttons in sidebars navigate to the cart page
  function wireSidebarCheckoutButtons() {
    function attach() {
      document.querySelectorAll('.cart-sidebar .btn-checkout, .cart-footer .btn-checkout, .btn-checkout-page, .btn-checkout').forEach(btn => {
        if (btn.__cartNav) return;
        btn.__cartNav = true;
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          const page = window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
          window.goToPagesPage(page);
        });
      });
    }
    document.addEventListener('DOMContentLoaded', attach);
    setTimeout(attach, 600);
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Keep sidebar helper functions available (for programmatic opening)
  window.openSidebarById = function (id) {
    const sidebar = document.getElementById(id);
    const backdrop = document.getElementById('backdrop');
    if (!sidebar || !backdrop) return;
    sidebar.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeSidebarById = function (id) {
    const sidebar = document.getElementById(id);
    const backdrop = document.getElementById('backdrop');
    if (!sidebar || !backdrop) return;
    sidebar.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };
  window.closeAllSidebars = function () {
    const backdrop = document.getElementById('backdrop');
    const cart = document.getElementById('cartSidebar');
    const wish = document.getElementById('wishlistSidebar');
    if (cart) cart.classList.remove('active');
    if (wish) wish.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Disable image hover-swap helper (no-op) — if your other code references them, this prevents errors.
  window.swapProductCardImage = function () { /* disabled in click-first UX */ };
  window.swapToAltImage = function () { /* disabled */ };

  document.addEventListener('DOMContentLoaded', function () {
    wireHeaderClicks();
    wireSidebarCheckoutButtons();

    // Keep wishlist badge styling consistent
    const b = document.getElementById('wishlistCount');
    if (b) {
      b.style.width = b.style.width || '16px';
      b.style.height = b.style.height || '16px';
      b.style.fontSize = b.style.fontSize || '10px';
      b.style.lineHeight = b.style.lineHeight || b.style.height;
      b.style.padding = '0';
      b.style.borderRadius = '50%';
      b.style.display = b.textContent && parseInt(b.textContent) > 0 ? 'flex' : (b.style.display === '' ? 'none' : b.style.display);
      b.style.alignItems = 'center';
      b.style.justifyContent = 'center';
      b.style.position = 'absolute';
    }
  });
})();