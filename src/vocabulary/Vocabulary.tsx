import {useQuery} from "react-query";
import vocabularyService from "@/vocabulary/VocabularyService.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";


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
    return <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="bg-zinc-100">
            <CardHeader>
                <CardTitle className="text-xl font-medium">Here's your daily random vocabulary refresher</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{data?.response}</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    </div>

}

export default Vocabulary;