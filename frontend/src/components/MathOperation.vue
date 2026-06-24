<template>
  <div class="math-operation" :class="{ 'is-division': isDivision }">

    <!-- Loading -->
    <div v-if="!operation" class="d-flex justify-center">
      <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
    </div>

    <!-- Division layout -->
    <div v-else-if="isDivision" class="division-wrapper">
      <div class="division-row">
        <span class="division-num">{{ operation.num1 }}</span>
        <span class="division-sign">÷</span>
        <span class="division-num">{{ operation.num2 }}</span>
        <span class="division-sign">=</span>
        <div class="answer-group">
          <input
            ref="divInput"
            v-model="divAnswer.quotient"
            type="number"
            inputmode="numeric"
            class="digit-box digit-box--large"
            :class="feedbackClass"
            :disabled="solved"
            placeholder="?"
            @keydown.enter="emit('check', divAnswer)"
          />
          <span v-if="hasRemainder" class="division-sign" style="font-size: 1.4rem;">r</span>
          <input
            v-if="hasRemainder"
            v-model="divAnswer.remainder"
            type="number"
            inputmode="numeric"
            class="digit-box digit-box--large"
            :class="feedbackClass"
            :disabled="solved"
            placeholder="?"
            @keydown.enter="emit('check', divAnswer)"
          />
        </div>
      </div>
    </div>

    <!-- Vertical layout (suma, resta, multiplicación) -->
    <div v-else class="vertical-wrapper">

      <!-- Carry row -->
      <div class="op-row carry-row" aria-label="llevadas">
        <div class="op-cell op-cell--sign"></div>
        <div
          v-for="(c, i) in columns"
          :key="'carry-' + i"
          class="op-cell"
        >
          <input
            v-if="c.showCarry"
            v-model="carryInputs[i]"
            type="number"
            inputmode="numeric"
            maxlength="1"
            class="carry-box"
            :class="{ 'carry-box--hint': hintCarries[i] !== undefined }"
            :disabled="solved || hintCarries[i] !== undefined"
            :placeholder="hintCarries[i] !== undefined ? String(hintCarries[i]) : ''"
            @input="clampCarry(i)"
          />
          <span v-else class="carry-placeholder"></span>
        </div>
      </div>

      <!-- Number 1 row -->
      <div class="op-row num-row">
        <div class="op-cell op-cell--sign"></div>
        <div
          v-for="(c, i) in columns"
          :key="'n1-' + i"
          class="op-cell"
        >
          <span class="digit">{{ c.d1 !== null ? c.d1 : '' }}</span>
        </div>
      </div>

      <!-- Number 2 row -->
      <div class="op-row num-row">
        <div class="op-cell op-cell--sign">
          <span class="operator-sign">{{ operation.operator }}</span>
        </div>
        <div
          v-for="(c, i) in columns"
          :key="'n2-' + i"
          class="op-cell"
        >
          <span class="digit">{{ c.d2 !== null ? c.d2 : '' }}</span>
        </div>
      </div>

      <!-- Divider line -->
      <div class="op-divider"></div>

      <!-- Answer row -->
      <div class="op-row answer-row">
        <div class="op-cell op-cell--sign"></div>
        <div
          v-for="(c, i) in columns"
          :key="'ans-' + i"
          class="op-cell"
        >
          <input
            :ref="el => setAnswerRef(el, i)"
            v-model="answerDigits[i]"
            type="number"
            inputmode="numeric"
            maxlength="1"
            class="digit-box"
            :class="feedbackClass"
            :disabled="solved"
            placeholder="?"
            @input="clampDigit(i)"
            @keydown="onAnswerKeydown($event, i)"
          />
        </div>
        <!-- Extra carry-out box if result has more digits than operands -->
        <div v-if="hasExtraDigit" class="op-cell">
          <input
            v-model="answerDigits[columns.length]"
            type="number"
            inputmode="numeric"
            maxlength="1"
            class="digit-box"
            :class="feedbackClass"
            :disabled="solved"
            placeholder="?"
            @input="clampDigit(columns.length)"
          />
        </div>
      </div>
    </div>

    <!-- Feedback badge -->
    <transition name="fade-scale">
      <div v-if="feedback" class="feedback-badge" :class="'feedback-badge--' + feedback">
        <v-icon size="32">{{ feedback === 'correct' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
        <span>{{ feedback === 'correct' ? '¡Correcto!' : '¡Inténtalo de nuevo!' }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  operation: { type: Object, default: null },
  feedback:  { type: String, default: null },  // 'correct' | 'wrong' | null
  solved:    { type: Boolean, default: false },
  hintCarries: { type: Array, default: () => [] },
  hasRemainder: { type: Boolean, default: false },
})

const emit = defineEmits(['check', 'update:carryInputs', 'update:answerDigits'])

// ─── Division state ──────────────────────────────────────────────────────────
const divInput   = ref(null)
const divAnswer  = ref({ quotient: '', remainder: '' })

// ─── Vertical column decomposition ──────────────────────────────────────────
const isDivision = computed(() => props.operation?.operator === '÷')

const columns = computed(() => {
  if (isDivision.value || !props.operation) return []
  const s1 = String(props.operation.num1)
  const s2 = String(props.operation.num2)
  const ans = String(props.operation.answer)
  // Width = max of both operands and answer (to accommodate carry-out)
  const w = Math.max(s1.length, s2.length, ans.length)
  const p1 = s1.padStart(w, ' ')
  const p2 = s2.padStart(w, ' ')

  return Array.from({ length: w }, (_, i) => {
    const d1 = p1[i] === ' ' ? null : Number(p1[i])
    const d2 = p2[i] === ' ' ? null : Number(p2[i])
    // Show carry box if any column to the right could generate a carry
    const showCarry = i < w - 1
    return { d1, d2, showCarry }
  })
})

const hasExtraDigit = computed(() => {
  if (isDivision.value || !props.operation) return false
  const ans = String(props.operation.answer)
  const ops = Math.max(String(props.operation.num1).length, String(props.operation.num2).length)
  return ans.length > ops
})

// ─── Inputs (declarados antes del watch immediate) ───────────────────────────
const carryInputs  = ref([])
const answerDigits = ref([])
const answerRefs   = ref([])

watch(() => props.operation, () => {
  if (!props.operation) return
  const w = isDivision.value ? 0 : columns.value.length
  carryInputs.value  = Array(w).fill('')
  answerDigits.value = Array(w + (hasExtraDigit.value ? 1 : 0)).fill('')
  divAnswer.value    = { quotient: '', remainder: '' }
  answerRefs.value   = []
  nextTick(() => focusFirst())
}, { immediate: true })

function clampCarry(i) {
  const v = String(carryInputs.value[i]).replace(/\D/g, '').slice(0, 1)
  carryInputs.value[i] = v
}

function setAnswerRef(el, i) {
  if (el) answerRefs.value[i] = el
}

function clampDigit(i) {
  const v = String(answerDigits.value[i]).replace(/\D/g, '').slice(0, 1)
  answerDigits.value[i] = v
  // Auto-advance to next box
  if (v !== '' && i < answerRefs.value.length - 1) {
    answerRefs.value[i + 1]?.focus()
  }
}

function onAnswerKeydown(e, i) {
  if (e.key === 'Backspace' && answerDigits.value[i] === '' && i > 0) {
    answerRefs.value[i - 1]?.focus()
  }
  if (e.key === 'Enter') {
    emitCheck()
  }
  if (e.key === 'ArrowRight' && i < answerRefs.value.length - 1) {
    answerRefs.value[i + 1]?.focus()
  }
  if (e.key === 'ArrowLeft' && i > 0) {
    answerRefs.value[i - 1]?.focus()
  }
}

function focusFirst() {
  if (isDivision.value) {
    divInput.value?.focus()
  } else {
    answerRefs.value[0]?.focus()
  }
}

// ─── Check answer ─────────────────────────────────────────────────────────────
function emitCheck() {
  if (isDivision.value) {
    emit('check', divAnswer.value)
  } else {
    // Combine digit boxes into a number (left→right, drop leading empty)
    const combined = answerDigits.value.join('').replace(/^0+(?=\d)/, '') || '0'
    emit('check', combined)
  }
}

// ─── Feedback class ───────────────────────────────────────────────────────────
const feedbackClass = computed(() => ({
  'digit-box--correct': props.feedback === 'correct',
  'digit-box--wrong':   props.feedback === 'wrong',
}))

defineExpose({ emitCheck, focusFirst, carryInputs, answerDigits })
</script>

<style scoped>
/* ─── Wrapper ────────────────────────────────────────────────────────────── */
.math-operation {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}

/* ─── Vertical layout ────────────────────────────────────────────────────── */
.vertical-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Courier New', Courier, monospace;
}

.op-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.op-cell {
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.op-cell--sign {
  width: 40px;
  justify-content: flex-end;
  padding-right: 6px;
}

.operator-sign {
  font-size: 2rem;
  font-weight: 700;
  color: #5e35b1;
  line-height: 1;
}

/* ─── Digits ─────────────────────────────────────────────────────────────── */
.digit {
  font-size: 2.4rem;
  font-weight: 700;
  color: #1b1c1c;
  line-height: 1.2;
  min-width: 36px;
  text-align: center;
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
.op-divider {
  width: 100%;
  height: 3px;
  background: #4527a0;
  border-radius: 2px;
  margin: 6px 0;
}

/* ─── Carry boxes ────────────────────────────────────────────────────────── */
.carry-row {
  min-height: 32px;
  align-items: flex-end;
}

.carry-placeholder {
  display: block;
  width: 28px;
  height: 28px;
}

.carry-box {
  width: 28px;
  height: 28px;
  border: 2px dashed #b39ddb;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4527a0;
  background: #f3e5f5;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  -moz-appearance: textfield;
  appearance: textfield;
}

.carry-box::-webkit-outer-spin-button,
.carry-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.carry-box:focus {
  border-color: #7c4dff;
  background: #ede7f6;
}

.carry-box--hint {
  border-color: #ff6f00 !important;
  background: #fff3e0 !important;
  color: #e65100 !important;
  border-style: solid !important;
  animation: hint-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes hint-pop {
  from { transform: scale(0.6); }
  to   { transform: scale(1); }
}

/* ─── Answer digit boxes ─────────────────────────────────────────────────── */
.digit-box {
  width: 52px;
  height: 64px;
  border: 3px solid #b39ddb;
  border-radius: 12px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1b1c1c;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  -moz-appearance: textfield;
  appearance: textfield;
  font-family: 'Courier New', Courier, monospace;
}

.digit-box::-webkit-outer-spin-button,
.digit-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.digit-box:focus {
  border-color: #7c4dff;
  box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.15);
  transform: scale(1.05);
}

.digit-box--large {
  width: 72px;
  height: 72px;
  font-size: 2.4rem;
}

.digit-box--correct {
  border-color: #2f6a3f !important;
  background: #d3f9d8 !important;
  animation: correct-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.digit-box--wrong {
  border-color: #ba1a1a !important;
  background: #ffdad6 !important;
  animation: shake 0.4s ease;
}

@keyframes correct-bounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

/* ─── Division layout ────────────────────────────────────────────────────── */
.division-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.division-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.division-num {
  font-family: 'Courier New', Courier, monospace;
  font-size: 2.6rem;
  font-weight: 700;
  color: #1b1c1c;
}

.division-sign {
  font-size: 2.2rem;
  font-weight: 700;
  color: #5e35b1;
}

.answer-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Feedback badge ─────────────────────────────────────────────────────── */
.feedback-badge {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
}

.feedback-badge--correct {
  background: #d3f9d8;
  color: #2f6a3f;
}

.feedback-badge--wrong {
  background: #ffdad6;
  color: #ba1a1a;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
