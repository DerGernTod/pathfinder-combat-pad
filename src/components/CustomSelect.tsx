import "./CustomSelect.css";
import { useState } from "react";
import { useCallback } from "react";

interface CustomSelectOption {
    id: string;
    element: JSX.Element;
    onSelect(): void;
}

interface CustomSelectProps {
    options: CustomSelectOption[];
}

export function CustomSelect({ options }: CustomSelectProps): JSX.Element {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = useCallback((option: CustomSelectOption) => {
        setSelectedOption(option);
        option.onSelect();
        setDropdownOpen(false);
    }, []);

    return (
        <div className="custom-select">
            <div
                className="selected-option"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selectedOption.element}
            </div>
            <div className={`options ${dropdownOpen ? "open" : ""}`}>
                {options.map((option) => (
                    <div
                        key={option.id}
                        className="option"
                        onClick={() => handleSelect(option)}
                    >
                        {option.element}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomSelect;
