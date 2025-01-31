import { EntityStatus, useEntityStore } from "../../../../../store/useEntityStore";
import { Canvas } from "../../../../Canvas";
import { useRef } from "react";

const canvasStyle = {
    flexBasis: "200px",
    flexGrow: 0,
    flexShrink: 0,
    height: "80%"
};

export function CreateSlot(): JSX.Element {
    const { addEntity } = useEntityStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    return (
        <div className="entity-slot">
            
            <Canvas style={canvasStyle} ref={canvasRef} />
            
            <button onClick={() => {
                addEntity({ name: canvasRef.current?.toDataURL("image/webp") || "", status: EntityStatus.PlayerCharacter });
                canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }}>+</button>
        </div>
    );
}