import {useEffect, useRef} from "react";
import {Link, useParams} from "react-router";
import {ArrowLeft, ChevronRight, Search} from "lucide-react";
import {PageHeader} from "@/components/layout/AppShell.tsx";
import {useCommandMenu} from "@/components/layout/CommandMenu.tsx";
import {ChatView} from "@/components/chat/ChatView.tsx";
import {askLlama, generateGrammarLesson, useLlmChat} from "@/hooks/use-llm-chat.ts";
import {LessonWithLevel, useAllLessons} from "@/hooks/use-grammar-lessons.tsx";
import {useDailyWord} from "@/hooks/use-daily-word.ts";
import {markLessonStudied, setLastLessonId} from "@/lib/progress.ts";

const FOLLOW_UPS: Record<string, string> = {
    "Quiz me on this": "Give me a short quiz with 3 multiple-choice questions on this. Number them, list the options as a), b), c), and put the answers at the very end under an 'Answers' heading.",
    "3 more examples": "Give me 3 more example sentences, each with a one-line explanation of why it is correct.",
    "Explain it more simply": "Explain it again more simply, in a few short sentences.",
    "Common mistakes": "What are the most common mistakes learners make with this? Show wrong and corrected versions in a table.",
};

function SidePanel({lesson, lessons}: { lesson: LessonWithLevel; lessons: LessonWithLevel[] }) {
    const {data: word} = useDailyWord();
    const sameLevel = lessons.filter(other => other.level.level === lesson.level.level);
    const index = sameLevel.findIndex(other => other.id === lesson.id);
    const upNext = sameLevel.slice(index + 1, index + 4);

    return (
        <aside className="hidden w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l bg-muted/30 p-5 xl:flex">
            {upNext.length > 0 && (
                <section className="flex flex-col gap-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Up next in {lesson.level.shortLabel}</h2>
                    {upNext.map(next => (
                        <Link
                            className="flex min-h-10 items-center justify-between gap-2 rounded-xl border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                            key={next.id}
                            to={`/grammar/${next.id}`}
                        >
                            <span className="truncate">{next.title}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground"/>
                        </Link>
                    ))}
                </section>
            )}
            {word && (
                <Link className="flex flex-col gap-1.5 rounded-xl border bg-background p-4 transition-colors hover:bg-muted/50" to="/words">
                    <span className="text-xs text-muted-foreground">Word of the day</span>
                    <span className="text-xl font-semibold">{word.word}</span>
                    {word.pronunciation && <span className="font-mono text-xs text-muted-foreground">{word.pronunciation} · {word.partOfSpeech}</span>}
                    <span className="line-clamp-3 text-[13px] leading-5 text-muted-foreground">{word.definition}</span>
                </Link>
            )}
        </aside>
    );
}

function LessonChat({lesson, lessons}: { lesson: LessonWithLevel; lessons: LessonWithLevel[] }) {
    const chat = useLlmChat();
    const startedRef = useRef(false);
    const {open: openCommandMenu} = useCommandMenu();

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        setLastLessonId(lesson.id);
        chat.send(`I want to brush up on ${lesson.title}`, generateGrammarLesson(lesson.id));
    }, [chat, lesson]);

    // The first full explanation counts as having studied the lesson.
    const firstAnswer = chat.messages[1];
    useEffect(() => {
        if (firstAnswer?.status === "done" && firstAnswer.content) markLessonStudied(lesson.id);
    }, [firstAnswer?.status, firstAnswer?.content, lesson.id]);

    const sameLevel = lessons.filter(other => other.level.level === lesson.level.level);
    const position = sameLevel.findIndex(other => other.id === lesson.id) + 1;

    const ask = (text: string) => {
        const prompt = FOLLOW_UPS[text] ?? text;
        chat.send(text, askLlama(`We are studying the grammar lesson "${lesson.title}" (${lesson.level.label}). ${prompt}`));
    };

    return (
        <div className="flex min-h-0 flex-1">
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    actions={
                        <button
                            aria-label="Find another lesson"
                            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            onClick={openCommandMenu}
                            type="button"
                        >
                            <Search className="h-5 w-5"/>
                        </button>
                    }
                    leading={
                        <Link
                            aria-label="All grammar lessons"
                            className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-muted"
                            to={`/grammar?level=${lesson.level.shortLabel.toLowerCase()}`}
                        >
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                    }
                    subtitle={`${lesson.level.label}${position > 0 ? ` · lesson ${position} of ${sameLevel.length}` : ""}`}
                    title={lesson.title}
                />
                <ChatView
                    messages={chat.messages}
                    onRegenerate={chat.regenerate}
                    onSend={ask}
                    placeholder="Ask about this lesson…"
                    status={chat.status}
                    suggestions={chat.busy ? [] : Object.keys(FOLLOW_UPS)}
                />
            </div>
            <SidePanel lesson={lesson} lessons={lessons}/>
        </div>
    );
}

export default function LessonPage() {
    const {lessonId} = useParams();
    const {lessons, isLoading} = useAllLessons();
    const lesson = lessons.find(candidate => candidate.id === Number(lessonId));

    if (!lesson) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-muted-foreground">{isLoading ? "Loading lesson…" : "That lesson doesn't exist."}</p>
                {!isLoading && <Link className="text-sm font-medium text-brand underline" to="/grammar">Browse all lessons</Link>}
            </div>
        );
    }

    // Keyed by lesson so navigating to another lesson starts a fresh conversation.
    return <LessonChat key={lesson.id} lesson={lesson} lessons={lessons}/>;
}
