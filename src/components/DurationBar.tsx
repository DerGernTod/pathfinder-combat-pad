import ./DurationBar.css;
import type { ReactElement } from react;

const nums = Array.from({ length: 10 });

export function DurationBar(): ReactElement {
    return (
        <div className=duration-bar>
            <div className=pad />
            <div className=duration-label rotated-text>DURATION</div>
            {nums.map((_, i) => {
                const value = 10 - i;
                return (
                    <div key={'duration-' + value} className=duration-number>
                        {value}
                    </div>
                );
            })}
        </div>
    );
}
