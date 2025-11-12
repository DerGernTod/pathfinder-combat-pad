import {
    characterMarkers,
    characterMarkerHeaderBg,
    initHeading,
    initContent,
    statusHeading,
    delay,
    rotatedText,
    dying,
    dyingCount,
    dyingCountItem,
    scrollOverlay,
    scrollOverlayButton,
    scrollOverlayButtonVariants,
    scrollOverlayVariants,
    hidden,
} from "./CharacterMarkers.css.ts";
import { AnimatePresence } from "motion/react";
import { InitSlot } from "./components/InitSlot/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";
import { useEntityStore } from "../../store/useEntityStore";
import { useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";

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

        const debouncedUpdate = debounce(update, 250);

        // listeners and observers
        const ro = new ResizeObserver(debouncedUpdate);
        ro.observe(content);

        const mo = new MutationObserver(debouncedUpdate);
        mo.observe(content, { childList: true, subtree: true, characterData: true });

        content.addEventListener("scroll", debouncedUpdate, { passive: true });

        // Wait for fonts to load before initial check
        document.fonts.ready.then(debouncedUpdate).catch(debouncedUpdate);

        return () => {
            ro.disconnect();
            mo.disconnect();
            content.removeEventListener("scroll", debouncedUpdate);
            debouncedUpdate.cancel();
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
        if (!el) {
            return;
        }
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    return (
        <div className={characterMarkers}>
            <div className={characterMarkerHeaderBg} />
            <MarkerHeading classes={initHeading}>INITIATIVE</MarkerHeading>
            <MarkerHeading classes={statusHeading}>
                <div className={delay}>
                    <div className={rotatedText}>DELAY</div>
                </div>
                <div className={dying}>DYING</div>
                <div className={dyingCount}>
                    <div className={dyingCountItem}>1</div>
                    <div className={dyingCountItem}>2</div>
                    <div className={dyingCountItem}>3</div>
                </div>
            </MarkerHeading>
            <div className={initContent} ref={contentRef}>
                <AnimatePresence>
                    {entities.map((entity) => (
                        <InitSlot key={entity.id} entity={entity} />
                    ))}
                </AnimatePresence>
                <InitSlot />
            </div>
            <div
                className={`${scrollOverlay} ${scrollOverlayVariants.top} ${showTop ? "" : hidden}`}
                aria-hidden={!showTop}
            >
                <button
                    type="button"
                    className={`${scrollOverlayButton} ${scrollOverlayButtonVariants.top}`}
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    ▲ Scroll
                </button>
            </div>

            <div
                className={`${scrollOverlay} ${scrollOverlayVariants.bottom} ${showBottom ? "" : hidden}`}
                aria-hidden={!showBottom}
            >
                <button
                    type="button"
                    className={`${scrollOverlayButton} ${scrollOverlayButtonVariants.bottom}`}
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
