import { Entity } from "../../../../store/useEntityStore";
import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import { EntitySlot } from "./components/EntitySlot";

interface InitSlotProps {
    entity?: Entity;
}

export function InitSlot({ entity }: InitSlotProps): JSX.Element {
    let slot: JSX.Element;
    if (entity) {
        slot = <EntitySlot entity={entity} />;
    } else {
        slot = <CreateSlot />;
    }

    return (
        <div className="init-slot-container">
            <div className="init-slot">{slot}</div>
            <div className="init-content-status">
                <div>O</div>
                <div>💀</div>
                <div>💀</div>
                <div>💀</div>
            </div>
        </div>
    );
}