

export const MonsterMath = {
  random : (min : bigint,max : bigint) => BigInt(Math.floor(Math.random()*Number(max-min)+Number(min))),
  abs : (x : bigint) => x < 0 ? -x : x,
  gcd : (a : bigint, b : bigint): bigint => b == 0n ? a : MonsterMath.gcd(b, a % b)
} as const