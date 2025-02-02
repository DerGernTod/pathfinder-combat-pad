import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import { Entity } from "../../../../store/useEntityStore";
import { EntityInstance } from "./components/EntityInstance";
import { StatusSlot } from "./components/StatusSlot";

interface InitSlotProps {
    entity?: Entity;
}

export function InitSlot({ entity }: InitSlotProps): JSX.Element {
    let slot: JSX.Element;
    if (entity) {
        slot = <EntityInstance entity={entity} />;
    } else {
        slot = <CreateSlot />;
    }

    return (
        <div className="init-slot-container">
            <StatusSlot entity={entity} className="init-slot" status={0}>
                &nbsp;
            </StatusSlot>
            {slot}
            <div className="init-content-status">
                <StatusSlot entity={entity} status={1}>
                    O
                </StatusSlot>
                <StatusSlot entity={entity} status={2}>
                    💀
                </StatusSlot>
                <StatusSlot entity={entity} status={3}>
                    💀
                </StatusSlot>
                <StatusSlot entity={entity} status={4}>
                    💀
                </StatusSlot>
            </div>
        </div>
    );
}
