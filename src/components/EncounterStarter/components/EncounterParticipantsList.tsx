import type { ReactElement } from "react";
import { encounterHeaderStyle, horizontalBarStyle } from "../EncounterStarter.css";

export function EncounterParticipantsList(props: { className?: string }): ReactElement {
    return (
        <div className={props.className}>
            <h3 className={encounterHeaderStyle}>Participants</h3>
            <div className={horizontalBarStyle} />
            <button>+</button>
        </div>
    );
}
