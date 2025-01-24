import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import AskLlamaForm from "@/askllama/AskLlamaForm.tsx";

function AskLlama() {
    return (
        <div className="p-4">
            <Card className="">
                <CardHeader>
                    <CardTitle>English Daily</CardTitle>
                    <CardDescription>Ask anything that pops into your mind</CardDescription>
                </CardHeader>
                <CardContent>
                    <AskLlamaForm/>
                </CardContent>
            </Card>
        </div>
    );
}

export default AskLlama;