
exports.validateCoupon = (data) => {
    const errors = [];
    if (!data.code) errors.push("Coupon code is required");
    if (!data.discountType || !['FLAT', 'PERCENT'].includes(data.discountType)) {
        errors.push("Invalid or missing discountType (FLAT or PERCENT)");
    }
    if (data.discountValue === undefined || data.discountValue < 0) {
        errors.push("Valid discountValue is required");
    }
    if (!data.startDate || !data.endDate) {
        errors.push("Start date and End date are required");
    }
    return errors;
};