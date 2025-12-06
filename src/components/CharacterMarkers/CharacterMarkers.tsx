import {
    characterMarkers,
    characterMarkerHeaderBg,
    initHeading,
    initContent,
    statusHeading,
    delay,
    rotatedText,
    dying,
    dyingCount,
    dyingCountItem,
} from "./CharacterMarkers.css.ts";
import { AnimatePresence } from "motion/react";
import { InitSlot } from "./components/InitSlot/InitSlot";
import { MarkerHeading } from "./components/MarkerHeading";
import { TurnMarker } from "./components/TurnMarker";
import { useEntityStore } from "../../store/useEntityStore";
import { useShallow } from "zustand/react/shallow";
import { ScrollContainer } from "../ScrollContainer";

export function CharacterMarkers() {
    const entityIds = useEntityStore(useShallow(state => state.entities.map(entity => entity.id)));

    return (
        <div className={characterMarkers}>
            <div className={characterMarkerHeaderBg} />
            <MarkerHeading classes={initHeading}>INITIATIVE</MarkerHeading>
            <MarkerHeading classes={statusHeading}>
                <div className={delay}>
                    <div className={rotatedText}>DELAY</div>
                </div>
                <div className={dying}>DYING</div>
                <div className={dyingCount}>
                    <div className={dyingCountItem}>1</div>
                    <div className={dyingCountItem}>2</div>
                    <div className={dyingCountItem}>3</div>
                </div>
            </MarkerHeading>
            <ScrollContainer contentClassName={initContent}>
                <TurnMarker />
                <AnimatePresence>
                    {entityIds.map((id) => (
                        <InitSlot key={id} entityId={id} />
                    ))}
                </AnimatePresence>
                <InitSlot />
            </ScrollContainer>
        </div>
    );
}
