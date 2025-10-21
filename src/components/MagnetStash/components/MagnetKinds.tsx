import { MagnetKindCondition, MagnetKindConditionPreview } from "./MagnetKindCondition";
import { MagnetKind } from "./magnet-kind-types";
import { MagnetKindArrow } from "./MagnetKindArrow";
import type { MagnetKindDescriptors } from "./magnet-kind-types";
import { MagnetKindMonsterToken } from "./MagnetKindMonsterToken";

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
    }
};


