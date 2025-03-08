import { MagnetKindArrow, MagnetKindArrowProps } from "./MagnetKindArrow";
import { MagnetKindCondition, MagnetKindConditionPreview, MagnetKindConditionProps } from "./MagnetKindCondition";
import { MagnetKind } from "../../../constants";

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

export interface MagnetKindDescriptor<PROPS> {
    allowRotate: boolean;
    children: React.ComponentType<PROPS>;
    preview: React.ComponentType<any>;
    offset: Offset;
}

export interface MagnetKindDescriptors {
    [MagnetKind.Arrow]: MagnetKindDescriptor<MagnetKindArrowProps>;
    [MagnetKind.Condition]: MagnetKindDescriptor<MagnetKindConditionProps>;
}

export interface MagnetKindProps {
    className: string;
    id: number;
    details?: unknown;
}

export interface Offset {
    left: number;
    top: number;
}

