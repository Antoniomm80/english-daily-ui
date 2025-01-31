import ReactMarkdown from "react-markdown";
import {useEffect, useRef} from "react";

interface LlmResponsePanelProps {
    text: string[];
}

function LlmResponsePanel(props: LlmResponsePanelProps) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (panelRef.current) {
            panelRef.current.scrollTop = panelRef.current.scrollHeight;
        }
    }, [props.text]);
    return (
        <div ref={panelRef} className="overflow-y-auto h-64 border p-2 rounded bg-gray-50 mb-4">
            <ReactMarkdown>{props.text.join("")}</ReactMarkdown>
        </div>
    );
}

export default LlmResponsePanel;