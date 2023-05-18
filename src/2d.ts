import { getSin } from "./helpers.js";

export const scalable2d = (xStep: number, xFactor: number, y: number, yFactor: number) => {};

export const triangle = (
    t: number,
    y: number,
    points: number,
    cycles: number,
    optionals?: Partial<{ polarity: 1 | -1; tOffset: number }>
): [number, number][] => {
    const polarity = optionals?.polarity;
    const tOffset = optionals?.tOffset;

    const steps = points - 1;
    const xStep = t / steps;
    const yStep = y / steps;
    const amps = polarity !== undefined ? 1 : 2;

    let xCoord = tOffset ?? 0,
        yCoord = 0;
    let coords: [number, number][] = [];

    for (let c = 0; c < cycles; c++) {
        for (let amp = 0, pol = polarity ?? 1; amp < amps; amp++, pol *= -1) {
            for (let i = 0, yS = yStep; i < 2; i++, yS *= -1) {
                for (let ii = 0; ii < steps; ii++, xCoord += xStep, yCoord += yS) {
                    coords.push([xCoord, yCoord * pol]);
                }
            }
        }
    }

    coords.push([xCoord, yCoord]);

    return coords;
};

export const sin2d = (
    t: number,
    y: number,
    ampPoints: number,
    cycles: number,
    optionals?: Partial<{ polarity: 1 | -1; tOffset: number }>
): [number, number][] => {
    const polarity = optionals?.polarity;
    const tOffset = optionals?.tOffset;

    const steps = ampPoints - 1;
    const angle = Math.PI / 2;
    const xStep = t / steps;
    const angleStep = angle / steps;
    const amps = polarity !== undefined ? 1 : 2;

    let x = tOffset ?? 0,
        a = 0;
    let coords: [number, number][] = [];

    for (let c = 0; c < cycles; c++) {
        for (let amp = 0, pol = polarity ?? 1; amp < amps; amp++, pol *= -1) {
            for (let i = 0, aStep = angleStep; i < 2; i++, aStep *= -1) {
                for (let ii = 0; ii < steps; ii++, a += aStep, x += xStep) {
                    coords.push([x, y * getSin(a, pol)]);
                }
            }
        }
    }

    coords.push([x, y * getSin(a)]);

    return coords;
};
