import "./MarkerHeading.css";
import type { ReactElement } from "react";

export function MarkerHeading({ classes, children }: { classes: string, children: string | ReactElement | ReactElement[] }): ReactElement {
    return (
        <h1 className={`marker-heading ${classes}`}>{children}</h1>
    );
}
