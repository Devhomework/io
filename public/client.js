// public/client.js

const socket = io();

const messageElement = document.getElementById('message');
const inputElement = document.getElementById('input');
const sendButton = document.getElementById('send');

socket.on('message', (msg) => {
	messageElement.textContent = msg;
	console.log('Сообщение через сокет:', msg);

	if ('serviceWorker' in navigator && 'PushManager' in window) {
		navigator.serviceWorker.ready.then(function(reg) {
			if (Notification.permission === 'granted') {
				reg.showNotification('Новое сообщение', {
					body: msg,
					icon: 'icon.png',
					badge: 'badge.png'
				});
			}
		});
	} else {
		showNotification('Новое сообщение', msg);
	}
});

sendButton.addEventListener('click', () => {
	const message = inputElement.value;
	socket.emit('new message', message);
	inputElement.value = '';
});

// Функция для простого показа уведомления (без Service Worker)
function showNotification(title, body) {
	console.log('Показ уведомления:', title, body);
	if (Notification.permission === 'granted') {
		new Notification(title, { body });
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(permission => {
			console.log('Запрошено разрешение на уведомления:', permission);
			if (permission === 'granted') {
				new Notification(title, { body });
			}
		});
	}
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(registration) {
		console.log('Service Worker зарегистрирован:', registration);
	}).catch(function(error) {
		console.log('Ошибка регистрации Service Worker:', error);
	});
}

// Запросить разрешение на уведомления
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
	Notification.requestPermission().then(permission => {
		console.log('Первоначальное разрешение на уведомления:', permission);
	});
}

// Запросить разрешение на мобилках при первом взаимодействии
document.addEventListener('click', () => {
	if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
		Notification.requestPermission().then(permission => {
			console.log('Разрешение на уведомления:', permission);
		});
	}
});