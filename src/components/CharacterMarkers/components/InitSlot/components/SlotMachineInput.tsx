import "./SlotMachineInput.css";
import { PanInfo, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

const NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1); // Adjust range as needed

interface SlotNumberInputProps {
    onChange(this: void, num: number): void;
}

export default function SlotNumberInput({ onChange }: SlotNumberInputProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dragStartIndex, setDragStartIndex] = useState(0);
    const [itemHeight, setItemHeight] = useState(0);
    const slotContainerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);
    
    const translateY = useTransform(y, function snap(){
        return snapToIndex(itemHeight, selectedIndex);
    });
    
    const dragCallback = useCallback(function handleDrag(_: unknown, info: PanInfo) {
        const delta = dragStartIndex - Math.round(info.offset.y / itemHeight);
        const newIndex = Math.min(NUMBERS.length - 1, Math.max(0, (delta)));
        setSelectedIndex(newIndex);
    }, [dragStartIndex, itemHeight]);

    const dragStartCallback = useCallback(function handleDragStart() {
        setDragStartIndex(selectedIndex);
    }, [selectedIndex]);

    const dragEndCallback = useCallback(function handleDragEnd() {
        animate(translateY, [translateY.get(), snapToIndex(itemHeight, selectedIndex)]);
        onChange(selectedIndex + 1);
    }, [selectedIndex, translateY, itemHeight, onChange]);

    useLayoutEffect(() => {
        if (!slotContainerRef.current) {
            return;
        }
        const roundedHeight = getPixelPerfectSlotHeight(slotContainerRef.current);
        setItemHeight(roundedHeight);
    }, []);
    
    const itemStyle = useMemo(() => {
        return {
            fontSize: `${itemHeight}px`,
            height: `${itemHeight}px`,
        };
    }, [itemHeight])
    
    return (
        <div className="number-slot" ref={slotContainerRef}>
            <motion.div
                drag="y"
                dragConstraints={{ bottom: -itemHeight / 2, top: -(itemHeight / 2) -itemHeight * (NUMBERS.length - 1) }}
                onDrag={dragCallback}
                onDragStart={dragStartCallback}
                onDragEnd={dragEndCallback}
                className="slot-list"
                style={{ y: translateY }}
            >
                <motion.div key={0} className="item" style={itemStyle}>
                    &nbsp;
                </motion.div>
                {NUMBERS.map((num, index) => {
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
                <motion.div key={NUMBERS.length} className="item" style={itemStyle}>
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