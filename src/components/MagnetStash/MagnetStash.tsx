import "./MagnetStash.css";
import { MagnetKind } from "../../constants";
import { useMagnetStore } from "../../store/useMagnetStore";

export function MagnetStash(): JSX.Element {
    const { createAndDragMagnet } = useMagnetStore();
    return (
        <div className="magnet-stash" onPointerDown={(e) => createAndDragMagnet({
            isDragging: true,
            kind: MagnetKind.Arrow,
            location: { left: e.clientX - 25, top: e.clientY - 25 },
            rotation: 0
        })}>
            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,90 50,70 10,90" fill="gray" />
            </svg>
        </div>
    );
}