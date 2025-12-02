const couponService = require('../services/couponService');
const { validateCoupon } = require('../utils/validation');

exports.createCoupon = (req, res) => {
    const couponData = req.body;
    
    // Basic validation
    const validationErrors = validateCoupon(couponData);
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    const createdCoupon = couponService.createCoupon(couponData);
    res.status(201).json({
        message: "Coupon created successfully",
        coupon: createdCoupon
    });
};

exports.getAllCoupons = (req, res) => {
    const coupons = couponService.getAllCoupons();
    res.status(200).json(coupons);
};

exports.getBestCoupon = (req, res) => {
    const { user, cart } = req.body;

    if (!user || !cart || !cart.items) {
        return res.status(400).json({ error: "Invalid input: User and Cart data required" });
    }

    const result = couponService.findBestCoupon(user, cart);

    if (result) {
        res.status(200).json({
            coupon: result.coupon.code,
            discount: result.discount,
            message: "Best coupon found"
        });
    } else {
        res.status(200).json({
            coupon: null,
            discount: 0,
            message: "No eligible coupon found"
        });
    }
};