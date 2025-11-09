const MonsterMath = {
    random: (min, max) => BigInt(Math.floor(Math.random() * Number(max - min) + Number(min))),
    abs: (x) => x < 0 ? -x : x,
    gcd: (a, b) => b == 0n ? a : MonsterMath.gcd(b, a % b)
};

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
class MonsterFloat {
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
    constructor(_numerator, _denominator) {
        this._numerator = _numerator;
        this._denominator = _denominator;
        if (_denominator === 0n)
            throw new Error("Cannot divide by zero");
    }
    /**
   * Gets the numerator of the fraction.
   * @returns The numerator value
   */
    get numerator() {
        return this._numerator;
    }
    /**
     * Gets the denominator of the fraction.
     * @returns The denominator value
     */
    get denominator() {
        return this._denominator;
    }
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
    normalize() {
        const gcd = MonsterMath.gcd(this._numerator, this._denominator);
        return new MonsterFloat(this._numerator / gcd, this._denominator / gcd);
    }
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
    static from(other) {
        function numberStringToBigFloatHelper(n) {
            let decimalPlaces = 0n;
            let res = 0n;
            let foundDot = false;
            for (const char of n) {
                if (foundDot)
                    decimalPlaces++;
                if (char === ".")
                    foundDot = true;
                else
                    res = 10n * res + BigInt(char.charCodeAt(0) - 48);
            }
            return new MonsterFloat(res, 10n ** decimalPlaces).normalize();
        }
        function helper() {
            switch (typeof other) {
                case "bigint": return new MonsterFloat(other, 1n);
                case "number": {
                    return numberStringToBigFloatHelper(other.toString());
                }
                case "string": {
                    const tryAsNumber = Number(other);
                    if (!Number.isNaN(tryAsNumber))
                        return numberStringToBigFloatHelper(other);
                    //try reading a fraction.
                    const parts = other.split("/");
                    if (parts.length !== 2)
                        throw Error(`Cannot read ${other} because of too many '/'`);
                    try {
                        if (parts.some(p => p.length === 0))
                            throw SyntaxError("Found empty string when not expected");
                        const denom = BigInt(parts[0]);
                        const num = BigInt(parts[1]);
                        return new MonsterFloat(denom, num).normalize();
                    }
                    catch (e) {
                        throw Error(`Cannot read ${other} because of ${e}`);
                    }
                }
                default: return new MonsterFloat(other._numerator, other._denominator);
            }
        }
        return helper();
    }
    /**
     * @returns The number represented by this monsterfloat, without arbitrary precision.
     */
    toNumber() {
        return Number(this._numerator) / Number(this._denominator);
    }
    /**
     * @returns The monsterfloat represented by a fraction as a string.
     */
    toFractionString() {
        return `${this._numerator}/${this._denominator}`;
    }
    /**
     * Alias for {@link toFractionString}
     */
    toString() {
        return this.toFractionString();
    }
    /**
     * @param precision how many decimal numbers after the dot to be shown. If negative, it's treated as if it's 0
     * @returns The number represented by the monsterfloat.
     */
    toNumberString(precision = 16n) {
        const rest = this._numerator % this._denominator;
        if (rest === 0n || precision <= 0n)
            return (this._numerator / this._denominator).toString();
        const result = [this._numerator / this._denominator, "."];
        const digits = (int) => BigInt(int.toString().length); //alternatively one might use floor(log10(int))+1, if a log10 function would exist for bigints
        const getNextCarry = (precarry) => {
            // we assume here that this._denominator > precarry
            const extraZeroes = digits(this._denominator - 1n) - digits(precarry) + 1n;
            const nextCarry = precarry * (10n ** extraZeroes);
            return [nextCarry, extraZeroes];
        };
        // we use long division to get the next digits 
        let [carry, extraZeroes] = getNextCarry(rest);
        while (precision > 0n) {
            const nextDigit = carry / this._denominator;
            for (let count = 1; count <= extraZeroes - digits(nextDigit); count++)
                result.push("0");
            result.push(nextDigit);
            const nextRest = carry - nextDigit * this._denominator;
            if (nextRest === 0n)
                break;
            [carry, extraZeroes] = getNextCarry(nextRest);
            precision--;
        }
        return result.join("");
    }
    /**
     *
     * @param other The second summand
     * @returns The sum of this and the {@link other} monsterfloat
     */
    add(other) {
        other = MonsterFloat.from(other);
        return new MonsterFloat(this._numerator * other._denominator + other._numerator * this._denominator, this._denominator * other._denominator).normalize();
    }
    /**
     * Shorthand for {@link add}
     */
    a(other) { return this.add(other); }
    negate() {
        return new MonsterFloat(-this._numerator, this._denominator);
    }
    /**
     *
     * @param other The second subtract
     * @returns The subtraction of this and the {@link other} monsterfloat
     */
    subtract(other) {
        other = MonsterFloat.from(other);
        return this.add(other.negate());
    }
    /**
     * Shorthand for {@link subtract}
     */
    s(other) { return this.subtract(other); }
    /**
     *
     * @param other The second multiplier
     * @returns The multiplication of this and the {@link other} monsterfloat
     */
    multiply(other) {
        other = MonsterFloat.from(other);
        return new MonsterFloat(this._numerator * other._numerator, this._denominator * other._denominator).normalize();
    }
    /**
     * Shorthand for {@link multiply}
     */
    m(other) { return this.multiply(other); }
    /**
     *
     * @param other The divisor
     * @returns The division of this and the {@link other} monsterfloat
     */
    divide(other) {
        other = MonsterFloat.from(other);
        return new MonsterFloat(this._numerator * other._denominator, this._denominator * other._numerator).normalize();
    }
    /**
     * Shorthand for {@link divide}
     */
    d(other) { return this.divide(other); }
    /**
     *
     * @param other The exponent
     * @returns The exponantiation of this with the {@link other} monsterfloat
     */
    pow(other) {
        other = MonsterFloat.from(other);
        return new MonsterFloat(this._numerator ** other._numerator, this._denominator ** other._denominator).normalize();
    }
    /**
     * Shorthand for {@link pow}
     */
    p(other) { return this.pow(other); }
    orderOperationHelper(op) {
        return (other) => {
            other = MonsterFloat.from(other);
            return op(this._numerator * other._denominator, other._numerator * this._denominator);
        };
    }
    /**
     *
     * @param other Another number
     * @returns True if the value of this is equal to the {@link other} monsterfloat
     */
    isEqual(other) {
        return this.orderOperationHelper((l, r) => l === r)(other);
    }
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
    isLessThan(other) {
        return this.orderOperationHelper((l, r) => l < r)(other);
    }
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
    isLessThanOrEqual(other) {
        return this.orderOperationHelper((l, r) => l <= r)(other);
    }
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
    isGreaterThan(other) {
        return this.orderOperationHelper((l, r) => l > r)(other);
    }
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
    isGreaterThanOrEqual(other) {
        return this.orderOperationHelper((l, r) => l >= r)(other);
    }
}

export { MonsterFloat };
