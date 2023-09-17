import { Cyclic } from "./2d.js";

export type Values = (number | [number, number])[];
type Optionals = Partial<{
    yOffset: number;
    phaseSegmentsOffset: number;
}>;

export default class Curve<F extends Cyclic> {
    constructor(f: F, points: number, optionals: Optionals = {}) {
        this.#f = f;
        this.#points = points;
        this.#optionals = optionals;
    }

    #f: F;
    #points: number;
    #optionals: Optionals;
    #tOffset = 0;
    #cycles: Values = [];

    public getData = () => structuredClone(this.#cycles);

    public reset = () => {
        this.#tOffset = 0;
        this.#cycles = [];
    };

    public tick = (tPerSegment: number, y: number) => {
        const cycle = this.#f(tPerSegment, y, this.#points, 1, { tOffset: this.#tOffset, includeOrigin: this.#tOffset === 0, ...this.#optionals });

        this.#tOffset = cycle.at(-1)[0];
        this.#cycles.push(...cycle);

        return structuredClone(cycle);
    };
}
