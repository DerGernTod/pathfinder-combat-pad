import "./InitSlot.css";
import { CreateSlot } from "./components/CreateSlot";
import { EntityInstance } from "./components/EntityInstance";
import type { ReactElement } from "react";
import { StatusSlot } from "./components/StatusSlot";
import { motion } from "motion/react";
import { useEntityStore } from "../../../../store/useEntityStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef } from "react";

interface InitSlotProps {
    entityId?: number;
}

const exitOptions = { height: 0, transition: { delay: .35 } };
const initialOptions = { height: 0 };
const animateOptions = { height: "4rem" };

export function InitSlot({ entityId }: InitSlotProps): ReactElement {
    const gapClass = getGapClass(!!entityId);
    const activeEntityId = useEntityStore(useShallow(state => state.activeEntityId));
    const isActive = entityId !== undefined && entityId === activeEntityId;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [isActive]);

    return (
        <motion.div
            ref={ref}
            key={entityId}
            className={`init-slot-container ${gapClass}`}
            animate={animateOptions}
            initial={initialOptions}
            exit={exitOptions}
        >
            <EntitySlot entityId={entityId} />
        </motion.div>
    );
}

function EntitySlot({ entityId }: { entityId: number | undefined }): ReactElement {
    if (!entityId) {
        return <CreateSlot />;
    }
    return (
        <>
            <StatusSlot entityId={entityId} className="init-slot slot-holder" status={0}>
                <EntityInstance entityId={entityId} />
            </StatusSlot>
            <div className="init-content-status">
                <StatusSlot entityId={entityId} status={1}>
                    O
                </StatusSlot>
                <StatusSlot entityId={entityId} status={2}>
                    💀
                </StatusSlot>
                <StatusSlot entityId={entityId} status={3}>
                    💀
                </StatusSlot>
                <StatusSlot entityId={entityId} status={4}>
                    💀
                </StatusSlot>
            </div>
        </>
    );
}

function getGapClass(hasEntity: boolean): string {
    if (hasEntity) {
        return "grid-gap";
    }
    return "";
}
