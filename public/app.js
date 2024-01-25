const socket = io();

// Connection event
socket.on('connect', () => {
  console.log('Connected to server');
});

// Login event
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    // Send the username and password to the server for login
    socket.emit('login', { username, password });
  }
});

// Login success event
socket.on('login success', ({ username, socketId }) => {
  console.log(`Login successful: ${username}`);
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('chatPage').style.display = 'block';
});

// Login error event
socket.on('login error', (error) => {
  console.error(`Login error: ${error}`);
  alert(error);
});

// Chat message event
socket.on('chat message', (data) => {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');
  li.textContent = `${data.from}: ${data.message}`;
  messages.appendChild(li);
});

// Private message event
socket.on('private message', (data) => {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');
  li.textContent = `[Private from ${data.from}]: ${data.message}`;
  messages.appendChild(li);
});

// Private message error event
socket.on('private message error', (error) => {
  console.error(`Private message error: ${error}`);
  alert(error);
});

// Disconnect event
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Form submission event for sending messages
document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.getElementById('message').value;
  if (message) {
    // Send the message to the server
    socket.emit('chat message', message);
    document.getElementById('message').value = '';
  }
});

// Form submission event for sending private messages
document.getElementById('privateMessageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const toUser = document.getElementById('toUser').value;
  const privateMessage = document.getElementById('privateMessage').value;
  if (toUser && privateMessage) {
    // Send the private message to the specified user
    socket.emit('private message', { to: toUser, message: privateMessage });
    document.getElementById('toUser').value = '';
    document.getElementById('privateMessage').value = '';
  }
});
