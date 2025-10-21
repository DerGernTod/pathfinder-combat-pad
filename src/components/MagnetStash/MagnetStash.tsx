import "./MagnetStash.css";
import { MagnetKind } from "./components/magnet-kind-types";
import { MagnetKinds } from "./components/MagnetKinds";
import { createElement } from "react";
import { useMagnetStore } from "../../store/useMagnetStore";

export function MagnetStash(): JSX.Element {
    const { createAndDragMagnet } = useMagnetStore();
    return (
        <div className="magnet-stash">
            <div onPointerDown={(e) => createAndDragMagnet({
                details: "#e18c52",
                isDragging: true,
                kind: MagnetKind.Arrow,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0,
            })}>
                {createElement(MagnetKinds[MagnetKind.Arrow].preview, { className: "", details: "#e18c52" })}
            </div>
            <div onPointerDown={(e) => createAndDragMagnet({
                details: "#758963",
                isDragging: true,
                kind: MagnetKind.Arrow,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0,
            })}>
                {createElement(MagnetKinds[MagnetKind.Arrow].preview, { className: "", details: "#758963" })}
            </div>
            <div onPointerDown={(e) => createAndDragMagnet({
                details: "#61749c",
                isDragging: true,
                kind: MagnetKind.Arrow,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0,
            })}>
                {createElement(MagnetKinds[MagnetKind.Arrow].preview, { className: "", details: "#61749c" })}
            </div>
            <div onPointerDown={(e) => createAndDragMagnet({
                details: "",
                isDragging: true,
                kind: MagnetKind.Condition,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0
            })}>
                {createElement(MagnetKinds[MagnetKind.Condition].preview, { className: "" })}
            </div>
            <div onPointerDown={(e) => createAndDragMagnet({
                details: "",
                isDragging: true,
                kind: MagnetKind.MonsterToken,
                location: { left: e.clientX - 25, top: e.clientY - 25 },
                rotation: 0
            })}>
                {createElement(MagnetKinds[MagnetKind.MonsterToken].preview, { className: "" })}
            </div>
        </div>
    );
}
