import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import LlmResponsePanel from "@/llmResponse/LlmResponsePanel.tsx";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";
import {useGrammarLessons} from "@/hooks/use-grammar-lessons.tsx";

function GrammarLesson() {
    const reasoningEndedRef = useRef(false);
    const [thoughtChain, setThoughtChain] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const {setBreadcrumbs} = useBreadcrumb();
    const {"grammar-lesson": grammarLesson} = useParams();
    const grammarLessons = useGrammarLessons();
    const currentLesson = grammarLessons?.lessons.find((lesson) => lesson.title === grammarLesson);

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Grammar", currentLesson?.description];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs, grammarLesson]);

    useEffect(() => {
        setResponse([]);
        setThoughtChain([]);
        reasoningEndedRef.current = false;
        fetch(`/english-daily/api/v1/englishdaily/grammar?grammarLesson=${grammarLesson}`);
    }, [grammarLesson]);


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


    return (
        <div className="p-4">
            <LlmResponsePanel text={thoughtChain}/>
            <LlmResponsePanel text={response}/>
        </div>
    );

}

export default GrammarLesson;