import { CyclicOptionals } from "./2d.js";
import { clamp } from "../helpers.js";

type CyclicCommonSettings = {
    segments: number;
    points: number;
    cycles: number;
    steps: number;
    xStep: number;
    yStep: number;
    tOffset: number;
    yOffset: number;
    phaseSegmentsOffset: number;
    withPhaseOffset: boolean;
    includeOrigin: boolean;
};

type Steps = {
    x: number;
    y: number;
};

type CyclicData = {
    coords: [number, number][];
    steps: Steps;
};

export const getCyclicInitialData = (settings: CyclicCommonSettings): CyclicData => {
    const steps: Steps = { x: settings.tOffset, y: settings.yOffset };
    const coords: [number, number][] = [];

    if (settings.includeOrigin) coords.push([steps.x, steps.y]);

    return { steps, coords };
};

export const getCyclicCommonSettings = (
    x: number,
    y: number,
    segments: number,
    pointsPerSegment: number,
    cycles: number,
    optionals: CyclicOptionals | undefined
): CyclicCommonSettings => {
    pointsPerSegment = Math.round(pointsPerSegment);
    cycles = Math.round(cycles);

    const steps = pointsPerSegment - 1;
    const xStep = x / steps;
    const yStep = y / steps;

    const tOffset = optionals?.tOffset ?? 0;
    const yOffset = optionals?.yOffset ?? 0;
    const phaseSegmentsOffset = clamp(Math.round(optionals?.phaseSegmentsOffset ?? 0), 0, segments);
    const includeOrigin = !!optionals?.includeOrigin;

    return {
        segments,
        points: pointsPerSegment,
        cycles,
        steps,
        xStep,
        yStep,
        tOffset,
        yOffset,
        phaseSegmentsOffset,
        withPhaseOffset: phaseSegmentsOffset > 0 && phaseSegmentsOffset < segments,
        includeOrigin,
    };
};

export const iterateCycles = (
    cycles: number,
    settings: CyclicCommonSettings,
    handler: (segment: number, step: number) => boolean | void,
    phaseOffset = false
): void => {
    const firstSeg = phaseOffset ? settings.phaseSegmentsOffset : 0;

    for (let cycle = 0; cycle < cycles; cycle++) {
        for (let seg = firstSeg; seg < firstSeg + settings.segments; seg++) {
            for (let step = 0; step < settings.steps; step++) {
                if (handler(seg, step)) return;
            }
        }
    }
};

/**
 * @description Function searchs for interval between two values in which passed value lays and returns computed value for second axis based on ratio distance on first one.
 * @param axis Axis on which passed value lays and for which find interpolation interval.
 * @param value Value for passed axis. It should lay inside of value range and can be located anywhere, not just exactly on passed values.
 * @param values Value range for both axes.
 * @return Computed value for second axis based on ratio distance inside found interval on first one or undefined if interval cannot be found.
 */
export const getInterpolatedValue = (axis: "x" | "y", value: number, values: [number, number][]): number | undefined => {
    const fromAxisIndex = axis === "x" ? 0 : 1
    const forAxisIndex = axis === "x" ? 1 : 0

    let vals: [[number, number], [number, number]] | undefined

    for (let i = 1; i < values.length; i++) {
        const v1 = values[i - 1]
        const v2 = values[i]

        if ((value >= v1[fromAxisIndex] && value <= v2[fromAxisIndex]) || (value <= v1[fromAxisIndex] && value >= v2[fromAxisIndex])) {
            vals = [v1, v2]
            break
        }
    }

    if (vals) {
        const [v1, v2] = vals

        const fromInterval = v2[fromAxisIndex] - v1[fromAxisIndex]
        const fromIntervalRatio = (value - v1[fromAxisIndex]) / fromInterval

        const forInterval = v2[forAxisIndex] - v1[forAxisIndex]
        const forIntervalValue = v1[forAxisIndex] + forInterval * fromIntervalRatio

        return forIntervalValue
    }

    return undefined
}
