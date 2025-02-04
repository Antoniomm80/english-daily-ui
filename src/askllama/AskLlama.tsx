import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import AskLlamaForm from "@/askllama/AskLlamaForm.tsx";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import {useEffect, useState} from "react";
import {ThoughtChainSwitcher} from "@/llmResponse/ThoughtChainSwitcher.tsx";

function AskLlama() {
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Ask Llama"];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs]);
    const [thoughtChainVisible, setThoughtChainVisible] = useState(false);
    return (
        <div className="p-4">
            <ThoughtChainSwitcher thoughtChainVisible={thoughtChainVisible}
                                  setThoughtChainVisible={(checked) => setThoughtChainVisible(checked)}/>
            <Card className="">
                <CardHeader>
                    <CardTitle>English Daily</CardTitle>
                    <CardDescription>Ask anything that pops into your mind</CardDescription>
                </CardHeader>
                <CardContent>
                    <AskLlamaForm thoughtChainVisible={thoughtChainVisible}/>
                </CardContent>
            </Card>
        </div>
    );
}

export default AskLlama;