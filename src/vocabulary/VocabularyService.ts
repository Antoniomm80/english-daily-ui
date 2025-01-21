import axios, {AxiosError} from "axios";
import {VocabularyProps} from "@/vocabulary/VocabularyProps.ts";
import qs from "qs";

const vocabularyService = {


    async getDailyVocabulary(blacklist: string[]): Promise<VocabularyProps> {
        try {
            const result = await axios.get<VocabularyProps>(`/english-daily/api/v1/englishdaily/vocabulary`, {
                params: {blacklist},
                paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
            });
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