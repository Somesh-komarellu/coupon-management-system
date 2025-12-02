# Coupon Management System API

## 1. Project Overview
This project is a RESTful API for an e-commerce platform that manages discount coupons. It allows admins to create coupons with complex eligibility rules (such as minimum cart value, specific categories, and user tiers) and provides a smart "Best Coupon" endpoint that automatically calculates the most beneficial discount for a user's specific cart.

## 2. Tech Stack
* **Language:** JavaScript (Node.js)
* **Framework:** Express.js
* **Storage:** In-memory Data Structure (Array-based persistence)
* **Tools:** Postman (for API testing)

## 3. How to Run

### Prerequisites
* Node.js (v14 or higher) installed.
* npm (Node Package Manager) installed.

### Setup Steps
1.  Clone the repository or download the source code.
2.  Navigate to the project directory:
    ```bash
    cd coupon-management-system
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Start the Service
To start the server:
```bash
npm start

The server will run on http://localhost:3000.

4. API Endpoints & Testing
Authentication (Demo)
POST /login Use these hardcoded credentials to verify access:

Email: hire-me@anshumat.org

Password: HireMe@2025!

Create Coupon
POST /coupons Example Body:


{
  "code": "SAVE50",
  "discountType": "PERCENT",
  "discountValue": 50,
  "startDate": "2023-01-01",
  "endDate": "2025-12-31",
  "eligibility": { "minCartValue": 1000 }
}


Get Best Coupon
POST /coupons/applicable-coupons Example Body:



{
  "user": {
    "userId": "u123",
    "userTier": "GOLD",
    "lifetimeSpend": 2000
  },
  "cart": {
    "items": [
      { "productId": "p1", "price": 2000, "quantity": 1 }
    ]
  }
}




