import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { useCallback, useEffect, useRef } from "react";

interface StatusSlotProps {
    children: string | JSX.Element;
    className?: string;
    status: number;
    entity?: Entity;
}
export function StatusSlot({
    children,
    className,
    status,
    entity,
}: StatusSlotProps): JSX.Element {
    const { draggedEntityId, setStatus, swapEntities } = useEntityStore();
    const elemRef = useRef<HTMLDivElement | null>(null);

    const moveEntityInstance = useCallback(function moveEntityInstanceCallback(e: PointerEvent) {
        const boundingRect = elemRef.current?.getBoundingClientRect();
        if (
            !entity ||
            draggedEntityId === null ||
            !isWithinBounds(e.clientX, e.clientY, boundingRect)
        ) {
            return;
        }
        if (entity.id !== draggedEntityId) {
            swapEntities(draggedEntityId, entity.id);
        }
        setStatus(draggedEntityId, status);
    }, [entity, draggedEntityId, setStatus, status, swapEntities]);

    useEffect(() => {
        if (draggedEntityId !== null) {
            window.addEventListener("pointermove", moveEntityInstance);
        } else {
            window.removeEventListener("pointermove", moveEntityInstance);
        }
        return () => {
            window.removeEventListener("pointermove", moveEntityInstance);
        }
    }, [draggedEntityId, moveEntityInstance]);

    return (
        <div ref={elemRef} className={className}>
            {children}
        </div>
    );
}

function isWithinBounds(
    x: number,
    y: number,
    boundingRect: DOMRect | undefined
): boolean {
    if (!boundingRect) {
        return false;
    }

    return (
        x >= boundingRect.left &&
        x <= boundingRect.right &&
        y >= boundingRect.top &&
        y <= boundingRect.bottom
    );
}
