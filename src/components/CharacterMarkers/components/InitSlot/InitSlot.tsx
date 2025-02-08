import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import { Entity } from "../../../../constants";
import { EntityInstance } from "./components/EntityInstance";
import { StatusSlot } from "./components/StatusSlot";
import { motion } from "motion/react";

interface InitSlotProps {
    entity?: Entity;
}

export function InitSlot({ entity }: InitSlotProps): JSX.Element {
    let slot: JSX.Element;
    let gapClass = "";
    if (entity) {
        gapClass = "grid-gap";
        slot = (
            <>
                <StatusSlot entity={entity} className="init-slot" status={0}>
                    &nbsp;
                </StatusSlot>
                <EntityInstance entity={entity} />            
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
            </>
        );
    } else {
        slot = <CreateSlot />;
    }

    return (
        <motion.div
            key={entity?.id}
            className={`init-slot-container ${gapClass}`}
            animate={
                { height: "4rem" }
            }
            initial={
                { height: 0 }
            }
            exit={
                { height: 0, transition: { delay: .35 } }
            }>
            {slot}

        </motion.div>
    );
}
