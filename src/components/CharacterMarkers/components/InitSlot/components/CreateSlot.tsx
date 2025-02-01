import { useCallback } from "react";
import {
    EntityKind,
    useEntityStore,
} from "../../../../../store/useEntityStore";
import { Canvas } from "../../../../Canvas";
import { useRef } from "react";

const canvasStyle = {
    flexBasis: "200px",
    flexGrow: 0,
    flexShrink: 0,
    height: "80%",
};

export function CreateSlot(): JSX.Element {
    const { addEntity } = useEntityStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const createEntity = useCallback(() => {
        addEntity({
            name: canvasRef.current?.toDataURL("image/webp") || "",
            kind: EntityKind.PlayerCharacter,
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
    }, [addEntity]);

    return (
        <div className="entity-slot">
            <Canvas style={canvasStyle} ref={canvasRef} />
            <select>
                <option
                    value={EntityKind.PlayerCharacter}
                    className="kind-option-0"
                >
                    <circle />
                </option>
                <option
                    value={EntityKind.NonPlayerCharacter}
                    className="kind-option-1"
                >
                    <circle />
                </option>
                <option value={EntityKind.Monster} className="kind-option-2">
                    <circle />
                </option>
                <option value={EntityKind.Hazard} className="kind-option-3">
                    <circle />
                </option>
            </select>
            <button onClick={createEntity}>+</button>
        </div>
    );
}
