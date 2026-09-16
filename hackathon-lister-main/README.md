<div align="center">

# 🎓 CampusEvents — Hackathon & College Event Lister

**Discover. Organize. Participate.**

*A full-stack platform for students to explore hackathons, workshops, competitions, and college events — all in one place.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square)]()



</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Frontend Pages](#-frontend-pages)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)


---

## 🌟 Overview

**CampusEvents** is a modern, full-stack web application designed exclusively for the student community. Whether you're a developer looking for your next hackathon, a club organizer promoting a workshop, or a student hunting for competitions — CampusEvents brings everything under one roof.

> 🏆 Built for students. Powered by passion. Designed for impact.

### Why CampusEvents?

- 🎯 **Centralized Discovery** — No more scattered WhatsApp forwards or missed opportunities. Browse all campus events in one place.
- 🔐 **Secure & Personalized** — JWT-powered authentication ensures your data and events are safe and personal.
- 🛠️ **Student-Led Organization** — Any registered student can create, manage, and promote their own events.
- ⚡ **Blazing Fast Filtering** — Find exactly what you're looking for with multi-dimensional filters in real time.

---


## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Styling, animations, responsive layout |
| JavaScript (Vanilla) | DOM manipulation, API calls, dynamic UI |
| Swiper.js | Touch-friendly event carousel |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment |
| Express.js | REST API framework & routing |
| MySQL | Relational database for persistent storage |

### Security & Auth
| Technology | Purpose |
|------------|---------|
| JWT (jsonwebtoken) | Stateless token-based authentication |
| bcryptjs | Secure password hashing |
| Protected Middleware | Route-level access control |

---

## ✨ Features

### 🔐 User Authentication
- ✅ Secure **signup and login** system
- ✅ **JWT token** generation and validation
- ✅ **bcrypt** password hashing (salted, 10 rounds)
- ✅ Protected routes via **auth middleware**
- ✅ User **profile management** — edit college, year, and personal details

### 📅 Event Management
- ✅ **Create & organize** events with rich details
- ✅ Support for **Technical** and **Non-Technical** categories
- ✅ **Online** and **Offline** event modes
- ✅ Full event metadata — title, description, date, time, organizer, image, registration link, fee, and more
- ✅ **Delete** your own events from the dashboard

### 🔍 Event Discovery
- ✅ **Browse all events** in a two-column responsive layout
- ✅ **Search** events by name or keyword
- ✅ **Multi-filter system** — filter by category, mode (online/offline), and cost (free/paid)
- ✅ **Recently added carousel** powered by Swiper.js
- ✅ **Interactive detail panel** — click any event for a smooth slide-in view

### 📊 Dashboard
- ✅ **Personalized dashboard** for every user
- ✅ **User profile section** with avatar placeholder
- ✅ **Edit profile** inline — college name, study year
- ✅ Placeholder sections for future **registrations** and **certificates**

---

## 📁 Project Structure

```
campusevents/
│
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js                  # Sequelize DB connection
│   ├── 📂 controllers/
│   │   ├── authController.js      # Register, login, profile logic
│   │   └── eventController.js     # CRUD for events
│   ├── 📂 middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── 📂 models/
│   │   ├── User.js                # User Sequelize model
│   │   └── Event.js               # Event Sequelize model
│   ├── 📂 routes/
│   │   ├── authRoutes.js          # Auth API routes
│   │   └── eventRoutes.js         # Event API routes
│   ├── .env                       # Environment variables (not committed)
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── 📂 frontend/
│   ├── 📂 css/
│   │   ├── styles.css             # Global styles
│   │   ├── home.css               # Home page styles
│   │   ├── events.css             # Events page styles
│   │   └── dashboard.css          # Dashboard styles
│   ├── 📂 js/
│   │   ├── auth.js                # Login/register logic
│   │   ├── events.js              # Event listing & filtering
│   │   ├── eventDetail.js         # Event detail panel
│   │   ├── dashboard.js           # Dashboard UI logic
│   │   ├── organizeEvent.js       # Event creation form
│   │   └── home.js                # Home page + carousel
│   ├── 📂 pages/
│   │   ├── home.html              # Landing page
│   │   ├── events.html            # Browse events
│   │   ├── login.html             # Login / Register
│   │   ├── dashboard.html         # User dashboard
│   │   ├── organizeEvent.html     # Create new event
│   │   └── editProfile.html       # Edit profile page
│   └── index.html                 # App entry point
│
├── 📂 screenshots/                # (Add your screenshots here)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) `v16+`
- [MySQL](https://www.mysql.com/) `v8+`
- [npm](https://www.npmjs.com/) `v8+`
- A MySQL client (MySQL Workbench, TablePlus, or CLI)

---

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/campusevents.git
cd campusevents
```

#### 2. Set Up the Backend

```bash
cd backend
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file inside the `/backend` directory:

```bash
cp .env.example .env
```

Then fill in your values (see [Environment Variables](#-environment-variables) section).

#### 4. Set Up the MySQL Database

Log into MySQL and create your database:

```sql
CREATE DATABASE campusevents_db;
```

Sequelize will auto-sync the tables when the server starts (with `sync: { force: false }`).

#### 5. Start the Backend Server

```bash
npm start
# or for development with auto-reload:
npx nodemon server.js
```

The server will start at: **`http://localhost:5000`**

#### 6. Launch the Frontend

Open `frontend/pages/home.html` directly in your browser, **or** use a local server for the best experience:

```bash
# Using VS Code Live Server extension (recommended)
# Right-click home.html → "Open with Live Server"

# OR using npx serve
npx serve frontend/
```

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory with the following variables:

```env
# ─────────────────────────────────────────
# 🖥️  Server Configuration
# ─────────────────────────────────────────
PORT=5000

# ─────────────────────────────────────────
# 🗄️  MySQL Database Configuration
# ─────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_NAME=campusevents_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# ─────────────────────────────────────────
# 🔐 JWT Secret
# ─────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# ─────────────────────────────────────────
# 🌍 CORS / Frontend Origin
# ─────────────────────────────────────────
CLIENT_ORIGIN=http://localhost:3000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 📖 API Documentation

**Base URL:** `http://localhost:5000/api`

### 🔐 Authentication APIs

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user account |
| `POST` | `/auth/login` | ❌ | Login and receive a JWT token |
| `GET` | `/auth/me` | ✅ | Get the currently authenticated user |
| `PUT` | `/auth/profile` | ✅ | Update user profile (college, year) |

#### Example — Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@college.edu",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@college.edu"
  }
}
```

---

#### Example — Login User

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@college.edu",
    "college": "MIT",
    "year": "3rd Year"
  }
}
```

---

### 📅 Event APIs

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/events` | ❌ | Fetch all events (supports query filters) |
| `GET` | `/events/:id` | ❌ | Fetch a single event by ID |
| `POST` | `/events` | ✅ | Create a new event |
| `DELETE` | `/events/:id` | ✅ | Delete an event (owner only) |

#### Query Parameters for `GET /events`

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `category` | `string` | `Technical` | Filter by event category |
| `mode` | `string` | `Online` | Filter by online/offline |
| `type` | `string` | `Free` | Filter by free or paid |
| `search` | `string` | `hackathon` | Search by title keyword |

#### Example — Create Event

**Request:**
```http
POST /api/events
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "CodeFest 2025",
  "description": "24-hour national-level hackathon",
  "date": "2025-11-15",
  "time": "09:00 AM",
  "location": "Main Auditorium, IIT Bombay",
  "category": "Technical",
  "mode": "Offline",
  "type": "Free",
  "organizer": "IEEE Student Chapter",
  "imageUrl": "https://example.com/codefest.jpg",
  "registrationLink": "https://devfolio.co/codefest",
  "registrationFee": 0,
  "isFeatured": true
}
```

---

### 🔒 Auth Header Format

All protected routes require the JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗃️ Database Models

### 👤 User Model

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | INTEGER | Primary Key, Auto Increment |
| `username` | STRING | Not Null, Unique |
| `email` | STRING | Not Null, Unique, Valid Email |
| `password` | STRING | Not Null, Hashed via bcrypt |
| `college` | STRING | Optional |
| `year` | STRING | Optional |
| `createdAt` | DATE | Auto-generated |
| `updatedAt` | DATE | Auto-updated |

### 📅 Event Model

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | INTEGER | Primary Key, Auto Increment |
| `title` | STRING | Not Null |
| `description` | TEXT | Not Null |
| `date` | DATEONLY | Not Null |
| `time` | STRING | Not Null |
| `location` | STRING | Not Null |
| `category` | ENUM | `Technical`, `Non-Technical` |
| `mode` | ENUM | `Online`, `Offline` |
| `type` | ENUM | `Free`, `Paid` |
| `organizer` | STRING | Not Null |
| `imageUrl` | STRING | Optional |
| `registrationLink` | STRING | Optional |
| `registrationFee` | FLOAT | Default: 0 |
| `isFeatured` | BOOLEAN | Default: false |
| `createdBy` | INTEGER | Foreign Key → User.id |
| `createdAt` | DATE | Auto-generated |

---

## 🖥️ Frontend Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 Home | `home.html` | Landing page with Swiper.js carousel of recent events and featured sections |
| 📋 Events | `events.html` | Two-column event browser with live search + multi-filter sidebar |
| 🔍 Event Detail | *(panel in events.html)* | Slide-in panel showing full event details on click |
| 🔑 Login / Register | `login.html` | Tabbed auth page with form validation |
| 📊 Dashboard | `dashboard.html` | User profile, organized events, and settings |
| ➕ Organize Event | `organizeEvent.html` | Full form to create and publish a new event |
| ✏️ Edit Profile | `editProfile.html` | Update college name and study year |

---

## 🔮 Future Enhancements

Here's what's planned on the CampusEvents roadmap:

- [ ] 📧 **Email Notifications** — Automated reminders for registered events via NodeMailer
- [ ] 🗓️ **Event Registration Tracking** — Users can register for events and view them in dashboard
- [ ] 🏅 **Certificates Module** — Upload and display event participation certificates
- [ ] 🌐 **OAuth Integration** — Login with Google / GitHub using Passport.js
- [ ] 📱 **Progressive Web App (PWA)** — Offline support and installable on mobile
- [ ] 🔔 **Real-time Notifications** — Socket.io powered alerts for new events
- [ ] 📊 **Analytics Dashboard** — Organizers can view event reach and registrations
- [ ] 🗺️ **Map Integration** — Google Maps embed for offline event locations
- [ ] 🏷️ **Tags & Trending** — Tag-based discovery and trending events section
- [ ] 🌙 **Dark Mode** — System-aware theme toggle
- [ ] 📤 **Image Upload** — Direct image uploads via Cloudinary / AWS S3 instead of URL
- [ ] 🛡️ **Admin Panel** — Moderation dashboard for approving/removing events

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork** the repository
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone** your forked repo
   ```bash
   git clone https://github.com/your-username/campusevents.git
   ```

3. **Create** a feature branch
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

4. **Make** your changes and **commit** them
   ```bash
   git add .
   git commit -m "✨ feat: add amazing new feature"
   ```

5. **Push** to your branch
   ```bash
   git push origin feature/your-amazing-feature
   ```

6. **Open** a Pull Request on GitHub

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `✨ feat:` | New feature |
| `🐛 fix:` | Bug fix |
| `📝 docs:` | Documentation update |
| `💄 style:` | CSS / UI changes |
| `♻️ refactor:` | Code refactor |
| `🔧 chore:` | Config or tooling changes |



---

## 👨‍💻 Author

<div align="center">

**Built with 🔥 by [Renukesh DurgaPrasad](https://github.com/Renukeshpragada),[Madem hemanth](https://github.com/Hemanth2131)**

*Computer Science student | Full-Stack Developer | Open Source Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Renukeshpragada)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/renukesh-durgaprasad-pragada/)
</div>

---

<div align="center">

### ⭐ If CampusEvents helped you or inspired you, please give it a star!

*It keeps the project alive and motivates future development.* 🙏

---

*"The best way to predict the future is to build it."* — Alan Kay

**© 2025 CampusEvents. Built for students, by students.**

</div>
