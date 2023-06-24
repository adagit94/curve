export const reverse = (numbers: number[]): number[] => [...numbers].reverse();

export const invert = (numbers: number[]): number[] => numbers.map(n => n * -1);

export const getYs = (tValues: [number, number][]) => tValues.map(([_x, y]) => y);
