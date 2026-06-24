<template>
  <div class="problems-panel">

    <!-- ─── Level bar ───────────────────────────────────────────────── -->
    <div class="level-bar mb-6">
      <div class="d-flex align-center gap-2">
        <span class="text-body-2 font-weight-bold" style="color: #5e35b1;">Nivel:</span>
        <v-btn
          v-for="n in 5"
          :key="n"
          size="small"
          :variant="store.level === n ? 'flat' : 'outlined'"
          :color="store.level === n ? 'deep-purple' : 'deep-purple-lighten-3'"
          class="level-btn"
          @click="changeLevel(n)"
        >{{ n }}</v-btn>
      </div>

      <div class="streak-display">
        <v-icon size="20" :color="store.streak >= 0 ? 'amber-darken-2' : 'red-darken-2'">
          {{ store.streak >= 0 ? 'mdi-fire' : 'mdi-emoticon-sad' }}
        </v-icon>
        <span class="text-body-2 font-weight-bold" :style="streakStyle">
          {{ streakLabel }}
        </span>
      </div>
    </div>

    <!-- ─── Level-up / level-down notice ───────────────────────────── -->
    <transition name="fade-scale">
      <v-alert
        v-if="levelNotice"
        :type="levelNotice.type"
        density="compact"
        rounded="pill"
        class="mb-4"
        :text="levelNotice.text"
      ></v-alert>
    </transition>

    <!-- ─── Problem card ────────────────────────────────────────────── -->
    <v-card v-if="store.problem" class="problem-card rounded-xl elevation-3 mb-6">
      <div class="problem-category-badge">
        <v-icon size="16" class="mr-1">{{ categoryIcon }}</v-icon>
        {{ categoryLabel }}
      </div>

      <div class="problem-text">
        {{ store.problem.text }}
      </div>

      <!-- Hint box -->
      <transition name="fade-scale">
        <div v-if="store.hintShown" class="hint-box mt-4">
          <v-icon size="18" color="orange-darken-2" class="mr-2">mdi-lightbulb</v-icon>
          <span>{{ store.problem.hint }}</span>
        </div>
      </transition>
    </v-card>

    <!-- ─── Answer area ─────────────────────────────────────────────── -->
    <div v-if="store.problem" class="answer-area mb-6">
      <div class="answer-label">Respuesta:</div>

      <div v-if="store.problem.isText" class="text-answer-wrap">
        <v-text-field
          v-model="userAnswer"
          :disabled="solved"
          variant="outlined"
          placeholder="Escribe tu respuesta..."
          density="comfortable"
          color="deep-purple"
          hide-details
          class="text-answer-field"
          @keydown.enter="checkAnswer"
        ></v-text-field>
        <div class="text-body-2 mt-1" style="color: #7c4dff; opacity: 0.8;">
          Tip: incluye los números en tu respuesta
        </div>
      </div>

      <input
        v-else
        ref="answerInput"
        v-model="userAnswer"
        type="number"
        inputmode="numeric"
        class="number-answer-input"
        :class="feedbackClass"
        :disabled="solved"
        placeholder="?"
        @keydown.enter="checkAnswer"
      />

      <!-- Feedback badge -->
      <transition name="fade-scale">
        <div v-if="feedback" class="feedback-badge" :class="'feedback-badge--' + feedback">
          <v-icon size="28">{{ feedback === 'correct' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
          <div>
            <div class="font-weight-bold">{{ feedback === 'correct' ? '¡Correcto!' : '¡Inténtalo de nuevo!' }}</div>
            <div v-if="feedback === 'wrong' && attempts >= 2" class="text-body-2 mt-1">
              Respuesta: <strong>{{ store.problem.answer }}</strong>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- ─── Action buttons ──────────────────────────────────────────── -->
    <div class="action-row">
      <v-btn
        v-if="!solved"
        color="deep-purple"
        size="large"
        prepend-icon="mdi-check"
        class="font-weight-bold px-8"
        elevation="2"
        :disabled="!userAnswer"
        @click="checkAnswer"
      >
        Comprobar
      </v-btn>

      <v-btn
        v-if="!solved && !store.hintShown"
        color="orange"
        variant="tonal"
        size="large"
        prepend-icon="mdi-lightbulb"
        @click="showHint"
      >
        Pista
      </v-btn>

      <v-btn
        v-if="solved"
        color="deep-purple"
        size="large"
        prepend-icon="mdi-arrow-right"
        class="font-weight-bold px-8"
        elevation="2"
        @click="nextProblem"
      >
        Siguiente
      </v-btn>

      <v-btn
        v-if="!solved"
        color="grey"
        variant="text"
        size="large"
        prepend-icon="mdi-skip-next"
        @click="nextProblem"
      >
        Saltar
      </v-btn>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useProblemsStore } from '@/stores/problems'

const store       = useProblemsStore()
const userAnswer  = ref('')
const feedback    = ref(null)
const solved      = ref(false)
const attempts    = ref(0)
const levelNotice = ref(null)
const answerInput = ref(null)
let   levelNoticeTm = null

// ─── Bootstrap ────────────────────────────────────────────────────────────────
onMounted(() => {
  if (!store.problem) store.generate()
})

// ─── Level ────────────────────────────────────────────────────────────────────
const prevLevel = ref(store.level)

watch(() => store.level, (newLevel) => {
  if (newLevel === prevLevel.value) return
  const up = newLevel > prevLevel.value
  prevLevel.value = newLevel
  clearTimeout(levelNoticeTm)
  levelNotice.value = {
    type: up ? 'success' : 'warning',
    text: up ? `¡Subiste al nivel ${newLevel}! ¡Genial!` : `Bajaste al nivel ${newLevel}. ¡Tú puedes!`,
  }
  levelNoticeTm = setTimeout(() => { levelNotice.value = null }, 3000)
})

function changeLevel(n) {
  store.setLevel(n)
  reset()
  store.generate()
}

// ─── Streak display ───────────────────────────────────────────────────────────
const streakLabel = computed(() => {
  const s = store.streak
  if (s === 0) return 'Empezando...'
  if (s > 0)   return `Racha: ${s} ✓`
  return `${Math.abs(s)} fallos`
})

const streakStyle = computed(() => ({
  color: store.streak >= 0 ? '#f57f17' : '#c62828',
}))

// ─── Category display ─────────────────────────────────────────────────────────
const CATEGORY_META = {
  reparto:           { label: 'Reparto',         icon: 'mdi-hand-heart' },
  compras:           { label: 'Compras',          icon: 'mdi-cart' },
  distancias:        { label: 'Distancias',       icon: 'mdi-map-marker-distance' },
  grupos:            { label: 'Grupos',           icon: 'mdi-account-group' },
  edades:            { label: 'Edades',           icon: 'mdi-cake' },
  tiempo:            { label: 'Tiempo',           icon: 'mdi-clock-outline' },
  porcentajes:       { label: 'Porcentajes',      icon: 'mdi-percent' },
  proporcionalidad:  { label: 'Proporción',       icon: 'mdi-scale-balance' },
}

const categoryIcon  = computed(() => CATEGORY_META[store.problem?.category]?.icon  ?? 'mdi-help-circle')
const categoryLabel = computed(() => CATEGORY_META[store.problem?.category]?.label ?? '')

// ─── Actions ──────────────────────────────────────────────────────────────────
function reset() {
  userAnswer.value = ''
  feedback.value   = null
  solved.value     = false
  attempts.value   = 0
}

function nextProblem() {
  reset()
  store.generate()
  nextTick(() => answerInput.value?.focus())
}

function showHint() {
  store.showHint()
}

function checkAnswer() {
  if (!userAnswer.value && userAnswer.value !== 0) return
  attempts.value++
  const correct = store.check(userAnswer.value)
  feedback.value = correct ? 'correct' : 'wrong'

  if (correct) {
    solved.value = true
  } else {
    // After 2 failed attempts show the answer; clear red highlight after 1.5s
    setTimeout(() => {
      if (!solved.value) feedback.value = null
    }, 1500)
  }
}

const feedbackClass = computed(() => ({
  'number-answer-input--correct': feedback.value === 'correct',
  'number-answer-input--wrong':   feedback.value === 'wrong',
}))
</script>

<style scoped>
.problems-panel {
  max-width: 640px;
  margin: 0 auto;
}

/* ─── Level bar (shared style) ───────────────────────────────────────────── */
.level-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(69, 39, 160, 0.1);
}

.level-btn {
  min-width: 36px !important;
  height: 36px !important;
  font-weight: 700 !important;
}

.streak-display {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gap-2 { gap: 8px; }

/* ─── Problem card ───────────────────────────────────────────────────────── */
.problem-card {
  background: #fff !important;
  padding: 32px !important;
  position: relative;
}

.problem-category-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #7c4dff;
  background: #ede7f6;
  border-radius: 50px;
  padding: 4px 12px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.problem-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1b1c1c;
  line-height: 1.7;
  font-family: 'Nunito Sans', sans-serif;
}

.hint-box {
  display: flex;
  align-items: flex-start;
  background: #fff3e0;
  border: 2px solid #ffcc02;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #e65100;
  font-family: 'Courier New', Courier, monospace;
}

/* ─── Answer area ────────────────────────────────────────────────────────── */
.answer-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.answer-label {
  font-size: 1rem;
  font-weight: 700;
  color: #5e35b1;
  align-self: flex-start;
}

.number-answer-input {
  width: 160px;
  height: 72px;
  border: 3px solid #b39ddb;
  border-radius: 16px;
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

.number-answer-input::-webkit-outer-spin-button,
.number-answer-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
}

.number-answer-input:focus {
  border-color: #7c4dff;
  box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.15);
  transform: scale(1.04);
}

.number-answer-input--correct {
  border-color: #2f6a3f !important;
  background: #d3f9d8 !important;
  animation: correct-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.number-answer-input--wrong {
  border-color: #ba1a1a !important;
  background: #ffdad6 !important;
  animation: shake 0.4s ease;
}

.text-answer-wrap {
  width: 100%;
}

.text-answer-field {
  font-size: 1.1rem !important;
}

/* ─── Feedback badge ─────────────────────────────────────────────────────── */
.feedback-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border-radius: 16px;
  font-size: 1.05rem;
}

.feedback-badge--correct {
  background: #d3f9d8;
  color: #2f6a3f;
}

.feedback-badge--wrong {
  background: #ffdad6;
  color: #ba1a1a;
}

/* ─── Actions ────────────────────────────────────────────────────────────── */
.action-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Animations ─────────────────────────────────────────────────────────── */
@keyframes correct-bounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
