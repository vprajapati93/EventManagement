# 🎉 Event Hall Management System | MERN Stack

A full-stack web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) to manage inquiries, event bookings and more for an event or banquet hall.

---

## 🚀 Features

- 📅 Check real-time event date availability before booking
- 📝 Manage and convert client inquiries into confirmed bookings
- 📧 Send automated email confirmations of booking using **NodeMailer**
- 📤 Upload booking documents (PDFs/images) securely to **Cloudinary**
- 💵 Track all payments status (paid, pending)
- 🗂 Dashboard with tabs for upcoming events, inquiries, and calendar view
- 🔍 Search, filter, and view detailed booking and inquiry info
- 🌐 Fully responsive, modern admin dashboard

---

## 📁 Folder Structure

EventManagement/
├── BackEnd/                          # Node-Express + MongoDB backend
│   ├── controllers/                 # Route logic
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # Express routes
│   ├── middleware/                  # Multer (for uploading files locally before Cloudinary)
│   ├── utils/                       # Utility functions (e.g., email, Cloudinary)
│   ├── .env                         # Environment variables
│   └── server.js                    # Backend entry point
├── FrontEnd/                        # React + Tailwind frontend
│   ├── components/                  # Reusable components
│   ├── pages/                       # Route pages (Dashboard, BookingForm, etc.)
│   ├── App.jsx                      # Root React component
│   ├── main.jsx                     # React entry point
│   ├── .env                         # Frontend environment variables
│   └── vite.config.js               # Vite configuration
├── README.md                        # Project documentation
└── .gitignore                       # Combined ignore file for both frontend & backend

