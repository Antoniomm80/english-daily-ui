import axios, {AxiosError} from "axios";
import {GrammarLessonsProps} from "@/grammar/GrammarItemProps.ts";
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
    } = useQuery(["grammar-lessons", grammarLessonLevel.valueOf()], () => grammarService.getGrammarLessons(grammarLessonLevel));
    if (isError) {
        throw error;
    }
    return data;
}