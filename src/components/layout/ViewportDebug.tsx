import {useEffect, useState} from "react";

// TEMPORARY: measures viewport and safe-area values on device to diagnose the iOS gap under the tab bar.
function measure() {
    const probe = (style: string) => {
        const el = document.createElement("div");
        el.style.cssText = `position:fixed;left:0;top:0;width:1px;visibility:hidden;pointer-events:none;${style}`;
        document.body.appendChild(el);
        const height = el.getBoundingClientRect().height;
        el.remove();
        return Math.round(height);
    };
    const rect = (selector: string) => {
        const r = document.querySelector(selector)?.getBoundingClientRect();
        return r ? `${Math.round(r.top)}→${Math.round(r.bottom)}` : "–";
    };
    const vv = window.visualViewport;
    return {
        standalone: String((navigator as Navigator & { standalone?: boolean }).standalone ?? matchMedia("(display-mode: standalone)").matches),
        "screen.h": screen.height,
        innerH: window.innerHeight,
        clientH: document.documentElement.clientHeight,
        "vv.h / top": vv ? `${Math.round(vv.height)} / ${Math.round(vv.offsetTop)}` : "–",
        scrollY: Math.round(window.scrollY),
        "100vh": probe("height:100vh"),
        "100dvh": probe("height:100dvh"),
        "100svh": probe("height:100svh"),
        "100lvh": probe("height:100lvh"),
        "inset top": probe("height:env(safe-area-inset-top)"),
        "inset bottom": probe("height:env(safe-area-inset-bottom)"),
        "fixed inset-0": probe("bottom:0;height:auto"),
        shell: rect("[data-debug=shell]"),
        tabbar: rect("[data-debug=tabbar]"),
    };
}

export function ViewportDebug() {
    const [values, setValues] = useState(measure);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const update = () => setValues(measure());
        const timer = window.setTimeout(update, 500);
        window.addEventListener("resize", update);
        window.visualViewport?.addEventListener("resize", update);
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener("resize", update);
            window.visualViewport?.removeEventListener("resize", update);
        };
    }, []);

    if (hidden) return null;
    return (
        <button
            className="fixed left-1/2 top-1/3 z-[100] -translate-x-1/2 rounded-lg bg-black/85 px-3 py-2 text-left font-mono text-[11px] leading-4 text-white"
            onClick={() => setHidden(true)}
            type="button"
        >
            {Object.entries(values).map(([key, value]) => <div key={key}>{key}: {value}</div>)}
            <div className="mt-1 text-white/60">tap to hide</div>
        </button>
    );
}
