 function filterProducts(category) {
    if (category === 'all') {
        currentProducts = [...products];
    } else if (category === 'sale') {
        currentProducts = products.filter(p => p.oldPrice > 0);
    } else if (category === 'new') {
        currentProducts = products.filter(p => p.badge === 'NEW');
    } else {
        currentProducts = products.filter(p => p.category === category);
    }
    
    updateFilterButtons(category);
    renderCategoryProducts();
}

function updateFilterButtons(activeCategory) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}
