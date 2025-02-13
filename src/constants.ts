export const enum MagnetKind {
    Arrow = 0
}

export interface MagnetData {
    id: number;
    location: {
        left: number;
        top: number;
    },
    kind: MagnetKind;
    isDragging: boolean;
}

export interface Entity {
    id: number;
    name: string;
    kind: EntityKind;
    level: number;
    status: number;
}

export const enum EntityKind {
    PlayerCharacter = 0,
    NonPlayerCharacter = 1,
    Monster = 2,
    Hazard = 3
}

