[🔙 Volver al README](../README.md)

# 🧠 Guía Avanzada de STOMP.js

Esta guía avanzada cubre el uso de la librería [`@stomp/stompjs`](https://github.com/stomp-js/stompjs) para interactuar con brokers de mensajería (RabbitMQ, ActiveMQ, etc.) mediante el protocolo STOMP sobre WebSockets. Incluye configuración robusta, reconexión, heartbeats, manejo de errores y prácticas modernas.

## Indice

- [🧠 Guía Avanzada de STOMP.js](#-guía-avanzada-de-stompjs)
  - [Indice](#indice)
  - [Instalacion :blush:](#instalacion-blush)
    - [💡 Requisitos previos](#-requisitos-previos)
  - [Conexion y configuracion](#conexion-y-configuracion)
  - [Activar y desactivar el cliente STOMP](#activar-y-desactivar-el-cliente-stomp)
    - [Activar Cliente](#activar-cliente)
      - [¿Qué hace?](#qué-hace)
      - [¿Cuándo lo usas?](#cuándo-lo-usas)
    - [Desactivar Cliente](#desactivar-cliente)
      - [¿Qué hace?](#qué-hace-1)
      - [¿Cuándo lo usas?](#cuándo-lo-usas-1)
    - [Ejemplo típico](#ejemplo-típico)
  - [Suscripción a eventos](#suscripción-a-eventos)
    - [Tipos comunes de destinos](#tipos-comunes-de-destinos)
    - [Ejemplo: suscripción a canal público](#ejemplo-suscripción-a-canal-público)
    - [Ejemplo: suscripción a cola privada de usuario](#ejemplo-suscripción-a-cola-privada-de-usuario)
    - [Ejemplo: cancelación de una suscripción](#ejemplo-cancelación-de-una-suscripción)
    - [🧠 Buenas prácticas](#-buenas-prácticas)
  - [Desuscripción a eventos](#desuscripción-a-eventos)
    - [¿Cuándo deberías usar .unsubscribe()?](#cuándo-deberías-usar-unsubscribe)
    - [🧠 Buenas prácticas](#-buenas-prácticas-1)
  - [Envío de mensajes](#envío-de-mensajes)
    - [Envío standar](#envío-standar)
    - [Con encabezados personalizados](#con-encabezados-personalizados)
    - [Envío a destinos dinámicos](#envío-a-destinos-dinámicos)
    - [🧠 Buenas prácticas](#-buenas-prácticas-2)
  - [Reintentos automáticos](#reintentos-automáticos)
  - [Gestión de errores](#gestión-de-errores)
  - [Ejemplo completo con @stomp/stompjs](#ejemplo-completo-con-stompstompjs)

## Instalacion :blush:

### 💡 Requisitos previos

1. Un entorno con soporte para ES6 o superior.
2. Un broker de mensajería compatible con STOMP sobre WebSocket (como RabbitMQ con el plugin Web-STOMP habilitado).

```js
npm install @stomp/stompjs
```

3. 🔀 Usa sockjs-client si necesitas compatibilidad con navegadores antiguos o transporte alternativo al WebSocket nativo.

```js
npm install sockjs-client
```

## Conexion y configuracion

Para establecer una conexión básica con un broker STOMP usando WebSockets, puedes crear una instancia de Client y configurar parámetros clave como la URL del broker, encabezados de conexión, reconexión automática, y heartbeats para mantener viva la conexión.

```js
import { Client } from '@stomp/stompjs';

const client = new Client({
  //🔌 URL del broker STOMP al que se conecta el cliente, usando WebSockets
  brokerURL: 'ws://localhost:15674/ws',

  //🐞 Función de depuración: muestra en consola los logs internos del cliente STOMP.
  // Útil para ver la conexión, suscripciones y errores.
  debug: str => console.log(`[STOMP] ${str}`),

  // 🔁 Reconexión automática: espera 5 segundos antes de intentar reconectarse si la conexión se pierde.
  reconnectDelay: 5000,

  // ❤️‍🔥 Heartbeats: el cliente espera y envía un “pulso” cada 10 segundos
  // Mantiene viva la conexión y detectar si el servidor cae.
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,

  //🔗 onConnect: se ejecuta cuando el cliente se conecta
  // El objeto frame contiene información de los headers del servidor.
  // Útil para confirmar la conexión o iniciar suscripciones.
  onConnect: frame => {
    console.log('✅ Conectado al broker:', frame.headers);
  },

  //🛑 onStompError: se dispara cuando el broker responde con un error STOMP
  // (por ejemplo, si no reconoce una ruta o hay un fallo en el backend).
  // frame.body suele incluir detalles adicionales útiles para depurar.
  onStompError: frame => {
    console.error('❌ STOMP error:', frame.headers['message']);
    console.error('Detalles:', frame.body);
  },

  //📴 onDisconnect: se ejecuta cuando el cliente se desconecta.
  // Útil para limpiar el estado de la aplicación o mostrar alertas al usuario.
  onDisconnect: () => {
    console.warn('🔌 Cliente desconectado.');
  },
});
```

## Activar y desactivar el cliente STOMP

Estas dos funciones controlan el ciclo de vida de la conexión WebSocket/STOMP. Aquí te explico:

### Activar Cliente

```js
client.activate();
```

#### ¿Qué hace?

1. Inicia la conexión WebSocket con el broker.
2. Realiza el handshake STOMP (CONNECT).
3. Ejecuta el callback onConnect.
4. Habilita el envío/recepción de mensajes(subscriptions/publish).

#### ¿Cuándo lo usas?

1. Al arrancar iniciar la conexión, manualmente o reintentos.

### Desactivar Cliente

```js
client.deactivate();
```

#### ¿Qué hace?

1. Envía el frame DISCONNECT al broker.
2. Cierra el WebSocket.
3. Elimina todas las suscripciones activas.
4. Detiene la reconexión automática (si estaba activada).

#### ¿Cuándo lo usas?

1. Al salir de un componente (por ejemplo, con useEffect en React).
2. Al cerrar sesión en tu app.
3. Si cambias de usuario o entorno.

### Ejemplo típico

```js
// Activar al iniciar
client.activate();

// Desactivar antes de cerrar o limpiar
window.addEventListener('beforeunload', () => {
  client.deactivate();
});
```

## Suscripción a eventos

STOMP.js permite suscribirse a distintos destinos que representan canales de comunicación. Estos destinos pueden tener diferentes formas según cómo estén configurados en el backend (por ejemplo, en Spring WebSocket o RabbitMQ).

### Tipos comunes de destinos

- `/topic/...`: Canales públicos a los que todos los clientes pueden suscribirse. Ideal para salas de chat, notificaciones globales, etc.
- `/queue/...`: Canales punto a punto. Aunque múltiples clientes pueden suscribirse, normalmente cada mensaje solo es entregado a uno.
- `/user/queue/...`: Canales privados asociados a un usuario autenticado. Muy útiles para mensajes uno-a-uno (chat privado, alertas personalizadas, etc.).

> ⚠️ Nota: el prefijo `/user/` es especial. El backend lo interpreta para enviar el mensaje al usuario conectado.

---

### Ejemplo: suscripción a canal público

```ts
client.onConnect = () => {
  const subscription = client.subscribe('/topic/general', message => {
    const contenido = JSON.parse(message.body);
    console.log('Mensaje recibido en canal público:', contenido);
  });
};
```

### Ejemplo: suscripción a cola privada de usuario

```ts
client.onConnect = () => {
  const suscripcionPrivada = client.subscribe('/user/queue/notificaciones', message => {
    const notificacion = JSON.parse(message.body);
    console.log('Notificación privada:', notificacion);
  });
};
```

### Ejemplo: cancelación de una suscripción

```ts
const subscription = client.subscribe('/topic/eventos', msg => {
  // procesar mensaje
});

// Cancelar la suscripción cuando ya no sea necesaria
subscription.unsubscribe();
```

### 🧠 Buenas prácticas

- Evita múltiples suscripciones al mismo tópico sin necesidad; podría duplicar la recepción de mensajes.
- Si usas React u otro framework SPA, gestiona las suscripciones en un useEffect, onMounted, o controlador de ciclo de vida adecuado.
- Siempre cancela las suscripciones cuando desmontes componentes o cierres la conexión.

## Desuscripción a eventos

El método .unsubscribe() cancela una suscripción activa que has creado previamente con .subscribe(). Después de llamarlo:

- El cliente deja de recibir mensajes de ese destino.
- Se libera la conexión asociada a esa suscripción.
- Es útil para evitar fugas de memoria o recibir mensajes innecesarios.

```ts
const subscription = client.subscribe('/topic/general', msg => {
  // manejar mensaje
});
```

### ¿Cuándo deberías usar .unsubscribe()?

- Cuando cambias de contexto de aplicación, como cerrar sesión o cambiar de canal de chat.
- Para evitar recibir mensajes duplicados si estás reconfigurando suscripciones dinámicamente.

```ts
useEffect(() => {
  const sub = client.subscribe('/topic/sala', handleMessage);

  return () => {
    sub.unsubscribe();
  };
}, []);
```

### 🧠 Buenas prácticas

- ✅ Guarda siempre la referencia a la suscripción si planeas cancelarla luego.
- ⚠️ No llames a unsubscribe() sin haber verificado que la suscripción existe.
- ⚠️ Si creas múltiples suscripciones, llévalas en un array o en un mapa para gestionarlas limpiamente.

## Envío de mensajes

El método client.publish() se utiliza para enviar mensajes al servidor STOMP a través del WebSocket. Puedes enviar mensajes a rutas específicas (destination), con o sin encabezados personalizados (headers) y con un cuerpo (body) en texto plano o JSON.

### Envío standar

```ts
client.publish({
  destination: '/app/register-user',
  body: JSON.stringify({
    name: 'manuel',
    lastname: 'entrena',
  }),
});
```

- destination: es la ruta del mensaje que debe estar definida y manejada por el servidor.
- body: contenido del mensaje. Se recomienda usar JSON.stringify() para estructurar los datos si son objetos.

### Con encabezados personalizados

```ts
client.publish({
  destination: '/app/chat',
  headers: { token: '7b5c9e1e-47f3-4b2e-b7ce-c93d04ae0e4f' },
  body: 'Mensaje importante',
});
```

🔐 Importante: aunque puedes enviar tokens como encabezados STOMP, asegúrate de que tu backend los valide correctamente. No es equivalente a los headers HTTP tradicionales (como Authorization), pero el servidor puede acceder a ellos desde el MessageHeaders.

### Envío a destinos dinámicos

Puedes construir rutas dinámicas con variables si el backend lo permite:

```ts
client.publish({
  destination: `/app/chat/${roomId}`,
  body: JSON.stringify({ text: 'Hola sala ' + roomId }),
});
```

### 🧠 Buenas prácticas

- ✅ Serializa siempre los objetos con JSON.stringify() antes de enviarlos como cuerpo.
- ✅ Documenta los headers esperados en tu backend y asegúrate de que STOMP los recibe correctamente.
- ⚠️ No expongas datos sensibles en los headers si no estás usando una conexión segura (wss://).
- ✅ Estandariza el esquema de mensajes para facilitar la validación del lado servidor.
- ✅ Usa encabezados para cosas como tipo de evento (eventType: 'user_joined') o trazabilidad (traceId, sessionId, etc.).

## Reintentos automáticos

El parámetro `reconnectDelay` define el tiempo entre reintentos de conexión:

```ts
reconnectDelay: 10000, // 10 segundos
```

Para gestionar errores del broker:

```ts
client.onStompError = frame => {
  console.error('STOMP error:', frame.headers['message']);
  console.error('Detalles:', frame.body);
};
```

## Gestión de errores

Errores WebSocket:

```ts
client.onWebSocketError = event => {
  console.error('WebSocket error:', event);
};
```

Errores STOMP:

```ts
client.onStompError = frame => {
  console.error('STOMP error:', frame.headers['message']);
  console.error('Detalles:', frame.body);
};
```

## Ejemplo completo con @stomp/stompjs

```ts
import { Client } from '@stomp/stompjs';

// Instancia del cliente STOMP
const client = new Client({
  brokerURL: 'ws://localhost:15674/ws',

  // Logs útiles para desarrollo
  debug: str => console.log(`[STOMP DEBUG] ${str}`),

  // Reintento automático cada 5 segundos si se pierde la conexión
  reconnectDelay: 5000,

  // Heartbeats para mantener la conexión viva y detectar desconexiones
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,

  // Conexión exitosa
  onConnect: frame => {
    console.log('✅ Conectado al broker:', frame.headers);

    // 🧭 Suscripción a canal público
    const publicSub = client.subscribe('/topic/general', message => {
      const data = JSON.parse(message.body);
      console.log('📣 Mensaje público:', data);
    });

    // 🔒 Suscripción a cola privada de usuario
    const privateSub = client.subscribe('/user/queue/notifications', message => {
      const notif = JSON.parse(message.body);
      console.log('🔔 Notificación privada:', notif);
    });

    // 📨 Envío de un mensaje estándar
    client.publish({
      destination: '/app/register-user',
      body: JSON.stringify({
        name: 'Manuel',
        lastname: 'Entrena',
      }),
    });

    // 📨 Envío de un mensaje con headers personalizados (ej. autenticación)
    client.publish({
      destination: '/app/chat',
      headers: { token: '7b5c9e1e-47f3-4b2e-b7ce-c93d04ae0e4f' },
      body: JSON.stringify({
        message: 'Hola a todos desde el canal seguro!',
        timestamp: Date.now(),
      }),
    });

    // 🧹 Cancelar suscripciones si se desea limpiar
    setTimeout(() => {
      publicSub.unsubscribe();
      privateSub.unsubscribe();
      console.log('🧹 Suscripciones canceladas tras 60 segundos');
    }, 60000);
  },

  // Error STOMP (protocolo)
  onStompError: frame => {
    console.error('❌ STOMP error:', frame.headers['message']);
    console.error('Detalles del error:', frame.body);
  },

  // Error WebSocket (conexión física)
  onWebSocketError: event => {
    console.error('🚨 Error WebSocket:', event);
  },

  // Desconexión
  onDisconnect: () => {
    console.warn('🔌 Cliente desconectado.');
  },
});

// 🔌 Activar cliente
client.activate();

// 📴 Desactivar cliente al cerrar ventana (buena práctica en SPA)
window.addEventListener('beforeunload', () => {
  client.deactivate();
});
```
