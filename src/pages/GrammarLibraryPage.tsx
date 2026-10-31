import {useMemo, useState} from "react";
import {Link, useSearchParams} from "react-router";
import {Check, ChevronRight, Search} from "lucide-react";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {LessonWithLevel, LEVELS, useAllLessons} from "@/hooks/use-grammar-lessons.tsx";
import {getLastLessonId, getStudiedLessons} from "@/lib/progress.ts";

function LessonRow({lesson, studied, showLevel}: { lesson: LessonWithLevel; studied: boolean; showLevel: boolean }) {
    return (
        <li>
            <Link
                className="flex min-h-[52px] items-center gap-3 border-b border-muted px-1 py-2 text-[15px] transition-colors hover:bg-muted/40"
                to={`/grammar/${lesson.id}`}
            >
                {studied
                    ? <span aria-label="Studied" className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground" role="img"><Check className="h-3.5 w-3.5" strokeWidth={3}/></span>
                    : <span aria-label="Not studied yet" className="h-[22px] w-[22px] shrink-0 rounded-full border-[1.5px] border-muted-foreground/30" role="img"/>}
                <span className="flex-1">{lesson.title}</span>
                {showLevel && <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{lesson.level.shortLabel}</span>}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60"/>
            </Link>
        </li>
    );
}

/** Replaces the sidebar's three expanding lesson trees with one searchable list. */
export default function GrammarLibraryPage() {
    const {lessons, isLoading} = useAllLessons();
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const studied = useMemo(() => getStudiedLessons(), []);
    const lastLesson = lessons.find(lesson => lesson.id === getLastLessonId());

    const activeLevel = LEVELS.find(level => level.shortLabel.toLowerCase() === params.get("level")) ?? lastLesson?.level ?? LEVELS[0];
    const searching = query.trim().length > 0;
    const visible = searching
        ? lessons.filter(lesson => lesson.title.toLowerCase().includes(query.trim().toLowerCase()))
        : lessons.filter(lesson => lesson.level.level === activeLevel.level);
    const studiedCount = lessons.filter(lesson => studied.has(lesson.id)).length;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-8 pt-5 md:pt-10">
                <header className="flex items-end justify-between gap-4">
                    <h1 className="text-[28px] font-bold tracking-tight">Grammar</h1>
                    {lessons.length > 0 && <span className="pb-1.5 text-sm text-muted-foreground">{studiedCount} of {lessons.length} studied</span>}
                </header>

                <div className="relative">
                    <label className="sr-only" htmlFor="lesson-search">Search lessons</label>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground"/>
                    <input
                        className="h-11 w-full rounded-xl border bg-muted/40 pl-10 pr-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring/40 focus:bg-background md:text-[15px]"
                        id="lesson-search"
                        onChange={event => setQuery(event.target.value)}
                        placeholder={lessons.length ? `Search ${lessons.length} lessons` : "Search lessons"}
                        type="search"
                        value={query}
                    />
                </div>

                {!searching && (
                    <div aria-label="Level" className="grid grid-cols-3 rounded-xl bg-muted p-1" role="tablist">
                        {LEVELS.map(level => {
                            const selected = level.level === activeLevel.level;
                            const count = lessons.filter(lesson => lesson.level.level === level.level).length;
                            return (
                                <button
                                    aria-selected={selected}
                                    className={cn(
                                        "h-9 rounded-lg text-sm transition-colors",
                                        selected ? "bg-background font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    )}
                                    key={level.level}
                                    onClick={() => setParams({level: level.shortLabel.toLowerCase()}, {replace: true})}
                                    role="tab"
                                    type="button"
                                >
                                    {level.shortLabel}
                                    {count > 0 && <span className="font-normal text-muted-foreground"> · {count}</span>}
                                </button>
                            );
                        })}
                    </div>
                )}

                {lastLesson && !searching && (
                    <Link
                        className="flex items-center gap-3.5 rounded-2xl bg-primary p-4 text-primary-foreground transition-opacity hover:opacity-95"
                        to={`/grammar/${lastLesson.id}`}
                    >
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-xs text-primary-foreground/70">Continue · {lastLesson.level.shortLabel}</span>
                            <span className="truncate text-base font-semibold">{lastLesson.title}</span>
                        </div>
                        <ChevronRight className="h-5 w-5"/>
                    </Link>
                )}

                {isLoading && visible.length === 0 && (
                    <div className="flex flex-col gap-3">
                        {Array.from({length: 6}, (_, index) => <Skeleton className="h-11 w-full" key={index}/>)}
                    </div>
                )}

                {!isLoading && visible.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        {searching ? `No lesson matches “${query}”.` : "No lessons at this level yet."}
                    </p>
                )}

                {visible.length > 0 && (
                    <section aria-label={searching ? "Search results" : activeLevel.label}>
                        <ul>
                            {visible.map(lesson => (
                                <LessonRow key={lesson.id} lesson={lesson} showLevel={searching} studied={studied.has(lesson.id)}/>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}
