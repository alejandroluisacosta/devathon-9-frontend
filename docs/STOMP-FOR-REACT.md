[🔙 Volver al README](../README.md)

# ⚛️ Guía Avanzada de STOMP.js con React

Esta guía te enseña a integrar la librería [`@stomp/stompjs`](https://www.npmjs.com/package/@stomp/stompjs) en una aplicación React usando hooks (`useEffect`, `useState`, `useContext`, `useRef`) y el patrón de proveedor (`Context API`) para centralizar la lógica de conexión, envío y suscripción.

## 📦 Instalación

```bash
npm install @stomp/stompjs
```

Opcionalmente, si necesitas compatibilidad con SockJS:

```bash
npm install sockjs-client
```

## 🧠 Arquitectura recomendada

1. Crear un `StompContext` para exponer el cliente y funciones útiles.
2. Usar `useEffect` para controlar la activación y limpieza.
3. Usar `useRef` para mantener la instancia del cliente sin provocar re-renderizados.
4. Manejar la conexión, suscripciones y envío de mensajes dentro del contexto.

## 📁 Estructura de archivos sugerida

```
src/
├── stomp/
│   ├── StompProvider.tsx
│   ├── useStomp.ts
│   └── types.ts
```

## 🧱 StompProvider.tsx

```tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

interface StompContextProps {
  client: Client | null;
  connected: boolean;
  sendMessage: (destination: string, body: any, headers?: any) => void;
  subscribe: (destination: string, callback: (msg: IMessage) => void) => StompSubscription | null;
}

const StompContext = createContext<StompContextProps>({
  client: null,
  connected: false,
  sendMessage: () => {},
  subscribe: () => null,
});

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      debug: str => console.log(`[STOMP] ${str}`),

      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStompError: frame => console.error('STOMP error', frame.body),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (destination: string, body: any, headers = {}) => {
    if (!clientRef.current || !connected) return;

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  };

  const subscribe = (
    destination: string,
    callback: (msg: IMessage) => void
  ): StompSubscription | null => {
    if (!clientRef.current || !connected) return null;
    return clientRef.current.subscribe(destination, callback);
  };

  return (
    <StompContext.Provider value={{ client: clientRef.current, connected, sendMessage, subscribe }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStompContext = () => useContext(StompContext);
```

## 🔌 useStomp.ts (Hook personalizado)

```ts
import { useStompContext } from './StompProvider';

export const useStomp = () => {
  const context = useStompContext();
  if (!context) throw new Error('useStomp must be used within a StompProvider');
  return context;
};
```

## 🧪 Ejemplo: suscribirse y escuchar mensajes en un componente

```tsx
import React, { useEffect } from 'react';
import { useStomp } from '../stomp/useStomp';

const Notificaciones = () => {
  const { subscribe } = useStomp();

  useEffect(() => {
    const sub = subscribe('/user/queue/notificaciones', msg => {
      const data = JSON.parse(msg.body);
      console.log('🔔 Notificación:', data);
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [subscribe]);

  return <div>Escuchando notificaciones privadas...</div>;
};

export default Notificaciones;
```

## 📨 Ejemplo: enviar un mensaje desde un formulario

```tsx
import React, { useState } from 'react';
import { useStomp } from '../stomp/useStomp';

const ChatInput = () => {
  const { sendMessage } = useStomp();
  const [mensaje, setMensaje] = useState('');
  const handleSend = () => {
    sendMessage('/app/chat', { text: mensaje });
    setMensaje('');
  };

  return (
    <div>
      <input value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder=\"Escribe un mensaje...\" />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );

};

export default ChatInput;
```

## ✅ Integración en tu app principal

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StompProvider } from './stomp/StompProvider';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <StompProvider>
      <App />
    </StompProvider>
  </React.StrictMode>
);
```

## 🧠 Recomendaciones finales

- ✅ Usa `useEffect` para suscribirte/desuscribirte de tópicos dinámicamente.
- ✅ Usa `useContext` para compartir el cliente entre componentes.
- ❌ No recrees el cliente STOMP en cada componente.
- ✅ Cierra la conexión correctamente cuando la app se desmonte.
- 🔐 Si usas autenticación, pasa los tokens como `headers` en `publish()` o en `connectHeaders`.

Con esta arquitectura, tendrás una integración limpia, escalable y controlada del cliente STOMP en cualquier aplicación React moderna.
