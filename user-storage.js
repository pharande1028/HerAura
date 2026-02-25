// User-specific storage utility
function getUserKey(key) {
    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    const userId = customerData.id || customerData.email || 'guest';
    return `${userId}_${key}`;
}

function getUserCart() {
    return JSON.parse(localStorage.getItem(getUserKey('cart')) || '[]');
}

function setUserCart(cart) {
    localStorage.setItem(getUserKey('cart'), JSON.stringify(cart));
}

function getUserWishlist() {
    return JSON.parse(localStorage.getItem(getUserKey('wishlist')) || '[]');
}

function setUserWishlist(wishlist) {
    localStorage.setItem(getUserKey('wishlist'), JSON.stringify(wishlist));
}

function getUserRecentlyViewed() {
    return JSON.parse(localStorage.getItem(getUserKey('recentlyViewed')) || '[]');
}

function setUserRecentlyViewed(items) {
    localStorage.setItem(getUserKey('recentlyViewed'), JSON.stringify(items));
}

// Clear user data on logout
function clearUserData() {
    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    const userId = customerData.id || customerData.email;
    if (userId) {
        localStorage.removeItem(`${userId}_cart`);
        localStorage.removeItem(`${userId}_wishlist`);
        localStorage.removeItem(`${userId}_recentlyViewed`);
    }
}
