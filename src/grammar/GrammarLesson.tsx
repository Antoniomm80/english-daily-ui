import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import LlmResponsePanel from "@/llmResponse/LlmResponsePanel.tsx";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";

function GrammarLesson() {
    const {setBreadcrumbs} = useBreadcrumb();
    const {"grammar-lesson": grammarLesson} = useParams();

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Grammar", grammarLesson!];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs]);

    const reasoningEndedRef = useRef(false);
    const [thoughtChain, setThoughtChain] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);

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

    fetch(`/english-daily/api/v1/englishdaily/grammar?grammarLesson=${grammarLesson}`);


    return (
        <div className="p-4">
            <LlmResponsePanel text={thoughtChain}/>
            <LlmResponsePanel text={response}/>
        </div>
    );

}

export default GrammarLesson;