import { Entity } from "../../../../store/useEntityStore";
import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import { EntitySlot } from "./components/EntitySlot";
import { motion } from "motion/react";

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
        <motion.div
            exit={{ height: 0 }}
            initial={{ height: 0 }}
            animate={{ height: "4rem" }}
            layout
            className="init-slot-container"
        >
            <div className="init-slot">{slot}</div>
            <div className="init-content-status">
                <div>O</div>
                <div>💀</div>
                <div>💀</div>
                <div>💀</div>
            </div>
        </motion.div>
    );
}
