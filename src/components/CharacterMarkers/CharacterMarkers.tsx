import "./CharacterMarkers.css";
import { MarkerHeading } from "./components/MarkerHeading";
export function CharacterMarkers() {
    return (
        <div className="character-markers">
            <MarkerHeading classes="init-heading">Initiative</MarkerHeading>
            <MarkerHeading classes="status-heading">
                <div className="delay"><div className="rotated-text">Delay</div></div>
                <div className="dying">Dying</div>
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
                init content
            </div>
            <div
                className="status-content"
                style={{ backgroundColor: "lightgreen" }}
            >
                status content
            </div>
        </div>
    );
}
