import { useEffect, useState, useRef } from 'react';

useEffect(() => {
    const connect = () => {
    };

    connect();

    return () => {
        if (socket.current) {
            socket.current.close();
        }
    };
}, []);


export function useWebSocket(url: string) {
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socket = useRef<WebSocket | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const connect = () => {    
    
            socket.current.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };
    
            socket.current.onclose = () => {
                setConnectionStatus('Disconnected');
                setTimeout(connect, 1000); // Reconnect after 1 second
            };
    
            socket.current = new WebSocket(url);

            socket.current.onopen = () => {
                setConnectionStatus('Connected');
                setRetryCount(0);
            };

            socket.current.onmessage = (event) => {
                setText(event.data);
            };

            socket.current.onclose = () => {
                setConnectionStatus('Disconnected');
                const timeout = Math.min(1000 * 2 ** retryCount, 30000);
                setTimeout(connect, timeout);
                setRetryCount(prev => prev + 1);
            };

            socket.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('Error');
            };
        };

        connect();

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [url, retryCount]);

    return { socket, connectionStatus };
}