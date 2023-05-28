import { getSin } from "../../helpers.js";

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

export const exp2d = (
    t: number,
    initialBase: number,
    exp: number,
    points: number,
    optionals?: Partial<{ polarity: 1 | -1; tOffset: number }>
): [number, number][] => {
    const polarity = optionals?.polarity ?? 1;
    const tOffset = optionals?.tOffset ?? 0;

    let coords: [number, number][] = [];

    for (let b = initialBase, x = tOffset, i = 0; i < points; b = Math.pow(b, exp), x += t, i++) {
        coords.push([x, b * polarity]);
    }

    return coords;
};

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
