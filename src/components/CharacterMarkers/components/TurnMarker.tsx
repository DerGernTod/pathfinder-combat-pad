import "./TurnMarker.css";
import { useEntityStore } from "../../../store/useEntityStore";
import { useShallow } from "zustand/react/shallow";

export function TurnMarker() {
    const { activeEntityId, entities, cycleTurn } = useEntityStore(useShallow(state => ({
        activeEntityId: state.activeEntityId,
        entities: state.entities,
        cycleTurn: state.cycleTurn,
    })));

    const activeIndex = entities.findIndex(e => e.id === activeEntityId);

    if (activeEntityId === null || activeIndex === -1) {
        return null;
    }

    const top = `${activeIndex * 4}rem`;

    return (
        <div 
            className="turn-marker" 
            style={{ top }}
            onClick={cycleTurn}
            title="Next Turn"
        />
    );
}
