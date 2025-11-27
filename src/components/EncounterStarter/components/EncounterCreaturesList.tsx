import type { ReactElement } from "react";
import { useRef, useState } from "react";
import { encounterHeaderStyle, horizontalBarStyle } from "../EncounterStarter.css";
import {
    encounterCreaturesListStyle,
    encounterCreateSlotStyle,
    encounterEntityInstanceStyle,
    encounterCountInputStyle,
    encounterAddButtonStyle,
    encounterAddButtonInnerStyle,
    encounterCanvasStyle,
    creatureListItemStyle,
    creatureImageStyle,
    creatureInfoStyle,
    scrollableContent,
    creatureContainerStyle
} from "./EncounterCreaturesList.css";
import { useEncounterSetupStore } from "../../../store/useEncounterSetupStore";
import { EntityKind } from "../../../constants";
import { useEntityStore } from "../../../store/useEntityStore";
import { Canvas } from "../../Canvas";
import SlotNumberInput from "../../CharacterMarkers/components/InitSlot/components/SlotMachineInput";
import CustomSelect from "../../CustomSelect";
import type { CustomSelectOption } from "../../CustomSelect";
import { ScrollContainer } from "../../ScrollContainer";interface EncounterCreaturesListProps {
    className?: string;
}

const EntityOptions = [
    EntityKind.PlayerCharacter,
    EntityKind.NonPlayerCharacter,
    EntityKind.Monster,
    EntityKind.Hazard,
] as const;

const canvasStyle = {
    flexBasis: "200px",
    flexGrow: 0,
    flexShrink: 0,
    height: "100%",
};

export function EncounterCreaturesList(props: EncounterCreaturesListProps): ReactElement {
    const addAvailableCreature = useEncounterSetupStore(state => state.addAvailableCreature);
    const moveToParticipants = useEncounterSetupStore(state => state.moveToParticipants);
    const availableCreatures = useEncounterSetupStore(state => state.availableCreatures);
    const participants = useEncounterSetupStore(state => state.participants);
    const existingEntities = useEntityStore(state => state.entities);

    // New Entity State
    const [kind, setKind] = useState<EntityKind>(EntityOptions[EntityKind.Monster]);
    const [level, setLevel] = useState(1);
    const [count, setCount] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Filter out entities that are already in participants or availableCreatures (by originalId)
    const participantIds = new Set(participants.map(p => p.originalId).filter(Boolean));
    const availableCreatureIds = new Set(availableCreatures.map(c => c.originalId).filter(Boolean));
    const availableExistingEntities = existingEntities.filter(entity =>
        !participantIds.has(entity.id) && !availableCreatureIds.has(entity.id)
    );

    const handleAddNew = () => {
        const name = canvasRef.current?.toDataURL("image/webp");
        if (!name) {
            return;
        }

        // Add multiple creatures to available creatures based on count
        for (let i = 0; i < count; i++) {
            addAvailableCreature({
                name,
                kind,
                level,
            });
        }

        // Clear canvas and reset count
        const context = canvasRef.current?.getContext("2d");
        if (context && canvasRef.current) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setCount(1);
    };

    const handleClickExistingEntity = (entity: typeof existingEntities[0]) => {
        // Add existing entity directly to participants with originalId
        const { addParticipant } = useEncounterSetupStore.getState();
        addParticipant({
            name: entity.name,
            kind: entity.kind,
            level: entity.level,
            originalId: entity.id,
        });
    };

    const selectOptions = EntityOptions.map(toCustomSelectOption) as [CustomSelectOption, ...CustomSelectOption[]];

    function toCustomSelectOption(entityKind: EntityKind): CustomSelectOption {
        return {
            element: <KindOption kind={entityKind} />,
            id: String(entityKind),
            onSelect() {
                setKind(entityKind);
            },
        };
    }

    return (
        <div className={`${props.className} ${encounterCreaturesListStyle}`}>
            <h3 className={encounterHeaderStyle}>Add Creature</h3>
            <div className={horizontalBarStyle} />

            {/* New Entity Form - Encounter-specific flexbox layout */}
            <div className={encounterCreateSlotStyle}>
                <div className={`entity-instance entity-instance-type-${kind} ${encounterEntityInstanceStyle}`}>
                    <Canvas style={canvasStyle} className={encounterCanvasStyle} ref={canvasRef} penSize={2} />
                    <SlotNumberInput onChange={setLevel} max={20} value={level} />
                    <CustomSelect
                        options={selectOptions}
                        selectedIndex={EntityOptions.indexOf(kind)}
                    />
                </div>
                <div className={encounterCountInputStyle}>
                    <SlotNumberInput onChange={setCount} max={20} value={count} />
                </div>
                <div className={encounterAddButtonStyle}>
                    <button className={encounterAddButtonInnerStyle} onClick={handleAddNew}>✚</button>
                </div>
            </div>
            <div className={horizontalBarStyle} />

            {/* Available Creatures and Existing Entities */}
            <div className={creatureContainerStyle}>
                <ScrollContainer contentClassName={scrollableContent} variant="absolute">
                    {/* Show available creatures from the store */}
                    {availableCreatures.map(creature => (
                        <button
                            key={creature.id}
                            onClick={() => moveToParticipants(creature.id)}
                            className={creatureListItemStyle[creature.kind]}
                        >
                            <img src={creature.name} alt="name" className={creatureImageStyle} />
                            <span className={creatureInfoStyle}>Lvl {creature.level}</span>
                        </button>
                    ))}

                    {/* Show existing entities that aren't in participants */}
                    {availableExistingEntities.map(entity => (
                        <button
                            key={entity.id}
                            onClick={() => handleClickExistingEntity(entity)}
                            className={creatureListItemStyle[entity.kind]}
                        >
                            <img src={entity.name} alt="name" className={creatureImageStyle} />
                            <span className={creatureInfoStyle}>Lvl {entity.level}</span>
                        </button>
                    ))}
                </ScrollContainer>
            </div>
        </div>
    );
}

function KindOption({ kind }: { kind: EntityKind }): ReactElement {
    return <div className={`kind-option kind-option-${kind}`}>●</div>;
}
