// oxlint-disable react/jsx-max-depth
import type { ReactElement } from "react";

export function ShadowFilter({ id }: { id: string }): ReactElement {
    return (
        <>
            {/* Keep filter content in separate component to reduce JSX nesting depth in token files */}
            <defs>
                <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodOpacity="0.8" />
                </filter>
            </defs>
        </>
    );
}
