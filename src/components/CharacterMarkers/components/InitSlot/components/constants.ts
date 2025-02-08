import { EntityKind } from "../../../../../constants";

export const KIND_LOOKUP = {
    [EntityKind.PlayerCharacter]: "PC",
    [EntityKind.NonPlayerCharacter]: "NPC",
    [EntityKind.Monster]: "MON",
    [EntityKind.Hazard]: "HAZ",
};
