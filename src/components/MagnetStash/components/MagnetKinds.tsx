import { MagnetKindCondition, MagnetKindConditionPreview } from "./MagnetKindCondition";
import { MagnetKind } from "./magnet-kind-types";
import { MagnetKindArrow } from "./MagnetKindArrow";
import type { MagnetKindDescriptors } from "./magnet-kind-types";
import { MagnetKindMonsterToken } from "./MagnetKindMonsterToken";
import { MagnetKindPlayerToken } from "./MagnetKindPlayerToken";
import { MagnetKindNPCToken } from "./MagnetKindNPCToken";
import { MagnetKindHazardToken } from "./MagnetKindHazardToken";

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
    },
    [MagnetKind.MonsterToken]: {
        allowRotate: false,
        children: MagnetKindMonsterToken,
        offset: { left: 25, top: 25 },
        preview: MagnetKindMonsterToken
    },
    [MagnetKind.PlayerToken]: {
        allowRotate: false,
        children: MagnetKindPlayerToken,
        offset: { left: 25, top: 25 },
        preview: MagnetKindPlayerToken
    },
    [MagnetKind.NPCToken]: {
        allowRotate: false,
        children: MagnetKindNPCToken,
        offset: { left: 25, top: 25 },
        preview: MagnetKindNPCToken
    },
    [MagnetKind.HazardToken]: {
        allowRotate: false,
        children: MagnetKindHazardToken,
        offset: { left: 25, top: 25 },
        preview: MagnetKindHazardToken
    }
};



