<div align="center">

# 🚀 WHATSAPP ADMIN PANEL
### 💻 Developed by **Surya K** (Founder of [Nexentora Technologies](https://nexentora.com))

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=800&size=34&duration=3000&pause=1000&color=00FFCC&center=true&vCenter=true&multiline=true&repeat=true&width=750&height=100&lines=%E2%9A%A1+SYSTEM+OPERATIONAL;%F0%9F%94%92+SECURE+CREDENTIALS+ACTIVE;%F0%9F%92%AC+REAL-TIME+MESSAGING" alt="Typing SVG Banner" />

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
&nbsp;&nbsp;
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
&nbsp;&nbsp;
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=00FFCC)](https://socket.io/)
&nbsp;&nbsp;
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
&nbsp;&nbsp;
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
&nbsp;&nbsp;
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

<br/>

```
┌─────────────────────────────────────────────────────────────┐
│  STATUS: ONLINE  │  SECURITY: HIGH  │  RELEASE: v1.0.0      │
└─────────────────────────────────────────────────────────────┘
```

</div>

---

## ⚡ SYSTEM OVERVIEW

A highly secure, sleek admin dashboard designed for real-time WhatsApp messaging automation. Equipped with cookie-based session authorization, bcrypt password hashing, and a customizable monochromatic UI featuring instant light/dark mode toggling.

> ⚠️ **NOTICE**: This project is developed exclusively for **educational and research purposes**.

---

## ⚡ CORE CAPABILITIES

```
┌─────────────────────────────────────────────────────────────────┐
│                       FEATURE GRID                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [✔] Password-Protected Dashboard (bcrypt encryption)          │
│   [✔] Multi-Method Pairing (QR Code Scanner or Pairing Code)    │
│   [✔] Real-Time Interactive Dispatch with Validation            │
│   [✔] Fast Message Template Selection Grid                      │
│   [✔] Clean Live Toast Notification Feeds                       │
│   [✔] Active Session State Metrics (Uptime, Message Logs)       │
│   [✔] Monochromatic Theme Toggler with localStorage Persistence   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ TECH STACK & ARCHITECTURE

| Technology Layer | Core Dependency | Implementation Target | Status Badge |
| :--- | :--- | :--- | :---: |
| **Server Runtime** | `Node.js` | Backend execution engine & runtime | ![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) |
| **API Framework** | `Express` | Middleware pipeline, static assets, routing | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |
| **Sockets** | `Socket.IO` | Bi-directional communication channel | ![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=cyan) |
| **Automation** | `whatsapp-web.js` | Direct browser automation for WA Web client | ![Puppeteer](https://img.shields.io/badge/Puppeteer-Green?style=flat-square) |
| **Cryptography** | `bcryptjs` | Multi-round password hashing logic | ![Security](https://img.shields.io/badge/Security-bcrypt-orange?style=flat-square) |
| **Session Control** | `express-session` | Cookie-based session validation | ![Cookies](https://img.shields.io/badge/Cookies-Secure-blue?style=flat-square) |

---

## ⚡ DIRECTORY LAYOUT

```
whatsapp-admin-panel/
│
├── middleware/
│   └── auth.js              # Route-level validation check
│
├── public/
│   ├── app.js               # Frontend socket operations & events
│   ├── index.html            # Main command dashboard UI
│   ├── login.html            # Security login screen
│   └── style.css             # Full style definitions
│
├── routes/
│   ├── auth.js               # Session handler routes
│   └── whatsapp.js           # WA Client setup & control routes
│
├── services/
│   └── whatsapp.js           # Lifecycle automation wrapper
│
├── utils/
│   └── hash.js               # CLI generator utility for bcrypt hashes
│
├── .env                       # Local secrets configuration
├── package.json               # Manifest file
└── server.js                  # Entrypoint runner
```

---

## ⚡ DEPLOYMENT STEPS

### Prerequisites
Make sure you have Node.js and Google Chrome/Chromium installed on your machine.
```bash
node --version  # Recommended: >= v16.x
npm --version   # Recommended: >= v8.x
```

### 1. Download Workspace
```bash
git clone https://github.com/Suryask1222/whatsapp_web_panel.git
cd whatsapp_web_panel
npm install
```

### 2. Configure Environment Properties
Create a file named `.env` in the root folder:
```env
PORT=3000
SESSION_SECRET=select_a_highly_secure_secret_passphrase
ADMIN_PASSWORD_HASH=$2b$10$9vXuHdXHfXENUFvYOK5lo.LZg10y6GFN0lMz/Bh7WZzmKxMZKM9B.
```
> *Note: The default hash represents the password `admin`. Use the utility below to customize it.*

### 3. Generate Safe Passwords
Run the following utility command:
```bash
node utils/hash.js your_new_password_here
# Replace ADMIN_PASSWORD_HASH in .env with the output
```

### 4. Launch Service
```bash
# Developer Hot Reload Mode
npm run dev

# Normal Server Mode
npm start
```
Go to **`http://localhost:3000`** in your browser.

---

## ⚡ API HANDBOOK

### Authentication Gate

| HTTP Method | Route Endpoint | Request payload | Success Response | Function |
| :---: | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `{ "password": "..." }` | `200 OK` | Establishes authenticated cookie session |
| `POST` | `/api/auth/logout` | None | `200 OK` | Clears active cookie session |
| `GET` | `/api/auth/status` | None | `{ "authenticated": true }` | Checks active session status |

### WhatsApp Controller

| HTTP Method | Route Endpoint | Request payload | Success Response | Function |
| :---: | :--- | :--- | :--- | :--- |
| `POST` | `/api/init` | None | `{ "status": "initializing" }` | Powers on the QR scanner client |
| `POST` | `/api/init-phone` | `{ "phone": "..." }` | `{ "status": "initializing" }` | Requests Pairing Code validation |
| `GET` | `/api/status` | None | `{ "status": "connected" }` | Returns execution state metric |
| `POST` | `/api/send` | `{ "phone": "...", "message": "..." }` | `{ "success": true }` | Dispatches single chat transmission |
| `POST` | `/api/disconnect` | None | `{ "success": true }` | Unlinks device and clears local state |

#### Send Custom Message (via `curl`):
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -b "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"phone":"919876543210","message":"Hello from the API!"}'
```

---

## ⚡ SYSTEM ROADMAP

```
Phase 1 [████████████████████] 100% | Refactoring & Secure Cookie Auth
Phase 2 [████████████████████] 100% | UI Design (Monochromatic Cyberpunk Theme)
Phase 3 [████████████░░░░░░░░]  60% | Multi-Session WhatsApp Management
Phase 4 [██████░░░░░░░░░░░░░░]  30% | Log Persistence Database Setup
```

---

## ⚡ SECURITY COMPLIANCE
```
=====================================================================
  This automation gateway was engineered strictly for educational 
  and personal utility demonstrations. Always comply with legal 
  messaging limits to prevent unexpected account bans.
=====================================================================
```

---

<div align="center">

### 👨‍💻 DEVELOPER ATTRIBUTION

## **SURYA K**
#### **Freelance Web Developer & Founder @ Nexentora Technologies**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nexentora)
&nbsp;&nbsp;
[![Website](https://img.shields.io/badge/Nexentora-000000?style=for-the-badge&logo=google-chrome&logoColor=00FFCC)](https://nexentora.com)

<br/>

```
======================================================
  Built with passion for next-generation automation.
======================================================
```

</div>