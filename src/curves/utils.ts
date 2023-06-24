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
