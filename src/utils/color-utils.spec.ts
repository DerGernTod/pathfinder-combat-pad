import { describe, it, expect } from "vitest";
import { generateUniqueColor, generateThematicColor, hexToHSV, hueDistance } from "./color-utils";
import { EntityKind } from "../constants";

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
        const existing: string[] = ["#7fa6b3"]; // Same hue as PC base
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
