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
    const { setMagnetLocation, dragMagnet, dropMagnet, deleteMagnet, rotateMagnet } = useMagnetStore();
    const [ startOffset, setStartOffset ] = useState(magnetKindStartOffset[magnet.kind]);
    const [draggingAllowed, setDraggingAllowed] = useState(magnet.isDragging);
    
    const updateLocation = useCallback(function updateLocationCallback(moveEvent: globalThis.PointerEvent) {
        if (!magnet.isDragging && draggingAllowed) {
            dragMagnet(magnet.id);
        }
        if (!magnet.isDragging) {
            return;
        }
        setMagnetLocation(magnet.id, {
            left: moveEvent.clientX - startOffset.left,
            top: moveEvent.clientY - startOffset.top
        });
    }, [dragMagnet, draggingAllowed, magnet.id, magnet.isDragging, setMagnetLocation, startOffset.left, startOffset.top]);
    
    const stopDragging = useCallback(function stopDraggingCallback(e: globalThis.PointerEvent) {
        window.removeEventListener("pointermove", updateLocation);
        if (!magnet.isDragging) {
            if (isEraserEvent(e)) {
                deleteMagnet(magnet.id);
            } else if (!magnet.isDragging) {
                rotateMagnet(magnet.id);
            }
        } else {
            dropMagnet(magnet.id);
        }
        setDraggingAllowed(false);
    }, [deleteMagnet, dropMagnet, magnet.id, magnet.isDragging, rotateMagnet, updateLocation]);

    const allowDragging = useCallback(function startDraggingCallback(e: PointerEvent<HTMLDivElement>) {
        if (!magnetRef.current) {
            return;
        }
        const bounds = magnetRef.current.getBoundingClientRect();
        setStartOffset({
            left: e.clientX - bounds.left,
            top: e.clientY - bounds.top
        });
        setDraggingAllowed(true);
    }, []);

    useEffect(() => {
        if (!draggingAllowed) {
            return;
        }
        window.addEventListener("pointermove", updateLocation);
        window.addEventListener("pointerup", stopDragging, { once: true })
        
        return () => {
            window.removeEventListener("pointermove", updateLocation);
            window.removeEventListener("pointerup", stopDragging);
        };
    }, [stopDragging, updateLocation, draggingAllowed]);

    let draggingClass = "";
    if (magnet.isDragging) {
        draggingClass = "dragging";
    }

    return (
        <motion.div
            ref={magnetRef}
            className="magnet"
            style={magnet.location}
            onPointerDown={allowDragging}
            animate={ { rotate: magnet.rotation, scale: 1 } }
            initial={ { scale: 0 } }
            exit={ { scale: 0 } }
        >
            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon className={draggingClass} points="50,10 90,90 50,70 10,90" fill="gray" />
            </svg>
        </motion.div>
    );
}

function isEraserEvent(e: globalThis.PointerEvent) {
    return e.shiftKey || e.pointerType === "pen" && e.button === 5;
}