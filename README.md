
AthleteX

AthletX is a full-stack e-commerce web application designed for sports and athletic products. It supports user authentication, wishlist functionality, cart management, and vendor/user dashboards.

Features

- User & Vendor Login / Signup
- Add to Wishlist / Move to Cart
- View and Edit Profile
- Product Discounts and Price Calculation
- Secure Password Handling (bcrypt)
- Session-based Authentication
- EJS Templating Engine for Views
- Clean MVC Folder Structure

ATHLETX/
├── config/ # Configuration files (e.g. cloudinary, DB)
├── controller/ # Controllers for handling logic
├── Database/ # Database connection setup
├── middleware/ # Custom middlewares (e.g. auth)
├── models/ # Mongoose schemas
├── public/ # Static files like CSS, JS
├── routes/ # Express routes
├── static/ # Optional static assets (images, etc.)
├── views/ # EJS templates for frontend
├── .env # Environment variables (Not pushed to GitHub)
├── .gitignore # Files to ignore in Git
├── package.json # Project metadata & dependencies
├── package-lock.json # Dependency versions lock file
└── Server.js # Entry point

Tech Stake
- Frontend: HTML, CSS, EJS
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Authentication: bcrypt, express-session
- Cloud Storage: Cloudinary (for image upload)

