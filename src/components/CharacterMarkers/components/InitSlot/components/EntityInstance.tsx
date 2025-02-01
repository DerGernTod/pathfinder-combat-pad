import { useCallback } from "react";
import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { motion } from "motion/react";
import { PointerEventHandler } from "react";

interface EntityInstanceProps {
    entity: Entity;
    onAnimationComplete: () => void;
    onAnimationStart: () => void;
}

export const EntityInstance = ({
    entity,
    onAnimationComplete,
    onAnimationStart,
}: EntityInstanceProps): JSX.Element => {
    const { removeEntity, entities } = useEntityStore();
    const { id, name, kind: status } = entity;
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
            onLayoutAnimationComplete={onAnimationComplete}
            onLayoutAnimationStart={onAnimationStart}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={handleRemove}
            layout
            className={`entity-instance entity-instance-type-${status}`}
        >
            <div draggable className="grabber">
                ⋮
            </div>
            <div className="label-wrapper">
                <img style={{ width: "70%", opacity: "80%" }} src={name} />
            </div>
            <div className="entity-slot-controls"></div>
        </motion.div>
    );
};
