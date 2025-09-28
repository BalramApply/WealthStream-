# 💹 WealthStream

WealthStream is a **complete MERN stack investment platform** that simulates a virtual wealth management system.  
It provides authentication, KYC verification, investment products, transaction handling, and portfolio management with interactive visualizations.

---

## 🚀 Features

### 🔐 Authentication & KYC
- User registration & login with **JWT authentication**
- **PAN validation** and **ID document upload**
- KYC status verification

### 📊 Product Management
- 5 seeded investment products (**Stocks, Mutual Funds, Bonds**)
- **Price charts** using Chart.js
- Category filtering and detailed product pages

### 💰 Transactions & Portfolio
- Virtual wallet with **₹1,00,000 starting balance**
- Buy functionality with **real-time balance updates**
- Portfolio dashboard with **P&L calculations**
- Interactive allocation and performance charts

### ⭐ Additional Features
- Watchlist functionality
- Transaction history with filtering
- Responsive UI for all devices
- Comprehensive error handling

---

## 🏗️ Tech Stack

**Frontend**
- React.js (Context API for Auth)
- Chart.js for charts
- CSS Grid & Flexbox for responsive design

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Multer for file uploads

---

## 📂 Project Structure

### Backend Components
- **Models**: `User`, `Product`, `Transaction`, `Portfolio`
- **Controllers**: Auth, Product, Transaction, Portfolio (full CRUD)
- **Routes**: RESTful API endpoints
- **Middleware**: Authentication, File Upload, Error Handling
- **Database**: MongoDB configuration & seed data

### Frontend Components
- **Authentication**: Login, Register, KYC Form with validation
- **Products**: Listing, Filtering, Charts, Detailed Views
- **Portfolio**: Dashboard, Transaction History, Watchlist
- **Common**: Header, Footer, Private Routes
- **Context**: Auth Context for global state
- **Services**: API Service with interceptors

---

## 🖥️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/wealthstream.git
cd wealthstream
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # configure environment variables
npm run seed           # seed initial products
npm run dev            # start backend on http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start              # start frontend on http://localhost:3000
```

---

## ⚙️ Environment Variables

### 🔙 Backend (`.env`)

```env
MONGODB_URI= YOUR_MONGO_URL
NODE_ENV= development
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret_key_here_min_32_characters
```

### 🎨 Frontend (`.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Wealth Stream
```

⚠️ **Important**: Never commit your real credentials to GitHub. Replace sensitive values in `.env.example` with placeholders.

---

## 📖 API Documentation

### 🔐 Auth Routes

#### Register User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Balram",
  "email": "balram@example.com",
  "password": "121212"
}
```

#### Login User

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "balram@gmail.com",
  "password": "121212"
}
```

#### Complete KYC (with file upload)

```http
POST http://localhost:5000/api/auth/kyc
Authorization: Bearer {{token}}
Content-Type: multipart/form-data
```

#### Get Profile

```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer {{token}}
```

---

### 📊 Product Routes

#### Get All Products

```http
GET http://localhost:5000/api/products
```

#### Get Product By ID

```http
GET http://localhost:5000/api/products/{productId}
```

#### Get Products By Category

```http
GET http://localhost:5000/api/products/category/{category}
```

---

### 💰 Portfolio Routes

#### Get Portfolio

```http
GET http://localhost:5000/api/portfolio
Authorization: Bearer {{token}}
```

#### Add to Watchlist

```http
POST http://localhost:5000/api/portfolio/watchlist
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "productId": "68d8d91b460be630651028e7"
}
```

#### Remove from Watchlist

```http
DELETE http://localhost:5000/api/portfolio/watchlist/{productId}
Authorization: Bearer {{token}}
```

#### Get Watchlist

```http
GET http://localhost:5000/api/portfolio/watchlist
Authorization: Bearer {{token}}
```

---

### 💸 Transaction Routes

#### Buy Product

```http
POST http://localhost:5000/api/transactions/buy
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "productId": "68d83afdeb9698d027538ee6",
  "units": 5
}
```

#### Get User Transactions

```http
GET http://localhost:5000/api/transactions
Authorization: Bearer {{token}}
```

---

### 🏥 Health Check

```http
GET http://localhost:5000/health
```

---

## 📱 UI/UX Highlights

* Modern, responsive design (CSS Grid & Flexbox)
* Interactive data visualizations with Chart.js
* Mobile-friendly navigation
* Loading & error states for better UX

---