// Run this in your browser console (F12 -> Console tab) to clear all products

// Clear all product-related localStorage items
localStorage.removeItem('shopProducts');
localStorage.removeItem('adminProducts');
localStorage.removeItem('products');
localStorage.removeItem('cart');
localStorage.removeItem('wishlist');
localStorage.removeItem('recentlyViewed');
localStorage.removeItem('productReviews');

console.log('✅ All products cleared successfully!');
alert('All products have been cleared from both admin and shop portals!');

// Refresh the current page to see changes
location.reload();