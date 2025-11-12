import { markerHeading } from "./MarkerHeading.css.ts";
import type { ReactElement } from "react";

export function MarkerHeading({ classes, children }: { classes?: string, children: string | ReactElement | ReactElement[] }): ReactElement {
    return (
        <h1 className={`${markerHeading} ${classes || ""}`}>{children}</h1>
    );
}
