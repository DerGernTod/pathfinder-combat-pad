import "./Magnet.css";
import { MagnetData, MagnetKind } from "../../constants";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useMagnetStore } from "../../store/useMagnetStore";

interface MagnetProps {
    magnet: MagnetData;
}

const magnetKindStartOffset = {
    [MagnetKind.Arrow]: { left: 25, top: 25 }
};

export function Magnet({ magnet }: MagnetProps): JSX.Element {
    const magnetRef = useRef<HTMLDivElement>(null);
    const { setMagnetLocation, dragMagnet, dropMagnet, deleteMagnet } = useMagnetStore();
    const [ startOffset, setStartOffset ] = useState(magnetKindStartOffset[magnet.kind]);
    
    const updateLocation = useCallback(function updateLocationCallback(moveEvent: globalThis.PointerEvent) {
        setMagnetLocation(magnet.id, {
            left: moveEvent.clientX - startOffset.left,
            top: moveEvent.clientY - startOffset.top
        });
    }, [magnet.id, setMagnetLocation, startOffset]);
    
    const stopDragging = useCallback(function stopDraggingCallback() {
        dropMagnet(magnet.id);
        window.removeEventListener("pointermove", updateLocation);
    }, [dropMagnet, magnet.id, updateLocation]);

    const startDragging = useCallback(function startDraggingCallback(e: PointerEvent<HTMLDivElement>) {
        if (!magnetRef.current || isEraserEvent(e)) {
            return;
        }
        dragMagnet(magnet.id);
        const bounds = magnetRef.current.getBoundingClientRect();
        setStartOffset({
            left: e.clientX - bounds.left,
            top: e.clientY - bounds.top
        });
    }, [dragMagnet, magnet.id]);

    const remove = useCallback(function removeCallback(e: PointerEvent<HTMLDivElement>) {
        if (isEraserEvent(e)) {
            deleteMagnet(magnet.id);
        }
    }, [deleteMagnet, magnet.id]);

    useEffect(() => {
        if (!magnet.isDragging) {
            return;
        }
        window.addEventListener("pointermove", updateLocation);
        window.addEventListener("pointerup", stopDragging, { once: true })
        
        return () => {
            window.removeEventListener("pointermove", updateLocation);
            window.removeEventListener("pointerup", stopDragging);
        };
    }, [magnet.isDragging, magnet.id, stopDragging, updateLocation]);

    let draggingClass = "";
    if (magnet.isDragging) {
        draggingClass = "dragging";
    }

    return (
        <motion.div ref={magnetRef} className="magnet" style={magnet.location} onPointerDown={startDragging} onClick={remove}
            animate={
                { opacity: 1 }
            }
            initial={
                { opacity: 0 }
            }
            exit={
                { opacity: 0 }
            }>
            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon className={draggingClass} points="50,10 90,90 50,70 10,90" fill="gray" />
            </svg>
        </motion.div>
    );
}

function isEraserEvent(e: PointerEvent<HTMLDivElement>) {
    return e.shiftKey || e.pointerType === "pen" && e.button === 5;
}