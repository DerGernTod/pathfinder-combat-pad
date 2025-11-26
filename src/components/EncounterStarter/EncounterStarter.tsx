import {
    bodySeparator,
    buttonText,
    encounterButton,
    encounterSelectionBody,
    encounterSelectionBodyChild,
    headerText,
    modalBody,
    modalContainer,
    startEncounterButtonSectionStyle,
    startEncounterButtonStyle,
    verticalBarStyle
} from "./EncounterStarter.css.ts";
import { EncounterParticipantsList } from "./components/EncounterParticipantsList.tsx";
import { EncounterCreaturesList } from "./components/EncounterCreaturesList.tsx";
import type { ReactElement } from "react";
import { useState } from "react";
import { useEncounterSetupStore } from "../../store/useEncounterSetupStore.ts";
import { useEntityStore } from "../../store/useEntityStore.ts";

export function EncounterStarter(): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const variant = isOpen ? "active" : "default";
    const participants = useEncounterSetupStore(state => state.participants);
    const clearParticipants = useEncounterSetupStore(state => state.clear);
    const entities = useEntityStore(state => state.entities);
    const setEntities = useEntityStore(state => state.setEntities);

    const handleOpen = () => {
        if (!isOpen) {
            clearParticipants();
        }
        setIsOpen(!isOpen);
    };

    const handleStartEncounter = () => {
        const newEntities = participants.map((participant) => {
            const existingEntity = participant.originalId 
                ? entities.find(e => e.id === participant.originalId) 
                : undefined;

            if (existingEntity) {
                return {
                    ...existingEntity,
                    // We might want to update name/kind/level if they were editable in the setup, 
                    // but for now we assume they are just for reordering.
                    // However, if we allow editing in setup, we should update here.
                    // Given the current UI only allows reordering, we just keep the existing data 
                    // but place it in the new order.
                };
            } else {
                // New entity
                // We need to generate a new ID. Since we are bulk setting, we can't rely on `addEntity`'s auto-increment 
                // easily without potentially conflicting if we mix strategies.
                // But `setEntities` replaces everything. So we can just re-assign IDs or keep existing ones.
                // To be safe and simple:
                // 1. Keep existing IDs for existing entities.
                // 2. Generate new IDs for new entities.
                // We need to ensure new IDs don't clash with existing ones.
                return {
                    id: 0, // Placeholder, will fix below
                    name: participant.name,
                    kind: participant.kind,
                    level: participant.level,
                    status: 0,
                    damageTaken: 0,
                };
            }
        });

        // Fix IDs
        const maxId = newEntities.reduce((max, e) => Math.max(max, e.id), 0);
        let nextId = maxId + 1;
        const finalEntities = newEntities.map(e => {
            if (e.id === 0) {
                return { ...e, id: nextId++ };
            }
            return e;
        });

        setEntities(finalEntities);
        setIsOpen(false);
    };

    return (
        <div className={modalContainer[variant]}>
            <div id="encounter-header" className={encounterButton[variant]} onClick={handleOpen}>
                <span className={buttonText[variant]}>Start Encounter</span>
                <h2 className={headerText[variant]}>Create New Encounter</h2>
            </div>

            <div className={modalBody[variant]}>
                <div className={encounterSelectionBody}>
                    <EncounterCreaturesList className={encounterSelectionBodyChild} />
                    <div className={`${bodySeparator} ${encounterSelectionBodyChild}`}>
                        <h3>&nbsp;</h3>
                        <div className={verticalBarStyle} />
                        <div>&gt;</div>
                        <div>&lt;</div>
                        <div className={verticalBarStyle} />
                    </div>
                    <EncounterParticipantsList className={encounterSelectionBodyChild} />
                </div>
                <div className={startEncounterButtonSectionStyle}>
                    <button 
                        className={startEncounterButtonStyle[variant]}
                        onClick={handleStartEncounter}
                        disabled={participants.length === 0}
                    >
                        Start Encounter
                    </button>
                </div>
            </div>
        </div>
    );

}
