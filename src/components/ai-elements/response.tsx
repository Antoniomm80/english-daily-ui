import {memo, ReactNode, useState} from "react";
import ReactMarkdown, {Components} from "react-markdown";
import remarkGfm from "remark-gfm";
import {Check, Copy} from "lucide-react";
import {cn} from "@/lib/utils";

function CodeBlock({children, text}: { children: ReactNode; text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="my-3 overflow-hidden rounded-xl border">
            <div className="flex items-center justify-end border-b bg-muted/50 px-2 py-1">
                <button
                    aria-label="Copy"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => {
                        void navigator.clipboard?.writeText(text);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                    type="button"
                >
                    {copied ? <Check className="h-3.5 w-3.5"/> : <Copy className="h-3.5 w-3.5"/>}
                </button>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-5">{children}</pre>
        </div>
    );
}

function nodeText(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(nodeText).join("");
    if (node && typeof node === "object" && "props" in node) {
        return nodeText((node as { props: { children?: ReactNode } }).props.children);
    }
    return "";
}

const components: Components = {
    h1: ({children}) => <h2 className="mb-2 mt-5 text-xl font-semibold tracking-tight first:mt-0">{children}</h2>,
    h2: ({children}) => <h3 className="mb-2 mt-5 text-lg font-semibold tracking-tight first:mt-0">{children}</h3>,
    h3: ({children}) => <h4 className="mb-1.5 mt-4 text-base font-semibold first:mt-0">{children}</h4>,
    h4: ({children}) => <h5 className="mb-1 mt-3 text-[15px] font-semibold first:mt-0">{children}</h5>,
    p: ({children}) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
    ul: ({children}) => <ul className="my-2 list-disc space-y-1 pl-6 marker:text-muted-foreground">{children}</ul>,
    ol: ({children}) => <ol className="my-2 list-decimal space-y-1 pl-6 marker:text-muted-foreground">{children}</ol>,
    li: ({children}) => <li className="pl-1">{children}</li>,
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    a: ({children, href}) => <a className="font-medium text-brand underline underline-offset-2" href={href} rel="noreferrer" target="_blank">{children}</a>,
    blockquote: ({children}) => <blockquote className="my-3 rounded-xl bg-muted/60 px-4 py-2 italic text-foreground/90">{children}</blockquote>,
    hr: () => <hr className="my-5"/>,
    pre: ({children}) => <CodeBlock text={nodeText(children)}>{children}</CodeBlock>,
    code: ({children, className}) => className
        ? <code className={className}>{children}</code>
        : <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em]">{children}</code>,
    table: ({children}) => (
        <div className="my-3 overflow-x-auto rounded-xl border">
            <table className="w-full border-collapse text-sm">{children}</table>
        </div>
    ),
    thead: ({children}) => <thead className="bg-muted/50">{children}</thead>,
    th: ({children}) => <th className="border-b px-3 py-2 text-left font-semibold text-muted-foreground">{children}</th>,
    td: ({children}) => <td className="border-b px-3 py-2 align-top [tr:last-child_&]:border-0">{children}</td>,
};

export interface ResponseProps {
    children: string;
    className?: string;
}

/** Markdown answer with GitHub-flavoured tables, styled code and quotes. */
export const Response = memo(function Response({children, className}: ResponseProps) {
    return (
        <div className={cn("min-w-0 break-words", className)}>
            <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
    );
});
