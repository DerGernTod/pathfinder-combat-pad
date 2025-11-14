import {
    numberSlot,
    slotList,
    item,
    selected,
    valueView
} from "./SlotMachineInput.css.ts";
import { animate, motion, useMotionValue, AnimatePresence } from "motion/react";
import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
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
}

export default memo(SlotNumberInputMemo);

function SlotNumberInputMemo({ onChange, max, value }: SlotNumberInputProps) {
    const numbers = Array.from({ length: max }, (_, i) => i);
    const [selectedIndex, setSelectedIndex] = useState(value);
    const [itemHeight, setItemHeight] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPortal, setShowPortal] = useState(false);
    const [portalPosition, setPortalPosition] = useState<{ top: number; left: number } | null>(null);
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const translateY = useMotionValue(0);
    const entranceDoneRef = useRef(false);

    const { dragCallback, dragStartCallback, dragEndCallback } = useSlotMachineDrag({
        isExpanded,
        itemHeight,
        numbers,
        selectedIndex,
        setSelectedIndex,
        translateY,
        onChange
    });

    const handleValueClick = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsExpanded(false);
        onChange(selectedIndex);
    }, [onChange, selectedIndex]);

    useLayoutEffect(() => {
        if (!slotContainerRef.current) {
            return;
        }
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
        // This effect runs whenever the component is visible and `translateY` needs to be set.
        // Use `animate` here to explicitly transition the MotionValue.
        if (showPortal && isExpanded && !entranceDoneRef.current) {
            void animate(
                translateY,
                [calculateSnapPosition(itemHeight, selectedIndex) - SNAP_OFFSET, calculateSnapPosition(itemHeight, selectedIndex)],
                { duration: ANIMATION_DURATION }
            ).finished.then(() => {
                entranceDoneRef.current = true;
            });
        } else if (!isExpanded) {
            // Reset when closing, just in case
            translateY.set(calculateSnapPosition(itemHeight, selectedIndex));
        }
    }, [itemHeight, selectedIndex, translateY, isExpanded, showPortal]);

    useEffect(() => {
        if (isExpanded) {
            entranceDoneRef.current = false;
            setShowPortal(true);
        }
    }, [isExpanded]);

    const itemStyle = useMemo(() => ({
        fontSize: `${itemHeight}px`,
        height: `${itemHeight}px`,
    }), [itemHeight]);

    const handleExitComplete = useCallback(() => {
        setShowPortal(false);
    }, []);

    return (
        <div className={numberSlot.collapsed} ref={slotContainerRef} tabIndex={0} onBlur={handleBlur}>
            <div
                key="collapsed"
                className={valueView}
                onClick={handleValueClick}
            >
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
                />,
                document.body
            )}
        </div>
    );
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

    const dragCallback = useCallback((_: unknown, info: PanInfo) => {
        if (!isExpanded) {
            return;
        }
        const delta = dragStartIndex - Math.round(info.offset.y / itemHeight);
        const newIndex = Math.min(numbers.length - 1, Math.max(0, delta));
        setSelectedIndex(newIndex);
    }, [dragStartIndex, itemHeight, numbers, isExpanded, setSelectedIndex]);

    const dragStartCallback = useCallback(() => {
        if (!isExpanded) {
            return;
        }
        setDragStartIndex(selectedIndex);
    }, [selectedIndex, isExpanded]);

    const dragEndCallback = useCallback(() => {
        if (!isExpanded) {
            return;
        }
        animate(translateY, [translateY.get(), calculateSnapPosition(itemHeight, selectedIndex)]);
        onChange(selectedIndex);
    }, [selectedIndex, translateY, itemHeight, onChange, isExpanded]);

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

const ExpandedSlotMachine = memo<ExpandedSlotMachineProps>(({
    isExpanded,
    portalPosition,
    itemHeight,
    selectedIndex,
    numbers,
    translateY,
    onDrag,
    onDragStart,
    onDragEnd,
    itemStyle,
    onExitComplete
}) => (
    <AnimatePresence onExitComplete={onExitComplete}>
        {isExpanded && (
            <motion.div
                className={numberSlot.expanded}
                initial={{ height: COLLAPSED_HEIGHT, top: (portalPosition?.top || 0) }}
                animate={{ height: EXPANDED_HEIGHT, top: (portalPosition?.top || 0) - SNAP_OFFSET }}
                exit={{ height: COLLAPSED_HEIGHT, top: (portalPosition?.top || 0) }}
                transition={{ duration: ANIMATION_DURATION }}
                tabIndex={0}
                style={{ position: "absolute", left: portalPosition?.left || 0, zIndex: PORTAL_Z_INDEX }}
            >
                <motion.div
                    key="expanded"
                    className={slotList}
                    drag="y"
                    style={{ y: translateY }}
                    exit={{ y: calculateSnapPosition(itemHeight, selectedIndex) - SNAP_OFFSET }}
                    transition={{ duration: ANIMATION_DURATION }}
                    dragConstraints={{ bottom: -itemHeight / DRAG_CONSTRAINT_DIVISOR, top: -(itemHeight / DRAG_CONSTRAINT_DIVISOR) -itemHeight * (numbers.length - 1) }}
                    onDrag={onDrag}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                >
                    <motion.div key={0} className={item} style={itemStyle}>
                        &nbsp;
                    </motion.div>
                    {numbers.map((num, index) => {
                        let selectedClass = "";
                        if (index === selectedIndex) {
                            selectedClass = selected;
                        }
                        return (
                            <motion.div key={num} style={itemStyle} className={`${item} ${selectedClass}`}>
                                {num}
                            </motion.div>
                        );
                    })}
                    <motion.div key={numbers.length} className={item} style={itemStyle}>
                        &nbsp;
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
));
