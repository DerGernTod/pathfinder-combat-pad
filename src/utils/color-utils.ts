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
 * Convert hex color to HSV
 */
function hexToHSV(hex: string): HSV {
    // Remove # if present
    hex = hex.replace(/^#/, "");

    // Parse RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const v = max * 100;

    if (delta !== 0) {
        s = (delta / max) * 100;

        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        } else if (max === g) {
            h = ((b - r) / delta + 2) * 60;
        } else {
            h = ((r - g) / delta + 4) * 60;
        }
    }

    return { h, s, v };
}

/**
 * Convert HSV to hex color
 */
function hsvToHex(hsv: HSV): string {
    const { h, s: sPercent, v: vPercent } = hsv;
    const s = sPercent / 100;
    const v = vPercent / 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
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
        // Generate random hue
        const h = Math.random() * 360;
        const candidate: HSV = { h, s: saturation, v: value };

        // Check if too close to type colors
        if (isTooCloseToTypeColors(candidate, minTypeDistance)) {
            // Skip this candidate
        } else {
            // Check if too close to existing colors
            const tooCloseToExisting = existingHSVs.some(existingHSV => {
                const hueDist = hueDistance(candidate.h, existingHSV.h);
                return hueDist < minExistingDistance;
            });

            if (!tooCloseToExisting) {
                return hsvToHex(candidate);
            }
        }
    }

    // Fallback: return a color even if it might be close to others
    // This should rarely happen with reasonable parameters
    const h = Math.random() * 360;
    return hsvToHex({ h, s: saturation, v: value });
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
