import {
    numberSlot,
    slotList,
    item,
    selected,
    valueView
} from "./SlotMachineInput.css.ts";
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
    }), [itemHeight]);

    return (
        <div className={numberSlot} ref={slotContainerRef} tabIndex={0} onBlur={handleBlur}>
            <AnimatePresence initial={false}>
                {isExpanded ? (
                    <motion.div
                        className={slotList}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        drag="y"
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
                ) : (
                    <div className={valueView} onClick={handleValueClick}>
                        {numbers[selectedIndex]}
                    </div>
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
