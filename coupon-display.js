function loadProductCoupons(productId, category) {
    const coupons = JSON.parse(localStorage.getItem('herauraCoupons') || '[]');
    const now = new Date();
    
    console.log('Loading coupons for product:', productId, 'category:', category);
    console.log('Available coupons:', coupons);
    
    const applicable = coupons.filter(c => {
        console.log('Checking coupon:', c.code, 'status:', c.status, 'type:', c.type, 'applicableTo:', c.applicableTo);
        
        if (c.status !== 'active') {
            console.log('Coupon', c.code, 'rejected: not active');
            return false;
        }
        if (new Date(c.validUntil) < now) {
            console.log('Coupon', c.code, 'rejected: expired');
            return false;
        }
        
        const isProductPage = window.location.pathname.includes('product-detail');
        if (isProductPage && !['firstPurchase', 'percentage', 'specialDay', 'buy799get199', 'buy999get299'].includes(c.type)) {
            console.log('Coupon', c.code, 'rejected: wrong type for product page');
            return false;
        }
        
        if (c.applicableTo === 'all') {
            console.log('Coupon', c.code, 'accepted: applicable to all');
            return true;
        }
        if (c.applicableTo === 'categories' && c.applicableCategories) {
            const match = c.applicableCategories.some(cat => 
                cat.toLowerCase() === category.toLowerCase() || cat.toLowerCase() === 'all'
            );
            console.log('Coupon', c.code, 'category match:', match, 'categories:', c.applicableCategories);
            return match;
        }
        console.log('Coupon', c.code, 'rejected: no match');
        return false;
    });
    
    console.log('Applicable coupons:', applicable);
    
    const container = document.getElementById('productCoupons');
    if (!container) {
        console.log('Coupon container not found');
        return;
    }
    
    if (applicable.length === 0) {
        console.log('No applicable coupons - hiding section');
        container.innerHTML = '<p style="color: #999; font-style: italic; padding: 0.5rem;">No offers available for this product at the moment.</p>';
        return;
    }
    
    window.productCoupons = applicable;
    
    container.innerHTML = `
        <button onclick="openCouponsModal()" style="display:flex; align-items:center; gap:0.5rem; padding:0.6rem 1rem; background:white; color:#8B4513; border:2px solid #d4a574; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='#fafafa'; this.style.borderColor='#8B4513'" onmouseout="this.style.background='white'; this.style.borderColor='#d4a574'">
            <span>View ${applicable.length} Available Offer${applicable.length > 1 ? 's' : ''}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    `;
}

function openCouponsModal() {
    const modal = document.createElement('div');
    modal.id = 'couponsModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background: white; border-radius: 15px; padding: 2rem; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative;';
    
    const coupons = window.productCoupons || [];
    
    content.innerHTML = `
        <button onclick="closeCouponsModal()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #666; line-height: 1; transition: all 0.3s ease;" onmouseover="this.style.color='#dc3545'; this.style.transform='rotate(90deg)';" onmouseout="this.style.color='#666'; this.style.transform='rotate(0deg)';">&times;</button>
        <h2 style="font-family: 'Playfair Display', serif; color: #8B4513; margin-bottom: 0.5rem; font-size: 1.8rem;">Available Offers</h2>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">Choose from ${coupons.length} exclusive offer${coupons.length > 1 ? 's' : ''} for your order</p>
        ${coupons.map(c => {
            let description = '';
            if (c.type === 'firstPurchase') {
                description = `Get ${c.value}% OFF on your first purchase`;
            } else if (c.type === 'buy799get199') {
                description = `Buy products worth ₹799 and get ₹199 product FREE`;
            } else if (c.type === 'buy999get299') {
                description = `Buy products worth ₹999 and get ₹299 product FREE`;
            } else {
                description = `Get ${c.value}% OFF on orders above ₹${c.minOrder}`;
            }
            
            return `
                <div style="border: 2px solid #d4a574; border-radius: 15px; padding: 1.5rem; margin-bottom: 1rem; background: white; box-shadow: 0 4px 12px rgba(212,165,116,0.15); transition: all 0.3s ease;" onmouseover="this.style.boxShadow='0 6px 20px rgba(139,69,19,0.25)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 12px rgba(212,165,116,0.15)'; this.style.transform='translateY(0)';">
                    <div style="display: flex; gap: 1rem; align-items: start; margin-bottom: 1rem;">
                        <div style="background: #f8f4ef; padding: 0.8rem; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4a574" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 700; color: #8B4513; font-size: 1.3rem; margin-bottom: 0.5rem; letter-spacing: 0.5px;">${c.code}</div>
                            <div style="color: #666; font-size: 0.95rem; line-height: 1.5;">${description}</div>
                            ${c.description ? `<div style="color: #888; font-size: 0.85rem; font-style: italic; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #d4a574;">${c.description}</div>` : ''}
                        </div>
                    </div>
                    <button onclick="copyCouponFromModal('${c.code}')" style="width: 100%; padding: 0.8rem; background: #d4a574; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(212,165,116,0.3);" onmouseover="this.style.background='#8B4513'; this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(139,69,19,0.4)';" onmouseout="this.style.background='#d4a574'; this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(212,165,116,0.3)';">COPY CODE</button>
                </div>
            `;
        }).join('')}
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCouponsModal();
    });
}

function closeCouponsModal() {
    const modal = document.getElementById('couponsModal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

function copyCouponFromModal(code) {
    navigator.clipboard.writeText(code);
    alert('Coupon code "' + code + '" copied!');
}

function copyCoupon(code) {
    navigator.clipboard.writeText(code);
    alert('Coupon code "' + code + '" copied!');
}
