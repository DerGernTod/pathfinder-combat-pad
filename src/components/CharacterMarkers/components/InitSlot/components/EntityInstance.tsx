import "./EntityInstance.css";
import type { PointerEventHandler, ReactElement } from "react";
import { useEffect, useRef, useState, forwardRef } from "react";
import { KIND_LOOKUP } from "./constants";
import SlotMachineInput from "./SlotMachineInput";
import { motion } from "motion/react";
import { useEntityStore } from "../../../../../store/useEntityStore";
import { useMagnetStore } from "../../../../../store/useMagnetStore";
import { useShallow } from "zustand/react/shallow";

interface EntityInstanceProps {
    entityId: number;
}
const transparentImage = new Image();
transparentImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function getClassName(opts: {
    kind: string;
    status: string;
    draggingClass: string;
    isMagnetHighlighted: boolean;
    isHighlighted: boolean;
}): string {
    const { kind, status, draggingClass, isMagnetHighlighted, isHighlighted } =
        opts;
    const magnetHighlightClass = isMagnetHighlighted
        ? "magnet-being-dragged"
        : "";
    const highlightedClass = isHighlighted ? "highlighted" : "";
    return `entity-instance entity-instance-type-${kind} status-${status} ${draggingClass} ${magnetHighlightClass} ${highlightedClass}`;
}

function getInlineStyle(
    color?: string,
): React.CSSProperties & { "--entity-color"?: string } {
    const style: React.CSSProperties & { "--entity-color"?: string } = {};
    if (color) {
        style["--entity-color"] = color;
    }
    return style;
}

function createHandlePointerDown(params: {
    id: number;
    grabberRef: React.RefObject<HTMLDivElement | null>;
    removeEntity: (id: number) => void;
    setDraggedEntityId: (id: number | null) => void;
    setHighlightedEntityId: (id: number | null) => void;
    setDraggingClass: (c: string) => void;
}): PointerEventHandler<HTMLDivElement> {
    const {
        id,
        grabberRef,
        removeEntity,
        setDraggedEntityId,
        setHighlightedEntityId,
        setDraggingClass,
    } = params;

    function startGrab() {
        setDraggedEntityId(id);
        setHighlightedEntityId(id); // Highlight linked magnet
        setDraggingClass("dragging");
        document.body.classList.add("grabbing");
        grabberRef.current?.classList.remove("grab-cursor");

        function onPointerUp() {
            setDraggingClass("");
            setDraggedEntityId(null);
            setHighlightedEntityId(null); // Clear highlight
            document.body.classList.remove("grabbing");
            grabberRef.current?.classList.add("grab-cursor");
        }

        globalThis.addEventListener("pointerup", onPointerUp, { once: true });
    }

    function startSimpleHighlight() {
        setHighlightedEntityId(id);
        globalThis.addEventListener(
            "pointerup",
            () => {
                setHighlightedEntityId(null);
            },
            { once: true },
        );
    }

    return (e) => {
        const isPenErase = e.pointerType === "pen" && e.button === 5;
        if (e.shiftKey || isPenErase) {
            removeEntity(id);
            return;
        }

        if (grabberRef.current?.contains(e.target as Node)) {
            startGrab();
            return;
        }

        // Also highlight on simple click/press of the row
        startSimpleHighlight();
    };
}

export const EntityInstance = ({
    entityId,
}: EntityInstanceProps): ReactElement | null => {
    const { removeEntity, setDraggedEntityId, setDamageTaken, setHighlightedEntityId } =
        useEntityStore(
            useShallow((store) => ({
                removeEntity: store.removeEntity,
                setDraggedEntityId: store.setDraggedEntityId,
                setDamageTaken: store.setDamageTaken,
                setHighlightedEntityId: store.setHighlightedEntityId,
            })),
        );

    const entity = useEntityStore(
        useShallow((store) => store.entities.find((e) => e.id === entityId)),
    ),
        [lastKnownEntity, setLastKnownEntity] = useState(entity);

    useEffect(() => {
        if (entity) {
            setLastKnownEntity(entity);
        }
    }, [entity]);

    if (!lastKnownEntity) {
        return null;
    }

    const entityIds = useEntityStore(useShallow((state) => state.entities.map((e) => e.id))),
        { id, name, kind, status, level, damageTaken, color } = lastKnownEntity,
        highlightedLinkedEntityId = useMagnetStore(
            (state) =>
                state.magnets.find((m) => m.id === state.highlightedMagnetId)
                    ?.linkedEntityId,
        ),
        isMagnetHighlighted = highlightedLinkedEntityId === id,
        highlightedEntityId = useEntityStore(useShallow((state) => state.highlightedEntityId)),
        isHighlighted = highlightedEntityId === id || isMagnetHighlighted,
        draggableRef = useRef(null),
        grabber = useRef<HTMLDivElement | null>(null),
        [draggingClass, setDraggingClass] = useState("");

    const handlePointerDown = createHandlePointerDown({
        id,
        grabberRef: grabber,
        removeEntity,
        setDraggedEntityId,
        setHighlightedEntityId,
        setDraggingClass,
    });

    const className = getClassName({ kind, status, draggingClass, isMagnetHighlighted, isHighlighted });
    const inlineStyle = getInlineStyle(color);

    return (
        <motion.div
            key={String(id)}
            ref={draggableRef}
            layoutDependency={entityIds}
            layoutId={String(lastKnownEntity.id)}
            onPointerDown={handlePointerDown}
            onPointerEnter={() => setHighlightedEntityId(id)}
            onPointerLeave={() => setHighlightedEntityId(null)}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            initial={{ opacity: 0 }}
            exit={{ left: -250, opacity: 0, transition: { delay: 0.15 } }}
            layout
            className={className}
            style={inlineStyle}
        >
            <div className="label-wrapper">
                <img src={name} />
            </div>
            <div className="instance-kind-container">
                {KIND_LOOKUP[kind]}
                <div className={`instance-kind instance-kind-${kind}`}>
                    {level}
                </div>
            </div>
            <SlotMachineInput
                onChange={(damage: number) => setDamageTaken(id, damage)}
                value={damageTaken}
                max={150}
            />
            <Grabber ref={grabber} />
        </motion.div>
    );
};

const Grabber = forwardRef<HTMLDivElement, unknown>((_, ref) => {
    const draggedEntityId = useEntityStore((state) => state.draggedEntityId);

    useEffect(() => {
        // `ref` can be a callback or object ref; normalize to access `.current` safely
        const el = (ref as React.RefObject<HTMLDivElement | null>)?.current;
        el?.classList.toggle("grab-cursor", draggedEntityId === null);
    }, [draggedEntityId, ref]);

    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
            className="grabber grab-cursor"
        >
            ⋮
        </div>
    );
});

Grabber.displayName = "Grabber";

