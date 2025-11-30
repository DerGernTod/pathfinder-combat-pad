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
import { generateUniqueColor } from "../../utils/color-utils.ts";
import { useMagnetStore } from "../../store/useMagnetStore.ts";

export function EncounterStarter(): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const variant = isOpen ? "active" : "default";
    const participants = useEncounterSetupStore(state => state.participants);
    const clearParticipants = useEncounterSetupStore(state => state.clear);
    const entities = useEntityStore(state => state.entities);
    const setEntities = useEntityStore(state => state.setEntities);
    const createMagnetsForEntities = useMagnetStore(state => state.createMagnetsForEntities);

    const handleOpen = () => {
        if (!isOpen) {
            clearParticipants();
        }
        setIsOpen(!isOpen);
    };

    const handleStartEncounter = () => {
        // Collect existing colors to avoid duplicates
        const existingColors = entities
            .map(e => e.color)
            .filter((color): color is string => color !== undefined);

        const newEntities = participants.map((participant) => {
            const existingEntity = participant.originalId 
                ? entities.find(e => e.id === participant.originalId) 
                : undefined;

            if (existingEntity) {
                // Existing entity - preserve color if it has one, otherwise generate
                const color = existingEntity.color || generateUniqueColor(existingColors);
                if (!existingEntity.color) {
                    existingColors.push(color); // Track newly generated color
                }
                return {
                    ...existingEntity,
                    color,
                };
            } else {
                // New entity - generate color
                const color = generateUniqueColor(existingColors);
                existingColors.push(color);
                
                return {
                    id: 0, // Placeholder, will fix below
                    name: participant.name,
                    kind: participant.kind,
                    level: participant.level,
                    status: 0,
                    damageTaken: 0,
                    color,
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
        
        // Create magnets for all entities (all should have colors at this point)
        const entitiesWithColors = finalEntities.filter((e): e is typeof e & { color: string } => e.color !== undefined);
        createMagnetsForEntities(entitiesWithColors.map(e => ({ id: e.id, color: e.color })));
        
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
