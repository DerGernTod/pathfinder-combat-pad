import {
    numberSlot,
    slotList,
    item,
    selected,
    valueView
} from "./SlotMachineInput.css.ts";
import { animate, motion, useMotionValue, AnimatePresence } from "motion/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { PanInfo, MotionValue } from "motion/react";

// Constants
const ANIMATION_DURATION = 0.25;
const SNAP_OFFSET = 20;
const COLLAPSED_HEIGHT = "2.5rem";
const EXPANDED_HEIGHT = "5rem";
const PORTAL_Z_INDEX = 1000;
const DRAG_CONSTRAINT_DIVISOR = 2;

interface SlotNumberInputProps {
    onChange(this: void, num: number): void;
    max: number;
    value: number;
}

interface ExpandedSlotMachineProps {
    isExpanded: boolean;
    portalPosition: { top: number; left: number } | null;
    itemHeight: number;
    selectedIndex: number;
    numbers: number[];
    translateY: MotionValue<number>;
    onDrag: (event: unknown, info: PanInfo) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    itemStyle: { fontSize: string; height: string };
    onExitComplete: () => void;
    onBlur: () => void;
}

export default SlotNumberInputMemo;

function SlotNumberInputMemo({ onChange, max, value }: SlotNumberInputProps) {
    const numbers = Array.from({ length: max }, (_, i) => i);
    const [selectedIndex, setSelectedIndex] = useState(value);

    const {
        slotContainerRef,
        itemHeight,
        isExpanded,
        showPortal,
        portalPosition,
        translateY,
        itemStyle,
        handleValueClick,
        handleBlur,
        handleExitComplete
    } = useSlotMachineUI({ value, numbers, onChange });

    const { dragCallback, dragStartCallback, dragEndCallback } = useSlotMachineDrag({
        isExpanded,
        itemHeight,
        numbers,
        selectedIndex,
        setSelectedIndex,
        translateY,
        onChange
    });

    return (
        <div className={numberSlot.collapsed} ref={slotContainerRef} tabIndex={0}>
            <div key="collapsed" className={valueView} onClick={handleValueClick}>
                {numbers[selectedIndex]}
            </div>
            {showPortal && createPortal(
                <ExpandedSlotMachine
                    isExpanded={isExpanded}
                    portalPosition={portalPosition}
                    itemHeight={itemHeight}
                    selectedIndex={selectedIndex}
                    numbers={numbers}
                    translateY={translateY}
                    onDrag={dragCallback}
                    onDragStart={dragStartCallback}
                    onDragEnd={dragEndCallback}
                    itemStyle={itemStyle}
                    onExitComplete={handleExitComplete}
                    onBlur={handleBlur}
                />,
                document.body
            )}
        </div>
    );
}

function useSlotMachineUI({ value, numbers, onChange }: { value: number; numbers: number[]; onChange: (n: number) => void }) {
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const [itemHeight, setItemHeight] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPortal, setShowPortal] = useState(false);
    const [portalPosition, setPortalPosition] = useState<{ top: number; left: number } | null>(null);
    const translateY = useMotionValue(0);
    const entranceDoneRef = useRef(false);
    const [selectedIndex, setSelectedIndex] = useState(value);

    useLayoutEffect(() => {
        if (!slotContainerRef.current) return;
        const roundedHeight = calculateSlotItemHeight(slotContainerRef.current);
        setItemHeight(roundedHeight);
    }, []);

    useLayoutEffect(() => {
        if (isExpanded && slotContainerRef.current) {
            const rect = slotContainerRef.current.getBoundingClientRect();
            setPortalPosition({ top: rect.top, left: rect.left });
        } else {
            setPortalPosition(null);
        }
    }, [isExpanded]);

    useLayoutEffect(() => {
        if (showPortal && isExpanded && !entranceDoneRef.current) {
            void animate(
                translateY,
                [calculateSnapPosition(itemHeight, selectedIndex) - SNAP_OFFSET, calculateSnapPosition(itemHeight, selectedIndex)],
                { duration: ANIMATION_DURATION }
            ).finished.then(() => {
                entranceDoneRef.current = true;
            });
        } else if (!isExpanded) {
            translateY.set(calculateSnapPosition(itemHeight, selectedIndex));
        }
    }, [itemHeight, selectedIndex, translateY, isExpanded, showPortal]);

    useEffect(() => {
        if (isExpanded) {
            entranceDoneRef.current = false;
            setShowPortal(true);
        }
    }, [isExpanded]);

    const itemStyle = {
        fontSize: `${itemHeight}px`,
        height: `${itemHeight}px",
    };

    const handleValueClick = () => setIsExpanded(true);
    const handleBlur = () => {
        setIsExpanded(false);
        onChange(selectedIndex);
    };
    const handleExitComplete = () => setShowPortal(false);

    return {
        slotContainerRef,
        itemHeight,
        isExpanded,
        showPortal,
        portalPosition,
        translateY,
        itemStyle,
        handleValueClick,
        handleBlur,
        handleExitComplete,
        selectedIndex,
        setSelectedIndex
    };
}

function useSlotMachineDrag({
    isExpanded,
    itemHeight,
    numbers,
    selectedIndex,
    setSelectedIndex,
    translateY,
    onChange
}: {
    isExpanded: boolean;
    itemHeight: number;
    numbers: number[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    translateY: MotionValue<number>;
    onChange: (num: number) => void;
}) {
    const [dragStartIndex, setDragStartIndex] = useState(-1);

    const dragCallback = (_: unknown, info: PanInfo) => {
        if (!isExpanded) return;
        const delta = dragStartIndex - Math.round(info.offset.y / itemHeight);
        const newIndex = Math.min(numbers.length - 1, Math.max(0, delta));
        setSelectedIndex(newIndex);
    };

    const dragStartCallback = () => {
        if (!isExpanded) return;
        setDragStartIndex(selectedIndex);
    };

    const dragEndCallback = () => {
        if (!isExpanded) return;
        animate(translateY, [translateY.get(), calculateSnapPosition(itemHeight, selectedIndex)]);
        onChange(selectedIndex);
    };

    return {
        dragCallback,
        dragStartCallback,
        dragEndCallback
    };
}

function calculateSlotItemHeight(container: HTMLDivElement): number {
    const bounds = container.getBoundingClientRect();
    const roundedHeight = Math.round(bounds.height / DRAG_CONSTRAINT_DIVISOR);
    if (roundedHeight % DRAG_CONSTRAINT_DIVISOR === 0) {
        return roundedHeight;
    }
    return roundedHeight - 1;
}

function calculateSnapPosition(itemHeight: number, selectedIndex: number): number {
    return SNAP_OFFSET + -itemHeight / DRAG_CONSTRAINT_DIVISOR - selectedIndex * itemHeight;
}

const SlotList: React.FC<{
    numbers: number[];
    selectedIndex: number;
    itemStyle: { fontSize: string; height: string };
    translateY: MotionValue<number>;
    itemClass: string;
    selectedClassName: string;
    dragHandlers: { onDrag: (e: unknown, i: PanInfo) => void; onDragStart: () => void; onDragEnd: () => void };
    itemHeight: number;
}> = ({ numbers, selectedIndex, itemStyle, translateY, itemClass, selectedClassName, dragHandlers, itemHeight }) => {
    return (
        <motion.div
            key="expanded"
            className={slotList}
            drag="y"
            style={{ y: translateY }}
            exit={{ y: calculateSnapPosition(itemHeight, selectedIndex) - SNAP_OFFSET }}
            transition={{ duration: ANIMATION_DURATION }}
            dragConstraints={{ bottom: -itemHeight / DRAG_CONSTRAINT_DIVISOR, top: -(itemHeight / DRAG_CONSTRAINT_DIVISOR) - itemHeight * (numbers.length - 1) }}
            onDrag={dragHandlers.onDrag}
            onDragStart={dragHandlers.onDragStart}
      
