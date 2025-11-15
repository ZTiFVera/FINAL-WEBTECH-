 // cart-page.js - checkout button navigates to checkout via helper
function formatPrice(value) {
    return `₱${value.toLocaleString()}.00`;
}

function renderCartPage() {
    const container = document.getElementById('cartItemsPage');
    const summary = document.getElementById('cartSummaryPage');
    if (!container || !summary) return;

    if (!cartItems || cartItems.length === 0) {
        container.innerHTML = `<div class="empty-cart-page">Your bag is empty. <a href="../pages/shop.html">Keep shopping</a></div>`;
        summary.innerHTML = `<div style="text-align:center; color:var(--text-gray)">No items in bag</div>`;
        return;
    }

    container.innerHTML = cartItems.map(item => {
        return `
        <div class="bag-item" data-cart-id="${item.cartItemId}">
            <img src="${item.img}" alt="${item.name}" onerror="this.style.backgroundColor='#f0f0f0'">
            <div style="flex:1;">
                <div class="bag-item-title">${item.name}</div>
                <div class="bag-item-meta">Size: ${item.size} • Color: ${item.color}</div>
                <div class="bag-item-meta" style="margin-top:8px;">₱${item.price.toLocaleString()} ${item.oldPrice ? `<span style="color:#d32f2f; margin-left:12px;">₱${item.oldPrice.toLocaleString()}</span>` : ''}</div>
                <div class="bag-item-controls">
                    <label>QTY</label>
                    <select class="bag-item-qty" onchange="changeQtyFromPage('${item.cartItemId}', this.value)">
                        ${[...Array(10)].map((_,i)=>`<option value="${i+1}" ${item.quantity === i+1 ? 'selected':''}>${i+1}</option>`).join('')}
                    </select>
                    <button style="background:none;border:none;color:#111;text-decoration:underline; cursor:pointer;" onclick="editItem('${item.cartItemId}')">EDIT</button>
                    <button style="background:none;border:none;color:#b33;text-decoration:underline; cursor:pointer;" onclick="removeFromCartFromPage('${item.cartItemId}')">REMOVE</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    const subtotal = cartItems.reduce((s,i)=> s + (i.price * i.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;

    summary.innerHTML = `
        <div style="font-weight:800; margin-bottom:12px;">Order Summary</div>
        <div class="summary-row"><span>Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping:</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
        ${subtotal < 5000 ? `<div style="font-size:13px; color:var(--text-gray); margin:8px 0;"><i class="fas fa-truck"></i> Add ₱${(5000 - subtotal).toLocaleString()} more for free shipping</div>` : ''}
        <div style="margin:12px 0;"><input id="promoCodeInput" placeholder="Enter Promo Code" style="width:100%; padding:10px; border:1px solid var(--border-gray);" /><button class="btn-apply" onclick="applyPromoCode()">APPLY</button></div>
        <hr />
        <div class="summary-row" style="font-size:18px;"><span>Total:</span><span>${formatPrice(total)}</span></div>
        <div style="margin-top:18px;">
            <button class="btn-checkout-page" onclick="(function(){ if(typeof window.goToPagesPage==='function'){ window.goToPagesPage(window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html'); } else { window.location.href = window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html'; } })()">CHECKOUT</button>
        </div>
    `;
}
window.renderCartPage = renderCartPage;