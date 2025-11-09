type Numeric = MonsterFloat | bigint | number;
/**
 * Represents an arbitrary-precision rational number using a pair of BigInts.
 * This class provides exact arithmetic operations without floating-point precision loss.
 *
 * @example
 * ```typescript
 * const num = new MonsterFloat(1n, 2n); // Represents 1/2
 * const result = num.add(0.25); // Represents 3/4
 * ```
 *
 * @remarks
 * - All arithmetic operations return a new normalized MonsterFloat instance
 * - Numbers can be created from strings, numbers, bigints, or other MonsterFloat instances using the static `from` method
 * - The class maintains numbers in their simplest form by automatically reducing fractions
 *
 * @throws When attempting to create a MonsterFloat with a denominator of 0
 *
 * @see
 * - Use {@link from} to create instances from various numeric types
 * - Use {@link toNumber} to convert to JavaScript number
 * - Use {@link toNumberString} for decimal string representation
 * - Use {@link toFractionString} for fractional string representation
 */
export declare class MonsterFloat {
    protected readonly _numerator: bigint;
    protected readonly _denominator: bigint;
    /**
   * Creates a new MonsterFloat instance representing a rational number.
   *
   * @param _numerator The top number in the fraction
   * @param _denominator The bottom number in the fraction (must not be zero)
   * @throws When denominator is zero
   *
   * @example
   * ```
   * const half = new MonsterFloat(1n, 2n); // Represents 1/2
   * ```
   */
    constructor(_numerator: bigint, _denominator: bigint);
    /**
   * Gets the numerator of the fraction.
   * @returns The numerator value
   */
    get numerator(): bigint;
    /**
     * Gets the denominator of the fraction.
     * @returns The denominator value
     */
    get denominator(): bigint;
    /**
     * Reduces the fraction to its simplest form by dividing both numerator and denominator
     * by their greatest common divisor (GCD).
     *
     * @returns {MonsterFloat} A new MonsterFloat instance with the simplified fraction
     *
     * @example
     * ```typescript
     * const num = new MonsterFloat(2n, 4n);
     * const simplified = num.normalize(); // Returns 1/2
     * ```
     */
    protected normalize(): MonsterFloat;
    /**
     * Creates a new MonsterFloat from various numeric types or strings.
     * @param other - The value to convert to a MonsterFloat. Can be:
     *   - A number
     *   - A bigint
     *   - A string representing a decimal number (e.g. "123.456")
     *   - A string representing a fraction (e.g. "1/2")
     *   - Another Monsterfloat
     * @returns A new normalized MonsterFloat instance representing the input value
     * @throws {Error} If the string fraction has more than one '/' character
     * @throws {Error} If the string fraction is empty
     * @throws {Error} If the string fraction parts cannot be converted to BigInt
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
    private orderOperationHelper;
    /**
     *
     * @param other Another number
     * @returns True if the value of this is equal to the {@link other} monsterfloat
     */
    isEqual(other: Numeric): boolean;
    /**
     * Compares this number with another numeric value to determine if this number is less than the other.
     *
     * @param other - The numeric value to compare with
     * @returns True if this number is less than the other, false otherwise
     *
     * @example
     * const num1 = new MonsterFloat("1.5");
     * const num2 = new MonsterFloat("2.0");
     * console.log(num1.isLessThan(num2)); // true
     */
    isLessThan(other: Numeric): boolean;
    /**
     * Compares this number with another numeric value to determine if this number is less than or equal to the other.
     *
     * @param other - The numeric value to compare with
     * @returns True if this number is less than the other, false otherwise
     *
     * @example
     * const num1 = new MonsterFloat("1.5");
     * const num2 = new MonsterFloat("2.0");
     * console.log(num1.isLessThan(num2)); // true
     */
    isLessThanOrEqual(other: Numeric): boolean;
    /**
     * Compares this number with another numeric value to determine if this number is less than or equal to the other.
     *
     * @param other - The numeric value to compare with
     * @returns True if this number is less than the other, false otherwise
     *
     * @example
     * const num1 = new MonsterFloat("1.5");
     * const num2 = new MonsterFloat("2.0");
     * console.log(num1.isLessThan(num2)); // true
     */
    isGreaterThan(other: Numeric): boolean;
    /**
     * Compares this number with another numeric value to determine if this number is greater than or equal to the other.
     *
     * @param other - The numeric value to compare with
     * @returns True if this number is less than the other, false otherwise
     *
     * @example
     * const num1 = new MonsterFloat("1.5");
     * const num2 = new MonsterFloat("2.0");
     * console.log(num1.isLessThan(num2)); // true
     */
    isGreaterThanOrEqual(other: Numeric): boolean;
}
export {};
