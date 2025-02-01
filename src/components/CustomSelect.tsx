import "./CustomSelect.css";
import { useState } from "react";
import { useCallback } from "react";
import { motion } from "motion/react";

export interface CustomSelectOption {
    id: string;
    element: JSX.Element;
    onSelect(): void;
}

interface CustomSelectProps {
    options: [CustomSelectOption, ...CustomSelectOption[]];
    className?: string;
    selectedIndex: number;
}

export function CustomSelect({ options, className, selectedIndex }: CustomSelectProps): JSX.Element {
    const [selectedOption, setSelectedOption] = useState(options[selectedIndex]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleSelect = useCallback((option: CustomSelectOption) => {
        setSelectedOption(option);
        option.onSelect();
        setDropdownOpen(false);
    }, []);
    return (
        <div className={`custom-select ${className || ""}`}>
            <div
                className="selected-option"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selectedOption.element}
            </div>
            <div className={`options ${dropdownOpen ? "open" : ""}`}>
                {options.map((option) => (
                    <motion.div
                        key={option.id}
                        className="option"
                        whileTap={{ scale: 1.2 }}
                        onClick={() => handleSelect(option)}
                    >
                        {option.element}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default CustomSelect;
