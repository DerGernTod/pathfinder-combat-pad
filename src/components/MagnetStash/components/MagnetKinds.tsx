import { MagnetKindArrow, MagnetKindArrowProps } from "./MagnetKindArrow";
import { MagnetKindCondition, MagnetKindConditionPreview, MagnetKindConditionProps } from "./MagnetKindCondition";
import { ComponentType } from "react";

export const enum MagnetKind {
    Arrow = 0,
    Condition = 1
}

export interface MagnetData<T extends MagnetKind> {
    id: number;
    location: {
        left: number;
        top: number;
    },
    rotation: number;
    kind: T;
    isDragging: boolean;
    details: MagnetKindDescriptors[T]["children"] extends ComponentType<infer P>
        ? P extends MagnetKindProps
            ? P["details"] : never
        : never;
}

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

