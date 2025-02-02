import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { useLayoutEffect, useRef } from "react";

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

    useLayoutEffect(() => {
        if (draggedEntityId === null) {
            return;
        }
        const boundingRect = elemRef.current?.getBoundingClientRect();
        
        window.addEventListener("pointermove", moveEntityInstance);
        return () => {
            window.removeEventListener("pointermove", moveEntityInstance);
        };

        function moveEntityInstance(e: PointerEvent) {
            if (
                !entity ||
                draggedEntityId === null ||
                !isWithinBounds(e.clientX, e.clientY, boundingRect)
            ) {
                return;
            }
            if (entity.id !== draggedEntityId) {
                swapEntities(draggedEntityId, entity.id);
                return;
            }
            setStatus(draggedEntityId, status);
        }
    }, [entity, draggedEntityId, setStatus, status, swapEntities]);

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
