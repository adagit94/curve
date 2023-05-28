export const linInterval = (start: number, end: number): number => end - start;
export const linStep = (interval: number, steps: number): number => interval / steps;
export const linLength = (step: number, steps: number): number => step * steps;

export const vecLength = (vec: [number, number]): number => Math.sqrt(vec[0] ** 2 + vec[1] ** 2);

export const getSin = (angle: number, polarity?: 1 | -1): number => {
    let sin = Math.sin(angle);
    if (polarity !== undefined) sin *= polarity;

    return sin
}

export const clamp = (x: number, min = 0, max = 1): number => Math.max(min, Math.min(x, max))