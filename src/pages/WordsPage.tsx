import {useNavigate} from "react-router";
import {MessageCircle, RefreshCw, Volume2} from "lucide-react";
import {PageHeader} from "@/components/layout/AppShell.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useDailyWord} from "@/hooks/use-daily-word.ts";

function Chips({title, items}: { title: string; items?: string[] }) {
    if (!items || items.length === 0) return null;
    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
            <ul className="flex flex-wrap gap-2">
                {items.map(item => (
                    <li className="rounded-full bg-muted px-3 py-1 text-sm" key={item}>{item}</li>
                ))}
            </ul>
        </section>
    );
}

function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

export default function WordsPage() {
    const {data, isBusy, isError, refetch} = useDailyWord();
    const navigate = useNavigate();

    const practise = () => {
        if (!data) return;
        navigate("/ask", {
            state: {
                prompt: `Help me practise the word "${data.word}" (${data.partOfSpeech}): ${data.definition}. ` +
                    "Give me two fresh example sentences, then ask me to write my own and correct it.",
                display: `Help me practise "${data.word}"`,
            },
        });
    };

    return (
        <>
            <PageHeader
                actions={
                    <Button className="gap-2" disabled={isBusy} onClick={() => refetch()} size="sm" variant="outline">
                        <RefreshCw className={isBusy ? "h-4 w-4 animate-spin" : "h-4 w-4"}/>
                        Another word
                    </Button>
                }
                className="md:border-b"
                title="Vocabulary refresher"
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:py-10">
                    {isError && <p className="text-sm text-destructive">Couldn't load a word. Try again in a moment.</p>}

                    {isBusy && (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-4 w-32"/>
                            <Skeleton className="h-12 w-64"/>
                            <Skeleton className="h-24 w-full"/>
                            <Skeleton className="h-16 w-full"/>
                        </div>
                    )}

                    {!isBusy && data && (
                        <article className="flex flex-col gap-6">
                            <header className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">{data.partOfSpeech}</span>
                                    {data.source && <span className="truncate">from {data.source}</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">{data.word}</h2>
                                    <button
                                        aria-label={`Pronounce ${data.word}`}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        onClick={() => speak(data.word)}
                                        type="button"
                                    >
                                        <Volume2 className="h-5 w-5"/>
                                    </button>
                                </div>
                                {data.pronunciation && <p className="font-mono text-sm text-muted-foreground">{data.pronunciation}</p>}
                            </header>

                            <p className="text-lg leading-relaxed">{data.definition}</p>

                            {data.exampleSentence && (
                                <blockquote className="rounded-2xl bg-muted/60 px-5 py-4 text-[15px] italic leading-relaxed">
                                    {data.exampleSentence}
                                </blockquote>
                            )}

                            <Chips items={data.collocations} title="Collocations"/>
                            <Chips items={data.synonyms} title="Synonyms"/>

                            <Button className="h-11 gap-2 self-start" onClick={practise}>
                                <MessageCircle className="h-4 w-4"/>
                                Practise it with the tutor
                            </Button>
                        </article>
                    )}
                </div>
            </div>
        </>
    );
}
