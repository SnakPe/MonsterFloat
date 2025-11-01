import { MonsterFloat } from "../src/MonsterFloat.js"
import { MonsterMath } from "../src/MonsterMath.js"

function testLongDivisionRandomly(){
  for(let i = 1; i < 1000; i++){
    const mf = new MonsterFloat(MonsterMath.random(0n,99999n), MonsterMath.random(1n,9999999n))
    const f = Number(mf.numerator)/Number(mf.denominator)
    console.log(mf,f)
    if(Number(mf.toNumberString()) !== f) throw Error(`mf:${mf.toFractionString()} ~> ${mf.toNumberString()} !== f:${f}`)
  }
}
function testLongDivision(){
    for(let i = 1n; i < 99999n; i++){
        for(let j = 1n; j < 99999n; j++){
            const mf = new MonsterFloat(i, j)
            const f = Number(mf.numerator)/Number(mf.denominator)
            console.log(mf,f)
            if(Number(mf.toNumberString(32n)) !== f) throw Error(`mf:${mf.toFractionString()} ~> ${mf.toNumberString()} !== f:${f}`)
        }
    }
}