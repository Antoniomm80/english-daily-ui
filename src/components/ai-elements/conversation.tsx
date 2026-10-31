import {ComponentProps} from "react";
import {StickToBottom, useStickToBottomContext} from "use-stick-to-bottom";
import {ArrowDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

/** Scrollable message log that sticks to the bottom while an answer streams in. */
export function Conversation({className, ...props}: ConversationProps) {
    return (
        <StickToBottom
            className={cn("relative min-h-0 flex-1 overflow-y-auto", className)}
            initial="smooth"
            resize="smooth"
            role="log"
            {...props}
        />
    );
}

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;

export function ConversationContent({className, ...props}: ConversationContentProps) {
    return <StickToBottom.Content className={cn("mx-auto w-full max-w-3xl px-4 py-6", className)} {...props}/>;
}

export function ConversationScrollButton({className, ...props}: ComponentProps<typeof Button>) {
    const {isAtBottom, scrollToBottom} = useStickToBottomContext();
    if (isAtBottom) return null;
    return (
        <Button
            aria-label="Scroll to latest message"
            className={cn("absolute bottom-4 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full shadow-md", className)}
            onClick={() => scrollToBottom()}
            size="icon"
            type="button"
            variant="outline"
            {...props}
        >
            <ArrowDown className="h-4 w-4"/>
        </Button>
    );
}
