import { Entity, useEntityStore } from "../../../../../store/useEntityStore";

export const EntityInstance = ({ entity }: { entity: Entity }): JSX.Element => {
    const { removeEntity } = useEntityStore();
    const { id, name, status } = entity;
    return (
        <div className={`entity-instance entity-instance-type-${status}`}>
            <div draggable className="grabber">⋮</div>
            <div className="label-wrapper">
                <img style={{ width: "70%", opacity: "80%" }} src={name} />
            </div>
            <div className="entity-slot-controls">
                <button onClick={() => removeEntity(id)}>X</button>
            </div>
        </div>
    );
};