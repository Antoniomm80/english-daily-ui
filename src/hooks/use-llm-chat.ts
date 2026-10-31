import {useCallback, useEffect, useRef, useState} from "react";
import {useSocket, whenConnected} from "@/hooks/use-socket-io.tsx";
import {DEEPSEEK_ENABLED} from "@/config.ts";

export type ChatStatus = "idle" | "submitted" | "streaming" | "error";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    reasoning: string;
    /** How long the model spent reasoning, once it is done. */
    reasoningSeconds?: number;
    status: "pending" | "streaming" | "done" | "error";
}

/** Starts the backend generation; tokens then arrive over the socket. */
export type ChatRequest = () => Promise<unknown>;

// The backend streams tokens over the socket but never signals the end of an answer,
// so an answer is considered finished once no token has arrived for this long.
const IDLE_MS = 2500;
const FIRST_TOKEN_TIMEOUT_MS = 90_000;

let nextId = 0;
const newId = () => `m${++nextId}`;

export function useLlmChat() {
    const socket = useSocket();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<ChatStatus>("idle");

    const activeRef = useRef(false);
    const reasoningDoneRef = useRef(!DEEPSEEK_ENABLED);
    const reasoningStartRef = useRef(0);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const lastRequestRef = useRef<ChatRequest>();

    const updateLast = useCallback((update: (message: ChatMessage) => ChatMessage) => {
        setMessages(prev => {
            if (prev.length === 0) return prev;
            const copy = [...prev];
            copy[copy.length - 1] = update(copy[copy.length - 1]);
            return copy;
        });
    }, []);

    const finish = useCallback((outcome: "done" | "error") => {
        activeRef.current = false;
        clearTimeout(idleTimerRef.current);
        updateLast(message => ({...message, status: outcome}));
        setStatus(outcome === "done" ? "idle" : "error");
    }, [updateLast]);

    useEffect(() => {
        if (!socket) return;
        const onToken = (token: string) => {
            if (!activeRef.current) return;
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => finish("done"), IDLE_MS);
            setStatus("streaming");

            if (!reasoningDoneRef.current) {
                if (token.includes("<think>")) return;
                if (token.includes("</think>")) {
                    reasoningDoneRef.current = true;
                    const seconds = Math.max(1, Math.round((Date.now() - reasoningStartRef.current) / 1000));
                    updateLast(message => ({...message, reasoningSeconds: seconds}));
                    return;
                }
                updateLast(message => ({...message, status: "streaming", reasoning: message.reasoning + token}));
                return;
            }
            updateLast(message => ({...message, status: "streaming", content: message.content + token}));
        };
        socket.on("message", onToken);
        return () => {
            socket.off("message", onToken);
        };
    }, [socket, finish, updateLast]);

    useEffect(() => () => clearTimeout(idleTimerRef.current), []);

    const run = useCallback(async (request: ChatRequest) => {
        lastRequestRef.current = request;
        activeRef.current = true;
        reasoningDoneRef.current = !DEEPSEEK_ENABLED;
        reasoningStartRef.current = Date.now();
        setStatus("submitted");
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => finish("error"), FIRST_TOKEN_TIMEOUT_MS);
        try {
            if (socket) await whenConnected(socket);
            await request();
        } catch {
            finish("error");
        }
    }, [socket, finish]);

    /** Shows `text` as the user's message and runs `request` to produce the answer. */
    const send = useCallback((text: string, request: ChatRequest) => {
        if (activeRef.current) return;
        setMessages(prev => [
            ...prev,
            {id: newId(), role: "user", content: text, reasoning: "", status: "done"},
            {id: newId(), role: "assistant", content: "", reasoning: "", status: "pending"},
        ]);
        void run(request);
    }, [run]);

    /** Replaces the last answer with a fresh one for the same request. */
    const regenerate = useCallback(() => {
        const request = lastRequestRef.current;
        if (!request || activeRef.current) return;
        updateLast(message => ({...message, content: "", reasoning: "", reasoningSeconds: undefined, status: "pending"}));
        void run(request);
    }, [run, updateLast]);

    const reset = useCallback(() => {
        activeRef.current = false;
        clearTimeout(idleTimerRef.current);
        lastRequestRef.current = undefined;
        setMessages([]);
        setStatus("idle");
    }, []);

    return {messages, status, send, regenerate, reset, busy: status === "submitted" || status === "streaming"};
}

export function askLlama(question: string): ChatRequest {
    return () => fetch("/english-daily/api/v1/englishdaily/ask-llama", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question}),
    }).then(response => {
        if (!response.ok) throw new Error(`ask-llama failed: ${response.status}`);
    });
}

export function generateGrammarLesson(lessonId: number): ChatRequest {
    return () => fetch(`/english-daily/api/v1/englishdaily/grammar/${lessonId}`).then(response => {
        if (!response.ok) throw new Error(`grammar lesson failed: ${response.status}`);
    });
}
