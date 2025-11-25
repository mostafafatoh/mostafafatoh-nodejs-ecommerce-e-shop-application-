# E-Commerce REST API

**Tech Stack:** Node.js, Express.js, MongoDB, JWT Authentication

## Features
- User registration and login with JWT
- Product CRUD (Create, Read, Update, Delete)
- Cart management
- Order processing
- Modular MVC architecture

## Setup & Installation

### 1. Clone the repo and start the project:
```bash
git clone https://github.com/mostafafatoh/mostafafatoh-nodejs-ecommerce.git
cd mostafafatoh-nodejs-ecommerce
npm install
npm start
```

-------

### 2. Create a .env file with your environment variables:
```bash
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```


-------

### 3. API Endpoints

/api/users → User registration & login

/api/products → Product CRUD

/api/cart → Manage cart

/api/orders → Order processing
-------


### 4. Notes

JWT authentication required for protected routes

MongoDB required for database operations
