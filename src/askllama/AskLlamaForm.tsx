import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

function AskLlamaForm() {

    const FormSchema = z.object({
        prompt: z.string().min(10, {
            message: "The prompt must be at least 10 characters long",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            prompt: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(JSON.stringify(data, null, 2));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="prompt"
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
    )


}

export default AskLlamaForm;