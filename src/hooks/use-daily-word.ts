import {useQuery} from "react-query";
import vocabularyService from "@/vocabulary/VocabularyService.ts";

// Words already shown this session, sent to the backend so "Another word" never repeats.
const shownWords: string[] = [];

export function useDailyWord() {
    const query = useQuery(["daily-vocabulary"], () => vocabularyService.getDailyVocabulary(shownWords), {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        onSuccess: data => {
            if (data?.word && !shownWords.includes(data.word)) shownWords.push(data.word);
        },
    });
    return {...query, isBusy: query.isLoading || query.isFetching};
}
