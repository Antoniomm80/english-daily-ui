import axios, {AxiosError} from "axios";
import {GrammarLessonsProps} from "@/grammar/GrammarItemProps.ts";
import {useQuery} from "react-query";

const grammarService = {
    async getGrammarLessons(): Promise<GrammarLessonsProps> {
        try {
            const result = await axios.get<GrammarLessonsProps>(`/english-daily/api/v1/englishdaily/grammar-lessons`);
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

export function useGrammarLessons(): GrammarLessonsProps | undefined {
    const {data, isError, error} = useQuery(["grammar-lessons"], () => grammarService.getGrammarLessons());
    if (isError) {
        throw error;
    }
    return data;
}