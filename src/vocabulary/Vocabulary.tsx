import {useQuery} from "react-query";
import vocabularyService from "@/vocabulary/VocabularyService.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import {useEffect} from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Separator} from "@radix-ui/react-separator";


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
        isFetching,
    } = useQuery(["daily-vocabulary"], () => vocabularyService.getDailyVocabulary(blacklist), {
        refetchOnWindowFocus: false,
    });
    const isWaitingForBackend = isLoading || isFetching;

    function printArray(array: string[] | undefined) {
        if (!array) {
            return "";
        }
        return array.join(", ");
    }


    if (data?.word && !blacklist.includes(data.word)) {
        blacklist.push(data.word);
    }
    return <div className="p-4">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Here's your daily random vocabulary refresher</CardTitle>
                <Separator className="bg-border h-[1px] w-full my-4"/>
                <CardDescription className="text-neutral-600">
                    {isWaitingForBackend &&
                        <Skeleton className="h-4 w-full mt-3"/>
                    }
                    {!isWaitingForBackend &&
                        <>
                            <strong className="font-bold">From: </strong>
                            <span
                                className="text-gray-500">{data?.source}</span>
                        </>
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>

                {isWaitingForBackend &&
                    <div className="space-y-2">
                        <Skeleton className="h-96 w-full"/>

                    </div>}
                {!isWaitingForBackend &&
                    <ul className="list-none text-left">
                        <li><strong className="font-extrabold">Word: </strong>{data?.word}</li>
                        <li><strong className="font-extrabold">Definition: </strong>{data?.definition}</li>
                        <li><strong className="font-extrabold">Part of Speech: </strong>{data?.partOfSpeech}</li>
                        <li><strong className="font-extrabold">Pronunciation: </strong>{data?.pronunciation}</li>
                        <li><strong className="font-extrabold">Example Sentence: </strong>{data?.exampleSentence}</li>
                        <li><strong className="font-extrabold">Collocations: </strong>{printArray(data?.collocations)}</li>
                        <li><strong className="font-extrabold">Synonyms: </strong>{printArray(data?.synonyms)}</li>
                    </ul>}
            </CardContent>
            <CardFooter className="place-content-end">
                <Button onClick={() => refetch()} disabled={isWaitingForBackend}>Refresh</Button>
            </CardFooter>
        </Card>
    </div>

}

export default Vocabulary;