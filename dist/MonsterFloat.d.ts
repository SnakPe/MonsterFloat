type Numeric = MonsterFloat | bigint | number;
/**
 *  Arbitrary-length math number
 */
export declare class MonsterFloat {
    protected readonly _numerator: bigint;
    protected readonly _denominator: bigint;
    /**
     *
     * @param _numerator The numerator of the fraction
     * @param _denominator The denomenator of the fraction
     * @throws Error when {@link _denominator} is 0n
     */
    constructor(_numerator: bigint, _denominator: bigint);
    get numerator(): bigint;
    get denominator(): bigint;
    protected normalize(): MonsterFloat;
    /**
     * Creates monsterfloats using a bigint, number or string.
     * If a monsterfloat is given, a copy of it is returned.
     *
     * @param other A bigint, number or string of a number
     * @returns A monsterfloat representing {@link other}
     */
    static from(other: Numeric | string): MonsterFloat;
    /**
     * @returns The number represented by this monsterfloat, without arbitrary precision.
     */
    toNumber(): number;
    /**
     * @returns The monsterfloat represented by a fraction as a string.
     */
    toFractionString(): string;
    /**
     * Alias for {@link toFractionString}
     */
    toString(): string;
    /**
     * @param precision how many decimal numbers after the dot to be shown. If negative, it's treated as if it's 0
     * @returns The number represented by the monsterfloat.
     */
    toNumberString(precision?: bigint): string;
    /**
     *
     * @param other The second summand
     * @returns The sum of this and the {@link other} monsterfloat
     */
    add(other: Numeric): MonsterFloat;
    /**
     * Shorthand for {@link add}
     */
    a(other: Numeric): MonsterFloat;
    protected negate(): MonsterFloat;
    /**
     *
     * @param other The second subtract
     * @returns The subtraction of this and the {@link other} monsterfloat
     */
    subtract(other: Numeric): MonsterFloat;
    /**
     * Shorthand for {@link subtract}
     */
    s(other: Numeric): MonsterFloat;
    /**
     *
     * @param other The second multiplier
     * @returns The multiplication of this and the {@link other} monsterfloat
     */
    multiply(other: Numeric): MonsterFloat;
    /**
     * Shorthand for {@link multiply}
     */
    m(other: Numeric): MonsterFloat;
    /**
     *
     * @param other The divisor
     * @returns The division of this and the {@link other} monsterfloat
     */
    divide(other: Numeric): MonsterFloat;
    /**
     * Shorthand for {@link divide}
     */
    d(other: Numeric): MonsterFloat;
    /**
     *
     * @param other The exponent
     * @returns The exponantiation of this with the {@link other} monsterfloat
     */
    pow(other: Numeric): MonsterFloat;
    /**
     * Shorthand for {@link pow}
     */
    p(other: Numeric): MonsterFloat;
}
export {};
