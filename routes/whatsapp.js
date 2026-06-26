const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsapp');

/**
 * POST /api/init
 * Starts WhatsApp client initialization in QR mode
 */
router.post('/init', (req, res) => {
  if (whatsappService.isInitializationStarted()) {
    return res.json({ success: false, message: 'WhatsApp is already initializing or connected.' });
  }

  whatsappService.setInitializationStarted(true);
  whatsappService.createClient(null);
  res.json({ success: true, message: 'WhatsApp initialization started.' });
});

/**
 * POST /api/init-phone
 * Starts WhatsApp client initialization in Phone pairing-code mode
 */
router.post('/init-phone', (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  if (whatsappService.isInitializationStarted()) {
    return res.json({ success: false, message: 'WhatsApp is already initializing or connected.' });
  }

  // Sanitize: digits only, must be long enough
  const sanitized = phone.replace(/\D/g, '');
  if (sanitized.length < 7) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format. Please include country code.' });
  }

  whatsappService.setInitializationStarted(true);
  whatsappService.createClient(sanitized);
  res.json({ success: true, message: 'Pairing code requested for ' + sanitized });
});

/**
 * GET /api/status
 * Fetches WhatsApp client status details
 */
router.get('/status', (req, res) => {
  const status = whatsappService.getStatus();
  res.json({
    connected: status.connected,
    initialized: status.initialized,
    label: status.label
  });
});

/**
 * POST /api/send
 * Sends message to a specified number
 */
router.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  const status = whatsappService.getStatus();
  if (!status.connected) {
    return res.status(400).json({ success: false, message: 'WhatsApp is not connected.' });
  }

  if (!phone || !message) {
    return res.status(400).json({ success: false, message: 'Recipient phone and message body are required.' });
  }

  // Simple length check to prevent giant payloads
  if (message.length > 4096) {
    return res.status(400).json({ success: false, message: 'Message exceeds the 4096 character limit.' });
  }

  try {
    await whatsappService.sendMessage(phone, message);
    res.json({ success: true, message: `Message successfully sent to ${phone}` });
  } catch (err) {
    console.error('Send message error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to send message.' });
  }
});

/**
 * POST /api/disconnect
 * Disconnects the WhatsApp Web session and destroys state
 */
router.post('/disconnect', async (req, res) => {
  try {
    await whatsappService.disconnect();
    res.json({ success: true, message: 'WhatsApp logged out successfully.' });
  } catch (err) {
    console.error('Disconnect error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Error occurred during disconnect.' });
  }
});

module.exports = router;
