# 🏦 Bank System API

A secure and scalable **Bank Management System Backend** built with Node.js, Express, and MongoDB.  
This project simulates real-world banking operations such as account management, transactions, transfers, and admin controls.

---

## 🚀 Features

### 👤 User Features
- User registration and authentication (JWT)
- View personal bank account
- View transaction history
- Account statement with date filtering
- Deposit / Withdraw / Transfer money

### 💰 Banking Features
- Automatic bank account creation on signup
- Balance management
- Transaction tracking (deposit, withdraw, transfer)
- Transaction status (pending, success, failed)

### 🛡️ Admin Features
- Freeze / Unfreeze bank accounts
- View account details
- System-level control over users/accounts

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation
- bcrypt (password hashing)

---

## ⚙️ Installation
npm install
npm run dev
Create .env file:
PORT=3000
SALT_ROUNDS =your salt round
DB_URI =your DB URI
ACCESS_SECRET_KEY =your Access_secret_Key
REFRESH_SECRET_KEY =your Refresh_secret_Key
PREFIX = "Bearer"
EMAIL =  your email
PASSWORD = your password

