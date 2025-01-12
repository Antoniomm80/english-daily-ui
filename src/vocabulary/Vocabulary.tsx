import {useQuery} from "react-query";
import vocabularyService from "@/vocabulary/VocabularyService.ts";

function Vocabulary() {
    const {
        isLoading,
        data
    } = useQuery(["daily-vocabulary"], () => vocabularyService.getDailyVocabulary());


    if (isLoading) {
        return (
            <div className="path-list">
                Loading...
            </div>
        );
    }
    <p>{data?.response}</p>
}

export default Vocabulary;