# SkillConnect | Hyperlocal Skill Exchange System

SkillConnect is a full-stack MERN application designed to spark community growth through the exchange of skills and services. It connects individuals looking for help with talented local volunteers in a secure, reward-based ecosystem.

## Key Features

- **Dynamic Role Management**: Dedicated modules for Users, Volunteers, and Admins.
- **Skill Marketplace**: Efficient workflow for requesting and delivering community services.
- **Micro-Economy**: Integrated points and wallet system to reward contributions.
- **Trusted Network**: Built-in reviews and ratings to maintain high quality.
- **Smart Analytics**: Admin tools for monitoring community health and resolving disputes.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Vite (Modern UI with Glassmorphism)
- **Backend**: Node.js, Express, MongoDB
- **Security**: JWT Authentication, Role-Based Access Control (RBAC)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account

### Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root with:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=5000`

3. **Run Application**:
   - Backend: `npm start`
   - Frontend: `cd frontend && npm run dev`

