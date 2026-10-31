import {ButtonHTMLAttributes, HTMLAttributes} from "react";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function Actions({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("-ml-2 flex items-center gap-0.5", className)} {...props}/>;
}

export interface ActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

/** Icon-only button under an answer, labelled for screen readers and with a tooltip. */
export function Action({label, className, children, ...props}: ActionProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    aria-label={label}
                    className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4",
                        className,
                    )}
                    type="button"
                    {...props}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
