import { Entity, useEntityStore } from "../../../../../store/useEntityStore";

interface StatusSlotProps {
    children: string | JSX.Element;
    className?: string;
    status: number;
    entity?: Entity;
}
export function StatusSlot({ children, className, status, entity }: StatusSlotProps): JSX.Element {
    const { draggedEntityId, setStatus, swapEntities } = useEntityStore();
    return (
        <div className={className} onDragOver={() => { 
            if (!entity || !draggedEntityId) {
                return;
            }
            if (entity.id !== draggedEntityId) {
                swapEntities(draggedEntityId, entity.id);
            }
            setStatus(draggedEntityId, status);
        }}>{children}</div>
    );
}