import { getYs } from "../../utils.js";
import { Cyclic } from "../static/2d.js";

export type Values = (number | [number, number])[];
type Optionals = Partial<{
    yOffset: number
    phaseSegmentsOffset: number
}>

export default class Curve<F extends Cyclic> {
    constructor(f: F, points: number, dimensions: 1 | 2, optionals: Optionals = {}) {
        this.#f = f;
        this.#points = points;
        this.#dimensions = dimensions;
        this.#optionals = optionals
    }

    #f: F;
    #points: number;
    #dimensions: 1 | 2;
    #optionals: Optionals;
    #tOffset = 0;
    #cycles: Values = [];

    public getData = () => structuredClone(this.#cycles);

    public reset = () => {
        this.#tOffset = 0;
        this.#cycles = [];
    };

    public tick = (t: number, y: number) => {
        const cycle = this.#f(t, y, this.#points, 1, { tOffset: this.#tOffset, includeOrigin: this.#tOffset === 0, ...this.#optionals });

        this.#tOffset = cycle.at(-1)[0];

        if (this.#dimensions === 1) {
            const values = getYs(cycle);

            this.#cycles.push(...values);
            return values;
        }

        this.#cycles.push(...cycle);
        return structuredClone(cycle);
    };
}
