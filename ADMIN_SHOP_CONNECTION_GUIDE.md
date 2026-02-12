# HerAura - Admin to Shop Connection Guide

## Issue Fixed: Products added in admin not showing in shop

### What was the problem?
- Admin panel was saving products to backend database
- Shop page was only loading from localStorage (local storage)
- No connection between backend and frontend shop display

### What has been fixed:

#### 1. **Updated Shop Page (shop.html)**
- Now loads products from backend API first
- Falls back to localStorage if backend is unavailable
- Auto-refreshes every 10 seconds to show new products

#### 2. **Updated Product Detail Page (product-detail.html)**
- Now loads individual product details from backend
- Supports all admin form fields (features, specifications, etc.)
- Falls back to localStorage if backend fails

#### 3. **Updated Product Model (backend/src/models/Product.js)**
- Added all missing fields from admin form:
  - shortDescription, features, availableSizes
  - sizeGuideImage, specifications, supplierInfo
  - careInstructions, categories, limitedEdition
  - giftingOccasions

#### 4. **Created Backend Startup Script**
- `start-backend.bat` - Double-click to start the backend server

## How to use:

### Step 1: Start the Backend Server
1. Double-click `start-backend.bat` OR
2. Open terminal in project folder and run:
   ```bash
   cd backend
   npm install
   node server.js
   ```
3. Server will start on http://localhost:5000

### Step 2: Add Products via Admin
1. Open `admin-login.html` in browser
2. Login to admin panel
3. Go to Product Management
4. Add products using the form
5. Products are saved to MongoDB database

### Step 3: View Products in Shop
1. Open `shop.html` in browser
2. Products from admin will automatically appear
3. Shop refreshes every 10 seconds for new products
4. Click on any product to view details

## Technical Details:

### API Endpoints Used:
- `GET /api/products` - Load all products for shop
- `GET /api/products/:id` - Load single product for detail page
- `POST /api/products` - Create new product (admin only)

### Data Flow:
```
Admin Form → Backend API → MongoDB → Shop Page Display
```

### Fallback System:
- If backend is down, shop loads from localStorage
- Ensures shop still works even without server
- Products added while offline will sync when server returns

## Troubleshooting:

### Products not showing?
1. Check if backend server is running (http://localhost:5000)
2. Check browser console for API errors
3. Verify MongoDB connection in backend

### Backend not starting?
1. Make sure Node.js is installed
2. Run `npm install` in backend folder
3. Check if MongoDB is running
4. Verify .env file has correct database URL

### Still having issues?
- Check browser developer tools (F12) for errors
- Verify network requests in Network tab
- Check backend server logs for errors

## Success Indicators:
✅ Backend server shows "Server running on http://localhost:5000"
✅ Admin can add products successfully
✅ Shop page loads products from backend
✅ Product detail pages show all admin form data
✅ Shop auto-refreshes to show new products

The connection between admin and shop is now fully functional!