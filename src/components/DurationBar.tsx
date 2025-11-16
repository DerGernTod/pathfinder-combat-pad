import "./DurationBar.css"; // Assuming you will add some CSS for styling
import type { ReactElement } from "react";

const nums: unknown[] = Array(10);

export function DurationBar(): ReactElement {
    return (
        <>
            <div className="pad" />
            <div className="duration-bar">
                <div className="duration-label">
                    <div className="rotated-text">DURATION</div>
                </div>
                <div className="duration-numbers">
                    {[...nums].map((_, i) => (
                        <div key={`${i}`} className="duration-number">
                            {10 - i}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

