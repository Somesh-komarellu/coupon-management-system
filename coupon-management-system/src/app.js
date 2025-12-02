const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT } = require('./config');
const couponRoutes = require('./routes/couponRoutes');

const app = express();


app.use(cors());
app.use(bodyParser.json());


const DEMO_USER = {
    email: "hire-me@anshumat.org",
    password: "HireMe@2025!"
};


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
        res.status(200).json({
            message: "Login successful",
            token: "demo-token-12345", 
            user: {
                name: "Reviewer",
                email: DEMO_USER.email,
                role: "Software Developer"
            }
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});



app.use('/coupons', couponRoutes);


app.get('/', (req, res) => {
    res.send('Coupon Management API is running.');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;