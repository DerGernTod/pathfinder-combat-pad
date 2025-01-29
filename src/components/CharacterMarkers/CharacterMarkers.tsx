import "./CharacterMarkers.css";
import { InitSlot } from "./components/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";

export function CharacterMarkers() {
    return (
        <div className="character-markers">
            <div className="character-marker-header-bg"></div>
            <MarkerHeading classes="init-heading">INITIATIVE</MarkerHeading>
            <MarkerHeading classes="status-heading">
                <div className="delay"><div className="rotated-text">DELAY</div></div>
                <div className="dying">DYING</div>
                <div className="dying-count">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
            </MarkerHeading>
            <div
                className="init-content"
                style={{ backgroundColor: "lightblue" }}
            >
                <InitSlot />
                <InitSlot />
                <InitSlot />
                <InitSlot />
                <div>second</div>
                <div>third</div>
            </div>
        </div>
    );
}
