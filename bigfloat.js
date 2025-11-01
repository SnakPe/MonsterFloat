const MonsterMath = {
    random: (min, max) => BigInt(Math.floor(Math.random() * Number(max - min) + Number(min))),
    abs: (x) => x < 0 ? -x : x,
    gcd: (a, b) => b == 0n ? a : MonsterMath.gcd(b, a % b)
};

/**
 *  Arbitrary-length math number
 */
class MonsterFloat {
    /**
     *
     * @param _numerator The numerator of the fraction
     * @param _denominator The denomenator of the fraction
     * @throws Error when {@link _denominator} is 0n
     */
    constructor(_numerator, _denominator) {
        this._numerator = _numerator;
        this._denominator = _denominator;
        if (_denominator === 0n)
            throw new Error("Cannot divide by zero");
    }
    get numerator() {
        return this._numerator;
    }
    get denominator() {
        return this._denominator;
    }
    normalize() {
        const gcd = MonsterMath.gcd(this._numerator, this._denominator);
        return new MonsterFloat(this._numerator / gcd, this._denominator / gcd);
    }
    /**
     * Creates monsterfloats using a bigint, number or string.
     * If a monsterfloat is given, a copy of it is returned.
     *
     * @param other A bigint, number or string of a number
     * @returns A monsterfloat representing {@link other}
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
                case "object": return new MonsterFloat(other._numerator, other._denominator);
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
}

export { MonsterFloat };
