import React, { useEffect, useRef } from "react";
import "./EntitySlot.css";
import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { EntityInstance } from "./EntityInstance";
import { debounce } from "es-toolkit"

const transparentImage = new Image();
transparentImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export function EntitySlot({ entity }: { entity: Entity }): JSX.Element {
    const { swapEntities, setDraggedEntityId, draggedEntityId } = useEntityStore();
    const [isAnimating, setIsAnimating] = React.useState(false);
    const nodeRef = useRef(null);
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedEntityId(entity.id);
        e.dataTransfer.setDragImage(transparentImage, 0, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isAnimating) {
            return;
        }
        e.dataTransfer.dropEffect = "move";
        if (draggedEntityId !== entity.id && draggedEntityId !== null) {
            swapEntities(draggedEntityId, entity.id);
            setIsAnimating(true);
        }
        console.log("dragover over", entity.id, "dragged id:", draggedEntityId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggedEntityId(null);
    };

    useEffect(() => {
        if (!isAnimating) {
            return;
        }
        const id = setTimeout(() => {
            setIsAnimating(false);
        }, 500);
        return () => clearTimeout(id);
    }, [isAnimating]);

    return (
        <div
            ref={nodeRef}
            className="entity-slot"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <EntityInstance entity={entity} />
        </div>
    );
}