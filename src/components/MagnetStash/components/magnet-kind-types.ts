export const enum MagnetKind {
    Arrow = 0,
    Condition = 1,
    MonsterToken = 2,
    PlayerToken = 3,
    NPCToken = 4,
    HazardToken = 5
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
    linkedEntityId?: number; // Links magnet to an entity
}
export interface MagnetKindDescriptor<PROPS> {
    allowRotate: boolean;
    children: React.ComponentType<PROPS>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any for preview components
    preview: React.ComponentType<any>;
    offset: Offset;
}
export interface MagnetKindDescriptors {
    [MagnetKind.Arrow]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.Condition]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.MonsterToken]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.PlayerToken]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.NPCToken]: MagnetKindDescriptor<MagnetKindProps>;
    [MagnetKind.HazardToken]: MagnetKindDescriptor<MagnetKindProps>;
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

