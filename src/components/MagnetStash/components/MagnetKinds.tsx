import { MagnetKind, MagnetKindDescriptors } from "./magnet-kind-types";
import { MagnetKindCondition, MagnetKindConditionPreview } from "./MagnetKindCondition";
import { MagnetKindArrow } from "./MagnetKindArrow";

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


