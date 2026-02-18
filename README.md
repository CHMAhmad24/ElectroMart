# 🛒 ElectroMart

**ElectroMart** is a premium e-commerce platform built for the next generation of tech shopping. 
It features a sleek UI, fast performance, and a user-centric shopping experience.

🔗 **Live Demo:** [https://electro-mart-shop.vercel.app/](https://electro-mart-shop.vercel.app/)

---

## ✨ Features
* **User Authentication:** Secure login and signup for customers.
* **Product Catalog:** Browse products by categories with real-time search.
* **Shopping Cart:** Add, remove, and update product quantities and stock easily.
* **Responsive Design:** Optimized for mobile, tablet, and desktop views.
* **Admin Dashboard:** Manage products, orders, and users.

## 🚀 Tech Stack
* **Frontend:** React.js / HTML5 / CSS3 / TailwindCSS
* **Backend:** Node.js / Express.js 
* **Database:** MongoDB / Cloudinary
* **Hosting:** [Vercel](https://vercel.com/)
* **Icons:** Lucid-React for crisp, scalable vector icons.
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
* **State Management:** Redux 


## 🏗️ Project Structure
```text
ElectroMart/
├── 📁 FrontEnd/                # React Frontend (Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable React & Shadcn UI components
│   │   ├── 📁 pages/          # App pages (Home, Shop, Cart, etc.)
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   └── vite.config.js         # Vite configuration
│
├── 📁 BackEnd/                # Serverless Backend
│   ├── 📁 Config/             # Environment & Global configurations
│   ├── 📁 DataBase/           # Database connection & setup
│   ├── 📁 Email_Verify/       # Email sending & verification logic (Nodemailer/SendGrid)
│   ├── 📁 Middlewares/        # Auth & validation middlewares
│   ├── 📁 Models/             # Database schemas
│   ├── 📁 Routes/             # API endpoint definitions
│   ├── 📁 controllers/        # Business logic & route handlers
│   ├── .env                   # Server environment variables
│   ├── package.json           # Backend dependencies
│   └── server.js              # Serverless entry point
│
├── LICENSE                    # ISC License
└── README.md                  # Project documentation
```

## 🛠️ Installation & Setup

Follow these steps to get the project locally:

Since this project uses **Serverless Functions**, the standard `node server.js` command won't work.
To simulate the production environment locally:

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/CHMAhmad24/ElectroMart.git
    ```
2.  **Install Dependencies:**
    ```bash
    cd FrontEnd
    npm install
    cd BackEnd
    ```
3.  **Install Vercel CLI (Optional but Recommended):**
    To run serverless functions locally:
    ```bash
    npm i -g vercel
    ```
4.  **Run the Project:**
    ```bash
    vercel dev
    ```
    *This command will start both the frontend and the serverless backend on your local machine.*
    ```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Requests.
