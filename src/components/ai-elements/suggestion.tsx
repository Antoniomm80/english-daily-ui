import {HTMLAttributes} from "react";
import {cn} from "@/lib/utils";

export function Suggestions({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
            {...props}
        />
    );
}

export interface SuggestionProps {
    suggestion: string;
    onClick: (suggestion: string) => void;
    disabled?: boolean;
    className?: string;
}

export function Suggestion({suggestion, onClick, disabled, className}: SuggestionProps) {
    return (
        <button
            className={cn(
                "h-9 shrink-0 whitespace-nowrap rounded-full border bg-background px-4 text-[13px] transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            disabled={disabled}
            onClick={() => onClick(suggestion)}
            type="button"
        >
            {suggestion}
        </button>
    );
}
