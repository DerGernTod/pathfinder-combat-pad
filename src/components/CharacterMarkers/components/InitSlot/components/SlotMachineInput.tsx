import "./SlotMachineInput.css";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PanInfo } from "motion/react";


interface SlotNumberInputProps {
    onChange(this: void, num: number): void;
    max: number;
    value: number;
}

export default function SlotNumberInput({ onChange, max, value }: SlotNumberInputProps) {
    const numbers = Array.from({ length: max }, (_, i) => i);
    const [selectedIndex, setSelectedIndex] = useState(value);
    const [dragStartIndex, setDragStartIndex] = useState(0);
    const [itemHeight, setItemHeight] = useState(0);
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);

    const translateY = useTransform(y, function snap(){
        return snapToIndex(itemHeight, selectedIndex);
    });

    const dragCallback = useCallback(function handleDrag(_: unknown, info: PanInfo) {
        const delta = dragStartIndex - Math.round(info.offset.y / itemHeight);
        const newIndex = Math.min(numbers.length - 1, Math.max(0, (delta)));
        setSelectedIndex(newIndex);
    }, [dragStartIndex, itemHeight, numbers]);

    const dragStartCallback = useCallback(function handleDragStart() {
        setDragStartIndex(selectedIndex);
    }, [selectedIndex]);

    const dragEndCallback = useCallback(function handleDragEnd() {
        animate(translateY, [translateY.get(), snapToIndex(itemHeight, selectedIndex)]);
        onChange(selectedIndex);
    }, [selectedIndex, translateY, itemHeight, onChange]);

    useLayoutEffect(() => {
        if (!slotContainerRef.current) {
            return;
        }
        const roundedHeight = getPixelPerfectSlotHeight(slotContainerRef.current);
        setItemHeight(roundedHeight);
    }, []);

    const itemStyle = useMemo(() => ({
        fontSize: `${itemHeight}px`,
        height: `${itemHeight}px`,
    }), [itemHeight])

    return (
        <div className="number-slot" ref={slotContainerRef}>
            <motion.div
                drag="y"
                dragConstraints={{ bottom: -itemHeight / 2, top: -(itemHeight / 2) -itemHeight * (numbers.length - 1) }}
                onDrag={dragCallback}
                onDragStart={dragStartCallback}
                onDragEnd={dragEndCallback}
                className="slot-list"
                style={{ y: translateY }}
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
