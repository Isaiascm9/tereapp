// Service worker de Téreapp — solo se encarga de mostrar la notificación
// cuando llega un push, y de llevarte a la app si le hacés clic.
// Este archivo tiene que subirse a GitHub junto al resto de Téreapp,
// en la misma carpeta que index.html (no adentro de ninguna subcarpeta).

self.addEventListener('push', (event) => {
  let data = { title: 'Téreapp', body: 'Tenés una novedad — abrí la app para verla.' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = Object.assign(data, parsed);
    }
  } catch (e) {
    // si el push llega sin contenido (la prueba inicial), se usa el texto genérico de arriba
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag || 'tereapp',
      requireInteraction: false
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
