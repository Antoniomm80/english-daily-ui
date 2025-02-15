import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Bot, User} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {Message} from "@/llmResponse/Message.ts";


export interface ChatAreaProps {
    messages: Message[];
}

export function ChatArea(props: ChatAreaProps) {
    return (
        <ScrollArea className="flex-1 p-4">
            {props.messages.map((message, index) => (
                <div key={index} className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`rounded-full p-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {message.role === 'user' ? <User size={24}/> : <Bot size={24}/>}
                        </div>
                        <div className={`mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <ReactMarkdown>{message.content.join("")}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
}