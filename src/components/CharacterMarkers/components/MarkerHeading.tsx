import "./MarkerHeading.css";
export function MarkerHeading({ classes, children }: { classes: string, children: string | JSX.Element | JSX.Element[] }): JSX.Element {
    return (
        <h1 className={`marker-heading ${classes}`}>{children}</h1>
    );
}