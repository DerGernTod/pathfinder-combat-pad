import "./EntityInstance.css";
import { useCallback, useRef, useState } from "react";
import { Entity, EntityKind, useEntityStore } from "../../../../../store/useEntityStore";
import { motion } from "motion/react";
import { PointerEventHandler } from "react";

interface EntityInstanceProps {
    entity: Entity;
}
const transparentImage = new Image();
transparentImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const KIND_LOOKUP = {
    [EntityKind.PlayerCharacter]: "PC",
    [EntityKind.NonPlayerCharacter]: "NPC",
    [EntityKind.Monster]: "MON",
    [EntityKind.Hazard]: "HAZ"
}

export const EntityInstance = ({
    entity
}: EntityInstanceProps): JSX.Element => {
    const { removeEntity, entities, setDraggedEntityId } = useEntityStore();
    const draggableRef = useRef(null);
    const { id, name, kind, status, level } = entity;
    const [isDragging, setIsDragging] = useState(false);
    const handlePointerDown = useCallback(
        (e: Parameters<PointerEventHandler<HTMLDivElement>>[0]) => {
            if ((e.pointerType === "pen" && e.button === 5) || e.shiftKey) {
                removeEntity(id);
            } else {
                setDraggedEntityId(id);
                setIsDragging(true);
                window.addEventListener("pointerup", () => {
                    setIsDragging(false);
                    setDraggedEntityId(null);
                }, { once: true });
            }
        },
        [removeEntity, id, setDraggedEntityId]
    );

    return (
        <motion.div
            ref={draggableRef}
            layoutDependency={entities}
            layoutId={String(id)}
            onPointerDown={handlePointerDown}
            layout
            className={`entity-instance entity-instance-type-${kind} status-${status} ${isDragging ? "dragging" : ""}`}
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
            <div className="grabber">
                ⋮
            </div>
        </motion.div>
    );
};
