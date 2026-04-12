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
├── 📁 FrontEnd/               # React Frontend (Vite)
│   └── 📁 src/
│       ├── 📁 Assets/         # Images, Icons, and static media
│       ├── 📁 CSS/            # Stylesheets (Sass/Tailwind/Global CSS)
│       ├── 📁 Context/        # React Context API providers
│       ├── 📁 ReduxToolkit/   # State management (Slices & Store)
│       ├── 📁 components/     # UI and Shared components
│       │   └── 📁 ui/         # Shadcn/Base UI elements
│       ├── 📁 lib/            # Utility functions & Third-party configs
│       └── 📁 pages/          # Application routes/screens
│           └── 📁 admin/      # Admin specific pages
│
├── 📁 BackEnd/                # Serverless Backend
│   ├── 📁 Config/             # Environment & Global configurations
│   ├── 📁 DataBase/           # Database connection logic
│   ├── 📁 Email_Verify/       # Nodemailer/SendGrid logic
│   ├── 📁 Middlewares/        # Auth & validation filters
│   ├── 📁 Models/             # Database schemas (Mongoose/Sequelize)
│   ├── 📁 Routes/             # API endpoint definitions
│   └── 📁 controllers/        # Business logic & handlers
│
├── LICENSE                    # Project License
└── README.md                  # Documentation
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
    npm install
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

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Requests.
