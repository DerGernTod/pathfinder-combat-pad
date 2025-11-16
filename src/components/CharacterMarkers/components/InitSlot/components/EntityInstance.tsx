import "./EntityInstance.css";
import type { PointerEventHandler, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { KIND_LOOKUP } from "./constants";
import SlotMachineInput from "./SlotMachineInput";
import { motion } from "motion/react";
import { useEntityStore } from "../../../../../store/useEntityStore";
import { useShallow } from "zustand/react/shallow";

interface EntityInstanceProps {
    entityId: number;
}
const transparentImage = new Image();
transparentImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const EntityInstance = ({
    entityId,
}: EntityInstanceProps): ReactElement => {
    const { removeEntity, entities, entityIds, setDraggedEntityId, draggedEntityId, setDamageTaken } = useEntityStore(useShallow(store => ({
        removeEntity: store.removeEntity,
        // entityIds: store.entities.map(entity => entity.id),
        entities: store.entities,
        setDraggedEntityId: store.setDraggedEntityId,
        draggedEntityId: store.draggedEntityId,
        setDamageTaken: store.setDamageTaken,
    })));
    const entity = entities.find(e => e.id === entityId)!;
    const draggableRef = useRef(null);
    const grabber = useRef<HTMLDivElement | null>(null);
    const { id, name, kind, status, level, damageTaken } = entity;
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
    return (
        <motion.div
            key={String(id)}
            ref={draggableRef}
            layoutDependency={entities}
            layoutId={String(entity.id)}
            onPointerDown={handlePointerDown}
            animate={{ opacity: 1, transition: { delay: .15 } }}
            initial={{ opacity: 0 }}
            exit={{ left: -250, opacity: 0, transition: { delay: .15 } }}
            layout
            className={`entity-instance entity-instance-type-${kind} status-${status} ${draggingClass}`}
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


