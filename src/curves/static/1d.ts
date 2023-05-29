import { linStep } from "../../helpers.js";

export const lin = (initial: number, interval: number, points: number): number[] => {
    const stepLength = linStep(interval, points - 1);
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

    for (let b = initialBase, i = 0; i < points; b = Math.pow(b, exp), i++) {
        numbers.push(b);
    }

    return numbers;
};

export const expCyclic = (initialBase: number, exponent: number, points: number, cycles: number): number[] => {
    const curve: number[] = exp(initialBase, exponent, points);
    let cycle: number[] = [...curve, ...curve.slice(1, -1).reverse()];

    let numbers: number[] = [];

    for (let c = 0; c < cycles; c++) {
        numbers.push(...cycle);
    }

    numbers.push(initialBase);

    return numbers;
};

export const expSeq = (base: number, initialExp: number, points: number, expIncrement = 1): number[] => {
    let numbers: number[] = [];

    for (let exp = initialExp, i = 0; i < points; exp += expIncrement, i++) {
        numbers.push(Math.pow(base, exp));
    }

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

export const sin = (x: number, points: number, cycles: number): number[] => {
    const steps = points - 1;
    const angle = Math.PI / 2;
    const angleStep = angle / steps;

    let a = 0;
    let numbers: number[] = [];

    for (let c = 0; c < cycles; c++) {
        for (let i = 0, aStep = angleStep; i < 2; i++, aStep *= -1) {
            for (let ii = 0; ii < steps; ii++, a += aStep) {
                numbers.push(x * Math.sin(a));
            }
        }
    }

    numbers.push(x * Math.sin(a));

    return numbers;
};
