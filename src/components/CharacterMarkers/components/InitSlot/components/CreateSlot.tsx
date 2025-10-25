import "./CreateSlot.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { Canvas } from "../../../../Canvas";
import CustomSelect from "../../../../CustomSelect";
import type { CustomSelectOption } from "../../../../CustomSelect";
import { EntityKind } from "../../../../../constants";
import SlotNumberInput from "./SlotMachineInput";
import { useEntityStore } from "../../../../../store/useEntityStore";

const canvasStyle = {
    flexBasis: "175px",
    flexGrow: 0,
    flexShrink: 0,
    height: "100%",
};

const EntityOptions = [
    EntityKind.PlayerCharacter,
    EntityKind.NonPlayerCharacter,
    EntityKind.Monster,
    EntityKind.Hazard,
] as const;

export function CreateSlot(): JSX.Element {
    const initialEntityKind = 0;
    const { addEntity } = useEntityStore();
    const [kind, setKind] = useState<EntityKind>(
        EntityOptions[initialEntityKind]
    );
    const [level, setLevel] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const createEntity = useCallback(() => {
        addEntity({
            damageTaken: 0,
            kind,
            level,
            name: canvasRef.current?.toDataURL("image/webp") ?? "",
            status: 0,
        });
        canvasRef.current
            ?.getContext("2d")
            ?.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
    }, [addEntity, kind, level]);
    const selectOptions = useMemo(() => EntityOptions.map(toCustomSelectOption) as [
        CustomSelectOption,
        ...CustomSelectOption[]
    ], []);

    return (
        <div className="create-slot">
            <div className="slot-holder">
                <div className={`entity-instance entity-instance-type-${kind}`}>
                    <Canvas style={canvasStyle} ref={canvasRef} penSize={2} />
                    <SlotNumberInput onChange={setLevel} max={20} value={level} />
                    <CustomSelect
                        options={selectOptions}
                        selectedIndex={initialEntityKind}
                    />
                </div>
            </div>
            <div className="button">
                <button onClick={createEntity}>✚</button>
            </div>
        </div>
    );

    function toCustomSelectOption(entityKind: EntityKind): CustomSelectOption {
        return {
            element: <KindOption kind={entityKind} />,
            id: String(entityKind),
            onSelect() {
                setKind(entityKind);
            },
        };
    }
}

function KindOption({ kind }: { kind: EntityKind }): JSX.Element {
    return <div className={`kind-option kind-option-${kind}`}>●</div>;
}
