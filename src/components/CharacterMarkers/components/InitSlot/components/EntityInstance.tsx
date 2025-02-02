import "./EntityInstance.css";
import {
    Entity,
    EntityKind,
    useEntityStore,
} from "../../../../../store/useEntityStore";
import { PointerEventHandler, useCallback, useRef, useState } from "react";
import { motion } from "motion/react";

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
    [EntityKind.Hazard]: "HAZ",
};

export const EntityInstance = ({
    entity,
}: EntityInstanceProps): JSX.Element => {
    const { removeEntity, entities, setDraggedEntityId } = useEntityStore();
    const draggableRef = useRef(null);
    const grabber = useRef<HTMLDivElement | null>(null);
    const { id, name, kind, status, level } = entity;
    const [draggingClass, setDraggingClass] = useState("");
    const handlePointerDown = useCallback(
        (e: Parameters<PointerEventHandler<HTMLDivElement>>[0]) => {
            const isPenErase = e.pointerType === "pen" && e.button === 5;
            if (e.shiftKey || isPenErase) {
                removeEntity(id);
            } else {
                setDraggedEntityId(id);
                setDraggingClass("dragging");
                document.body.classList.add("grabbing");
                grabber.current?.classList.remove("grab-cursor");
                window.addEventListener(
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
    return (
        <motion.div
            ref={draggableRef}
            layoutDependency={entities}
            layoutId={String(id)}
            onPointerDown={handlePointerDown}
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
            <div ref={grabber} className="grabber grab-cursor">⋮</div>
        </motion.div>
    );
};
