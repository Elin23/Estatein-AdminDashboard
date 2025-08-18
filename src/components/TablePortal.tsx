import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
    zIndex?: number;
    extraClass?: string;
};

export default function TablePortal({
    anchorRef,
    children,
    zIndex = 1200,
    extraClass = ""
}: Props) {
    const elRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const el = document.createElement("div");
        elRef.current = el;
        el.className = `table-portal-root ${extraClass}`.trim();
        el.style.position = "absolute";
        el.style.zIndex = String(zIndex);
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.width = "auto";
        el.style.pointerEvents = "auto";
        document.body.appendChild(el);
        setMounted(true);

        return () => {
            if (elRef.current && elRef.current.parentNode) {
                elRef.current.parentNode.removeChild(elRef.current);
            }
            elRef.current = null;
        };

    }, []);

    useEffect(() => {
        if (!elRef.current) return;
        let rafId = 0;

        const update = () => {
            const anchor = anchorRef?.current;
            const el = elRef.current!;
            if (!anchor) {
                el.style.display = "none";
                return;
            }
            el.style.display = "block";
            const rect = anchor.getBoundingClientRect();
            el.style.width = `${rect.width}px`;
            el.style.left = `${rect.left + window.scrollX}px`;
            el.style.top = `${rect.top + window.scrollY}px`;

            rafId = requestAnimationFrame(() => { });
        };

        update();

        const onScroll = () => update();
        const onResize = () => update();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);

        let ro: ResizeObserver | null = null;
        try {
            ro = new ResizeObserver(update);
            if (anchorRef.current) ro.observe(anchorRef.current);
        } catch (e) {
        }

        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
            if (ro) ro.disconnect();
            cancelAnimationFrame(rafId);
        };
    }, [anchorRef]);

    if (!mounted || !elRef.current) return null;
    return createPortal(<div style={{ width: "100%" }}>{children}</div>, elRef.current);
}
