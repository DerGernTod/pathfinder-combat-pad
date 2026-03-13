import { describe, it, expect } from "vitest";
import { generateUniqueColor, generateThematicColor } from "./color-utils";
import { EntityKind } from "../constants";

function hexToHSV(hex: string) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        } else if (max === g) {
            h = ((b - r) / delta + 2) * 60;
        } else {
            h = ((r - g) / delta + 4) * 60;
        }
    }
    return { h };
}

function hueDistance(h1: number, h2: number) {
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 360 - diff);
}

describe("color-utils generate functions", () => {
    it("generateUniqueColor returns a new hex and is reasonably separated", () => {
        const existing: string[] = ["#ff0000", "#00ff00"];
        const color = generateUniqueColor(existing, { maxAttempts: 50 });
        // Not equal to an existing color
        expect(existing).not.toContain(color);
        // Hue should be a number 0-360
        const hsv = hexToHSV(color);
        expect(hsv.h).toBeGreaterThanOrEqual(0);
        expect(hsv.h).toBeLessThan(360);
    });

    it("generateThematicColor avoids existing colors and primary base within given tolerance", () => {
        const existing: string[] = ["#7fa6b3"]; // same hue as PC base
        // Use moderate tolerances that the algorithm can satisfy reliably
        const minExistingDistance = 20;
        const minTypeDistance = 20;
        const color = generateThematicColor(EntityKind.PlayerCharacter, existing, { minExistingDistance, minTypeDistance, maxAttempts: 200 });
        const hsv = hexToHSV(color);
        const pc = hexToHSV("#7fa6b3");
        // Color must not equal any existing color
        expect(existing).not.toContain(color);
        // Hue should be at least the requested distance from the primary type base
        expect(hueDistance(hsv.h, pc.h)).toBeGreaterThanOrEqual(minTypeDistance);
    });
});
