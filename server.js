require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const whatsappService = require('./services/whatsapp');
const requireAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const whatsappRoutes = require('./routes/whatsapp');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Basic middlewares
app.use(cors());
app.use(express.json());

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'whatsapp_default_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false // Set to true if deploying over HTTPS
  }
});

app.use(sessionMiddleware);

// Shared Express session with Socket.IO
io.engine.use(sessionMiddleware);

// Initialize WhatsApp service with Socket.IO
whatsappService.initWhatsApp(io);

// Unprotected API routes (for login)
app.use('/api/auth', authRoutes);

// Auth wall middleware
app.use(requireAuth);

// Static assets (protected by RequireAuth middleware)
app.use(express.static(path.join(__dirname, 'public')));

// Protected API routes
app.use('/api', whatsappRoutes);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  // Security check: Reject unauthorized websocket clients
  const userSession = socket.request.session;
  if (!userSession || !userSession.isAuthenticated) {
    socket.disconnect(true);
    return;
  }

  // Send initial state details to the newly connected socket
  const status = whatsappService.getStatus();
  socket.emit('status', {
    connected: status.connected,
    label: status.label
  });

  if (status.qrDataUrl) {
    socket.emit('qr', status.qrDataUrl);
  }
  
  if (status.connected) {
    socket.emit('ready', { message: 'WhatsApp Connected!' });
  }
});

// Catch-all route to serve the dashboard interface
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 WhatsApp Admin Panel running at http://localhost:${PORT}\n`);
});
