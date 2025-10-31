import "./CharacterMarkers.css";
import { AnimatePresence } from "motion/react";
import { InitSlot } from "./components/InitSlot/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";
import { useEntityStore } from "../../store/useEntityStore";
import { useEffect, useRef, useState } from "react";

export function CharacterMarkers() {
    const { entities } = useEntityStore();

    const contentRef = useRef<HTMLDivElement | null>(null);
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) {
            return;
        }

        const update = () => {
            const el = content;
            const canScroll = el.scrollHeight > el.clientHeight + 1;
            if (!canScroll) {
                setShowTop(false);
                setShowBottom(false);
                return;
            }
            setShowTop(el.scrollTop > 2);
            setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
        };

        // listeners and observers
        const ro = new ResizeObserver(update);
        ro.observe(content);

        const mo = new MutationObserver(update);
        mo.observe(content, { childList: true, subtree: true, characterData: true });

        content.addEventListener("scroll", update, { passive: true });
        // initial check
        update();

        return () => {
            ro.disconnect();
            mo.disconnect();
            content.removeEventListener("scroll", update);
        };
    }, []);

    const scrollToTop = () => {
        const el = contentRef.current;
        if (!el) {
            return;
        }
        el.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
        const el = contentRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    return (
        <div className="character-markers">
            <div className="character-marker-header-bg" />
            <MarkerHeading classes="init-heading">INITIATIVE</MarkerHeading>
            <MarkerHeading classes="status-heading">
                <div className="delay">
                    <div className="rotated-text">DELAY</div>
                </div>
                <div className="dying">DYING</div>
                <div className="dying-count">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </MarkerHeading>
            <div className="init-content" ref={contentRef}>
                <AnimatePresence>
                    {entities.map((entity) => (
                        <InitSlot key={entity.id} entity={entity} />
                    ))}
                </AnimatePresence>
                <InitSlot />
            </div>
            <div className={`scroll-overlay top ${showTop ? "" : "hidden"}`} aria-hidden={!showTop}>
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    ▲ Scroll
                </button>
            </div>

            <div className={`scroll-overlay bottom ${showBottom ? "" : "hidden"}`} aria-hidden={!showBottom}>
                <button
                    type="button"
                    onClick={scrollToBottom}
                    aria-label="Scroll to bottom"
                    title="Scroll to bottom"
                >
                    ▼ Scroll
                </button>
            </div>
        </div>
    );
}
