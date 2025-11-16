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
} from "./CharacterMarkers.css.ts";
import { AnimatePresence } from "motion/react";
import { InitSlot } from "./components/InitSlot/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";
import { ScrollButton } from "./components/ScrollButton";
import { useEntityStore } from "../../store/useEntityStore";
import { useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import { useShallow } from "zustand/react/shallow";

export function CharacterMarkers() {
    const entityIds = useEntityStore(useShallow(state => state.entities.map(entity => entity.id)));

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
                    {entityIds.map((id) => (
                        <InitSlot key={id} entityId={id} />
                    ))}
                </AnimatePresence>
                <InitSlot />
            </div>
            <ScrollButton
                direction="top"
                onClick={scrollToTop}
                show={showTop}
            />
            <ScrollButton
                direction="bottom"
                onClick={scrollToBottom}
                show={showBottom}
            />
        </div>
    );
}
