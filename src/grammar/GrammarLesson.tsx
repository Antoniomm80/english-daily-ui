import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import LlmResponsePanel from "@/llmResponse/LlmResponsePanel.tsx";
import {useSocketIo} from "@/hooks/use-socket-io.tsx";
import {useGrammarLessons} from "@/hooks/use-grammar-lessons.tsx";
import {ThoughtChainSwitcher} from "@/llmResponse/ThoughtChainSwitcher.tsx";
import {Message} from "@/llmResponse/Message.ts";
import {ChatArea} from "@/llmResponse/ChatArea.tsx";
import {GrammarLessonLevel} from "@/grammar/GrammarLessonLevel.ts";

function GrammarLesson() {
    const reasoningEndedRef = useRef(false);
    const [thoughtChain, setThoughtChain] = useState<string[]>([]);

    const {setBreadcrumbs} = useBreadcrumb();
    const {"grammar-lesson": grammarLesson} = useParams();
    const b2GrammarLessons = useGrammarLessons(GrammarLessonLevel.B2);
    const c1GrammarLessons = useGrammarLessons(GrammarLessonLevel.C1);
    const advancedGrammarLessons = useGrammarLessons(GrammarLessonLevel.ADVANCED_GRAMMAR_CHALLENGE);
    const allLessons = [
        ...(b2GrammarLessons?.lessons ?? []),
        ...(c1GrammarLessons?.lessons ?? []),
        ...(advancedGrammarLessons?.lessons ?? [])
    ];

    const currentLesson = allLessons.find((lesson) => lesson.id === parseInt(grammarLesson!));
    const [thoughtChainVisible, setThoughtChainVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Grammar", currentLesson?.title ?? ""];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs, grammarLesson]);

    useEffect(() => {
        setThoughtChain([]);
        reasoningEndedRef.current = false;
        setChatMessages([...chatMessages, {role: "user", content: [`I want to brush up on ${currentLesson?.title ?? ""}`]}, {
            role: "bot",
            content: []
        }]);
        fetch(`/english-daily/api/v1/englishdaily/grammar/${currentLesson?.id}`);
    }, [grammarLesson]);


    useSocketIo("controlplane.local", "/ask-llama/socket", (message: string) => {
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


    return (
        <>
            <div className="p-4">
                <ThoughtChainSwitcher thoughtChainVisible={thoughtChainVisible}
                                      setThoughtChainVisible={(checked) => setThoughtChainVisible(checked)}/>
                {thoughtChainVisible && <LlmResponsePanel text={thoughtChain} greyBackground/>}
                <ChatArea messages={chatMessages}/>
            </div>
        </>
    );

}

export default GrammarLesson;