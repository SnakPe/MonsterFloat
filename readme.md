# MonsterFloat - Arbitrary Precision Rational Numbers

A TypeScript library for exact arithmetic operations using rational numbers. Unlike floating-point numbers, MonsterFloat represents numbers as fractions with arbitrary-precision integers (using BigInt), ensuring exact calculations without rounding errors.

## Features

- Exact arithmetic operations (no floating-point errors)
- Automatic fraction simplification
- Support for arbitrary-precision numbers
- Seamless conversion between number types

## Installation

```bash
npm install monsterfloat
```

## Usage

### Basic Operations

```typescript
import { MonsterFloat } from 'monsterfloat';

// Create fractions
const half = new MonsterFloat(1n, 2n);        // 1/2
const third = new MonsterFloat(1n, 3n);       // 1/3

// Perform calculations
const sum = half.add(third);                  // 5/6
const product = half.multiply(third);         // 1/6
const quotient = half.divide(third);          // 3/2
const power = half.pow(3);                    // 1/8

// Short-form aliases
const result = half.a(third).m(2).d(4);      // (1/2 + 1/3) * 2 / 4
```

### Comparison Operations

```typescript
const a = new MonsterFloat(1n, 2n);
const b = new MonsterFloat(3n, 4n);

a.isEqual(0.5);                // true
a.isLessThan(b);              // true
a.isGreaterThanOrEqual(0.25); // true
```

### Conversion Methods

```typescript
const num = new MonsterFloat(355n, 113n);

num.toNumber();           // 3.1415929203539825 (as JavaScript number)
num.toString();           // "355/113"
num.toNumberString(5n);   // "3.14159" (with specified precision)
```

### Creating from Different Types

```typescript
MonsterFloat.from(0.5);         // From number
MonsterFloat.from("1.23");      // From string
MonsterFloat.from(42n);         // From BigInt
```

## API Reference

### Constructor

- `new MonsterFloat(numerator: bigint, denominator: bigint)`

### Instance Methods

#### Arithmetic
- `add(other: Numeric)` or `a(other)` - Addition
- `subtract(other: Numeric)` or `s(other)` - Subtraction
- `multiply(other: Numeric)` or `m(other)` - Multiplication
- `divide(other: Numeric)` or `d(other)` - Division
- `pow(other: Numeric)` or `p(other)` - Exponentiation

#### Comparison
- `isEqual(other: Numeric)`
- `isLessThan(other: Numeric)`
- `isLessThanOrEqual(other: Numeric)`
- `isGreaterThan(other: Numeric)`
- `isGreaterThanOrEqual(other: Numeric)`

#### Conversion
- `toNumber(): number`
- `toString(): string`
- `toFractionString(): string`
- `toNumberString(precision: bigint): string`

### Static Methods

- `from(value: Numeric | string): MonsterFloat`

## Examples

### Exact Decimal Arithmetic

```typescript
const price = MonsterFloat.from("10.99");
const quantity = MonsterFloat.from(3);
const total = price.multiply(quantity);      // Exactly 32.97
```

### Complex Calculations

```typescript
const result = MonsterFloat.from(1)
  .divide(7)                                // 1/7
  .multiply(7)                             // 1
  .isEqual(1);                            // true (no floating point errors!)
```