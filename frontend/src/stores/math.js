import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Level config ───────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  1: { maxNum: 99,   mulMax: 5,  divMax: null },  // 8 años: 2 dígitos, × tabla hasta 5
  2: { maxNum: 499,  mulMax: 9,  divMax: 9    },  // 9 años: 3 dígitos, tabla completa, ÷ simple
  3: { maxNum: 999,  mulMax: 12, divMax: 9    },  // 10 años: 4 dígitos, × hasta 12
  4: { maxNum: 4999, mulMax: 12, divMax: 12   },  // 11 años: 5 dígitos, ÷ con resto
  5: { maxNum: 9999, mulMax: 15, divMax: 15   },  // 12 años: números grandes
}

const STREAK_UP   = 3  // aciertos seguidos para subir nivel
const STREAK_DOWN = 3  // fallos seguidos para bajar nivel

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Compute column-by-column carries for addition
function computeAddCarries(num1, num2) {
  const digits1 = String(num1).split('').map(Number).reverse()
  const digits2 = String(num2).split('').map(Number).reverse()
  const maxLen  = Math.max(digits1.length, digits2.length)
  const carries = []
  let carry = 0
  for (let i = 0; i < maxLen; i++) {
    const d1  = digits1[i] || 0
    const d2  = digits2[i] || 0
    const sum = d1 + d2 + carry
    carry = Math.floor(sum / 10)
    carries.unshift(i < maxLen - 1 ? carry : 0)
  }
  // carries[i] = carry entering column i from the right (0-indexed from left)
  return carries
}

// Compute column-by-column borrows for subtraction
function computeSubCarries(num1, num2) {
  const digits1 = String(num1).split('').map(Number).reverse()
  const digits2 = String(num2).split('').map(Number).reverse()
  const maxLen  = Math.max(digits1.length, digits2.length)
  const borrows = []
  let borrow = 0
  for (let i = 0; i < maxLen; i++) {
    const d1  = (digits1[i] || 0) - borrow
    const d2  = digits2[i] || 0
    borrow = d1 < d2 ? 1 : 0
    borrows.unshift(i < maxLen - 1 ? borrow : 0)
  }
  return borrows
}

export const useMathStore = defineStore('math', () => {
  const level     = ref(1)
  const streak    = ref(0)  // positive = consecutive correct, negative = consecutive wrong
  const operation = ref(null)
  const hintsUsed = ref(false)
  const totalCorrect = ref(0)
  const totalWrong   = ref(0)

  const levelLabel = computed(() => {
    const labels = { 1: '8 años', 2: '9 años', 3: '10 años', 4: '11 años', 5: '12 años' }
    return labels[level.value]
  })

  // ─── Level management ─────────────────────────────────────────────────────
  function setLevel(n) {
    level.value  = Math.min(5, Math.max(1, n))
    streak.value = 0
  }

  function _updateStreak(correct) {
    if (correct) {
      streak.value = streak.value > 0 ? streak.value + 1 : 1
      totalCorrect.value++
      if (streak.value >= STREAK_UP && level.value < 5) {
        level.value++
        streak.value = 0
      }
    } else {
      streak.value = streak.value < 0 ? streak.value - 1 : -1
      totalWrong.value++
      if (Math.abs(streak.value) >= STREAK_DOWN && level.value > 1) {
        level.value--
        streak.value = 0
      }
    }
  }

  // ─── Operation generator ──────────────────────────────────────────────────
  function generateOperation(operator) {
    hintsUsed.value = false
    const cfg = LEVEL_CONFIG[level.value]

    let num1, num2, answer, carries

    if (operator === '+') {
      num1    = randInt(10, cfg.maxNum)
      num2    = randInt(10, cfg.maxNum)
      answer  = num1 + num2
      carries = computeAddCarries(num1, num2)

    } else if (operator === '-') {
      num1    = randInt(10, cfg.maxNum)
      num2    = randInt(10, num1)
      answer  = num1 - num2
      carries = computeSubCarries(num1, num2)

    } else if (operator === '×') {
      const tableMax = cfg.mulMax
      num1    = randInt(2, tableMax)
      num2    = randInt(2, tableMax)
      answer  = num1 * num2
      carries = computeAddCarries(num1, num2)

    } else if (operator === '÷') {
      const tableMax = cfg.divMax || 9
      num2 = randInt(2, tableMax)
      const quotient  = randInt(2, tableMax)
      const remainder = level.value >= 4 ? randInt(0, num2 - 1) : 0
      num1    = num2 * quotient + remainder
      answer  = level.value >= 4 ? `${quotient}r${remainder}` : quotient
      carries = []
    }

    operation.value = { num1, num2, operator, answer, carries }
  }

  // ─── Answer checking ──────────────────────────────────────────────────────
  function checkAnswer(userAnswer) {
    if (!operation.value) return false

    const op = operation.value
    let correct = false

    if (op.operator === '÷' && level.value >= 4) {
      // userAnswer: { quotient, remainder }
      const [q, r] = String(op.answer).split('r').map(Number)
      correct = Number(userAnswer.quotient) === q && Number(userAnswer.remainder) === r
    } else {
      correct = Number(userAnswer) === Number(op.answer)
    }

    _updateStreak(correct)
    return correct
  }

  // ─── Hint system ──────────────────────────────────────────────────────────
  function getHint() {
    hintsUsed.value = true
    return operation.value?.carries ?? []
  }

  return {
    level,
    streak,
    operation,
    hintsUsed,
    totalCorrect,
    totalWrong,
    levelLabel,
    setLevel,
    generateOperation,
    checkAnswer,
    getHint,
  }
})
