import "./MagnetStash.css";
import { MagnetKind } from "../../constants";
import { MagnetKinds } from "./components/MagnetKinds";
import { createElement } from "react";
import { useMagnetStore } from "../../store/useMagnetStore";

export function MagnetStash(): JSX.Element {
    const { createAndDragMagnet } = useMagnetStore();
    return (
        <div className="magnet-stash">
            <div onPointerDown={(e) => createAndDragMagnet({
                isDragging: true,
                kind: MagnetKind.Arrow,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0
            })}>
                {createElement(MagnetKinds[MagnetKind.Arrow].preview, { className: "" })}
            </div>
            <div onPointerDown={(e) => createAndDragMagnet({
                isDragging: true,
                kind: MagnetKind.Condition,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0
            })}>
                {createElement(MagnetKinds[MagnetKind.Condition].preview, { className: "" })}
            </div>
        </div>
    );
}