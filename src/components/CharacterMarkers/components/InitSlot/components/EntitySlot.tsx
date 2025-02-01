import React, { useEffect, useRef, useState } from "react";
import "./EntitySlot.css";
import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { EntityInstance } from "./EntityInstance";

const transparentImage = new Image();
transparentImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export function EntitySlot({ entity }: { entity: Entity }): JSX.Element {
    const { swapEntities, setDraggedEntityId, draggedEntityId } =
        useEntityStore();
    const [isDragged, setIsDragged] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const nodeRef = useRef(null);
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragged(true);
        console.log("drag start", entity.id);
        e.dataTransfer.effectAllowed = "move";
        setDraggedEntityId(entity.id);
        e.dataTransfer.setDragImage(transparentImage, 0, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        console.log("drag over", entity.id);
        if (draggedEntityId !== entity.id && draggedEntityId !== null) {
            swapEntities(draggedEntityId, entity.id);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggedEntityId(null);
    };

    return (
        <div
            ref={nodeRef}
            className={"entity-slot" + (isDragged ? " cur-dragged" : "")}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={() => {
                setIsDragged(false);
            }}
        >
            <EntityInstance
                entity={entity}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
            />
        </div>
    );
}
