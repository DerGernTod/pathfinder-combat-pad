export interface Entity {
    id: number;
    name: string;
    kind: EntityKind;
    level: number;
    status: number;
    damageTaken: number;
}

export const enum EntityKind {
    PlayerCharacter = 0,
    NonPlayerCharacter = 1,
    Monster = 2,
    Hazard = 3
}

