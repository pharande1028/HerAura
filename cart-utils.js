// Global Cart & Wishlist Utility Functions
// Use these functions across all pages to ensure consistent cart/wishlist management

function addToCart(productId) {
    let cart = getUserCart();
    const products = JSON.parse(localStorage.getItem('shopProducts')) || [];
    const product = products.find(p => String(p.id) === String(productId));
    const existingItem = cart.find(item => String(item.id) === String(productId));
    
    if (existingItem) {
        alert('This item is already in your cart!');
        return false;
    }
    
    if (product) {
        cart.push({ ...product, quantity: 1 });
        setUserCart(cart);
        if (typeof updateBadges === 'function') updateBadges();
        alert('Product added to cart!');
        return true;
    }
    return false;
}

function toggleWishlist(productId) {
    let wishlist = getUserWishlist();
    const products = JSON.parse(localStorage.getItem('shopProducts')) || [];
    const product = products.find(p => String(p.id) === String(productId));
    const existingIndex = wishlist.findIndex(item => String(item.id) === String(productId));
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        setUserWishlist(wishlist);
        if (typeof updateBadges === 'function') updateBadges();
        alert('Removed from wishlist!');
        return false;
    } else {
        if (product) {
            wishlist.push(product);
            setUserWishlist(wishlist);
            if (typeof updateBadges === 'function') updateBadges();
            alert('Added to wishlist!');
            return true;
        }
    }
    return false;
}
