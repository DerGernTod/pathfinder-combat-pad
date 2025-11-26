import { useCallback, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { useEntityStore } from "../../../../../store/useEntityStore";
import { useShallow } from "zustand/react/shallow";

interface StatusSlotProps {
    children: string | ReactElement;
    className?: string;
    status: number;
    entityId?: number;
}
export function StatusSlot({
    children,
    className,
    status,
    entityId,
}: StatusSlotProps): ReactElement {
    const { draggedEntityId, setStatus, swapEntities } = useEntityStore(useShallow((state) => ({
        draggedEntityId: state.draggedEntityId,
        setStatus: state.setStatus,
        swapEntities: state.swapEntities,
    })));
    const elemRef = useRef<HTMLDivElement | null>(null);

    const moveEntityInstance = useCallback(function moveEntityInstanceCallback(e: PointerEvent) {
        const boundingRect = elemRef.current?.getBoundingClientRect();
        if (
            !entityId ||
            draggedEntityId === null ||
            !isWithinBounds(e.clientX, e.clientY, boundingRect)
        ) {
            return;
        }
        if (entityId !== draggedEntityId) {
            swapEntities(draggedEntityId, entityId);
        }
        setStatus(draggedEntityId, status);
    }, [draggedEntityId, entityId, setStatus, swapEntities, status]);

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
