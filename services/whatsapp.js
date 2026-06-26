const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let client = null;
let isConnected = false;
let qrDataUrl = null;
let initializationStarted = false;
let pairingPhone = null;
let pairingRequested = false;
let io = null;

/**
 * Initialize Socket.IO instance for WhatsApp notifications
 */
function initWhatsApp(ioInstance) {
  io = ioInstance;
}

/**
 * Get current connection status info
 */
function getStatus() {
  return {
    connected: isConnected,
    initialized: initializationStarted,
    qrDataUrl,
    label: isConnected 
      ? 'Connected' 
      : initializationStarted 
        ? (pairingPhone ? 'Enter Pairing Code' : 'Initializing...') 
        : 'Not Connected'
  };
}

/**
 * Reset state variables on logout or disconnection
 */
function resetState() {
  isConnected = false;
  initializationStarted = false;
  pairingPhone = null;
  pairingRequested = false;
  client = null;
  qrDataUrl = null;
}

/**
 * Initialize the WhatsApp client connection (QR or Pairing Code mode)
 */
function createClient(phoneForPairing = null) {
  pairingPhone = phoneForPairing;
  pairingRequested = false;

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    },
    webVersionCache: { type: 'none' }
  });

  client.on('qr', async (qr) => {
    if (pairingPhone) {
      if (pairingRequested) return;
      pairingRequested = true;
      try {
        // Wait for WA Web to be fully ready before requesting code
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Inject hook to capture pairing code even if callback fires early
        await client.pupPage.evaluate(() => {
          window._waPairingCode = null;
          const originalHandler = window.onCodeReceivedEvent;
          window.onCodeReceivedEvent = function (code) {
            window._waPairingCode = code;
            if (typeof originalHandler === 'function') {
              originalHandler(code);
            }
          };
        });

        let code;
        try {
          code = await client.requestPairingCode(pairingPhone);
        } catch (err) {
          // Check if custom handler captured the code due to callback race
          code = await client.pupPage.evaluate(() => window._waPairingCode);
          if (!code) throw err;
        }

        const formatted = code.match(/.{1,4}/g)?.join('-') || code;
        if (io) {
          io.emit('pairing_code', { code: formatted, phone: pairingPhone });
          io.emit('status', { connected: false, label: 'Enter Pairing Code' });
        }
      } catch (err) {
        if (io) {
          io.emit('error', { message: 'Could not get pairing code: ' + err.message });
          io.emit('status', { connected: false, label: 'Pairing Failed' });
        }
        resetState();
      }
    } else {
      try {
        qrDataUrl = await qrcode.toDataURL(qr, { width: 280, margin: 2 });
        if (io) {
          io.emit('qr', qrDataUrl);
          io.emit('status', { connected: false, label: 'Scan QR Code' });
        }
      } catch (err) {
        if (io) {
          io.emit('error', { message: 'Failed to generate QR Code' });
        }
      }
    }
  });

  client.on('ready', () => {
    isConnected = true;
    qrDataUrl = null;
    if (io) {
      io.emit('ready', { message: 'WhatsApp Connected!' });
      io.emit('status', { connected: true, label: 'Connected' });
    }
  });

  client.on('authenticated', () => {
    if (io) {
      io.emit('authenticated');
    }
  });

  client.on('auth_failure', (msg) => {
    resetState();
    if (io) {
      io.emit('auth_failure', { message: 'Authentication failed. Try again.' });
      io.emit('status', { connected: false, label: 'Auth Failed' });
    }
  });

  client.on('disconnected', (reason) => {
    resetState();
    if (io) {
      io.emit('disconnected', { reason });
      io.emit('status', { connected: false, label: 'Disconnected' });
    }
  });

  client.initialize().catch(err => {
    console.error('WhatsApp initialization error:', err);
    initializationStarted = false;
    if (io) {
      io.emit('error', { message: 'Failed to initialize WhatsApp client: ' + err.message });
      io.emit('status', { connected: false, label: 'Not Connected' });
    }
  });
}

/**
 * Send a message to a recipient
 */
async function sendMessage(phone, message) {
  if (!isConnected || !client) {
    throw new Error('WhatsApp client is not connected.');
  }

  // Format phone number to WhatsApp layout (number@c.us)
  const sanitized = phone.replace(/\D/g, '');
  const chatId = sanitized.includes('@c.us') ? sanitized : `${sanitized}@c.us`;

  await client.sendMessage(chatId, message);
}

/**
 * Logout and destroy WhatsApp session
 */
async function disconnect() {
  if (!client) {
    throw new Error('No active WhatsApp client session.');
  }

  try {
    await client.logout();
    resetState();
    if (io) {
      io.emit('status', { connected: false, label: 'Not Connected' });
    }
  } catch (err) {
    // If logout fails, attempt a forced destroy
    try {
      await client.destroy();
    } catch (destroyErr) {
      // Ignored: destroy failed
    }
    resetState();
    if (io) {
      io.emit('status', { connected: false, label: 'Not Connected' });
    }
  }
}

module.exports = {
  initWhatsApp,
  getStatus,
  createClient,
  sendMessage,
  disconnect,
  getClient: () => client,
  isInitializationStarted: () => initializationStarted,
  setInitializationStarted: (val) => { initializationStarted = val; }
};
