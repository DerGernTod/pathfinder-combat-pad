import { MagnetKindCondition, MagnetKindConditionPreview } from "./MagnetKindCondition";
import { MagnetKind } from "../../../constants";
import { MagnetKindArrow } from "./MagnetKindArrow";

export const MagnetKinds: MagnetKindDescriptors = {
    [MagnetKind.Arrow]: {
        allowRotate: true,
        children: MagnetKindArrow,
        offset: { left: 25, top: 25 },
        preview: MagnetKindArrow,
    },
    [MagnetKind.Condition]: {
        allowRotate: false,
        children: MagnetKindCondition,
        offset: { left: 25, top: 25 },
        preview: MagnetKindConditionPreview,
    }
};

export interface MagnetKindDescriptor {
    allowRotate: boolean;
    children: React.ComponentType<MagnetKindProps>;
    preview: React.ComponentType<any>;
    offset: Offset;
}

export type MagnetKindDescriptors = {
    [key in MagnetKind]: MagnetKindDescriptor;
};

export interface MagnetKindProps {
    className: string;
    id: number;
    details?: unknown;
}

export interface Offset {
    left: number;
    top: number;
}

