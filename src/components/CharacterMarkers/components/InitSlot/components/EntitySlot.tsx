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
    const nodeRef = useRef(null);
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = "all";
        setDraggedEntityId(entity.id);
        e.dataTransfer.setDragImage(transparentImage, 0, 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
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
            className="entity-slot"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <EntityInstance entity={entity} />
        </div>
    );
}
