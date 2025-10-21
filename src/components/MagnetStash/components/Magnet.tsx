import "./Magnet.css";
import type { MagnetData, MagnetKind, Offset } from "./magnet-kind-types";
import {
    createElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { MagnetKinds } from "./MagnetKinds";
import type { PointerEvent } from "react";
import { motion } from "motion/react";
import { useMagnetStore } from "../../../store/useMagnetStore";

export interface MagnetProps<T extends MagnetKind> {
    magnet: MagnetData<T>;
}

const INITIAL_MAGNET_STYLE = { scale: 0 };
const EXIT_MAGNET_STYLE = { scale: 0 };
const DRAG_MOVE_TOLERANCE = 5;

export function Magnet<T extends MagnetKind>({
    magnet,
}: MagnetProps<T>): JSX.Element {
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
    magnet: MagnetData<T>,
    magnetRef: React.RefObject<HTMLDivElement>
) {
    const {
        setMagnetLocation,
        dragMagnet,
        dropMagnet,
        deleteMagnet,
        rotateMagnet,
    } = useMagnetStore();

    const [startOffset, setStartOffset] = useState<Offset>(MagnetKinds[magnet.kind].offset);
    const [pointerDownStart, setPointerDownStart] = useState({ x: 0, y: 0 });
    const [draggingAllowed, setDraggingAllowed] = useState(magnet.isDragging);

    const updateLocation = useCallback(
        function updateLocationCallback(moveEvent: globalThis.PointerEvent) {

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
            magnet.id,
            magnet.isDragging,
            setMagnetLocation,
            startOffset.left,
            startOffset.top,
            pointerDownStart.x,
            pointerDownStart.y,
        ]
    );

    const stopDragging = useCallback(
        function stopDraggingCallback(e: globalThis.PointerEvent) {
            const { id, isDragging, kind } = magnet;
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
        [deleteMagnet, dropMagnet, magnet, rotateMagnet, updateLocation]
    );

    const allowDragging = useCallback(
        function startDraggingCallback(e: PointerEvent<HTMLDivElement>) {
            if (!magnetRef.current) {
                return;
            }
            const bounds = magnetRef.current.getBoundingClientRect();
            setStartOffset({
                left: e.clientX - bounds.left,
                top: e.clientY - bounds.top,
            });
            setPointerDownStart({ x: e.clientX, y: e.clientY });
            setDraggingAllowed(true);
        },
        // oxlint-disable-next-line react-hooks/exhaustive-deps -- ref doesn't need to be in the dependency array
        []
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



