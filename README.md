# 🌍 Hyper Local Skill & Service Exchange Platform

A full-stack MERN (MongoDB, Express, React, Node.js) web application that enables users to exchange skills and services within their local community.

This platform allows people to offer their skills and request services from others — promoting collaboration, networking, and community growth without monetary dependency.

---

## 🚀 Live Demo

🔗 Live Link: https://hyper-local-skill-and-service-exchange-qr53.onrender.com/

---

## 📌 Problem Statement

Many individuals possess valuable skills but lack a structured, trusted platform to exchange them locally.  
This project solves that challenge by providing a hyperlocal peer-to-peer skill and service exchange system.

---

## ✨ Key Features

- 🔐 Secure User Authentication (Register / Login)
- 👤 User Profile Management
- 🛠 Create & Manage Skill Listings
- 🔎 Browse Available Services
- 🤝 Send & Manage Service Requests
- 📱 Fully Responsive UI
- 🌐 RESTful API Integration
- 🔄 Complete Frontend ↔ Backend ↔ Database Data Flow
- 🗂 Organized MVC Backend Structure

---

## 🏗 Tech Stack

### 💻 Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### 🖥 Backend
- Node.js
- Express.js
- REST API Architecture
- JWT Authentication

### 🗄 Database
- MongoDB
- Mongoose ODM

### 🔧 Version Control & Deployment
- Git
- GitHub

---

## 📂 Project Structure

```
scratch/
│
├── backend/          # Express server, APIs, controllers
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── frontend/         # React frontend (Vite)
│   ├── src/
│   └── components/
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mourish07/Hyper-Local-Skill-and-Service-Exchange-Platform.git
cd Hyper-Local-Skill-and-Service-Exchange-Platform
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on:  
```
https://hyper-local-skill-and-service-exchange.onrender.com/
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
https://hyper-local-skill-and-service-exchange.onrender.com/```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

⚠️ Never push your `.env` file to GitHub.

---

## 🔄 Application Workflow

1. User registers and logs in.
2. JWT token is generated for authentication.
3. Users create service/skill listings.
4. Other users browse and send exchange requests.
5. Backend APIs handle requests and store data in MongoDB.
6. Frontend dynamically updates using API responses.

---

## 🧠 Learning Outcomes

- Built a complete full-stack MERN application
- Designed RESTful APIs
- Implemented JWT authentication
- Managed state and API integration in React
- Structured backend using MVC pattern
- Implemented secure environment configuration
- Practiced professional Git workflow

---

## 🚀 Future Enhancements

- 💬 Real-time chat using WebSockets
- ⭐ Rating & Review system
- 💳 Payment integration
- 📍 Location-based search filtering
- 🔔 Email / Push notifications
- 📊 Admin dashboard

---

## 👨‍💻 Author

**Mourish**

Full Stack Developer (MERN Stack)
Focused on building scalable and production-ready web applications.

---

## 📜 License

This project is created for educational and portfolio purposes.
