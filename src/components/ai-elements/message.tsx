import {HTMLAttributes} from "react";
import {cn} from "@/lib/utils";

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
    from: "user" | "assistant";
}

export function Message({from, className, ...props}: MessageProps) {
    return (
        <div
            className={cn(
                "group flex w-full py-3",
                from === "user" ? "is-user justify-end" : "is-assistant justify-start",
                className,
            )}
            data-role={from}
            {...props}
        />
    );
}

/** User turns render as a bubble; assistant turns flow full width like a document. */
export function MessageContent({className, ...props}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-col gap-2 text-[15px] leading-relaxed",
                "group-[.is-user]:max-w-[85%] group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-secondary-foreground",
                "group-[.is-assistant]:w-full",
                className,
            )}
            {...props}
        />
    );
}
