import {Brain} from "lucide-react";
import {Switch} from "@/components/ui/switch.tsx";

interface ThoughtChainSwitcherProps {
    thoughtChainVisible: boolean;
    setThoughtChainVisible: (visible: boolean) => void;
}

export function ThoughtChainSwitcher(props: ThoughtChainSwitcherProps) {
    return (
        <div className="mb-4 flex items-center space-x-4 rounded-md border p-4">
            <Brain/>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                    Deep Seek Thought Chain
                </p>
                <p className="text-sm text-muted-foreground">
                    View deep seek reasoning process
                </p>
            </div>
            <Switch checked={props.thoughtChainVisible} onCheckedChange={props.setThoughtChainVisible}/>
        </div>
    );
}