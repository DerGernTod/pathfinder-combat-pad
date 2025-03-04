import { MagnetKindProps } from "./MagnetKinds";

export function MagnetKindArrow({ className }: MagnetKindProps) {
    return (
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon className={`apply-transitions ${className}`} points="50,10 90,90 50,70 10,90" fill="gray" />
        </svg>
        // <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        //     <path className={`apply-transitions ${className}`} d="m21.707 11.293-7-7A1 1 0 0 0 13 5v3H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10v3a1 1 0 0 0 1.707.707l7-7a1 1 0 0 0 0-1.414z" style={{fill: "#ff8e31"}} data-name="Right"/>
        // </svg>
    );
}