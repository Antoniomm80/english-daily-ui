import axios, {AxiosError} from "axios";
import {GrammarItemProps, GrammarLessonsProps} from "@/grammar/GrammarItemProps.ts";
import {useQuery} from "react-query";
import {GrammarLessonLevel} from "@/grammar/GrammarLessonLevel.ts";

const grammarService = {
    async getGrammarLessons(grammarLessonLevel: GrammarLessonLevel): Promise<GrammarLessonsProps> {
        try {
            const result = await axios.get<GrammarLessonsProps>(`/english-daily/api/v1/englishdaily/grammar-lessons/${grammarLessonLevel.valueOf()}`);
            return result.data;
        } catch (error) {
            const errors = error as Error | AxiosError;
            if (axios.isAxiosError(error)) {
                throw new Error(errors.message);
            } else {
                throw error;
            }
        }

    },
}

export function useGrammarLessons(grammarLessonLevel: GrammarLessonLevel): GrammarLessonsProps | undefined {
    const {
        data,
        isError,
        error
    } = useQuery(["grammar-lessons", grammarLessonLevel.valueOf()], () => grammarService.getGrammarLessons(grammarLessonLevel), {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    if (isError) {
        throw error;
    }
    return data;
}

export interface LevelInfo {
    level: GrammarLessonLevel;
    label: string;
    shortLabel: string;
}

export const LEVELS: LevelInfo[] = [
    {level: GrammarLessonLevel.B2, label: "Grammar B2", shortLabel: "B2"},
    {level: GrammarLessonLevel.C1, label: "Grammar C1", shortLabel: "C1"},
    {level: GrammarLessonLevel.ADVANCED_GRAMMAR_CHALLENGE, label: "Advanced grammar", shortLabel: "Advanced"},
];

export interface LessonWithLevel extends GrammarItemProps {
    level: LevelInfo;
}

/** Every lesson across all levels, each tagged with its level. */
export function useAllLessons() {
    const b2 = useGrammarLessons(GrammarLessonLevel.B2);
    const c1 = useGrammarLessons(GrammarLessonLevel.C1);
    const advanced = useGrammarLessons(GrammarLessonLevel.ADVANCED_GRAMMAR_CHALLENGE);
    const byLevel = [b2, c1, advanced];
    const lessons: LessonWithLevel[] = LEVELS.flatMap((level, index) =>
        (byLevel[index]?.lessons ?? []).map(lesson => ({...lesson, level})));
    return {lessons, isLoading: byLevel.some(entry => entry === undefined)};
}
