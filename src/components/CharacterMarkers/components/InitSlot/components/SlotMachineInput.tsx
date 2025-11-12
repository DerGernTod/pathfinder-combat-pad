import "./SlotMachineInput.css";
import { animate, motion, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
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
    const [dragStartIndex, setDragStartIndex] = useState(0);
    const [itemHeight, setItemHeight] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);

    const translateY = useTransform(y, function snap(){
        return snapToIndex(itemHeight, selectedIndex);
    });

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
    }, [selectedIndex, onChange]);

    useLayoutEffect(() => {
        if (!slotContainerRef.current) {
            return;
        }
        const roundedHeight = getPixelPerfectSlotHeight(slotContainerRef.current);
        setItemHeight(roundedHeight);
    }, []);

    useEffect(() => {
        setSelectedIndex(value);
    }, [value]);

    const itemStyle = useMemo(() => ({
        fontSize: `${itemHeight}px`,
        height: `${itemHeight}px`,
    }), [itemHeight])

    return (
        <div className="number-slot" ref={slotContainerRef} onBlur={handleBlur} tabIndex={0}>
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="value-view"
                        className="value-view"
                        onClick={handleValueClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={itemStyle}
                    >
                        {selectedIndex}
                    </motion.div>
                ) : (
                    <motion.div
                        key="slot-machine"
                        drag="y"
                        dragConstraints={{ bottom: -itemHeight / 2, top: -(itemHeight / 2) -itemHeight * (numbers.length - 1) }}
                        onDrag={dragCallback}
                        onDragStart={dragStartCallback}
                        onDragEnd={dragEndCallback}
                        className="slot-list"
                        style={{ y: translateY }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div key={0} className="item" style={itemStyle}>
                            &nbsp;
                        </motion.div>
                        {numbers.map((num, index) => {
                            let selectedClass = "";
                            if (index === selectedIndex) {
                                selectedClass = "selected";
                            }
                            return (
                                <motion.div key={num} style={itemStyle} className={`item ${selectedClass}`}>
                                    {num}
                                </motion.div>
                            );
                        })}
                        <motion.div key={numbers.length} className="item" style={itemStyle}>
                            &nbsp;
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
    return -itemHeight / 2 -selectedIndex * itemHeight
}
