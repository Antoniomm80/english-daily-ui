import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useEffect, useRef, useState} from "react";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";
import {Send} from "lucide-react";
import ReactMarkdown from "react-markdown";

function AskLlamaForm() {


    const reasoningEndedRef = useRef(false);
    const [thoughtChain, setThoughtChain] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const thoughtChainRef = useRef<HTMLDivElement | null>(null);
    const responseChainRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (thoughtChainRef.current) {
            thoughtChainRef.current.scrollTop = thoughtChainRef.current.scrollHeight;
        }
    }, [thoughtChain]);
    useEffect(() => {
        if (responseChainRef.current) {
            responseChainRef.current.scrollTop = responseChainRef.current.scrollHeight;
        }
    }, [response]);
    useSocketIo("controlplane.local", "/ask-llama/socket", (message: string) => {

        if (message.trim().includes("</think>")) {
            reasoningEndedRef.current = true;
        } else {
            if (!reasoningEndedRef.current) {
                setThoughtChain((prev) => [...prev, message]);
            } else {
                setResponse((prev) => [...prev, message]);
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
        setResponse([]);
        //POST request to the llama

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
            <div ref={thoughtChainRef} className="overflow-y-auto h-64 border p-2 rounded bg-gray-50 mb-4">
                <ReactMarkdown>{thoughtChain.join("")}</ReactMarkdown>
            </div>
            <div ref={responseChainRef} className="overflow-y-auto h-64 border p-2 rounded bg-gray-50 mb-4">
                <ReactMarkdown>{response.join("")}</ReactMarkdown>
            </div>
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