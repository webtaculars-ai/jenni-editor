"use client"
// components/TextEditor.tsx
import { useEffect, useState, useRef } from 'react';

const TextEditor = () => {
    const [text, setText] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            socket.current = new WebSocket('ws://localhost:8080/ws/');

            socket.current.onopen = () => {
                setConnectionStatus('Connected');
            };

            socket.current.onmessage = (event) => {
                setText(event.data);
            };

            socket.current.onerror = (error) => {
                console.error("WebSocket error: ", error);
            };

            socket.current.onclose = () => {
                setConnectionStatus('Disconnected');
                setTimeout(connect, 1000); // Reconnect after 1 second
            };
        };

        connect();

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(newText);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <header className="w-full bg-blue-600 text-white p-4 text-center text-lg">
                Collaborative Text Editor
            </header>
            <div className="w-11/12 md:w-3/4 lg:w-1/2 mt-4">
                <textarea
                    value={text}
                    onChange={handleChange}
                    className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Start typing..."
                    aria-label="Collaborative text editor"
                />
            </div>
            <footer className="w-full bg-gray-200 text-gray-700 p-2 text-center text-sm">
                Connection Status: {connectionStatus}
            </footer>
        </div>
    );
};

export default TextEditor; 