import { getSin } from "./helpers.js";

export const lin = (initial: number, stepLength: number, points: number): number[] => {
    let numbers: number[] = [];

    for (let i = 0, n = initial; i < points; i++, n += stepLength) {
        numbers.push(n);
    }

    return numbers;
};

export const scalable = (initial: number, factor: number, points: number): number[] => {
    let numbers: number[] = [];

    for (let i = 0, n = initial; i < points; i++, n *= factor) {
        numbers.push(n);
    }

    return numbers;
};

export const exp = (initialBase: number, exp: number, points: number): number[] => {
    let numbers: number[] = [];

    for (let b = initialBase, i = 0; i < points; b = numbers[i] = Math.pow(b, exp), i++) {}

    return numbers;
};

export const alt = (a: number, b: number, cycles: number, valCount = 1): number[] => {
    const iterations = cycles * 2;
    let numbers: number[] = [];

    for (let i = 0; i < iterations; i++) {
        const val = i % 2 === 0 ? a : b;

        for (let ii = 0; ii < valCount; ii++) {
            numbers.push(val);
        }
    }

    return numbers;
};

export const sin = (x: number, points: number, cycles: number, polarity?: 1 | -1): number[] => {
    const steps = points - 1;
    const angle = Math.PI / 2;
    const angleStep = angle / steps;
    const amps = polarity !== undefined ? 1 : 2;

    let a = 0
    let numbers: number[] = [];

    for (let c = 0; c < cycles; c++) {
        for (let amp = 0, pol = polarity ?? 1; amp < amps; amp++, pol *= -1) {
            for (let i = 0, aStep = angleStep; i < 2; i++, aStep *= -1) {
                for (let ii = 0; ii < steps; ii++, a += aStep) {
                    numbers.push(x * getSin(a, pol));
                }
            }
        }
    }

    numbers.push(x * getSin(a));

    return numbers;
};
