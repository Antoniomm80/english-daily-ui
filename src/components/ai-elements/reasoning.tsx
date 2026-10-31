import {ReactNode, useEffect, useRef, useState} from "react";
import {ChevronDown, Lightbulb} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {cn} from "@/lib/utils";

export interface ReasoningProps {
    isStreaming: boolean;
    seconds?: number;
    children: ReactNode;
    className?: string;
}

/**
 * The model's thought chain, folded under a one-line trigger. It opens while the model
 * is thinking and folds itself away once the answer starts (unless the reader opened it).
 */
export function Reasoning({isStreaming, seconds, children, className}: ReasoningProps) {
    const [open, setOpen] = useState(isStreaming);
    const userToggled = useRef(false);

    useEffect(() => {
        if (userToggled.current) return;
        setOpen(isStreaming);
    }, [isStreaming]);

    return (
        <Collapsible
            className={cn("not-prose", className)}
            onOpenChange={value => {
                userToggled.current = true;
                setOpen(value);
            }}
            open={open}
        >
            <CollapsibleTrigger className="flex items-center gap-1.5 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                <Lightbulb className="h-4 w-4"/>
                {isStreaming
                    ? <span className="animate-pulse">Thinking…</span>
                    : <span>{seconds ? `Thought for ${seconds} second${seconds === 1 ? "" : "s"}` : "Reasoning"}</span>}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}/>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="mt-2 whitespace-pre-wrap rounded-xl border border-muted bg-muted/40 px-3 py-2.5 text-[13px] leading-5 text-muted-foreground">
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
