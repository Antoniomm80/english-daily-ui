import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

export function useSocketIo(host: string, path: string, onMessageListener: (message: string) => void) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io({
            host: host,
            path: path
        });
        setSocket(newSocket);

        newSocket.on("message", onMessageListener);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
}