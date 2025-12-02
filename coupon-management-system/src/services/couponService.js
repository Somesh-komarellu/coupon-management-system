const CouponModel = require('../models/Coupon.js');

class CouponService {
    createCoupon(data) {
        return CouponModel.create(data);
    }

    getAllCoupons() {
        return CouponModel.getAll();
    }

    
    isCouponEligible(coupon, user, cart, cartTotal) {
        const now = new Date();
        const start = new Date(coupon.startDate);
        const end = new Date(coupon.endDate);

        
        if (now < start || now > end) return false;

        
        const eligibility = coupon.eligibility || {};

        
        if (eligibility.allowedUserTiers && eligibility.allowedUserTiers.length > 0) {
            if (!eligibility.allowedUserTiers.includes(user.userTier)) return false;
        }
        
        if (eligibility.allowedCountries && eligibility.allowedCountries.length > 0) {
            if (!eligibility.allowedCountries.includes(user.country)) return false;
        }

        if (eligibility.minLifetimeSpend !== undefined) {
            if ((user.lifetimeSpend || 0) < eligibility.minLifetimeSpend) return false;
        }

        if (eligibility.minOrdersPlaced !== undefined) {
            if ((user.ordersPlaced || 0) < eligibility.minOrdersPlaced) return false;
        }

        if (eligibility.firstOrderOnly === true) {
            if ((user.ordersPlaced || 0) > 0) return false;
        }

        
        if (eligibility.minCartValue !== undefined) {
            if (cartTotal < eligibility.minCartValue) return false;
        }

        if (eligibility.minItemsCount !== undefined) {
            const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems < eligibility.minItemsCount) return false;
        }

        if (eligibility.applicableCategories && eligibility.applicableCategories.length > 0) {
            const cartCategories = cart.items.map(item => item.category);
            const hasApplicableCategory = cartCategories.some(cat => eligibility.applicableCategories.includes(cat));
            if (!hasApplicableCategory) return false;
        }

        if (eligibility.excludedCategories && eligibility.excludedCategories.length > 0) {
            const cartCategories = cart.items.map(item => item.category);
            const hasExcludedCategory = cartCategories.some(cat => eligibility.excludedCategories.includes(cat));
            if (hasExcludedCategory) return false;
        }

        return true;
    }

    
    calculateDiscount(coupon, cartTotal) {
        let discount = 0;
        if (coupon.discountType === 'FLAT') {
            discount = coupon.discountValue;
        } else if (coupon.discountType === 'PERCENT') {
            discount = (coupon.discountValue / 100) * cartTotal;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        }
        
        return Math.min(discount, cartTotal); 
    }

    findBestCoupon(user, cart) {
        const allCoupons = CouponModel.getAll();
        
        
        const cartTotal = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        const eligibleCoupons = [];

        for (const coupon of allCoupons) {
            if (this.isCouponEligible(coupon, user, cart, cartTotal)) {
                const discountAmount = this.calculateDiscount(coupon, cartTotal);
                eligibleCoupons.push({
                    coupon: coupon,
                    discount: discountAmount
                });
            }
        }

        if (eligibleCoupons.length === 0) return null;

        
        eligibleCoupons.sort((a, b) => {
            if (b.discount !== a.discount) {
                return b.discount - a.discount; 
            }
            const dateA = new Date(a.coupon.endDate);
            const dateB = new Date(b.coupon.endDate);
            if (dateA - dateB !== 0) {
                return dateA - dateB; // 
            }
            return a.coupon.code.localeCompare(b.coupon.code); 
        });

        return eligibleCoupons[0];
    }
}

module.exports = new CouponService();