import { isEven } from "../../helpers.js";
import { getCyclicCommonSettings, getCyclicInitialData, iterateCycles } from "./utils.js";

export type CommonOptionals = Partial<{ tOffset: number }>;

export type CyclicOptionals = CommonOptionals & Partial<{ yOffset: number; phaseSegmentsOffset: number; includeOrigin: boolean }>;

export type Cyclic = (tPerSegment: number, y: number, pointsPerSegment: number, cycles: number, optionals?: CyclicOptionals) => [number, number][];

export const lin2d = (x: number, xStep: number, y: number, yStep: number, points: number): [number, number][] => {
    let coords: [number, number][] = [];

    for (let i = 0, xCoord = x, yCoord = y; i < points; i++, xCoord += xStep, yCoord += yStep) {
        coords.push([xCoord, yCoord]);
    }

    return coords;
};

export const scalable2d = (x: number, xFactor: number, y: number, yFactor: number, points: number): [number, number][] => {
    let coords: [number, number][] = [];

    for (let i = 0, xCoord = x, yCoord = y; i < points; i++, xCoord *= xFactor, yCoord *= yFactor) {
        coords.push([xCoord, yCoord]);
    }

    return coords;
};

export const exp2d = (t: number, initialBase: number, exp: number, points: number, optionals?: CommonOptionals): [number, number][] => {
    const tOffset = optionals?.tOffset ?? 0;

    let coords: [number, number][] = [];

    for (let b = initialBase, x = tOffset, i = 0; i < points; b = Math.pow(b, exp), x += t, i++) {
        coords.push([x, b]);
    }

    return coords;
};

export const diagonal: Cyclic = (tPerSegment, y, pointsPerSegment, cycles, optionals) => {
    const settings = getCyclicCommonSettings(tPerSegment, y, 2, pointsPerSegment, cycles, optionals);

    if (settings.withPhaseOffset) {
        iterateCycles(1, settings, seg => {
            if (seg === settings.phaseSegmentsOffset) return true;
            settings.yOffset += settings.yStep;
        });
    }

    const data = getCyclicInitialData(settings);

    iterateCycles(
        cycles,
        settings,
        seg => {
            let { yStep } = settings;

            if (!isEven(seg)) yStep *= -1;

            const x = (data.steps.x += settings.xStep);
            const y = (data.steps.y += yStep);

            data.coords.push([x, y]);
        },
        settings.withPhaseOffset
    );

    return data.coords;
};

export const rectangular: Cyclic = (tPerSegment, y, pointsPerSegment, cycles, optionals) => {
    const settings = getCyclicCommonSettings(tPerSegment, y, 4, pointsPerSegment, cycles, optionals);

    if (settings.withPhaseOffset) {
        iterateCycles(1, settings, seg => {
            if (seg === settings.phaseSegmentsOffset) return true;

            if (!isEven(seg)) {
                settings.yOffset += seg === 3 ? -settings.yStep : settings.yStep;
            }
        });
    }

    const data = getCyclicInitialData(settings);

    iterateCycles(
        cycles,
        settings,
        seg => {
            const axis = isEven(seg) ? "x" : "y";

            switch (axis) {
                case "x":
                    data.steps.x += settings.xStep;
                    break;

                case "y":
                    data.steps.y += seg === 3 ? -settings.yStep : settings.yStep;
                    break;
            }

            data.coords.push([data.steps.x, data.steps.y]);
        },
        settings.withPhaseOffset
    );

    return data.coords;
};

export const diagonalWithSustain: Cyclic = (tPerSegment, y, pointsPerSegment, cycles, optionals) => {
    const settings = getCyclicCommonSettings(tPerSegment, y, 4, pointsPerSegment, cycles, optionals);

    if (settings.withPhaseOffset) {
        iterateCycles(1, settings, seg => {
            if (seg === settings.phaseSegmentsOffset) return true;

            if (!isEven(seg)) {
                settings.yOffset += seg === 3 ? -settings.yStep : settings.yStep;
            }
        });
    }

    const data = getCyclicInitialData(settings);

    iterateCycles(cycles, settings, seg => {
        const { xStep, yStep } = settings;

        if (isEven(seg)) {
            data.steps.x += xStep;
        } else {
            data.steps.x += xStep;
            data.steps.y += seg === 3 ? -yStep : yStep;
        }

        data.coords.push([data.steps.x, data.steps.y]);
    }, settings.withPhaseOffset);

    return data.coords;
};

export const sin2d: Cyclic = (tPerSegment, y, pointsPerSegment, cycles, optionals) => {
    const settings = getCyclicCommonSettings(tPerSegment, 0, 2, pointsPerSegment, cycles, optionals);
    const angleStep = Math.PI / 2 / settings.steps;
    let angle = 0;

    if (settings.withPhaseOffset) {
        iterateCycles(1, settings, seg => {
            if (seg === settings.phaseSegmentsOffset) return true;

            angle += angleStep;
        });
    }

    const data = getCyclicInitialData({ ...settings, includeOrigin: false });

    if (settings.includeOrigin) {
        data.coords.push([data.steps.x, settings.yOffset + y * Math.sin(angle)]);
    }

    iterateCycles(
        cycles,
        settings,
        seg => {
            data.steps.x += settings.xStep;
            angle += isEven(seg) ? angleStep : -angleStep;

            data.coords.push([data.steps.x, settings.yOffset + y * Math.sin(angle)]);
        },
        settings.withPhaseOffset
    );

    return data.coords;
};
