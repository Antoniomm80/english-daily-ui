import {useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router";
import {SquarePen} from "lucide-react";
import {PageHeader} from "@/components/layout/AppShell.tsx";
import {ChatView} from "@/components/chat/ChatView.tsx";
import {askLlama, useLlmChat} from "@/hooks/use-llm-chat.ts";
import {Button} from "@/components/ui/button.tsx";

export const STARTERS = [
    "\"Affect\" or \"effect\"? Explain with examples",
    "When do I use the present perfect continuous?",
    "Correct this: \"I am agree with you\"",
    "Phrasal verbs with \"take\" for work emails",
];

export interface AskNavigationState {
    /** The text sent to the tutor. */
    prompt: string;
    /** What the learner sees as their message, when different from the prompt. */
    display?: string;
}

export default function AskPage() {
    const chat = useLlmChat();
    const location = useLocation();
    const navigate = useNavigate();
    const handledStateRef = useRef<unknown>(null);
    const lastPromptRef = useRef<string>();

    // The backend answers each question on its own, so follow-ups carry the previous
    // question along; otherwise "give me more examples" would have nothing to refer to.
    const ask = (display: string, prompt: string = display) => {
        if (chat.busy) return;
        const previous = lastPromptRef.current;
        const request = previous ? `My previous question was: "${previous}"\n\n${prompt}` : prompt;
        lastPromptRef.current = prompt;
        chat.send(display, askLlama(request));
    };

    const newChat = () => {
        lastPromptRef.current = undefined;
        chat.reset();
    };

    // A prompt handed over from another page (Today, Words) is sent straight away.
    useEffect(() => {
        const state = location.state as AskNavigationState | null;
        if (!state?.prompt || handledStateRef.current === state) return;
        handledStateRef.current = state;
        ask(state.display ?? state.prompt, state.prompt);
        navigate(location.pathname, {replace: true, state: null});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    const followUps = chat.messages.length > 0
        ? ["Give me more examples", "Explain it more simply", "Quiz me on this"]
        : [];

    return (
        <>
            <PageHeader
                actions={chat.messages.length > 0 && (
                    <Button aria-label="New chat" disabled={chat.busy} onClick={newChat} size="icon" variant="ghost">
                        <SquarePen className="h-5 w-5"/>
                    </Button>
                )}
                subtitle="English Daily"
                title="Ask the tutor"
            />
            <ChatView
                emptyState={
                    <div className="flex flex-col gap-6 pt-6 md:pt-16">
                        <div className="flex flex-col gap-1.5">
                            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What would you like to know?</h2>
                            <p className="text-muted-foreground">Grammar doubts, word choice, corrections. Anything that pops into your mind.</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {STARTERS.map(starter => (
                                <button
                                    className="min-h-11 rounded-xl border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                                    key={starter}
                                    onClick={() => ask(starter)}
                                    type="button"
                                >
                                    {starter}
                                </button>
                            ))}
                        </div>
                    </div>
                }
                messages={chat.messages}
                onRegenerate={chat.regenerate}
                onSend={text => ask(text)}
                status={chat.status}
                suggestions={chat.busy ? [] : followUps}
            />
        </>
    );
}
