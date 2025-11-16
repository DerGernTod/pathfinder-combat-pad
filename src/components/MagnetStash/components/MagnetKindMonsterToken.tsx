import type { ReactElement } from "react";
import type { MagnetKindProps } from "./magnet-kind-types";

export function MagnetKindMonsterToken({ className, details }: MagnetKindProps): ReactElement {
    return (
        <svg
            height="60"
            width="60"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="-13 -13 65 65"
            xmlSpace="preserve"
            fill={details || "#C0392B"}
            // stroke={details}
            stroke="#0f0f0f"
            strokeWidth="1.55">
            <path
                className={`apply-transitions ${className}`}
                d="
    M 29 13 A 16 16 0 1 0 -3 13 A 16 16 0 1 0 29 13 Z

    M 13 8
    C 8 8 7 11 7 14
    L 7 17
    C 7 21 10 22 13 20
    C 16 22 19 21 19 17
    L 19 14
    C 19 11 18 8 13 8 Z

    M 9 12 L 11 12 L 11 14 L 9 14 Z

    M 15 12 L 17 12 L 17 14 L 15 14 Z

    M 13 16 L 12 18 L 14 18 Z
    "
            />
        </svg>


    );
}
