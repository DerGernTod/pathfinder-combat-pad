import "./EntityInstance.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Entity } from "../../../../../constants";
import { KIND_LOOKUP } from "./constants";
import type { PointerEventHandler } from "react";
import SlotMachineInput from "./SlotMachineInput";
import { motion } from "motion/react";
import { useEntityStore } from "../../../../../store/useEntityStore";

interface EntityInstanceProps {
    entity: Entity;
}
const transparentImage = new Image();
transparentImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const EntityInstance = ({
    entity,
}: EntityInstanceProps): JSX.Element => {
    const { removeEntity, entities, setDraggedEntityId, draggedEntityId, setDamageTaken } = useEntityStore();
    const draggableRef = useRef(null);
    const grabber = useRef<HTMLDivElement | null>(null);
    const { id, name, kind, status, level, damageTaken } = entity;
    const [draggingClass, setDraggingClass] = useState("");
    const handleDamageTakenChanged = useCallback((damage: number) => setDamageTaken(id, damage), [id, setDamageTaken]);
    const handlePointerDown = useCallback(
        (e: Parameters<PointerEventHandler<HTMLDivElement>>[0]) => {
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
        },
        [removeEntity, id, setDraggedEntityId]
    );
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
            <SlotMachineInput onChange={handleDamageTakenChanged} value={damageTaken} max={150} />
            <div ref={grabber} className="grabber grab-cursor">⋮</div>
        </motion.div>
    );
};


