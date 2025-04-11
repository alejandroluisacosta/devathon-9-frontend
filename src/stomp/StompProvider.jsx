import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

const StompContext = createContext({ client: null, connected: false });

export const StompProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/connect-game',
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

  const subscribe = (destination, callback) => {
    if (!clientRef.current || !connected) return null;
    return clientRef.current.subscribe(destination, callback);
  };

  const sendMessage = (destination, body, headers = {}) => {
    if (!clientRef.current || !connected) return;

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  };
  
  return (
    <StompContext.Provider value={{ client: clientRef.current, connected, subscribe, sendMessage }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStompContext = () => useContext(StompContext);
