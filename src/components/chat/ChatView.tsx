import {ReactNode, useEffect, useState} from "react";
import {AlertCircle, Check, Copy, RefreshCw, Square, Volume2} from "lucide-react";
import {Conversation, ConversationContent, ConversationScrollButton} from "@/components/ai-elements/conversation";
import {Message, MessageContent} from "@/components/ai-elements/message";
import {Response} from "@/components/ai-elements/response";
import {Reasoning} from "@/components/ai-elements/reasoning";
import {Action, Actions} from "@/components/ai-elements/actions";
import {Suggestion, Suggestions} from "@/components/ai-elements/suggestion";
import {PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar, PromptInputTools} from "@/components/ai-elements/prompt-input";
import {ChatMessage, ChatStatus} from "@/hooks/use-llm-chat.ts";

function stripMarkdown(markdown: string) {
    return markdown
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[#*_`>|]/g, "")
        .replace(/\[(.*?)]\(.*?\)/g, "$1");
}

function Loader() {
    return (
        <div aria-label="Waiting for the tutor" className="flex items-center gap-1.5 py-2" role="status">
            {[0, 150, 300].map(delay => (
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand" key={delay} style={{animationDelay: `${delay}ms`}}/>
            ))}
        </div>
    );
}

function AssistantActions({message, isLast, onRegenerate}: { message: ChatMessage; isLast: boolean; onRegenerate: () => void }) {
    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

    useEffect(() => () => {
        if (speaking) window.speechSynthesis.cancel();
    }, [speaking]);

    const speak = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(stripMarkdown(message.content));
        utterance.lang = "en-GB";
        utterance.onend = () => setSpeaking(false);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
    };

    return (
        <Actions>
            <Action
                label={copied ? "Copied" : "Copy"}
                onClick={() => {
                    void navigator.clipboard?.writeText(message.content);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }}
            >
                {copied ? <Check/> : <Copy/>}
            </Action>
            {isLast && <Action label="Regenerate" onClick={onRegenerate}><RefreshCw/></Action>}
            {canSpeak && <Action label={speaking ? "Stop reading" : "Read aloud"} onClick={speak}>{speaking ? <Square/> : <Volume2/>}</Action>}
        </Actions>
    );
}

export interface ChatViewProps {
    messages: ChatMessage[];
    status: ChatStatus;
    onSend: (text: string) => void;
    onRegenerate: () => void;
    suggestions?: string[];
    placeholder?: string;
    emptyState?: ReactNode;
    /** Hides the user's turn for messages the app sent on their behalf. */
    hideFirstUserMessage?: boolean;
}

export function ChatView({messages, status, onSend, onRegenerate, suggestions = [], placeholder, emptyState, hideFirstUserMessage}: ChatViewProps) {
    const [input, setInput] = useState("");
    const busy = status === "submitted" || status === "streaming";

    const submit = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || busy) return;
        onSend(trimmed);
        setInput("");
    };

    const lastAssistantIndex = messages.map(message => message.role).lastIndexOf("assistant");

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <Conversation>
                <ConversationContent>
                    {messages.length === 0 && emptyState}
                    {messages.map((message, index) => {
                        if (hideFirstUserMessage && index === 0 && message.role === "user") return null;
                        if (message.role === "user") {
                            return (
                                <Message from="user" key={message.id}>
                                    <MessageContent><p className="whitespace-pre-wrap">{message.content}</p></MessageContent>
                                </Message>
                            );
                        }
                        const thinking = message.status !== "done" && message.status !== "error" && message.content === "";
                        return (
                            <Message from="assistant" key={message.id}>
                                <MessageContent>
                                    {message.reasoning && (
                                        <Reasoning isStreaming={thinking} seconds={message.reasoningSeconds}>{message.reasoning}</Reasoning>
                                    )}
                                    {message.status === "pending" && !message.reasoning && <Loader/>}
                                    {message.content && <Response>{message.content}</Response>}
                                    {message.status === "error" && (
                                        <p className="flex items-center gap-2 text-sm text-destructive">
                                            <AlertCircle className="h-4 w-4"/>
                                            {message.content ? "The answer was cut short." : "The tutor didn't answer. Try again."}
                                        </p>
                                    )}
                                    {(message.status === "done" || message.status === "error") && (
                                        <AssistantActions isLast={index === lastAssistantIndex} message={message} onRegenerate={onRegenerate}/>
                                    )}
                                </MessageContent>
                            </Message>
                        );
                    })}
                </ConversationContent>
                <ConversationScrollButton/>
            </Conversation>

            <div className="mx-auto w-full max-w-3xl px-3 pb-3 md:px-4 md:pb-4">
                {suggestions.length > 0 && (
                    <Suggestions className="mb-2 px-1">
                        {suggestions.map(suggestion => (
                            <Suggestion disabled={busy} key={suggestion} onClick={submit} suggestion={suggestion}/>
                        ))}
                    </Suggestions>
                )}
                <PromptInput onSubmit={() => submit(input)}>
                    <label className="sr-only" htmlFor="chat-input">Message</label>
                    <PromptInputTextarea
                        id="chat-input"
                        onChange={event => setInput(event.target.value)}
                        placeholder={placeholder ?? "Ask anything about English…"}
                        value={input}
                    />
                    <PromptInputToolbar>
                        <PromptInputTools>
                            <span className="hidden pl-2 text-xs text-muted-foreground sm:inline">Enter to send · Shift+Enter for a new line</span>
                        </PromptInputTools>
                        <PromptInputSubmit disabled={!input.trim()} status={status}/>
                    </PromptInputToolbar>
                </PromptInput>
            </div>
        </div>
    );
}
