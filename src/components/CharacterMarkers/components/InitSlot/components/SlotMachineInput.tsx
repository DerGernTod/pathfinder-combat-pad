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
import type { PanInfo } from "motion/react";


interface SlotNumberInputProps {
    onChange(this: void, num: number): void;
    max: number;
    value: number;
}

export default memo(SlotNumberInputMemo);

function SlotNumberInputMemo({ onChange, max, value }: SlotNumberInputProps) {
    const numbers = Array.from({ length: max }, (_, i) => i);
    const [selectedIndex, setSelectedIndex] = useState(value);
    const [dragStartIndex, setDragStartIndex] = useState(-1);
    const [itemHeight, setItemHeight] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPortal, setShowPortal] = useState(false);
    const [portalPosition, setPortalPosition] = useState<{ top: number; left: number } | null>(null);
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const translateY = useMotionValue(0);
    const entranceDoneRef = useRef(false);

    // useEffect(() => {
    //     if (translateY.isAnimating() || (showPortal && !isExpanded)) {
    //         return;
    //     }
    //     translateY.set(snapToIndex(itemHeight, selectedIndex));
    // }, [itemHeight, selectedIndex, portalPosition, translateY, isExpanded, showPortal]);

    const dragCallback = useCallback(function handleDrag(_: unknown, info: PanInfo) {
        if (!isExpanded) {
            return;
        }
        const delta = dragStartIndex - Math.round(info.offset.y / itemHeight);
        const newIndex = Math.min(numbers.length - 1, Math.max(0, (delta)));
        setSelectedIndex(newIndex);
    }, [dragStartIndex, itemHeight, numbers, isExpanded]);

    const dragStartCallback = useCallback(function handleDragStart() {
        if (!isExpanded) {
            return;
        }
        setDragStartIndex(selectedIndex);
    }, [selectedIndex, isExpanded]);

    const dragEndCallback = useCallback(function handleDragEnd() {
        if (!isExpanded) {
            return;
        }
        animate(translateY, [translateY.get(), snapToIndex(itemHeight, selectedIndex)]);
        onChange(selectedIndex);
    }, [selectedIndex, translateY, itemHeight, onChange, isExpanded]);

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
        const roundedHeight = getPixelPerfectSlotHeight(slotContainerRef.current);
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
                [snapToIndex(itemHeight, selectedIndex) - 20, snapToIndex(itemHeight, selectedIndex)],
                { duration: 0.25 }
            ).finished.then(() => {
                entranceDoneRef.current = true;
            });
        } else if (!isExpanded) {
            // Reset when closing, just in case
            translateY.set(snapToIndex(itemHeight, selectedIndex));
        }
    }, [itemHeight, selectedIndex, translateY, isExpanded, showPortal, dragStartIndex]);

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

    console.log("translateY:", translateY.get());

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
                <AnimatePresence onExitComplete={() => setShowPortal(false)}>
                    {isExpanded && (
                        <motion.div
                            className={numberSlot.expanded}
                            initial={{ height: "2.5rem", top: (portalPosition?.top || 0) }}
                            animate={{ height: "5rem", top: (portalPosition?.top || 0) - 20 }}
                            exit={{ height: "2.5rem", top: (portalPosition?.top || 0) }}
                            transition={{ duration: 0.25 }}
                            tabIndex={0}
                            onBlur={handleBlur}
                            style={{ position: "absolute", left: portalPosition?.left || 0, zIndex: 1000 }}
                        >
                            <motion.div
                                key="expanded"
                                className={slotList}
                                drag="y"
                                style={{ y: translateY }}
                                exit={{ y: snapToIndex(itemHeight, selectedIndex) - 20 }}
                                transition={{ duration: 0.25 }}
                                dragConstraints={{ bottom: -itemHeight / 2, top: -(itemHeight / 2) -itemHeight * (numbers.length - 1) }}
                                onDrag={dragCallback}
                                onDragStart={dragStartCallback}
                                onDragEnd={dragEndCallback}
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
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

function getPixelPerfectSlotHeight(parent: HTMLDivElement): number {
    const bounds = parent.getBoundingClientRect();
    const roundedHeight = Math.round(bounds.height / 2);
    if (roundedHeight % 2 === 0) {
        return roundedHeight;
    }
    return roundedHeight - 1;
}

function snapToIndex(itemHeight: number, selectedIndex: number): number {
    return 20 + -itemHeight / 2 -selectedIndex * itemHeight
}
