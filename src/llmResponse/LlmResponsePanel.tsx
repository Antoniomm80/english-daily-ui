import ReactMarkdown from "react-markdown";
import {useEffect, useRef} from "react";

interface LlmResponsePanelProps {
    text: string[];
    greyBackground?: boolean;
}

function LlmResponsePanel(props: LlmResponsePanelProps) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (panelRef.current) {
            panelRef.current.scrollTop = panelRef.current.scrollHeight;
        }
    }, [props.text]);
    const backgroundColor = props.greyBackground ? "bg-gray-50" : "";
    return (
        <div ref={panelRef} className={`overflow-y-auto h-64 border p-4 rounded ${backgroundColor} mb-4`}>
            <ReactMarkdown>{props.text.join("")}</ReactMarkdown>
        </div>
    );
}

export default LlmResponsePanel;