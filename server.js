// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
	console.log('a user connected');

	// Отправляем сообщение при подключении нового клиента
	socket.emit('message', 'Welcome to Real-Time App!');

	// При получении сообщения от клиента
	socket.on('new message', (msg) => {
		// Отправляем это сообщение всем клиентам
		io.emit('message', msg);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});