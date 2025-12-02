
const coupons = [];

class CouponModel {
    static create(couponData) {
        
        const existingIndex = coupons.findIndex(c => c.code === couponData.code);
        if (existingIndex !== -1) {
            
            coupons[existingIndex] = couponData;
        } else {
            coupons.push(couponData);
        }
        return couponData;
    }

    static getAll() {
        return coupons;
    }

    static findByCode(code) {
        return coupons.find(c => c.code === code);
    }
}

module.exports = CouponModel;