import './App.css'
import {QueryClient, QueryClientProvider} from "react-query";
import Vocabulary from "@/vocabulary/Vocabulary.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb.tsx";
import {Route, Routes} from "react-router";
import AskLlama from "@/askllama/AskLlama.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>

                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                        <header
                            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1"/>
                                <Separator orientation="vertical" className="mr-2 h-4"/>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Daily English
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block"/>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Vocabulary Refresher</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        <Routes>
                            <Route index element={<Vocabulary/>}/>
                            <Route path="/ask-llama" element={<AskLlama/>}/>
                        </Routes>
                    </SidebarInset>
                </SidebarProvider>

            </QueryClientProvider>
        </>
    )
}

export default App
