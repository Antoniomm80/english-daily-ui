import './App.css'
import {QueryClient, QueryClientProvider} from "react-query";
import Vocabulary from "@/vocabulary/Vocabulary.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Route, Routes} from "react-router";
import AskLlama from "@/askllama/AskLlama.tsx";
import BreadcrumbDisplay from "@/breadcrumb/BreadcrumbDisplay.tsx";
import {BreadcrumbProvider} from "@/breadcrumb/BreadcrumbContext.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BreadcrumbProvider>
                    <SidebarProvider>
                        <AppSidebar/>
                        <SidebarInset>
                            <header
                                className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1"/>
                                    <Separator orientation="vertical" className="mr-2 h-4"/>
                                    <div id="breadcrumb-root"></div>
                                    <BreadcrumbDisplay/>
                                </div>
                            </header>
                            <Routes>
                                <Route index element={<Vocabulary/>}/>
                                <Route path="/ask-llama" element={<AskLlama/>}/>
                            </Routes>
                        </SidebarInset>
                    </SidebarProvider>
                </BreadcrumbProvider>
            </QueryClientProvider>
        </>
    )
}

export default App
