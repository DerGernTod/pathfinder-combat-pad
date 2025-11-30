import "./EntityInstance.css";
import type { PointerEventHandler, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
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

export const EntityInstance = ({
    entityId,
}: EntityInstanceProps): ReactElement | null => {
    const { removeEntity, setDraggedEntityId, draggedEntityId, setDamageTaken } = useEntityStore(useShallow(store => ({
        removeEntity: store.removeEntity,
        setDraggedEntityId: store.setDraggedEntityId,
        draggedEntityId: store.draggedEntityId,
        setDamageTaken: store.setDamageTaken,
    })));
    const entity = useEntityStore(useShallow(store => store.entities.find(e => e.id === entityId)));
    const [lastKnownEntity, setLastKnownEntity] = useState(entity);

    useEffect(() => {
        if (entity) {
            setLastKnownEntity(entity);
        }
    }, [entity]);

    if (!lastKnownEntity) {
        return null;
    }

    const entityIds = useEntityStore(useShallow(state => state.entities.map(e => e.id)));
    const { id, name, kind, status, level, damageTaken, color } = lastKnownEntity;
    
    // Check if this entity's linked magnet is being dragged
    const draggedMagnetId = useMagnetStore(state => state.draggedMagnetId);
    const draggedMagnet = useMagnetStore(state => 
        state.magnets.find(m => m.id === draggedMagnetId)
    );
    const isMagnetBeingDragged = draggedMagnet?.linkedEntityId === id;
    
    const draggableRef = useRef(null);
    const grabber = useRef<HTMLDivElement | null>(null);
    const [draggingClass, setDraggingClass] = useState("");
    const handlePointerDown = (e: Parameters<PointerEventHandler<HTMLDivElement>>[0]) => {
        const isPenErase = e.pointerType === "pen" && e.button === 5;
        if (e.shiftKey || isPenErase) {
            removeEntity(id);
        } else if (grabber.current?.contains(e.target as Node)) {
            setDraggedEntityId(id);
            setDraggingClass("dragging");
            document.body.classList.add("grabbing");
            grabber.current?.classList.remove("grab-cursor");
            globalThis.addEventListener(
                "pointerup",
                () => {
                    setDraggingClass("");
                    setDraggedEntityId(null);
                    document.body.classList.remove("grabbing");
                    grabber.current?.classList.add("grab-cursor");
                },
                { once: true }
            );
        }
    };
    useEffect(() => {
        grabber.current?.classList.toggle("grab-cursor", draggedEntityId === null);
    }, [draggedEntityId]);
    
    // Build className with magnet highlight
    const magnetHighlightClass = isMagnetBeingDragged ? "magnet-being-dragged" : "";
    const className = `entity-instance entity-instance-type-${kind} status-${status} ${draggingClass} ${magnetHighlightClass}`;
    
    // Build inline style with entity color for dynamic border
    const inlineStyle = color ? { "--entity-color": color } as React.CSSProperties : {};
    
    return (
        <motion.div
            key={String(id)}
            ref={draggableRef}
            layoutDependency={entityIds}
            layoutId={String(lastKnownEntity.id)}
            onPointerDown={handlePointerDown}
            animate={{ opacity: 1, transition: { delay: .15 } }}
            initial={{ opacity: 0 }}
            exit={{ left: -250, opacity: 0, transition: { delay: .15 } }}
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
            <SlotMachineInput onChange={(damage: number) => setDamageTaken(id, damage)} value={damageTaken} max={150} />
            <div ref={grabber} className="grabber grab-cursor">⋮</div>
        </motion.div>
    );
};


