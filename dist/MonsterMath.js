export const MonsterMath = {
    random: (min, max) => BigInt(Math.floor(Math.random() * Number(max - min) + Number(min))),
    abs: (x) => x < 0 ? -x : x,
    gcd: (a, b) => b == 0n ? a : MonsterMath.gcd(b, a % b)
};
