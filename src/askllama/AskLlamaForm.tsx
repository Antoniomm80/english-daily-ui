import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useState} from "react";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";

function AskLlamaForm() {
    const [messages, setMessages] = useState<string[]>([]);
    useSocketIo("controlplane.local", "/ask-llama/socket", (message: string) => {
        setMessages((prev) => [...prev, message]);
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
        setMessages([]);
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
            <div className="overflow-y-auto h-64 border p-2 rounded bg-gray-50 mb-4">
                {messages.join("")}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Send a message to the llama" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row justify-end">
                        <Button type="submit">Ask</Button>
                    </div>

                </form>
            </Form>
        </>
    )


}

export default AskLlamaForm;