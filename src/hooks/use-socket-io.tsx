import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

/**
 * One Socket.IO connection for the whole app. The backend broadcasts every LLM token
 * as a "message" event, so keeping a single long-lived connection means the socket is
 * already connected when a page fires its request (no lost first tokens).
 */
export function SocketProvider({children}: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io({path: "/ask-llama/socket"});
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    return useContext(SocketContext);
}

/** Resolves once the socket is connected (immediately if it already is). */
export function whenConnected(socket: Socket): Promise<void> {
    if (socket.connected) {
        return Promise.resolve();
    }
    return new Promise(resolve => socket.once("connect", () => resolve()));
}
