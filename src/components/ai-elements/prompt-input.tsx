import {ButtonHTMLAttributes, FormEvent, FormHTMLAttributes, HTMLAttributes, KeyboardEvent, TextareaHTMLAttributes, useEffect, useRef} from "react";
import {ArrowUp, Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {ChatStatus} from "@/hooks/use-llm-chat.ts";

export function PromptInput({className, onSubmit, ...props}: FormHTMLAttributes<HTMLFormElement>) {
    return (
        <form
            className={cn(
                "flex w-full flex-col rounded-2xl border bg-background shadow-sm transition-shadow focus-within:border-ring/40 focus-within:shadow-md",
                className,
            )}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSubmit?.(event);
            }}
            {...props}
        />
    );
}

export interface PromptInputTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxHeight?: number;
}

/** Grows with its content; Enter sends, Shift+Enter adds a line. */
export function PromptInputTextarea({className, maxHeight = 200, onKeyDown, value, ...props}: PromptInputTextareaProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    }, [value, maxHeight]);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <textarea
            className={cn(
                "w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-base leading-6 outline-none placeholder:text-muted-foreground md:text-[15px]",
                className,
            )}
            onKeyDown={handleKeyDown}
            ref={ref}
            rows={1}
            value={value}
            {...props}
        />
    );
}

export function PromptInputToolbar({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center justify-between gap-2 p-2", className)} {...props}/>;
}

export function PromptInputTools({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex min-w-0 items-center gap-1", className)} {...props}/>;
}

export function PromptInputButton({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4",
                className,
            )}
            type="button"
            {...props}
        />
    );
}

export interface PromptInputSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    status?: ChatStatus;
}

export function PromptInputSubmit({status = "idle", className, disabled, ...props}: PromptInputSubmitProps) {
    const busy = status === "submitted" || status === "streaming";
    return (
        <button
            aria-label={busy ? "Waiting for the answer" : "Send"}
            className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30",
                className,
            )}
            disabled={disabled || busy}
            type="submit"
            {...props}
        >
            {busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <ArrowUp className="h-[18px] w-[18px]"/>}
        </button>
    );
}
