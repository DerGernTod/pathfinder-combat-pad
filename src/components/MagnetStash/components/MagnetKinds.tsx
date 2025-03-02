import "./MagnetKinds.css";
import { MagnetKind } from "../../../constants";
import { MagnetKindArrow } from "./MagnetKindArrow";

export const MagnetKinds: MagnetKindDescriptors = {
    [MagnetKind.Arrow]: {
        allowRotate: true,
        children: MagnetKindArrow,
        offset: { left: 25, top: 25 },
    },
    [MagnetKind.Condition]: {
        allowRotate: false,
        children: ({ className }) => (<div className={`condition-marker apply-transitions ${className}`} />),
        offset: { left: 25, top: 25 }
    }
};

export interface MagnetKindDescriptor {
    allowRotate: boolean;
    children: React.ComponentType<{ className: string; }>;
    offset: Offset;
}

export type MagnetKindDescriptors = {
    [key in MagnetKind]: MagnetKindDescriptor;
};

export interface Offset {
    left: number;
    top: number;
}

