// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Map to store user information (username: { password, socketId })
const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user login or registration
  socket.on('login', ({ username, password }) => {
    // Check if the user exists
    const existingUser = users.get(username);

    if (existingUser) {
      // User exists, check password for login
      if (existingUser.password === password) {
        // Update the socketId for the existing user
        existingUser.socketId = socket.id;

        socket.username = username;
        io.to(socket.id).emit('login success', { username, socketId: socket.id });
      } else {
        io.to(socket.id).emit('login error', 'Invalid password.');
      }
    } else {
      // User doesn't exist, create a new account      
      users.set(username, { password, socketId: socket.id });
      socket.username = username;
      io.to(socket.id).emit('login success', { username, socketId: socket.id });
    }
  });

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', { from: socket.username, message: msg });
  });

  // Handle private messages
  socket.on('private message', ({ to, message }) => {
    const toUser = users.get(to);
    if (toUser) {
      io.to(toUser.socketId).emit('private message', { from: socket.username, message });
    } else {
      io.to(socket.id).emit('private message error', 'User not found.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Remove user from the map on disconnect
    users.delete(socket.username);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
