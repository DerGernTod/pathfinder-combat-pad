import "./Magnet.css";
import type { MagnetData, MagnetKind, Offset } from "./magnet-kind-types";
import type { PointerEvent, ReactElement } from "react";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { MagnetKinds } from "./MagnetKinds";
import { motion } from "motion/react";
import { useMagnetStore } from "../../../store/useMagnetStore";
import { useEntityStore } from "../../../store/useEntityStore";

import { useShallow } from "zustand/react/shallow";

export interface MagnetProps {
    id: number;
}

const INITIAL_MAGNET_STYLE = { scale: 0 };
const EXIT_MAGNET_STYLE = { scale: 0 };
const DRAG_MOVE_TOLERANCE = 5;

function getDraggingClass(magnet: MagnetData<MagnetKind>, isHighlighted: boolean) {
    let cls = "";
    if (magnet?.isDragging) {
        cls = "dragging";
    }
    if (isHighlighted) {
        cls += `${cls ? " " : ""}highlighted`;
    }
    return cls;
}

function renderMagnetChildren(magnet: MagnetData<MagnetKind>, draggingClass: string) {
    return createElement(MagnetKinds[magnet.kind].children, {
        className: draggingClass,
        details: magnet.details,
        id: magnet.id,
    });
}

function createStopDraggingHandler(options: {
    getMagnet: () => MagnetData<MagnetKind> | undefined;
    deleteMagnet: (id: number) => void;
    dropMagnet: (id: number) => void;
    rotateMagnet: (id: number) => void;
    updateLocation: (e: globalThis.PointerEvent) => void;
    setHighlightedMagnet: (id: number | null) => void;
    setDraggingAllowed: (v: boolean) => void;
}) {
    function handleNonDragging(e: globalThis.PointerEvent, m: MagnetData<MagnetKind>) {
        if (isEraserEvent(e)) {
            options.deleteMagnet(m.id);
        } else if (MagnetKinds[m.kind].allowRotate) {
            options.rotateMagnet(m.id);
        }
    }

    function stopDraggingImpl(e: globalThis.PointerEvent) {
        const magnet = options.getMagnet();
        if (!magnet) {
            return;
        }
        const { id, isDragging } = magnet;
        options.setHighlightedMagnet(null);
        globalThis.removeEventListener("pointermove", options.updateLocation);
        if (!isDragging) {
            handleNonDragging(e, magnet);
        } else {
            options.dropMagnet(id);
        }
        options.setDraggingAllowed(false);
    }

    return function stopDraggingCallback(e: globalThis.PointerEvent) {
        return stopDraggingImpl(e);
    };
}

export function Magnet({ id }: MagnetProps): ReactElement | null {
    const magnet = useMagnetStore(useShallow((state) => state.magnets.find((m) => m.id === id)));
    const magnetRef = useRef<HTMLDivElement>(null);

    // Check if this magnet's linked entity is highlighted
    const isHighlighted = useEntityStore(
        useShallow(
            (state) =>
                state.highlightedEntityId !== null &&
                state.highlightedEntityId === magnet?.linkedEntityId,
        ),
    );

    const allowDragging = useAllowDragging(magnet, magnetRef);

    const setHighlightedMagnet = useMagnetStore((state) => state.setHighlightedMagnet);
    const setHighlightedEntityId = useEntityStore((state) => state.setHighlightedEntityId);

    if (!magnet) {
        return null;
    }

    const draggingClass = getDraggingClass(magnet, isHighlighted);

    return (
        <motion.div
            ref={magnetRef}
            className="magnet"
            style={magnet.location}
            onPointerEnter={() => {
                setHighlightedMagnet(magnet.id);
                setHighlightedEntityId(magnet.linkedEntityId ?? null);
            }}
            onPointerLeave={() => {
                setHighlightedMagnet(null);
                setHighlightedEntityId(null);
            }}
            onPointerDown={allowDragging}
            animate={{ rotate: magnet.rotation, scale: 1 }}
            initial={INITIAL_MAGNET_STYLE}
            exit={EXIT_MAGNET_STYLE}
        >
            {renderMagnetChildren(magnet, draggingClass)}
        </motion.div>
    );
}

function useAllowDragging<T extends MagnetKind>(
    magnet: MagnetData<T> | undefined,
    magnetRef: React.RefObject<HTMLDivElement | null>,
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
            if (!magnet) {
                return;
            }

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
        ],
    );

    const stopDragging = createStopDraggingHandler({
        getMagnet: () => magnet,
        deleteMagnet,
        dropMagnet,
        rotateMagnet,
        updateLocation,
        setHighlightedMagnet,
        setDraggingAllowed,
    });

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
        [magnetRef, magnet, setHighlightedMagnet],
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
