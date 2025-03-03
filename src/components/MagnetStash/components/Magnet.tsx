import "./Magnet.css";
import { MagnetKinds, Offset } from "./MagnetKinds";
import { PointerEvent, createElement, useCallback, useEffect, useRef, useState } from "react";
import { MagnetData } from "../../../constants";
import { motion } from "motion/react";
import { useMagnetStore } from "../../../store/useMagnetStore";

interface MagnetProps {
    magnet: MagnetData;
}

const INITIAL_MAGNET_STYLE = { scale: 0 };
const EXIT_MAGNET_STYLE = { scale: 0 };

export function Magnet({ magnet }: MagnetProps): JSX.Element {
    const magnetRef = useRef<HTMLDivElement>(null);
    let draggingClass = "";
    if (magnet.isDragging) {
        draggingClass = "dragging";
    }
    const allowDragging = useAllowDragging(magnet, magnetRef);

    return (
        <motion.div
            ref={magnetRef}
            className="magnet"
            style={magnet.location}
            onPointerDown={allowDragging}
            animate={ { rotate: magnet.rotation, scale: 1 } }
            initial={ INITIAL_MAGNET_STYLE }
            exit={ EXIT_MAGNET_STYLE }
        >
            {createElement(MagnetKinds[magnet.kind].children, { className: draggingClass, details: magnet.details, id: magnet.id })} 
        </motion.div>
    );
}

function useAllowDragging(magnet: MagnetData, magnetRef: React.RefObject<HTMLDivElement>) {
    const { setMagnetLocation, dragMagnet, dropMagnet, deleteMagnet, rotateMagnet } = useMagnetStore();

    const [startOffset, setStartOffset] = useState<Offset>(MagnetKinds[magnet.kind].offset);
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
        const { id, isDragging, kind } = magnet;
        window.removeEventListener("pointermove", updateLocation);
        if (!isDragging) {
            if (isEraserEvent(e)) {
                deleteMagnet(id);
            } else if (!magnet.isDragging && MagnetKinds[kind].allowRotate) {
                rotateMagnet(id);
            }
        } else {
            dropMagnet(id);
        }
        setDraggingAllowed(false);
    }, [deleteMagnet, dropMagnet, magnet, rotateMagnet, updateLocation]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps -- ref doesn't need to be in the dependency array
    }, []);

    useEffect(() => {
        if (!draggingAllowed) {
            return;
        }
        window.addEventListener("pointermove", updateLocation);
        window.addEventListener("pointerup", stopDragging, { once: true });

        return () => {
            window.removeEventListener("pointermove", updateLocation);
            window.removeEventListener("pointerup", stopDragging);
        };
    }, [stopDragging, updateLocation, draggingAllowed]);

    return allowDragging;
}

function isEraserEvent(e: globalThis.PointerEvent) {
    return e.shiftKey || e.pointerType === "pen" && e.button === 5;
}