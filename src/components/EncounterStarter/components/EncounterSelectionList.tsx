import { EntityInstanceButton } from "./EntityInstanceButton";
import type { ReactElement } from "react";
import { useEntityStore } from "../../../store/useEntityStore";
import { encounterHeaderStyle, horizontalBarStyle, scrollableListStyle } from "../EncounterStarter.css";
import { encounterSelectionListStyle } from "./EncounterSelectionList.css";

interface EncounterSelectionListProps {
    onEntitySelect: (entityId: number) => void;
    className?: string;
}

export function EncounterSelectionList(props: EncounterSelectionListProps): ReactElement {
    const entities = useEntityStore((state) => state.entities);
    return (
        <div className={`${props.className} ${encounterSelectionListStyle}`}>
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
