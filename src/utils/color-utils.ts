import { EntityKind } from "../constants";

// Primary type colors extracted from CSS (InitSlot.css)
const PRIMARY_TYPE_COLORS = {
    [EntityKind.PlayerCharacter]: "#7fa6b3", // PC blue
    [EntityKind.NonPlayerCharacter]: "#82a687", // NPC green
    [EntityKind.Monster]: "#8f554a", // Monster brown
    [EntityKind.Hazard]: "#b39f9f", // Hazard pink
};

interface HSV {
    h: number; // 0-360
    s: number; // 0-100
    v: number; // 0-100
}

/* --- Hex / RGB / HSV helpers (split to satisfy max-statements) --- */
function parseHexToRgb(hex: string) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return { r, g, b };
}

function computeMaxMinDelta(r: number, g: number, b: number) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    return { max, min, delta };
}

function computeHueFromRgb(args: {
    max: number;
    r: number;
    g: number;
    b: number;
    delta: number;
}): number {
    const { max, r, g, b, delta } = args;
    if (delta === 0) {
        return 0;
    }

    if (max === r) {
        return ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    }

    if (max === g) {
        return ((b - r) / delta + 2) * 60;
    }

    return ((r - g) / delta + 4) * 60;
}

function computeSFrom(max: number, delta: number): number {
    if (delta === 0) {
        return 0;
    }
    return (delta / max) * 100;
}

function rgbToHsv(r: number, g: number, b: number): HSV {
    const { max, delta } = computeMaxMinDelta(r, g, b);
    const v = max * 100;
    const s = computeSFrom(max, delta);
    const h = computeHueFromRgb({ max, r, g, b, delta });
    return { h, s, v };
}

export function hexToHSV(hex: string): HSV {
    const { r, g, b } = parseHexToRgb(hex);
    return rgbToHsv(r, g, b);
}

function sectorRgb(h: number, c: number, x: number) {
    // Use a compact mapping to reduce statement count for the linter
    const sector = Math.floor((((h % 360) + 360) % 360) / 60);
    const map = [
        { r: c, g: x, b: 0 },
        { r: x, g: c, b: 0 },
        { r: 0, g: c, b: x },
        { r: 0, g: x, b: c },
        { r: x, g: 0, b: c },
        { r: c, g: 0, b: x },
    ];
    return map[sector] as { r: number; g: number; b: number };
}

function hsvToRgb(h: number, sPercent: number, vPercent: number) {
    const s = sPercent / 100;
    const v = vPercent / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    const base = sectorRgb(h, c, x);
    return { r: base.r + m, g: base.g + m, b: base.b + m };
}

function hsvToHex(hsv: HSV): string {
    const { h, s: sPercent, v: vPercent } = hsv;
    const { r, g, b } = hsvToRgb(h, sPercent, vPercent);
    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* --- Distance / type checks --- */
export function hueDistance(h1: number, h2: number): number {
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 360 - diff);
}

function isTooCloseToTypeColors(hsv: HSV, minDistance: number): boolean {
    const typeHSVs = Object.values(PRIMARY_TYPE_COLORS).map(hexToHSV);
    return typeHSVs.some((typeHSV) => {
        const hueDist = hueDistance(hsv.h, typeHSV.h);
        return hueDist < minDistance;
    });
}

/* --- Candidate generation helpers --- */
function randomCandidate(saturation: number, value: number): HSV {
    return { h: Math.random() * 360, s: saturation, v: value };
}

function candidateIsAcceptable(
    candidate: HSV,
    existingHSVs: HSV[],
    opts: { minTypeDistance: number; minExistingDistance: number },
): boolean {
    if (isTooCloseToTypeColors(candidate, opts.minTypeDistance)) {
        return false;
    }

    const tooCloseToExisting = existingHSVs.some((existingHSV) => {
        const hueDist = hueDistance(candidate.h, existingHSV.h);
        return hueDist < opts.minExistingDistance;
    });

    return !tooCloseToExisting;
}

export function generateUniqueColor(
    existingColors: string[],
    options: {
        saturation?: number;
        value?: number;
        minTypeDistance?: number;
        minExistingDistance?: number;
        maxAttempts?: number;
    } = {},
): string {
    const {
        saturation = 60,
        value = 70,
        minTypeDistance = 30,
        minExistingDistance = 20,
        maxAttempts = 100,
    } = options;

    const existingHSVs = existingColors.map(hexToHSV);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = randomCandidate(saturation, value);
        if (
            candidateIsAcceptable(candidate, existingHSVs, { minTypeDistance, minExistingDistance })
        ) {
            return hsvToHex(candidate);
        }
    }

    // Fallback
    const fallback = randomCandidate(saturation, value);
    return hsvToHex(fallback);
}

export function generateUniqueColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
        const color = generateUniqueColor(colors);
        colors.push(color);
    }
    return colors;
}

function createCandidateForAttempt(
    baseHSV: HSV,
    params: { attempt: number; slots: number; separation: number; hueRange: number },
): HSV {
    const { attempt, slots, separation, hueRange } = params;
    const slot = attempt % slots;
    const slotCenter = baseHSV.h + (slot - Math.floor(slots / 2)) * separation;
    const jitter = (Math.random() * 2 - 1) * Math.min(hueRange / 2, separation / 4);
    let h = slotCenter + jitter;
    h = ((h % 360) + 360) % 360;
    return { h, s: Math.max(baseHSV.s, 60), v: Math.max(baseHSV.v, 60) };
}

function findThematicCandidate(
    baseHSV: HSV,
    existingHSVs: HSV[],
    params: {
        slots: number;
        separation: number;
        hueRange: number;
        resolvedMinTypeDistance: number;
        minExistingDistance: number;
        maxAttempts: number;
    },
): HSV | null {
    const {
        slots,
        separation,
        hueRange,
        resolvedMinTypeDistance,
        minExistingDistance,
        maxAttempts,
    } = params;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = createCandidateForAttempt(baseHSV, {
            attempt,
            slots,
            separation,
            hueRange,
        });
        if (
            candidateIsAcceptable(candidate, existingHSVs, {
                minTypeDistance: resolvedMinTypeDistance,
                minExistingDistance,
            })
        ) {
            return candidate;
        }
    }
    return null;
}

function prepareThematicContext(kind: EntityKind, existingColors: string[]) {
    const baseHex = PRIMARY_TYPE_COLORS[kind];
    const baseHSV = hexToHSV(baseHex);
    const existingHSVs = existingColors.map(hexToHSV);
    const existingCount = Math.max(0, existingHSVs.length);
    const slots = Math.max(3, existingCount + 1);
    const separation = 360 / slots;
    return { baseHSV, existingHSVs, slots, separation };
}

export function generateThematicColor(
    kind: EntityKind,
    existingColors: string[],
    options: {
        hueRange?: number;
        minExistingDistance?: number;
        minTypeDistance?: number;
        maxAttempts?: number;
    } = {},
): string {
    const { hueRange = 80, minExistingDistance = 40, minTypeDistance, maxAttempts = 120 } = options;

    const resolvedMinTypeDistance = minTypeDistance ?? minExistingDistance;
    const { baseHSV, existingHSVs, slots, separation } = prepareThematicContext(
        kind,
        existingColors,
    );

    const found = findThematicCandidate(baseHSV, existingHSVs, {
        slots,
        separation,
        hueRange,
        resolvedMinTypeDistance,
        minExistingDistance,
        maxAttempts,
    });

    if (found) {
        return hsvToHex(found);
    }

    const fallbackHue = (((baseHSV.h + hueRange * 1.5 + Math.random() * 360) % 360) + 360) % 360;
    return hsvToHex({ h: fallbackHue, s: Math.max(baseHSV.s, 60), v: Math.max(baseHSV.v, 60) });
}
