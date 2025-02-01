import { useCallback } from "react";
import {
    EntityKind,
    useEntityStore,
} from "../../../../../store/useEntityStore";
import { Canvas } from "../../../../Canvas";
import { useRef } from "react";
import CustomSelect from "../../../../CustomSelect";
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
    const { addEntity } = useEntityStore();
    const [kind, setKind] = useState<null | EntityKind>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const createEntity = useCallback(() => {
        if (!kind) {
            return;
        }
        addEntity({
            name: canvasRef.current?.toDataURL("image/webp") || "",
            kind,
            level: 1,
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
        return EntityOptions.map(toCustomSelectOption);
    }, []);

    return (
        <div className="entity-slot">
            <Canvas style={canvasStyle} ref={canvasRef} />
            <CustomSelect options={selectOptions} />
            <button disabled={kind === null} onClick={createEntity}>
                +
            </button>
        </div>
    );

    function toCustomSelectOption(entityKind: EntityKind) {
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
