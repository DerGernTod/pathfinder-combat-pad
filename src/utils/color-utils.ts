import { EntityKind } from "../constants";

// Primary type colors extracted from CSS (InitSlot.css)
const PRIMARY_TYPE_COLORS = {
    [EntityKind.PlayerCharacter]: "#7fa6b3",  // PC blue
    [EntityKind.NonPlayerCharacter]: "#82a687", // NPC green
    [EntityKind.Monster]: "#8f554a",          // Monster brown
    [EntityKind.Hazard]: "#b39f9f",           // Hazard pink
};

interface HSV {
    h: number; // 0-360
    s: number; // 0-100
    v: number; // 0-100
}

/**
 * Parse a hex string into RGB components (0-1)
 */
function parseHexToRgb(hex: string) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return { r, g, b };
}

/**
 * Compute hue from components when delta !== 0
 */
function computeHue(max: number, r: number, g: number, b: number, delta: number): number {
    if (max === r) {
        return ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    }
    if (max === g) {
        return ((b - r) / delta + 2) * 60;
    }
    return ((r - g) / delta + 4) * 60;
}

/**
 * Convert RGB (0-1) to HSV with same numeric behavior as before
 */
function rgbToHsv(r: number, g: number, b: number): HSV {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const v = max * 100;

    if (delta !== 0) {
        s = (delta / max) * 100;
        h = computeHue(max, r, g, b, delta);
    }

    return { h, s, v };
}

/**
 * Convert hex color to HSV
 */
function hexToHSV(hex: string): HSV {
    const { r, g, b } = parseHexToRgb(hex);
    return rgbToHsv(r, g, b);
}

/**
 * Map sector values to normalized rgb before adding m
 */
function sectorRgb(h: number, c: number, x: number) {
    if (h >= 0 && h < 60) return { r: c, g: x, b: 0 };
    if (h >= 60 && h < 120) return { r: x, g: c, b: 0 };
    if (h >= 120 && h < 180) return { r: 0, g: c, b: x };
    if (h >= 180 && h < 240) return { r: 0, g: x, b: c };
    if (h >= 240 && h < 300) return { r: x, g: 0, b: c };
    return { r: c, g: 0, b: x };
}

/**
 * Convert HSV to RGB (0-1) following the same algorithm
 */
function hsvToRgb(h: number, sPercent: number, vPercent: number) {
    const s = sPercent / 100;
    const v = vPercent / 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    const base = sectorRgb(h, c, x);
    return { r: base.r + m, g: base.g + m, b: base.b + m };
}

/**
 * Convert HSV to hex color
 */
function hsvToHex(hsv: HSV): string {
    const { h, s: sPercent, v: vPercent } = hsv;
    const { r, g, b } = hsvToRgb(h, sPercent, vPercent);

    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculate the hue distance between two colors (0-180)
 * Takes into account the circular nature of hue
 */
function hueDistance(h1: number, h2: number): number {
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 360 - diff);
}

/**
 * Check if a color is too close to any of the primary type colors
 */
function isTooCloseToTypeColors(hsv: HSV, minDistance: number): boolean {
    const typeHSVs = Object.values(PRIMARY_TYPE_COLORS).map(hexToHSV);

    return typeHSVs.some(typeHSV => {
        const hueDist = hueDistance(hsv.h, typeHSV.h);
        return hueDist < minDistance;
    });
}

/**
 * Generate a random hue candidate with fixed S and V
 */
function randomCandidate(saturation: number, value: number): HSV {
    return { h: Math.random() * 360, s: saturation, v: value };
}

/**
 * Check candidate against type colors and existing colors
 */
function candidateIsAcceptable(candidate: HSV, existingHSVs: HSV[], opts: { minTypeDistance: number; minExistingDistance: number }): boolean {
    if (isTooCloseToTypeColors(candidate, opts.minTypeDistance)) { return false; }

    const tooCloseToExisting = existingHSVs.some(existingHSV => {
        const hueDist = hueDistance(candidate.h, existingHSV.h);
        return hueDist < opts.minExistingDistance;
    });

    return !tooCloseToExisting;
}

/**
 * Generate a random HSV color with fixed S and V levels
 * that doesn't clash with primary type colors
 */
export function generateUniqueColor(
    existingColors: string[],
    options: {
        saturation?: number;
        value?: number;
        minTypeDistance?: number;
        minExistingDistance?: number;
        maxAttempts?: number;
    } = {}
): string {
    const {
        saturation = 60,
        value = 70,
        minTypeDistance = 30,
        minExistingDistance = 20,
        maxAttempts = 100
    } = options;

    const existingHSVs = existingColors.map(hexToHSV);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = randomCandidate(saturation, value);
        if (candidateIsAcceptable(candidate, existingHSVs, { minTypeDistance, minExistingDistance })) {
            return hsvToHex(candidate);
        }
    }

    // Fallback: return a color even if it might be close to others
    const fallback = randomCandidate(saturation, value);
    return hsvToHex(fallback);
}

/**
 * Generate multiple unique colors at once
 */
export function generateUniqueColors(count: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
        const color = generateUniqueColor(colors);
        colors.push(color);
    }

    return colors;
}

/**
 * Create a candidate hue for a given attempt slot around base hue
 */
function createCandidateForAttempt(baseHSV: HSV, params: { attempt: number; slots: number; separation: number; hueRange: number }): HSV {
    const { attempt, slots, separation, hueRange } = params;
    const slot = attempt % slots;
    const slotCenter = baseHSV.h + (slot - Math.floor(slots / 2)) * separation;
    const jitter = (Math.random() * 2 - 1) * Math.min(hueRange / 2, separation / 4);
    let h = slotCenter + jitter;
    // Normalize
    h = ((h % 360) + 360) % 360;
    return { h, s: Math.max(baseHSV.s, 60), v: Math.max(baseHSV.v, 60) };
}

/**
 * Try to find an acceptable thematic candidate within attempts
 */
function findThematicCandidate(baseHSV: HSV, existingHSVs: HSV[], slots: number, separation: number, hueRange: number, resolvedMinTypeDistance: number, minExistingDistance: number, maxAttempts: number): HSV | null {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = createCandidateForAttempt(baseHSV, { attempt, slots, separation, hueRange });
        if (candidateIsAcceptable(candidate, existingHSVs, { minTypeDistance: resolvedMinTypeDistance, minExistingDistance })) {
            return candidate;
        }
    }
    return null;
}

/**
 * Generate a thematic color for a specific entity kind
 * Varies the hue slightly around the base color for that kind
 */
export function generateThematicColor(
    kind: EntityKind,
    existingColors: string[],
    options: {
        hueRange?: number;
        minExistingDistance?: number;
        /**
         * Minimum hue distance from primary type colors.
         * Separate from minExistingDistance which is the distance between generated colors.
         */
        minTypeDistance?: number;
        maxAttempts?: number;
    } = {}
): string {
    const {
        // Make same-type colors more distinct: widen hue range and increase min distance
        hueRange = 80, // +/- degrees
        minExistingDistance = 40,
        minTypeDistance,
        maxAttempts = 120
    } = options;

    const resolvedMinTypeDistance = minTypeDistance ?? minExistingDistance;

    const baseHex = PRIMARY_TYPE_COLORS[kind];
    const baseHSV = hexToHSV(baseHex);
    const existingHSVs = existingColors.map(hexToHSV);

    const existingCount = Math.max(0, existingHSVs.length);
    const slots = Math.max(3, existingCount + 1);
    const separation = 360 / slots;

    const found = findThematicCandidate(baseHSV, existingHSVs, slots, separation, hueRange, resolvedMinTypeDistance, minExi
