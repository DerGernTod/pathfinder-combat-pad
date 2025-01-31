import "./CharacterMarkers.css";
import { InitSlot } from "./components/InitSlot/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";
import { useEntityStore } from "../../store/useEntityStore";

export function CharacterMarkers() {
    const { entities } = useEntityStore();

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
            <div className="init-content">
                {entities.map((entity) => (<InitSlot key={entity.id} entity={entity} />))}
                <InitSlot />
            </div>
        </div>
    );
}
