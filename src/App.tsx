import {QueryClient, QueryClientProvider} from "react-query";
import {Navigate, Route, Routes} from "react-router";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {SocketProvider} from "@/hooks/use-socket-io.tsx";
import {AppShell} from "@/components/layout/AppShell.tsx";
import {CommandMenuProvider} from "@/components/layout/CommandMenu.tsx";
import TodayPage from "@/pages/TodayPage.tsx";
import GrammarLibraryPage from "@/pages/GrammarLibraryPage.tsx";
import LessonPage from "@/pages/LessonPage.tsx";
import WordsPage from "@/pages/WordsPage.tsx";
import AskPage from "@/pages/AskPage.tsx";
import {CourseAdminPage} from "@/components/admin/CourseAdminPage";

const queryClient = new QueryClient();

function AdminPage() {
    return (
        <div className="flex-1 overflow-y-auto">
            <CourseAdminPage/>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                <TooltipProvider delayDuration={300}>
                    <CommandMenuProvider>
                        <AppShell>
                            <Routes>
                                <Route element={<TodayPage/>} index/>
                                <Route element={<GrammarLibraryPage/>} path="/grammar"/>
                                <Route element={<LessonPage/>} path="/grammar/:lessonId"/>
                                <Route element={<WordsPage/>} path="/words"/>
                                <Route element={<AskPage/>} path="/ask"/>
                                <Route element={<Navigate replace to="/ask"/>} path="/ask-llama"/>
                                <Route element={<AdminPage/>} path="/admin/courses"/>
                                <Route element={<Navigate replace to="/"/>} path="*"/>
                            </Routes>
                        </AppShell>
                    </CommandMenuProvider>
                </TooltipProvider>
            </SocketProvider>
        </QueryClientProvider>
    );
}

export default App;
