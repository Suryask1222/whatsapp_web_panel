// WhatsApp Admin Panel - Frontend Operations Script
'use strict';

// State management
const state = {
  connected: false,
  sessionStart: null,
  messagesSent: 0,
  contacts: new Set(),
  toastEnabled: true,
  soundEnabled: false,
};

// Socket.IO connection and event routing
const socket = io();

socket.on('connect', () => {
  logActivity('Socket connected to server', 'info');
});

socket.on('status', ({ connected, label }) => {
  updateStatus(connected, label);
});

socket.on('qr', (dataUrl) => {
  showQR(dataUrl);
  logActivity('QR Code generated — scan with WhatsApp', 'info');
  addToast('QR Ready', 'Scan the QR code with your WhatsApp', 'info');
});

socket.on('pairing_code', ({ code, phone }) => {
  showPairingCode(code, phone);
  logActivity(`Pairing code sent: ${code} for +${phone}`, 'success');
  addToast('Pairing Code Ready', `Enter ${code} in WhatsApp`, 'success');
});

socket.on('authenticated', () => {
  logActivity('WhatsApp account authenticated', 'success');
});

socket.on('ready', ({ message }) => {
  updateStatus(true, 'Connected');
  hideQR();
  hidePairingCode();
  logActivity(message, 'success');
  addToast('Connected!', 'WhatsApp is ready to use', 'success');
  startSessionTimer();
});

socket.on('disconnected', ({ reason }) => {
  updateStatus(false, 'Disconnected');
  logActivity(`Disconnected: ${reason}`, 'error');
  addToast('Disconnected', reason, 'error');
  stopSessionTimer();
});

socket.on('auth_failure', ({ message }) => {
  updateStatus(false, 'Auth Failed');
  logActivity(`Auth failure: ${message}`, 'error');
  addToast('Authentication Failed', message, 'error');
});

socket.on('error', ({ message }) => {
  logActivity(`Error: ${message}`, 'error');
  addToast('Error', message, 'error');
});

// Session timer
let sessionInterval = null;

function startSessionTimer() {
  state.sessionStart = Date.now();
  if (sessionInterval) clearInterval(sessionInterval);
  sessionInterval = setInterval(updateSessionStat, 10000);
  updateSessionStat();
}

function stopSessionTimer() {
  if (sessionInterval) { 
    clearInterval(sessionInterval); 
    sessionInterval = null; 
  }
  state.sessionStart = null;
  el('statSession').textContent = '0m';
}

function updateSessionStat() {
  if (!state.sessionStart) return;
  const mins = Math.floor((Date.now() - state.sessionStart) / 60000);
  el('statSession').textContent = mins < 60 ? `${mins}m` : `${Math.floor(mins/60)}h${mins%60}m`;
}

// Update connection status in UI elements
function updateStatus(connected, label) {
  state.connected = connected;

  // Sidebar elements
  const dot = el('statusDot');
  const txt = el('statusText');
  dot.classList.toggle('connected', connected);
  txt.textContent = label;

  // Topbar elements
  el('topStatusDot').classList.toggle('connected', connected);
  el('topStatusText').textContent = label;

  // Dashboard badge
  const badge = el('connectionBadge');
  badge.textContent = connected ? 'Online' : 'Offline';
  badge.classList.toggle('online', connected);

  // Settings badge
  const sBadge = el('settingsConnectionBadge');
  sBadge.textContent = connected ? 'Online' : 'Offline';
  sBadge.classList.toggle('online', connected);

  // QR panel actions
  el('btnConnect').classList.toggle('hidden', connected);
  el('btnDisconnect').classList.toggle('hidden', !connected);

  // Phone panel actions
  el('btnConnectPhone').classList.toggle('hidden', connected);
  el('btnDisconnectPhone').classList.toggle('hidden', !connected);

  // Server URL display
  el('serverUrl').textContent = window.location.origin;
}

// QR code UI helpers
function showQR(dataUrl) {
  const img = el('qrImage');
  const placeholder = el('qrPlaceholder');
  img.src = dataUrl;
  img.classList.remove('hidden');
  placeholder.classList.add('hidden');
  el('qrSection').classList.add('scanning');
}

function hideQR() {
  el('qrImage').classList.add('hidden');
  el('qrPlaceholder').classList.remove('hidden');
  el('qrSection').classList.remove('scanning');
  el('qrPlaceholder').querySelector('.qr-center-text').textContent = 'Connected';
}

// Pairing code UI helpers
let pairingCountdownInterval = null;

function showPairingCode(code, phone) {
  el('pairingCodeDigits').textContent = code;
  el('pairingCodeDisplay').classList.remove('hidden');
  el('phoneLoginForm').classList.add('hidden');
  startPairingCountdown(60);
}

function hidePairingCode() {
  el('pairingCodeDisplay').classList.add('hidden');
  el('phoneLoginForm').classList.remove('hidden');
  stopPairingCountdown();
}

function startPairingCountdown(seconds) {
  stopPairingCountdown();
  let remaining = seconds;
  const bar = el('pairingBar');
  const timer = el('pairingTimer');
  bar.style.width = '100%';
  timer.textContent = remaining;
  pairingCountdownInterval = setInterval(() => {
    remaining--;
    timer.textContent = remaining;
    bar.style.width = `${(remaining / seconds) * 100}%`;
    if (remaining <= 10) bar.style.background = 'var(--red)';
    if (remaining <= 0) {
      stopPairingCountdown();
      el('pairingExpireNote').innerHTML = '<span style="color:var(--red)">Code expired — try again</span>';
    }
  }, 1000);
}

function stopPairingCountdown() {
  if (pairingCountdownInterval) { 
    clearInterval(pairingCountdownInterval); 
    pairingCountdownInterval = null; 
  }
}

// Connect WhatsApp via QR
el('btnConnect').addEventListener('click', async () => {
  setButtonLoading(el('btnConnect'), true);
  try {
    const res = await apiPost('/api/init');
    if (res.success) {
      logActivity('WhatsApp client initializing (QR mode)…', 'info');
      addToast('Initializing', 'Generating QR code…', 'info');
    } else {
      addToast('Notice', res.message, 'info');
    }
  } catch (e) {
    addToast('Error', 'Could not reach the server', 'error');
  }
  setButtonLoading(el('btnConnect'), false);
});

// Connect WhatsApp via Phone pairing code
el('btnConnectPhone').addEventListener('click', async () => {
  const phone = el('pairingPhoneInput').value.trim();
  if (!phone) {
    addToast('Required', 'Please enter your phone number', 'error');
    el('pairingPhoneInput').focus();
    return;
  }
  setButtonLoading(el('btnConnectPhone'), true);
  try {
    const res = await apiPost('/api/init-phone', { phone });
    if (res.success) {
      logActivity(`Requesting pairing code for +${phone.replace(/\D/g,'')}…`, 'info');
      addToast('Please wait…', 'Requesting pairing code. Takes ~15s', 'info');
    } else {
      addToast('Notice', res.message, 'info');
    }
  } catch (e) {
    addToast('Error', 'Could not reach the server', 'error');
  }
  setButtonLoading(el('btnConnectPhone'), false);
});

// Copy pairing code to clipboard
el('btnCopyCode').addEventListener('click', async () => {
  const code = el('pairingCodeDigits').textContent.replace(/-/g, '');
  try {
    await navigator.clipboard.writeText(code);
    const origText = el('btnCopyCode').lastChild.textContent;
    el('btnCopyCode').lastChild.textContent = ' Copied!';
    setTimeout(() => { el('btnCopyCode').lastChild.textContent = origText; }, 1500);
    addToast('Copied!', 'Pairing code copied to clipboard', 'success');
  } catch {
    addToast('Manual copy', 'Select the code and copy it manually', 'info');
  }
});

// Disconnect/Logout active WhatsApp session
async function disconnectWA() {
  try {
    const res = await apiPost('/api/disconnect');
    if (res.success) {
      addToast('Logged Out', 'WhatsApp has been disconnected', 'success');
      logActivity('Disconnected by user', 'info');
      stopSessionTimer();
      updateStatus(false, 'Not Connected');
      // Reset QR UI
      el('qrImage').classList.add('hidden');
      el('qrPlaceholder').classList.remove('hidden');
      el('qrPlaceholder').querySelector('.qr-center-text').textContent = 'Press Connect\nto generate QR';
      // Reset phone UI
      hidePairingCode();
      el('pairingPhoneInput').value = '';
    } else {
      addToast('Error', res.message, 'error');
    }
  } catch {
    addToast('Error', 'Could not reach the server', 'error');
  }
}
el('btnDisconnect').addEventListener('click', disconnectWA);
el('btnDisconnectPhone').addEventListener('click', disconnectWA);
el('settingsDisconnect').addEventListener('click', disconnectWA);

// Send message
el('btnSend').addEventListener('click', async () => {
  const phone = el('phoneInput').value.trim();
  const message = el('messageInput').value.trim();

  if (!phone) { addToast('Validation', 'Please enter a phone number', 'error'); return; }
  if (!message) { addToast('Validation', 'Please enter a message', 'error'); return; }
  if (!state.connected) { addToast('Not Connected', 'Connect WhatsApp first', 'error'); return; }

  setButtonLoading(el('btnSend'), true);
  try {
    const res = await apiPost('/api/send', { phone, message });
    if (res.success) {
      state.messagesSent++;
      state.contacts.add(phone);
      el('statSent').textContent = state.messagesSent;
      el('statContacts').textContent = state.contacts.size;

      addMessageToList(phone, message);
      logActivity(`Message sent to ${phone}`, 'success');
      addToast('Sent!', `Message delivered to ${phone}`, 'success');
      if (state.soundEnabled) playBeep();

      // Clear form
      el('messageInput').value = '';
      updateCharCount();
    } else {
      addToast('Failed', res.message, 'error');
      logActivity(`Failed to send to ${phone}: ${res.message}`, 'error');
    }
  } catch (e) {
    addToast('Error', 'Could not reach the server', 'error');
  }
  setButtonLoading(el('btnSend'), false);
});

// Character counter
el('messageInput').addEventListener('input', updateCharCount);
function updateCharCount() {
  const count = el('messageInput').value.length;
  const counter = el('charCount');
  counter.textContent = count;
  counter.style.color = count > 3800 ? 'var(--red)' : count > 3000 ? '#f59e0b' : '';
}

// Template buttons setup
document.querySelectorAll('.template-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    el('messageInput').value = btn.dataset.tpl;
    updateCharCount();
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
    navigateTo('messages');
    el('messageInput').focus();
  });
});

// Sidebar page navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    if (item.id === 'btnSidebarLogout') return; // Handled separately
    navigateTo(item.dataset.page);
    if (window.innerWidth <= 720) closeSidebar();
  });
});

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${page}`);
  const activePage = document.getElementById(`page-${page}`);
  if (activeNav) activeNav.classList.add('active');
  if (activePage) activePage.classList.add('active');
  const titles = { dashboard: 'Dashboard', messages: 'Messages', settings: 'Settings' };
  el('pageTitle').textContent = titles[page] || page;
}

// Login tab switching
document.querySelectorAll('.login-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    el('panelQR').classList.toggle('hidden', which !== 'qr');
    el('panelPhone').classList.toggle('hidden', which !== 'phone');
  });
});

// Hamburger menu
el('hamburger').addEventListener('click', () => {
  const sidebar = el('sidebar');
  sidebar.classList.toggle('open');
  el('sidebarOverlay').classList.toggle('hidden', !sidebar.classList.contains('open'));
});
el('sidebarOverlay').addEventListener('click', closeSidebar);
function closeSidebar() {
  el('sidebar').classList.remove('open');
  el('sidebarOverlay').classList.add('hidden');
}

// Settings toggles
el('toastToggle').addEventListener('change', function() {
  state.toastEnabled = this.checked;
});
el('soundToggle').addEventListener('change', function() {
  state.soundEnabled = this.checked;
});

// Theme switcher
const themeToggle = el('themeToggle');
if (localStorage.getItem('theme') === 'light') {
  themeToggle.checked = true;
}
themeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    logActivity('Switched to light theme', 'info');
  } else {
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    logActivity('Switched to dark theme', 'info');
  }
});

el('settingsClearLog').addEventListener('click', () => {
  el('activityList').innerHTML = '<li class="activity-empty">Log cleared</li>';
  addToast('Done', 'Activity log cleared', 'success');
});

// Session logout operations
async function handleLogout() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      window.location.href = '/login.html';
    } else {
      addToast('Error', data.message || 'Logout failed', 'error');
    }
  } catch (err) {
    addToast('Error', 'Could not reach the server', 'error');
  }
}

el('settingsLogout').addEventListener('click', handleLogout);
el('btnSidebarLogout').addEventListener('click', (e) => {
  e.preventDefault();
  handleLogout();
});

// Helpers
function el(id) { return document.getElementById(id); }

async function apiPost(url, body = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (res.status === 401) {
    window.location.href = '/login.html';
    return { success: false, message: 'Unauthorized session' };
  }
  
  return res.json();
}

function setButtonLoading(btn, loading) {
  const loader = btn.querySelector('.btn-loader');
  const text = btn.querySelector('.btn-text');
  const icon = btn.querySelector('svg');
  if (loading) {
    if (loader) { loader.classList.remove('hidden'); loader.classList.add('light'); }
    if (text) text.style.opacity = '0.5';
    if (icon) icon.style.opacity = '0.5';
    btn.disabled = true;
  } else {
    if (loader) loader.classList.add('hidden');
    if (text) text.style.opacity = '';
    if (icon) icon.style.opacity = '';
    btn.disabled = false;
  }
}

function logActivity(text, type = 'info') {
  const list = el('activityList');
  const empty = list.querySelector('.activity-empty');
  if (empty) empty.remove();

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const li = document.createElement('li');
  li.className = 'activity-item';
  li.innerHTML = `
    <span class="activity-dot ${type}"></span>
    <span class="activity-text">${escHtml(text)}</span>
    <span class="activity-time">${now}</span>
  `;
  list.prepend(li);

  while (list.children.length > 50) list.lastElementChild.remove();
}

function addMessageToList(phone, message) {
  const list = el('messageList');
  const empty = list.querySelector('.activity-empty');
  if (empty) empty.remove();

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const short = message.length > 80 ? message.slice(0, 80) + '…' : message;

  const li = document.createElement('li');
  li.className = 'msg-item';
  li.innerHTML = `
    <div class="msg-to"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg> ${escHtml(phone)}</div>
    <div class="msg-body">${escHtml(short)}</div>
    <div class="msg-time">${now}</div>
  `;
  list.prepend(li);
  while (list.children.length > 100) list.lastElementChild.remove();
}

function addToast(title, msg, type = 'success') {
  if (!state.toastEnabled) return;
  const icons = {
    success: `<svg class="toast-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px; height:16px; margin-top:2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg class="toast-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px; height:16px; margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg class="toast-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px; height:16px; margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };
  const dur = 3800;
  const container = el('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.setProperty('--toast-dur', `${dur}ms`);
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || ''}</span>
    <div class="toast-body">
      <div class="toast-title">${escHtml(title)}</div>
      <div class="toast-msg">${escHtml(msg)}</div>
    </div>
    <span class="toast-close" role="button" tabindex="0">✕</span>
  `;
  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), dur);
}

function removeToast(toast) {
  toast.style.animation = 'none';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  toast.style.transition = 'all 0.25s ease';
  setTimeout(() => toast.remove(), 250);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* ignore */ }
}

// Initialization
(async () => {
  try {
    const res = await fetch('/api/status');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    const status = await res.json();
    updateStatus(status.connected, status.label);
    if (status.connected) startSessionTimer();
  } catch (err) {
    // Server might be booting up
  }

  el('serverUrl').textContent = window.location.origin;
  logActivity('Panel loaded', 'info');
})();
