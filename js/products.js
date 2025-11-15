  // ============================================
// NESTAR GAZE - Complete Products Database
// ✅ FIXED: All images now use GREEN.jpg consistently
// ✅ FIXED: getImagePath() now properly used
// ============================================

// Auto-detect path based on current page location
function getImagePath(filename) {
    const isInSubfolder = window.location.pathname.includes('/pages/');
    return isInSubfolder ? `../images/${filename}` : `images/${filename}`;
}

// Complete Product Database
const products = [
    // === HOODIES ===
    {
        id: 1,
        name: "Premium Zip Hoodie",
        brand: "NESTAR GAZE",
        price: 4200,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "hoodies",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.8,
        reviews: 45,
        stock: 15,
        description: "Premium quality zip-up hoodie with soft fleece lining.",
        features: ["100% Cotton", "Fleece Lined", "Metal Zipper", "Kangaroo Pocket"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Navy"]
    },
    {
        id: 2,
        name: "Heavyweight Sweatshirt",
        brand: "NESTAR GAZE",
        price: 3800,
        oldPrice: 0,
        badge: "HOT",
        badgeClass: "",
        category: "hoodies",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.7,
        reviews: 38,
        stock: 22,
        description: "Heavyweight pullover sweatshirt with premium construction.",
        features: ["Heavy Cotton Blend", "Ribbed Cuffs", "Oversized Fit", "Pre-shrunk"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray"]
    },
    {
        id: 3,
        name: "Oversized Hoodie",
        brand: "NESTAR GAZE",
        price: 3600,
        oldPrice: 4800,
        badge: "SALE",
        badgeClass: "sale",
        category: "hoodies",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.6,
        reviews: 32,
        stock: 8,
        description: "Relaxed oversized hoodie with dropped shoulders.",
        features: ["Oversized Cut", "Premium Cotton", "Drawstring Hood", "Soft Touch"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Cream", "Olive"]
    },
    {
        id: 4,
        name: "Vintage Hoodie",
        brand: "NESTAR GAZE",
        price: 3900,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "hoodies",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.5,
        reviews: 28,
        stock: 18,
        description: "Vintage-inspired hoodie with washed finish.",
        features: ["Vintage Wash", "Faded Graphics", "Relaxed Fit", "Durable Cotton"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Charcoal", "Navy", "Burgundy"]
    },
    {
        id: 5,
        name: "Tech Hoodie",
        brand: "NESTAR GAZE",
        price: 4500,
        oldPrice: 0,
        badge: "BESTSELLER",
        badgeClass: "",
        category: "hoodies",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.9,
        reviews: 52,
        stock: 25,
        description: "Tech-enhanced hoodie with moisture-wicking fabric.",
        features: ["Moisture Wicking", "Hidden Pockets", "4-Way Stretch", "Quick Dry"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Gray"]
    },

    // === GRAPHIC TEES ===
    {
        id: 6,
        name: "Oversized Graphic Tee",
        brand: "NESTAR GAZE",
        price: 1900,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "tees",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.7,
        reviews: 41,
        stock: 30,
        description: "Oversized graphic tee with bold prints.",
        features: ["100% Cotton", "Oversized Fit", "Screen Printed", "Pre-washed"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White"]
    },
    {
        id: 7,
        name: "Vintage Band Tee",
        brand: "NESTAR GAZE",
        price: 1700,
        oldPrice: 0,
        badge: "",
        badgeClass: "",
        category: "tees",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.6,
        reviews: 35,
        stock: 20,
        description: "Vintage-style band tee with distressed graphics.",
        features: ["Vintage Wash", "Distressed Print", "Soft Cotton", "Relaxed Fit"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Gray", "White"]
    },
    {
        id: 8,
        name: "Streetwear Graphic Tee",
        brand: "NESTAR GAZE",
        price: 1600,
        oldPrice: 2200,
        badge: "-27%",
        badgeClass: "sale",
        category: "tees",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.5,
        reviews: 28,
        stock: 12,
        description: "Bold streetwear tee with modern graphics.",
        features: ["Cotton Blend", "Modern Graphics", "Regular Fit", "Machine Washable"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Navy"]
    },
    {
        id: 9,
        name: "Urban Art Tee",
        brand: "NESTAR GAZE",
        price: 1800,
        oldPrice: 0,
        badge: "HOT",
        badgeClass: "",
        category: "tees",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.8,
        reviews: 47,
        stock: 28,
        description: "Artistic urban tee featuring unique street art.",
        features: ["Premium Cotton", "Unique Artwork", "Comfortable Fit", "Fade Resistant"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Cream", "Burgundy"]
    },
    {
        id: 10,
        name: "Minimalist Tee",
        brand: "NESTAR GAZE",
        price: 1500,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "tees",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.4,
        reviews: 22,
        stock: 35,
        description: "Clean minimalist tee with subtle branding.",
        features: ["Soft Cotton", "Minimal Design", "Classic Fit", "Versatile"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray", "Navy"]
    },

    // === PANTS ===
    {
        id: 11,
        name: "Cargo Pants",
        brand: "NESTAR GAZE",
        price: 3400,
        oldPrice: 0,
        badge: "HOT",
        badgeClass: "",
        category: "pants",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.7,
        reviews: 39,
        stock: 20,
        description: "Utility cargo pants with multiple pockets.",
        features: ["Multiple Pockets", "Durable Fabric", "Adjustable Waist", "Tapered Leg"],
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Black", "Olive", "Khaki"]
    },
    {
        id: 12,
        name: "Slim Fit Jeans",
        brand: "NESTAR GAZE",
        price: 2900,
        oldPrice: 3800,
        badge: "-24%",
        badgeClass: "sale",
        category: "pants",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.6,
        reviews: 33,
        stock: 15,
        description: "Classic slim fit jeans with stretch denim.",
        features: ["Stretch Denim", "5-Pocket Design", "Slim Fit", "Fade Resistant"],
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Black", "Dark Blue", "Light Blue"]
    },
    {
        id: 13,
        name: "Baggy Pants",
        brand: "NESTAR GAZE",
        price: 3200,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "pants",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.5,
        reviews: 26,
        stock: 18,
        description: "Relaxed baggy pants for comfortable streetwear.",
        features: ["Relaxed Fit", "Wide Leg", "Elastic Waist", "Soft Cotton"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Tan"]
    },
    {
        id: 14,
        name: "Track Pants",
        brand: "NESTAR GAZE",
        price: 2600,
        oldPrice: 0,
        badge: "BESTSELLER",
        badgeClass: "",
        category: "pants",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.8,
        reviews: 51,
        stock: 40,
        description: "Athletic track pants with side stripes.",
        features: ["Side Stripes", "Elastic Waist", "Tapered Fit", "Moisture Wicking"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Gray"]
    },
    {
        id: 15,
        name: "Cargo Joggers",
        brand: "NESTAR GAZE",
        price: 2800,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "pants",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.6,
        reviews: 29,
        stock: 25,
        description: "Hybrid cargo joggers combining utility and comfort.",
        features: ["Cargo Pockets", "Jogger Style", "Drawstring Waist", "Cuffed Ankle"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Olive", "Charcoal"]
    },

    // === SALE ITEMS ===
    {
        id: 16,
        name: "Streetwear Bomber",
        brand: "NESTAR GAZE",
        price: 2800,
        oldPrice: 4500,
        badge: "-38%",
        badgeClass: "sale",
        category: "sale",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.5,
        reviews: 24,
        stock: 10,
        description: "Classic bomber jacket with premium satin finish.",
        features: ["Satin Finish", "Ribbed Cuffs", "Zip Closure", "Lightweight"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Olive"]
    },
    {
        id: 17,
        name: "Nylon Windbreaker",
        brand: "NESTAR GAZE",
        price: 1600,
        oldPrice: 2800,
        badge: "-43%",
        badgeClass: "sale",
        category: "sale",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.5,
        reviews: 19,
        stock: 8,
        description: "Lightweight windbreaker perfect for layering.",
        features: ["Water Resistant", "Packable", "Hood", "Zip Pockets"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Red"]
    },
    {
        id: 18,
        name: "Classic Dad Hat",
        brand: "NESTAR GAZE",
        price: 900,
        oldPrice: 1500,
        badge: "-40%",
        badgeClass: "sale",
        category: "sale",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.3,
        reviews: 15,
        stock: 50,
        description: "Unstructured dad hat with adjustable strap.",
        features: ["Unstructured", "Adjustable", "Cotton Twill", "Curved Brim"],
        sizes: ["One Size"],
        colors: ["Black", "Navy", "Beige", "White"]
    },
    {
        id: 19,
        name: "Vintage Jacket",
        brand: "NESTAR GAZE",
        price: 3200,
        oldPrice: 5200,
        badge: "-38%",
        badgeClass: "sale",
        category: "sale",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.6,
        reviews: 31,
        stock: 6,
        description: "Vintage-inspired denim jacket with distressed finish.",
        features: ["Distressed Denim", "Button Closure", "Chest Pockets", "Relaxed Fit"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Light Wash", "Dark Wash"]
    },
    {
        id: 20,
        name: "Urban Sneakers",
        brand: "NESTAR GAZE",
        price: 4200,
        oldPrice: 6500,
        badge: "-35%",
        badgeClass: "sale",
        category: "sale",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.7,
        reviews: 42,
        stock: 12,
        description: "Modern urban sneakers with premium construction.",
        features: ["Premium Leather", "Cushioned Sole", "Breathable", "Durable"],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["White", "Black", "Gray"]
    },

    // === NEW ARRIVALS ===
    {
        id: 21,
        name: "Limited Edition Hoodie",
        brand: "NESTAR GAZE",
        price: 5200,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "new",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 5.0,
        reviews: 8,
        stock: 5,
        description: "Exclusive limited edition hoodie.",
        features: ["Limited Edition", "Special Embroidery", "Premium Fabric", "Numbered"],
        sizes: ["M", "L", "XL"],
        colors: ["Black"]
    },
    {
        id: 22,
        name: "Future Tech Tee",
        brand: "NESTAR GAZE",
        price: 2100,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "new",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.9,
        reviews: 12,
        stock: 20,
        description: "Futuristic graphic tee with reflective elements.",
        features: ["Reflective Print", "Tech Fabric", "Modern Fit", "Unique Design"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White"]
    },
    {
        id: 23,
        name: "Modern Cargo Pants",
        brand: "NESTAR GAZE",
        price: 3700,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "new",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.8,
        reviews: 16,
        stock: 15,
        description: "Modern take on classic cargo pants.",
        features: ["Tech Pockets", "Water Resistant", "Stretch Fabric", "Slim Taper"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Black", "Olive", "Gray"]
    },
    {
        id: 24,
        name: "Contemporary Jacket",
        brand: "NESTAR GAZE",
        price: 4800,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "new",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.7,
        reviews: 10,
        stock: 10,
        description: "Contemporary jacket with modern silhouette.",
        features: ["Modern Design", "Premium Construction", "Versatile", "Quality Zippers"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Navy"]
    },
    {
        id: 25,
        name: "Trendy Sweatshirt",
        brand: "NESTAR GAZE",
        price: 3500,
        oldPrice: 0,
        badge: "NEW",
        badgeClass: "",
        category: "new",
        img: getImagePath("GREEN.jpg"), // ✅ FIXED
        rating: 4.9,
        reviews: 14,
        stock: 22,
        description: "On-trend sweatshirt with unique details.",
        features: ["Trendy Design", "Soft Cotton Blend", "Relaxed Fit", "Quality Construction"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Cream"]
    }
];

// Current products array for filtering
let currentProducts = [...products];

// Helper functions
function getStockStatus(stock) {
    if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 5) return { status: 'low-stock', label: `Only ${stock} Left!`, class: 'low-stock' };
    return { status: 'in-stock', label: 'In Stock', class: 'in-stock' };
}

function isProductAvailable(productId, size = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    if (product.stock === 0) return false;
    if (size && product.sizes && !product.sizes.includes(size)) return false;
    return true;
}

// Make available globally
window.getImagePath = getImagePath;
window.products = products;
window.currentProducts = currentProducts;