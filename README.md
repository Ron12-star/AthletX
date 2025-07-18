

🛒 ATHLETX - E-Commerce Web Application

Athlex is a comprehensive, full-featured e-commerce web application built to streamline the experience for both vendors and customers. Designed with scalability and performance in mind, this platform provides real-time product management, seamless order processing, and an intuitive user interface for efficient online transactions.

🙌 Features
---
👤 User & Vendor authentication

🛍️ Add to cart, order, wishlist

📦 Vendor dashboard with sweet inventory management

📄 Order confirmation and history

🔒 Secure routes using middleware

🌩️ Cloudinary integration for image uploads

✅ Jest-based unit testing

## 📁 Folder Structure

```

ATHLEX

├── config/
│ └── cloudinary.js
├── controller/
│ ├── cartroute.js
│ ├── itemsAtHomepage.js
│ ├── Login.js
│ ├── logout.js
│ ├── order.js
│ ├── profile.js
│ ├── profileupdate.js
│ ├── Signup.js
│ ├── UserDashboard.js
│ ├── vendorDashboard.js
│ ├── WishlistController.js
│ └── vendorcontroller/
├── Database/
│ └── DB.js
├── middleware/
│ ├── authmiddleware.js
│ └── upload.js
├── models/
│ ├── CartSchema.js
│ ├── OrderSchema.js
│ ├── productschema.js
│ ├── UserSchema.js
│ └── WishlistSchema.js
├── public/
│ ├── css/
│ ├── Images/
│ └── form.html
├── routes/
│ ├── authRouter.js
│ ├── cartRouter.js
│ ├── CategoryRouter.js
│ ├── OrderRoutes.js
│ ├── updateProfile.js
│ ├── vendorRouter.js
│ └── WishlistRouter.js
├── static/
│ ├── cart.js
│ ├── category.js
│ ├── cloudnary.js
│ ├── index.js
│ ├── vendor.js
│ └── wishlist.js
├── views/
│ ├── cart.ejs
│ ├── category.ejs
│ ├── checkout.ejs
│ ├── home.ejs
│ ├── login.ejs
│ ├── profile.ejs
│ ├── signup.ejs
│ ├── userLogin.ejs
│ ├── userorder-confirmation.ejs
│ ├── userorder-panding.ejs
│ ├── vendor.ejs
│ ├── vendorcomplete.ejs
│ ├── vendorpending.ejs
│ └── wishlist.ejs
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

````



## 💻 Tech Stack

### 🔧 Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **Cloudinary** for Image Uploads
- **Multer** for file handling

### 🎨 Frontend
##
- **HTML, CSS**
- **EJS** (Embedded JavaScript Templates)


## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Ron12-star/athlex.git
cd athlex
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file and set:

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

### 4️⃣ Run the Server

```bash
npm start
```

The server will run at [http://localhost:3000](http://localhost:3000)

---


## 🖼️ Screenshots

### 🏠 Homepage  
![Homepage](assets/Home.png)

### 📦 Vendor Dashboard  
![Vendor Dashboard](assets/VendorDashBoard.png)

### 🔐 Login Page  
![Login Page](assets/LoginPage.png)

### 🗂️ Category Wise Page  
![Category Page](assets/Category.png)

### 🛒 Shopping Cart  
![Cart](assets/cart.png)

### 💖 Wishlist Page  
![Wish List](assets/wishlist.png)

### 💳 Checkout Page  
![CheckOut](assets/checkout.png)

### 📦 Order Status Page  
![Order Status](assets/order-status.png)



## 🧠 Authors

* **Ronak Rathwa** - [Your Profile](https://github.com/Ron12-star)
* Contributors welcome!



