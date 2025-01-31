import "./EntitySlot.css";
import { Entity, useEntityStore } from "../../../../../store/useEntityStore";

export function EntitySlot({ entity }: { entity: Entity }): JSX.Element {
    const { removeEntity, swapEntityWithHigherPriority, swapEntityWithLowerPriority } = useEntityStore();
    const { id, name, status } = entity;
    return (
        <div className="entity-slot">
            <div className="grabber">⋮</div>
            <div className={`entity-instance entity-instance-type-${status}`}>
                <div className="label-wrapper">
                    <img style={{ width: "70%", opacity: "80%" }} src={name} />
                </div>
                <div className="entity-slot-controls">
                    <button onClick={() => swapEntityWithHigherPriority(id)}>+</button>
                    <button onClick={() => swapEntityWithLowerPriority(id)}>-</button>
                    <button onClick={() => removeEntity(id)}>X</button>
                </div>
            </div>
        </div>
    )
}