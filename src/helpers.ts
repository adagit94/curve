export const linInterval = (start: number, end: number): number => end - start;
export const linStep = (length: number, steps: number): number => length / steps;
export const linLength = (step: number, steps: number): number => step * steps;

export const vecLength = (vec: [number, number]): number => Math.sqrt(vec[0] ** 2 + vec[1] ** 2);

export const clamp = (x: number, min = 0, max = 1): number => Math.max(min, Math.min(x, max))

export const isEven = (number: number) => number % 2 === 0

export const root = (x: number, exp: number) => Math.pow(x, 1 / exp)

export const log = (x: number, base: number) => Math.log(x) / Math.log(base)
