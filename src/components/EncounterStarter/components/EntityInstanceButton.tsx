import { sortableHandle, sortableItem } from "./EntityInstanceButton.css";
import type { Entity } from "../../../constants";
import type { ReactElement } from "react";


interface EntityInstanceButtonProps {
    entity: Entity;
    onClick: (id: number) => void;
}

export function EntityInstanceButton({ entity, onClick }: EntityInstanceButtonProps): ReactElement {
    return (
        <div className={sortableItem} onClick={() => onClick(entity.id)}>
            <img src={entity.name} />
            <div className={sortableHandle}>⋮</div>
        </div>
    );
}
