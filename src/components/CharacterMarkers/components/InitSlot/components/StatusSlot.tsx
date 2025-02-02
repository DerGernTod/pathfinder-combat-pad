import { Entity, useEntityStore } from "../../../../../store/useEntityStore";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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
    const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);

    const moveEntityInstance = useCallback(
        function moveEntityInstanceCallback(e: PointerEvent) {
            if (
                !entity ||
                draggedEntityId === undefined ||
                !isWithinBounds(e.clientX, e.clientY, boundingRect)
            ) {
                return;
            }
            if (entity.id !== draggedEntityId) {
                swapEntities(draggedEntityId, entity.id);
                return;
            }
            setStatus(draggedEntityId, status);
        },
        [entity, draggedEntityId, boundingRect, setStatus, status, swapEntities]
    );

    useLayoutEffect(() => {
        if (draggedEntityId === null) {
            return;
        }
        setBoundingRect(elemRef.current?.getBoundingClientRect() ?? null);
        window.addEventListener("pointermove", moveEntityInstance);
        return () => {
            window.removeEventListener("pointermove", moveEntityInstance);
        };
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
    boundingRect: DOMRect | null
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
