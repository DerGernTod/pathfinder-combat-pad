import { useCallback, useEffect, useRef } from "react";
import type { Entity } from "../../../../../constants";
import type { ReactElement} from "react";
import { useEntityStore } from "../../../../../store/useEntityStore";

interface StatusSlotProps {
    children: string | ReactElement;
    className?: string;
    status: number;
    entity?: Entity;
}
export function StatusSlot({
    children,
    className,
    status,
    entity,
}: StatusSlotProps): ReactElement {
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
            globalThis.addEventListener("pointermove", moveEntityInstance);
        } else {
            globalThis.removeEventListener("pointermove", moveEntityInstance);
        }
        return () => {
            globalThis.removeEventListener("pointermove", moveEntityInstance);
        }
    }, [draggedEntityId, moveEntityInstance]);

    return (
        <div
            ref={elemRef}
            className={className}
        >
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
