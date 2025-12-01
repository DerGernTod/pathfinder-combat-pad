import "./Magnet.css";
import type { MagnetData, MagnetKind, Offset } from "./magnet-kind-types";
import type { PointerEvent, ReactElement } from "react";
import {
    createElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { MagnetKinds } from "./MagnetKinds";
import { motion } from "motion/react";
import { useMagnetStore } from "../../../store/useMagnetStore";

import { useShallow } from "zustand/react/shallow";

export interface MagnetProps {
    id: number;
}

const INITIAL_MAGNET_STYLE = { scale: 0 };
const EXIT_MAGNET_STYLE = { scale: 0 };
const DRAG_MOVE_TOLERANCE = 5;

export function Magnet({
    id,
}: MagnetProps): ReactElement | null {
    const magnet = useMagnetStore(useShallow(state => state.magnets.find(m => m.id === id)));
    const magnetRef = useRef<HTMLDivElement>(null);
    
    const allowDragging = useAllowDragging(magnet, magnetRef);

    if (!magnet) return null;

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
            animate={{ rotate: magnet.rotation, scale: 1 }}
            initial={INITIAL_MAGNET_STYLE}
            exit={EXIT_MAGNET_STYLE}
        >
            {createElement(MagnetKinds[magnet.kind].children, {
                className: draggingClass,
                details: magnet.details,
                id: magnet.id,
            })}
        </motion.div>
    );
}

function useAllowDragging<T extends MagnetKind>(
    magnet: MagnetData<T> | undefined,
    magnetRef: React.RefObject<HTMLDivElement | null>
) {
    const {
        setMagnetLocation,
        dragMagnet,
        dropMagnet,
        deleteMagnet,
        rotateMagnet,
        setHighlightedMagnet,
    } = useMagnetStore();

    // Safe access for initial state, though it will update if magnet becomes defined/undefined
    const initialOffset = magnet ? MagnetKinds[magnet.kind].offset : { left: 0, top: 0 };
    const [startOffset, setStartOffset] = useState<Offset>(initialOffset);
    const [pointerDownStart, setPointerDownStart] = useState({ x: 0, y: 0 });
    const [draggingAllowed, setDraggingAllowed] = useState(magnet?.isDragging ?? false);

    const updateLocation = useCallback(
        function updateLocationCallback(moveEvent: globalThis.PointerEvent) {
            if (!magnet) return;

            const totalOffset = {
                left: moveEvent.clientX - pointerDownStart.x,
                top: moveEvent.clientY - pointerDownStart.y,
            };
            const movementTotal = Math.abs(totalOffset.left) + Math.abs(totalOffset.top);
            if (!magnet.isDragging && draggingAllowed && movementTotal > DRAG_MOVE_TOLERANCE) {
                dragMagnet(magnet.id);
            }
            if (!magnet.isDragging) {
                return;
            }
            setMagnetLocation(magnet.id, {
                left: moveEvent.clientX - startOffset.left,
                top: moveEvent.clientY - startOffset.top,
            });
        },
        [
            dragMagnet,
            draggingAllowed,
            magnet,
            setMagnetLocation,
            startOffset.left,
            startOffset.top,
            pointerDownStart.x,
            pointerDownStart.y,
        ]
    );

    const stopDragging = useCallback(
        function stopDraggingCallback(e: globalThis.PointerEvent) {
            if (!magnet) return;
            const { id, isDragging, kind } = magnet;
            setHighlightedMagnet(-1);
            globalThis.removeEventListener("pointermove", updateLocation);
            if (!isDragging) {
                if (isEraserEvent(e)) {
                    deleteMagnet(id);
                } else if (
                    !magnet.isDragging &&
                    MagnetKinds[kind].allowRotate
                ) {
                    rotateMagnet(id);
                }
            } else {
                dropMagnet(id);
            }
            setDraggingAllowed(false);
        },
        [deleteMagnet, dropMagnet, magnet, rotateMagnet, updateLocation, setHighlightedMagnet]
    );

    const allowDragging = useCallback(
        function startDraggingCallback(e: PointerEvent<HTMLDivElement>) {
            if (!magnetRef.current || !magnet) {
                return;
            }
            setHighlightedMagnet(magnet.id);
            const bounds = magnetRef.current.getBoundingClientRect();
            setStartOffset({
                left: e.clientX - bounds.left,
                top: e.clientY - bounds.top,
            });
            setPointerDownStart({ x: e.clientX, y: e.clientY });
            setDraggingAllowed(true);
        },
        [magnetRef, magnet, setHighlightedMagnet]
    );

    useEffect(() => {
        if (!draggingAllowed) {
            return;
        }
        globalThis.addEventListener("pointermove", updateLocation);
        globalThis.addEventListener("pointerup", stopDragging, { once: true });

        return () => {
            globalThis.removeEventListener("pointermove", updateLocation);
            globalThis.removeEventListener("pointerup", stopDragging);
        };
    }, [stopDragging, updateLocation, draggingAllowed]);

    return allowDragging;
}

function isEraserEvent(e: globalThis.PointerEvent) {
    return e.shiftKey || (e.pointerType === "pen" && e.button === 5);
}



