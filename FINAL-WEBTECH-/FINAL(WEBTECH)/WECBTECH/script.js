// Page Navigation Function
function showPage(page, filter = null) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected page
    if (page === 'home') {
        document.getElementById('home-page').classList.add('active');
    } else if (page === 'shop') {
        document.getElementById('shop-page').classList.add('active');
        
        // Apply filter if provided
        if (filter) {
            document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
            if (filter === 'hoodies') {
                document.getElementById('hoodies-filter').checked = true;
            } else if (filter === 'tees') {
                document.getElementById('tees-filter').checked = true;
            }
            filterProducts();
        }
    }
}

// Filter Products Function
function filterProducts() {
    const selectedFilters = Array.from(document.querySelectorAll('.filter-checkbox'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    document.querySelectorAll('.product-item').forEach(product => {
        const category = product.dataset.category;
        product.style.display = selectedFilters.length === 0 || selectedFilters.includes(category) ? 'block' : 'none';
    });
}

// Add event listeners to filters
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-checkbox').forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });
});