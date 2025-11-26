import type { ReactElement } from "react";
import { encounterHeaderStyle, horizontalBarStyle } from "../EncounterStarter.css";
import { useEncounterSetupStore } from "../../../store/useEncounterSetupStore";
import { 
    creatureListItemStyle, 
    creatureImageStyle, 
    creatureInfoStyle 
} from "./EncounterCreaturesList.css";

export function EncounterParticipantsList(props: { className?: string }): ReactElement {
    const participants = useEncounterSetupStore(state => state.participants);
    const moveToAvailableCreatures = useEncounterSetupStore(state => state.moveToAvailableCreatures);

    const handleClickParticipant = (participantId: string) => {
        moveToAvailableCreatures(participantId);
    };

    return (
        <div className={props.className} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h3 className={encounterHeaderStyle}>Participants</h3>
            <div className={horizontalBarStyle} />
            <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
                {participants.map((participant) => (
                    <button 
                        key={participant.id} 
                        onClick={() => handleClickParticipant(participant.id)}
                        className={creatureListItemStyle[participant.kind]}
                    >
                        {participant.name.startsWith("data:image") 
                            ? <img src={participant.name} alt="participant" className={creatureImageStyle} />
                            : <span>{participant.name}</span>
                        }
                        <span className={creatureInfoStyle}>Lvl {participant.level}</span>
                    </button>
                ))}
                {participants.length === 0 && <div style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>No participants added</div>}
            </div>
        </div>
    );
}
