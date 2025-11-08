import { useEntityStore } from "../../store/useEntityStore.ts";
import { bodySeparator, buttonText, encounterButton, encounterSelectionBody, encounterSelectionBodyChild, headerText, horizontalBarStyle, modalBody, modalContainer, sectionsSeparatorStyle, startEncounterButtonSectionStyle, startEncounterButtonStyle, verticalBarStyle } from "./EncounterStarter.css.ts";
import { EncounterParticipantsList } from "./components/EncounterParticipantsList.tsx";
import { EncounterCreaturesList } from "./components/EncounterCreaturesList.tsx";
import type { ReactElement } from "react";
import { useState } from "react";

export function EncounterStarter(): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const entities = useEntityStore((state) => state.entities);
    const variant = isOpen ? "active" : "default";
    return (
        <div className={modalContainer[variant]}>
            <div id="encounter-header" className={encounterButton[variant]} onClick={() => setIsOpen(!isOpen)}>
                <span className={buttonText[variant]}>Start Encounter</span>
                <h2 className={headerText[variant]}>Create New Encounter</h2>
            </div>

            <div className={modalBody[variant]}>
                <div className={encounterSelectionBody}>
                    <EncounterCreaturesList className={encounterSelectionBodyChild} onEntitySelect={(id) => {
                        console.log("entity id", id); 
                    }} />
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
                    <button className={startEncounterButtonStyle[variant]}>Start Encounter</button>
                </div>
            </div>
        </div>
    );

}
