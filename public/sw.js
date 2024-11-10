// public/sw.js

self.addEventListener('push', function(event) {
	const options = {
		body: event.data.text(),
		icon: 'icon.png',
		badge: 'badge.png'
	};

	event.waitUntil(
		self.registration.showNotification('Новое сообщение', options)
	);
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	event.waitUntil(
		clients.openWindow('/')
	);
});