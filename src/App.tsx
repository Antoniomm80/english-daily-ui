import './App.css'
import {QueryClient, QueryClientProvider} from "react-query";
import Vocabulary from "@/vocabulary/Vocabulary.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Vocabulary/>
            </QueryClientProvider>
        </>
    )
}

export default App
