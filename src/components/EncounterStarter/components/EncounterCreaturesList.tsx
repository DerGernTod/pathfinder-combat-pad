import { EntityInstanceButton } from "./EntityInstanceButton";
import type { ReactElement } from "react";
import { useEntityStore } from "../../../store/useEntityStore";
import { encounterHeaderStyle, horizontalBarStyle, scrollableListStyle } from "../EncounterStarter.css";
import { encounterCreaturesListStyle } from "./EncounterCreaturesList.css";
import { useShallow } from "zustand/react/shallow";

interface EncounterCreaturesListProps {
    onEntitySelect: (entityId: number) => void;
    className?: string;
}

export function EncounterCreaturesList(props: EncounterCreaturesListProps): ReactElement {
    const entities = useEntityStore(useShallow(state => state.entities));
    return (
        <div className={`${props.className} ${encounterCreaturesListStyle}`}>
            <h3 className={encounterHeaderStyle}>Creatures</h3>
            <div className={horizontalBarStyle} />
            <div className={scrollableListStyle}>
                {entities.map((entity) => (
                    <EntityInstanceButton key={entity.id} entity={entity} onClick={props.onEntitySelect} />
                ))}
            </div>
        </div>
    );
}
