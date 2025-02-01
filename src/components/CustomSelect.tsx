import React, { useState } from "react";
import "./CustomSelect.css"; // Import your custom styles

const options = [
    { value: "option1", label: "Option 1", icon: "🔧" },
    { value: "option2", label: "Option 2", icon: "⚙️" },
    { value: "option3", label: "Option 3", icon: "🔩" },
    { value: "option4", label: "Option 4", icon: "🛠️" },
];
interface CustomSelectProps {
    options: { element: JSX.Element, props: }
}
export function CustomSelect(): JSX.Element {
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleSelect = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="custom-select">
            <div
                className="selected-option"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selectedOption.icon} {selectedOption.label}
            </div>
            <div className="options">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className="option"
                        onClick={() => handleSelect(option)}
                    >
                        {option.icon} {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomSelect;
