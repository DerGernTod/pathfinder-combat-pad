export const enum MagnetKind {
    Arrow = 0,
    Condition = 1,
    MonsterToken = 2
}

export interface MagnetData<T extends MagnetKind> {
    id: number;
    location: {
        left: number;
        top: number;
    };
    rotation: number;
    kind: T;
    isDragging: boolean;
    details: string;
}
export interface MagnetKindDescriptor<PROPS> {
    allowRotate: boolean;
    children: React.ComponentType<PROPS>;
    preview: React.ComponentType<any>;
    offset: Offset;
}
export interface MagnetKindDescriptors {
    [MagnetKind.Arrow]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.Condition]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.MonsterToken]: MagnetKindDescriptor<MagnetKindProps>;
}
export interface MagnetKindProps {
    className: string;
    id: number;
    details: string;
}
export interface Offset {
    left: number;
    top: number;
}

