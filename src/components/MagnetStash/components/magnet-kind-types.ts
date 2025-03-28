import { ComponentType } from "react";

export const enum MagnetKind {
    Arrow = 0,
    Condition = 1
}export interface MagnetData<T extends MagnetKind> {
    id: number;
    location: {
        left: number;
        top: number;
    };
    rotation: number;
    kind: T;
    isDragging: boolean;
    details: MagnetKindDescriptors[T]["children"] extends ComponentType<infer P> ? P extends MagnetKindProps ? P["details"] : never : never;
}
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
export interface MagnetKindConditionProps extends MagnetKindProps {
    details: string;
}
export interface Offset {
    left: number;
    top: number;
}
export interface MagnetKindArrowProps extends MagnetKindProps {
    details: string;
}

