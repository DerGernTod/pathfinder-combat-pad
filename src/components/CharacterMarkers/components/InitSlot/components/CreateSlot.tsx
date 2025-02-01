import { useCallback } from "react";
import {
    EntityKind,
    useEntityStore,
} from "../../../../../store/useEntityStore";
import { Canvas } from "../../../../Canvas";
import { useRef } from "react";
import CustomSelect, { CustomSelectOption } from "../../../../CustomSelect";
import { useState } from "react";
import { useMemo } from "react";
import "./CreateSlot.css";

const canvasStyle = {
    flexBasis: "200px",
    flexGrow: 0,
    flexShrink: 0,
    height: "80%",
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
    const [kind, setKind] = useState<EntityKind>(EntityOptions[initialEntityKind]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const createEntity = useCallback(() => {
        addEntity({
            name: canvasRef.current?.toDataURL("image/webp") || "",
            kind,
            level: 1,
            status: 0
        });
        canvasRef.current
            ?.getContext("2d")
            ?.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
    }, [addEntity, kind, canvasRef.current]);
    const selectOptions = useMemo(() => {
        return EntityOptions.map(toCustomSelectOption) as [CustomSelectOption, ...CustomSelectOption[]];
    }, []);

    return (
        <div className="entity-slot">
            <Canvas style={canvasStyle} ref={canvasRef} />
            <CustomSelect options={selectOptions} selectedIndex={initialEntityKind} />
            <button onClick={createEntity}>
                +
            </button>
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
