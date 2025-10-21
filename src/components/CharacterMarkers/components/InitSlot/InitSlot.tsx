import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import type { Entity } from "../../../../constants";
import { EntityInstance } from "./components/EntityInstance";
import { StatusSlot } from "./components/StatusSlot";
import { motion } from "motion/react";

interface InitSlotProps {
    entity?: Entity;
}

const exitOptions = { height: 0, transition: { delay: .35 } };
const initialOptions = { height: 0 };
const animateOptions = { height: "4rem" };

export function InitSlot({ entity }: InitSlotProps): JSX.Element {
    const gapClass = getGapClass(entity);

    return (
        <motion.div
            key={entity?.id}
            className={`init-slot-container ${gapClass}`}
            animate={animateOptions}
            initial={initialOptions}
            exit={exitOptions}
        >
            <EntitySlot entity={entity} />
        </motion.div>
    );
}

function EntitySlot({ entity }: { entity: Entity | undefined }): JSX.Element {
    if (!entity) {
        return <CreateSlot />;
    }
    return (
        <>
            <StatusSlot entity={entity} className="init-slot slot-holder" status={0}>
                <EntityInstance entity={entity} />
            </StatusSlot>
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
}

function getGapClass(entity: Entity | undefined) {
    if (entity) {
        return "grid-gap";
    }
    return "";
}
