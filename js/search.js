 // search.js - kept navigation robust
function liveSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    if (!searchInput || !searchDropdown) return;
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm.length === 0) {
        searchDropdown.style.display = 'none';
        return;
    }
    const results = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
        (p.category && p.category.toLowerCase().includes(searchTerm))
    );
    if (results.length === 0) {
        searchDropdown.innerHTML = `
            <div class="search-item" style="text-align: center; color: var(--text-gray); padding: 24px;">
                <i class="fas fa-search" style="font-size: 32px; opacity: 0.3; margin-bottom: 12px; display: block;"></i>
                No results found for "${searchTerm}"
            </div>
        `;
    } else {
        searchDropdown.innerHTML = results.slice(0, 8).map(product => `
            <div class="search-item" onclick="selectSearchResult(${product.id})" style="display:flex; align-items:center; padding:8px; cursor:pointer;">
                <img src="${product.img}" style="width: 40px; height: 50px; object-fit: cover; margin-right: 10px; background: #f0f0f0; border-radius: 4px;" onerror="this.style.backgroundColor='#f0f0f0'">
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 12px;">${product.name}</div>
                    <div style="font-size: 11px; color: #999;">₱${product.price.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }
    searchDropdown.style.display = 'block';
}

function selectSearchResult(productId) {
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const path = isInPagesFolder ? '../product-detail.html' : 'product-detail.html';
    window.location.href = `${path}?id=${productId}`;
}

document.addEventListener('click', function(e) {
    const searchBar = document.querySelector('.search-bar-custom');
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchBar && searchDropdown && !searchBar.contains(e.target)) {
        searchDropdown.style.display = 'none';
    }
});