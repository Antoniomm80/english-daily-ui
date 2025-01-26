import {useQuery} from "react-query";
import vocabularyService from "@/vocabulary/VocabularyService.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import {useEffect} from "react";


const blacklist: string[] = [];

function Vocabulary() {
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        const breadcrumbs = ["English Daily", "Vocabulary"];
        setBreadcrumbs(breadcrumbs);
    }, [setBreadcrumbs]);
    const {
        isLoading,
        data,
        refetch,
        isFetching
    } = useQuery(["daily-vocabulary"], () => vocabularyService.getDailyVocabulary(blacklist));

    function printArray(array: string[] | undefined) {
        if (!array) {
            return "";
        }
        return array.join(", ");
    }


    if (isLoading || isFetching) {
        return (
            <div className="path-list">
                <Spinner>
                    Loading...
                </Spinner>
            </div>
        );
    }
    if (data?.word && !blacklist.includes(data.word)) {
        blacklist.push(data.word);
    }
    return <div className="p-4">
        <Card className="bg-zinc-100">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Here's your daily random vocabulary refresher</CardTitle>
                <CardDescription className="text-lg font-gray-900"><strong className="font-bold">From: </strong><span
                    className="text-gray-500">{data?.source}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-none text-left">
                    <li><strong className="font-extrabold">Word: </strong>{data?.word}</li>
                    <li><strong className="font-extrabold">Definition: </strong>{data?.definition}</li>
                    <li><strong className="font-extrabold">Part of Speech: </strong>{data?.partOfSpeech}</li>
                    <li><strong className="font-extrabold">Pronunciation: </strong>{data?.pronunciation}</li>
                    <li><strong className="font-extrabold">Example Sentence: </strong>{data?.exampleSentence}</li>
                    <li><strong className="font-extrabold">Collocations: </strong>{printArray(data?.collocations)}</li>
                    <li><strong className="font-extrabold">Synonyms: </strong>{printArray(data?.synonyms)}</li>
                </ul>
            </CardContent>
            <CardFooter className="place-content-end">
                <Button onClick={() => refetch()}>Refresh</Button>
            </CardFooter>
        </Card>
    </div>

}

export default Vocabulary;