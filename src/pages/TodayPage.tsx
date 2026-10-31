import {useMemo, useState} from "react";
import {Link, useNavigate} from "react-router";
import {ArrowRight, Search} from "lucide-react";
import {PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar, PromptInputTools} from "@/components/ai-elements/prompt-input";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useCommandMenu} from "@/components/layout/CommandMenu.tsx";
import {useAllLessons} from "@/hooks/use-grammar-lessons.tsx";
import {useDailyWord} from "@/hooks/use-daily-word.ts";
import {getLastLessonId, getStudiedLessons} from "@/lib/progress.ts";
import {AskNavigationState, STARTERS} from "@/pages/AskPage.tsx";

function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 19) return "Good afternoon.";
    return "Good evening.";
}

export default function TodayPage() {
    const navigate = useNavigate();
    const {open: openCommandMenu} = useCommandMenu();
    const {lessons} = useAllLessons();
    const {data: word, isBusy: wordLoading} = useDailyWord();
    const [input, setInput] = useState("");

    const studied = useMemo(() => getStudiedLessons(), []);
    const lastLesson = lessons.find(lesson => lesson.id === getLastLessonId());
    // Suggest the first lesson not studied yet, at the level of the last one opened.
    const nextLesson = lastLesson ?? lessons.find(lesson => !studied.has(lesson.id));

    const ask = (prompt: string) => {
        if (!prompt.trim()) return;
        const state: AskNavigationState = {prompt: prompt.trim()};
        navigate("/ask", {state});
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-7 px-4 pb-10 pt-4 md:pt-12">
                <div className="flex items-center justify-between md:hidden">
                    <span className="text-base font-semibold">English Daily</span>
                    <button
                        aria-label="Search lessons"
                        className="-mr-2 flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={openCommandMenu}
                        type="button"
                    >
                        <Search className="h-5 w-5"/>
                    </button>
                </div>

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-4xl">{greeting()}</h1>
                    <p className="text-[15px] text-muted-foreground">Pick up where you left off, or just ask.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link className="flex min-h-[132px] flex-col gap-2 rounded-2xl border p-4 transition-colors hover:bg-muted/40" to="/words">
                        <span className="text-xs text-muted-foreground">Word of the day</span>
                        {wordLoading || !word
                            ? <><Skeleton className="h-6 w-24"/><Skeleton className="h-4 w-full"/></>
                            : <>
                                <span className="truncate text-xl font-semibold tracking-tight">{word.word}</span>
                                <span className="line-clamp-2 text-[13px] leading-[18px] text-muted-foreground">{word.definition}</span>
                            </>}
                    </Link>
                    {nextLesson ? (
                        <Link className="flex min-h-[132px] flex-col gap-2 rounded-2xl border p-4 transition-colors hover:bg-muted/40" to={`/grammar/${nextLesson.id}`}>
                            <span className="text-xs text-muted-foreground">{lastLesson ? "Continue" : "Start"} · {nextLesson.level.shortLabel}</span>
                            <span className="line-clamp-3 text-base font-semibold leading-snug">{nextLesson.title}</span>
                            <span className="mt-auto flex items-center gap-1 text-[13px] font-medium text-brand">Open lesson <ArrowRight className="h-3.5 w-3.5"/></span>
                        </Link>
                    ) : (
                        <Link className="flex min-h-[132px] flex-col gap-2 rounded-2xl border p-4 transition-colors hover:bg-muted/40" to="/grammar">
                            <span className="text-xs text-muted-foreground">Grammar</span>
                            <span className="text-base font-semibold">Browse lessons</span>
                        </Link>
                    )}
                </div>

                <section className="flex flex-col gap-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ask the tutor</h2>
                    <PromptInput onSubmit={() => ask(input)}>
                        <label className="sr-only" htmlFor="today-input">Ask the tutor</label>
                        <PromptInputTextarea
                            id="today-input"
                            onChange={event => setInput(event.target.value)}
                            placeholder="Ask anything about English…"
                            value={input}
                        />
                        <PromptInputToolbar>
                            <PromptInputTools/>
                            <PromptInputSubmit disabled={!input.trim()}/>
                        </PromptInputToolbar>
                    </PromptInput>
                    <div className="flex flex-col gap-2">
                        {STARTERS.slice(0, 3).map(starter => (
                            <button
                                className="min-h-11 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                                key={starter}
                                onClick={() => ask(starter)}
                                type="button"
                            >
                                {starter}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
