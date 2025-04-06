import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useRef, useState} from "react";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";
import {Send} from "lucide-react";
import LlmResponsePanel from "@/llmResponse/LlmResponsePanel.tsx";
import {Message} from "@/llmResponse/Message.ts";
import {ChatArea} from "@/llmResponse/ChatArea.tsx";
import {DEEPSEEK_ENABLED} from "@/config.ts";

interface AskLlamaFormProps {
    thoughtChainVisible: boolean;
}


function AskLlamaForm(props: AskLlamaFormProps) {
    const reasoningEndedRef = useRef(false);
    const [thoughtChain, setThoughtChain] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    useSocketIo("controlplane.local", "/ask-llama/socket", (message: string) => {
        if (!DEEPSEEK_ENABLED) {
            setChatMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content.push(message);
                return newMessages;
            });
        }
        if (message.trim().includes("<think>")) {
            return;
        }
        if (message.trim().includes("</think>")) {
            reasoningEndedRef.current = true;
        } else {
            if (!reasoningEndedRef.current) {
                setThoughtChain((prev) => [...prev, message]);
            } else {
                setChatMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content.push(message);
                    return newMessages;
                });
            }
        }

    });

    const FormSchema = z.object({
        question: z.string().min(10, {
            message: "The question must be at least 10 characters long",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            question: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        reasoningEndedRef.current = false;
        setThoughtChain([]);
        setChatMessages([...chatMessages, {role: "user", content: [data.question]}, {role: "bot", content: []}]);
        fetch("/english-daily/api/v1/englishdaily/ask-llama", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }


    return (
        <>
            {props.thoughtChainVisible && <LlmResponsePanel text={thoughtChain} greyBackground/>}
            <ChatArea messages={chatMessages}/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6" onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevents accidental form submission if inputs should not submit
                        form.handleSubmit(onSubmit)();
                    }
                }}>
                    <FormField
                        control={form.control}
                        name="question"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <div className="w-full bg-white">
                                        <div className="relative">
                                            <Input className="w-full p-3 pr-12 border rounded-lg focus:outline-none"
                                                   placeholder="Send a message to the llama" {...field} />
                                            <button
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                                                type="submit"
                                            >
                                                <Send size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </>
    )


}

export default AskLlamaForm;