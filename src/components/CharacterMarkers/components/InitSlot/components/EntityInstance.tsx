import "./EntityInstance.css";
import { useCallback } from "react";
import { Entity, EntityKind, useEntityStore } from "../../../../../store/useEntityStore";
import { motion } from "motion/react";
import { PointerEventHandler } from "react";

interface EntityInstanceProps {
    entity: Entity;
}

const KIND_LOOKUP = {
    [EntityKind.PlayerCharacter]: "PC",
    [EntityKind.NonPlayerCharacter]: "NPC",
    [EntityKind.Monster]: "MON",
    [EntityKind.Hazard]: "HAZ"
}

export const EntityInstance = ({
    entity
}: EntityInstanceProps): JSX.Element => {
    const { removeEntity, entities } = useEntityStore();
    const { id, name, kind, status, level } = entity;
    const handleRemove = useCallback(
        (e: Parameters<PointerEventHandler<HTMLDivElement>>[0]) => {
            if ((e.pointerType === "pen" && e.button === 5) || e.shiftKey) {
                removeEntity(id);
            }
        },
        [removeEntity, id]
    );
    return (
        <motion.div
            layoutDependency={entities}
            layoutId={String(id)}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={handleRemove}
            layout
            className={`entity-instance entity-instance-type-${kind} status-${status}`}
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
            <div draggable className="grabber">
                ⋮
            </div>
        </motion.div>
    );
};
