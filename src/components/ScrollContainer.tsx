import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import { ScrollButton } from "./CharacterMarkers/components/ScrollButton";

interface ScrollContainerProps {
    children: ReactNode;
    contentClassName?: string;
    variant?: "grid" | "absolute";
}

export function ScrollContainer({
    children,
    contentClassName,
    variant = "grid",
}: ScrollContainerProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);

    function updateFor(el: HTMLDivElement | null): void {
        if (!el) {
            return;
        }
        const canScroll = el.scrollHeight > el.clientHeight + 1;
        if (!canScroll) {
            setShowTop(false);
            setShowBottom(false);
            return;
        }
        setShowTop(el.scrollTop > 2);
        setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    }

    function setupObservers(el: HTMLDivElement, handler: () => void): () => void {
        const ro = new ResizeObserver(handler);
        ro.observe(el);

        const mo = new MutationObserver(handler);
        mo.observe(el, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        el.addEventListener("scroll", handler, { passive: true });

        // Wait for fonts to load before initial check
        document.fonts.ready.then(handler).catch(handler);

        return () => {
            ro.disconnect();
            mo.disconnect();
            el.removeEventListener("scroll", handler);
        };
    }

    useEffect(() => {
        const content = contentRef.current;
        if (!content) {
            return;
        }

        const debouncedUpdate = debounce(() => updateFor(content), 250);

        const cleanup = setupObservers(content, debouncedUpdate);

        return () => {
            cleanup();
            debouncedUpdate.cancel();
        };
    }, []);

    const scrollToTop = () => {
        const el = contentRef.current;
        if (!el) {
            return;
        }
        const scrollAmount = el.clientHeight * 0.8;
        el.scrollTo({
            top: Math.max(0, el.scrollTop - scrollAmount),
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        const el = contentRef.current;
        if (!el) {
            return;
        }
        const scrollAmount = el.clientHeight * 0.8;
        el.scrollTo({
            top: Math.min(el.scrollHeight, el.scrollTop + scrollAmount),
            behavior: "smooth",
        });
    };

    return (
        <>
            <div className={contentClassName} ref={contentRef}>
                {children}
            </div>
            <ScrollButton direction="top" onClick={scrollToTop} show={showTop} variant={variant} />
            <ScrollButton
                direction="bottom"
                onClick={scrollToBottom}
                show={showBottom}
                variant={variant}
            />
        </>
    );
}
