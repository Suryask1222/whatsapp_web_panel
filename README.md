<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=800&size=36&duration=3000&pause=1000&color=FFFFFF&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=100&lines=%E2%96%88+WHATSAPP+ADMIN+PANEL+%E2%96%88;%E2%96%93+REAL-TIME+MESSAGING+ENGINE+%E2%96%93" alt="WhatsApp Admin Panel" />

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=14&duration=2500&pause=800&color=888888&center=true&vCenter=true&repeat=true&width=600&height=30&lines=%3E+Initializing+secure+WhatsApp+gateway...;%3E+Socket.IO+handshake+complete...;%3E+QR+engine+ready.+Awaiting+scan...;%3E+System+online.+All+modules+active." alt="Terminal Animation" />

<br/>

![Node.js](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-000000?style=for-the-badge&logo=socketdotio&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-000000?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-000000?style=for-the-badge&logo=css3&logoColor=white)

<br/>

```
╔══════════════════════════════════════════════════════════════╗
║  STATUS: OPERATIONAL  │  MODE: SECURE  │  VERSION: 1.0.0   ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

---

<br/>

## `> SYSTEM OVERVIEW`

A secure, high-performance admin dashboard for real-time WhatsApp messaging automation. Engineered with a modular Node.js backend, cookie-based session security, bcrypt credential hashing, and a responsive monochromatic UI with live theme switching.

> **This project is built strictly for educational and learning purposes only.**

<br/>

---

## `> CORE CAPABILITIES`

```
┌─────────────────────────────────────────────────────────────┐
│                     FEATURE MATRIX                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [■] Password-Protected Admin Login (bcrypt + sessions)     │
│  [■] Dual-Mode WhatsApp Linking (QR Code / Pairing Code)   │
│  [■] Real-Time Message Dispatch with Input Validation       │
│  [■] Pre-Built Message Templates (4 categories)             │
│  [■] Live Toast Notifications + Activity Feed               │
│  [■] Session Dashboard (uptime, msg count, contacts)        │
│  [■] Light / Dark Theme Toggle with localStorage            │
│  [■] WebSocket-Secured Communication (Socket.IO)            │
│  [■] Modular MVC Architecture (routes/services/middleware)   │
│  [■] Environment-Based Configuration (.env)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

<br/>

---

## `> TECH STACK`

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---|:---|
| **Runtime** | Node.js | Server-side JavaScript execution |
| **Framework** | Express.js | HTTP routing and middleware |
| **Real-Time** | Socket.IO | Bi-directional WebSocket events |
| **WhatsApp** | whatsapp-web.js | Puppeteer-based WA Web automation |
| **Auth** | express-session + bcryptjs | Session cookies and password hashing |
| **Config** | dotenv | Environment variable management |
| **Frontend** | HTML5 / CSS3 / Vanilla JS | Responsive monochromatic dashboard |
| **Typography** | Google Inter | Modern variable-weight font |

</div>

<br/>

---

## `> ARCHITECTURE`

```
whatsapp-admin-panel/
│
├── middleware/
│   └── auth.js              # Route-level session guard
│
├── public/
│   ├── app.js               # Client-side Socket.IO + DOM controller
│   ├── index.html            # Main admin dashboard interface
│   ├── login.html            # Secure login gateway
│   └── style.css             # Monochromatic design system (light/dark)
│
├── routes/
│   ├── auth.js               # POST /login, /logout, GET /status
│   └── whatsapp.js           # POST /init, /init-phone, /send, /disconnect
│
├── services/
│   └── whatsapp.js           # WhatsApp client lifecycle manager
│
├── utils/
│   └── hash.js               # CLI bcrypt hash generator
│
├── .env                       # Secrets (SESSION_SECRET, ADMIN_PASSWORD_HASH)
├── .gitignore                 # Git exclusion rules
├── package.json               # Dependencies and scripts
├── server.js                  # Application entry point
└── README.md                  # This file
```

<br/>

---

## `> DEPLOYMENT`

### Prerequisites

```bash
# Required
node --version    # v16.x or higher
npm --version     # v8.x or higher
# Google Chrome or Chromium must be installed (Puppeteer dependency)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/nexentora/whatsapp-admin-panel.git

# Navigate into the project
cd whatsapp-admin-panel

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
SESSION_SECRET=your_super_secret_session_key_here
ADMIN_PASSWORD_HASH=$2b$10$9vXuHdXHfXENUFvYOK5lo.LZg10y6GFN0lMz/Bh7WZzmKxMZKM9B.
```

> The default password is `admin`. Generate a custom hash using the utility below.

### Password Hash Generator

```bash
node utils/hash.js your_new_password
# Output: Hash: $2b$10$...
# Copy the hash into .env as ADMIN_PASSWORD_HASH
```

### Launch

```bash
# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

Navigate to **`http://localhost:3000`** in your browser.

<br/>

---

## `> API REFERENCE`

<details>
<summary><b>Authentication Endpoints</b></summary>

<br/>

| Method | Endpoint | Body | Description |
|:---:|:---|:---|:---|
| `POST` | `/api/auth/login` | `{ password }` | Authenticate and create session |
| `POST` | `/api/auth/logout` | — | Destroy active session |
| `GET` | `/api/auth/status` | — | Check authentication state |

</details>

<details>
<summary><b>WhatsApp Client Endpoints</b></summary>

<br/>

| Method | Endpoint | Body | Description |
|:---:|:---|:---|:---|
| `POST` | `/api/init` | — | Initialize client (QR mode) |
| `POST` | `/api/init-phone` | `{ phone }` | Initialize client (pairing code mode) |
| `GET` | `/api/status` | — | Get WhatsApp connection state |
| `POST` | `/api/send` | `{ phone, message }` | Send a text message |
| `POST` | `/api/disconnect` | — | Logout and destroy WA session |

</details>

<details>
<summary><b>Send Message Example</b></summary>

<br/>

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -b "connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"phone":"919876543210","message":"Hello from the API!"}'
```

> Phone numbers must include country code without `+` (e.g. `919876543210` for India).

</details>

<br/>

---

## `> SCREENSHOTS`

<div align="center">

*Add your screenshots here showcasing the Login Page, Dashboard (dark/light modes), QR Scanning flow, and Message Composer.*

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│             [ LOGIN ]    [ DASHBOARD ]                │
│                                                      │
│             [ QR SCAN ]  [ MESSAGES ]                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

</div>

<br/>

---

## `> ROADMAP`

```
Phase 1 ████████████████████░░░░  80%   Core Features
Phase 2 ████████░░░░░░░░░░░░░░░░  35%   Multi-Session Support
Phase 3 ████░░░░░░░░░░░░░░░░░░░░  15%   Database Integration
Phase 4 ██░░░░░░░░░░░░░░░░░░░░░░  10%   Scheduled Messaging
```

- [ ] Multi-session WhatsApp account management
- [ ] MongoDB / SQLite message history persistence
- [ ] Scheduled and campaign-based messaging
- [ ] Incoming message webhooks and read receipts
- [ ] Contact management and group messaging
- [ ] Rate limiting and abuse prevention

<br/>

---

## `> DISCLAIMER`

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   This project is developed strictly for EDUCATIONAL PURPOSES.    ║
║   It is NOT intended for commercial use, spam, or any activity    ║
║   that violates WhatsApp's Terms of Service.                      ║
║                                                                   ║
║   The developer assumes NO responsibility for misuse of this      ║
║   software. Use at your own risk and in compliance with all       ║
║   applicable laws and regulations.                                ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

<br/>

---

## `> LICENSE`

This project is open-source and licensed under the [MIT License](LICENSE).

<br/>

---

<div align="center">

## `> DEVELOPER`

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=20&duration=2500&pause=1000&color=FFFFFF&center=true&vCenter=true&repeat=true&width=500&height=40&lines=SURYA+K;Freelance+Web+Developer;Founder+%40+Nexentora+Technologies" alt="Developer" />

<br/><br/>

<a href="https://github.com/nexentora">
  <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="https://nexentora.com">
  <img src="https://img.shields.io/badge/Nexentora-000000?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
</a>

<br/><br/>

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Engineered by Surya K  |  Nexentora Technologies
  Full-Stack Web Development  |  Node.js Specialist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=000000&height=100&section=footer" width="100%" />

</div>
#   w h a t s a p p _ w e b _ p a n e l  
 #   w h a t s a p p _ w e b _ p a n e l  
 