import axios, {AxiosError} from "axios";
import {VocabularyProps} from "@/vocabulary/VocabularyProps.ts";

const vocabularyService = {


    async getDailyVocabulary(): Promise<VocabularyProps> {
        try {
            //add param to url
            const result = await axios.get<VocabularyProps>(`http://controlplane.local/english-daily/api/v1/englishdaily/vocabulary`);
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

export default vocabularyService;