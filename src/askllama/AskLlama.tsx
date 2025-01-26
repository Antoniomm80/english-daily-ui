import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import AskLlamaForm from "@/askllama/AskLlamaForm.tsx";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import {useEffect} from "react";

function AskLlama() {
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Ask Llama"];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs]);
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