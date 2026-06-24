<template>
  <div class="math-view h-100 w-100 bg-grey-lighten-4 pa-4 pa-md-8 overflow-y-auto">

    <!-- ─── Header ────────────────────────────────────────────────────────── -->
    <div class="d-flex align-center mb-4 gap-3">
      <v-btn
        v-if="activeOperator"
        icon="mdi-arrow-left"
        variant="tonal"
        color="deep-purple"
        @click="backToSelector"
      ></v-btn>
      <div class="flex-grow-1">
        <h2 class="text-h5 font-weight-bold" style="color: #4527a0;">
          {{ activeOperator ? operatorLabel : 'Matemáticas' }}
        </h2>
        <p class="text-body-2" style="color: #7c4dff;">
          {{ activeOperator ? mathStore.levelLabel : '¿Qué quieres practicar hoy?' }}
        </p>
      </div>
    </div>

    <!-- ─── Mode toggle ───────────────────────────────────────────────────── -->
    <div v-if="!activeOperator" class="mode-toggle mb-6">
      <v-btn-toggle
        v-model="mode"
        mandatory
        color="deep-purple"
        variant="outlined"
        rounded="pill"
        density="comfortable"
      >
        <v-btn value="ops" prepend-icon="mdi-calculator-variant">
          Operaciones
        </v-btn>
        <v-btn value="problems" prepend-icon="mdi-text-box-outline">
          Problemas
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- ─── Problems mode ─────────────────────────────────────────────────── -->
    <ProblemsPanel v-if="mode === 'problems' && !activeOperator" />

    <!-- ─── Ops mode (selector + practice) ──────────────────────────────── -->
    <transition v-if="mode === 'ops'" name="slide-fade" mode="out-in">
      <div v-if="!activeOperator" key="selector">
        <v-row justify="center">
          <v-col
            v-for="op in operators"
            :key="op.symbol"
            cols="6"
            md="3"
          >
            <v-card
              class="op-card d-flex flex-column align-center justify-center pa-6 rounded-xl"
              :color="op.color"
              hover
              @click="selectOperator(op.symbol)"
            >
              <span class="op-symbol">{{ op.symbol }}</span>
              <span class="op-label mt-3">{{ op.label }}</span>
            </v-card>
          </v-col>
        </v-row>

        <!-- Stats strip -->
        <div class="stats-strip mt-8">
          <div class="stat-item">
            <v-icon color="green-darken-2">mdi-check-circle</v-icon>
            <span>{{ mathStore.totalCorrect }} correctas</span>
          </div>
          <div class="stat-item">
            <v-icon color="red-darken-2">mdi-close-circle</v-icon>
            <span>{{ mathStore.totalWrong }} falladas</span>
          </div>
          <div class="stat-item">
            <v-icon color="deep-purple">mdi-star</v-icon>
            <span>Nivel {{ mathStore.level }} · {{ mathStore.levelLabel }}</span>
          </div>
        </div>
      </div>

      <!-- ─── Practice screen ───────────────────────────────────────────── -->
      <div v-else key="practice" class="practice-wrapper">

        <!-- Level selector + streak -->
        <div class="level-bar mb-6">
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 font-weight-bold" style="color: #5e35b1;">Nivel:</span>
            <v-btn
              v-for="n in 5"
              :key="n"
              size="small"
              :variant="mathStore.level === n ? 'flat' : 'outlined'"
              :color="mathStore.level === n ? 'deep-purple' : 'deep-purple-lighten-3'"
              class="level-btn"
              @click="changeLevel(n)"
            >{{ n }}</v-btn>
          </div>

          <div class="streak-display">
            <v-icon size="20" :color="mathStore.streak >= 0 ? 'amber-darken-2' : 'red-darken-2'">
              {{ mathStore.streak >= 0 ? 'mdi-fire' : 'mdi-emoticon-sad' }}
            </v-icon>
            <span class="text-body-2 font-weight-bold" :style="streakColor">
              {{ streakLabel }}
            </span>
          </div>
        </div>

        <!-- Auto-level notification -->
        <transition name="fade-scale">
          <v-alert
            v-if="levelNotice"
            :type="levelNotice.type"
            density="compact"
            rounded="pill"
            class="mb-4 level-notice"
            :text="levelNotice.text"
          ></v-alert>
        </transition>

        <!-- Operation card -->
        <v-card class="operation-card rounded-xl pa-8 pa-md-12 elevation-3 mb-6">
          <MathOperation
            ref="mathOpRef"
            :operation="mathStore.operation"
            :feedback="feedback"
            :solved="solved"
            :hint-carries="hintCarries"
            :has-remainder="mathStore.level >= 4 && activeOperator === '÷'"
            @check="onCheck"
          />
        </v-card>

        <!-- Action buttons -->
        <div class="action-row">
          <v-btn
            v-if="!solved"
            color="deep-purple"
            size="large"
            prepend-icon="mdi-check"
            class="font-weight-bold px-8"
            elevation="2"
            @click="checkAnswer"
          >
            Comprobar
          </v-btn>

          <v-btn
            v-if="!solved && activeOperator !== '÷'"
            color="orange"
            variant="tonal"
            size="large"
            prepend-icon="mdi-lightbulb"
            :disabled="mathStore.hintsUsed"
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
            @click="nextOperation"
          >
            Siguiente
          </v-btn>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMathStore } from '@/stores/math'
import MathOperation from '@/components/MathOperation.vue'
import ProblemsPanel from '@/components/ProblemsPanel.vue'

const mathStore      = useMathStore()
const mode           = ref('ops')   // 'ops' | 'problems'
const mathOpRef      = ref(null)
const activeOperator = ref(null)
const feedback       = ref(null)   // 'correct' | 'wrong' | null
const solved         = ref(false)
const hintCarries    = ref([])
const levelNotice    = ref(null)
let   levelNoticeTm  = null

const operators = [
  { symbol: '+', label: 'Sumar',       color: '#d5e3ff' },
  { symbol: '-', label: 'Restar',      color: '#d3f9d8' },
  { symbol: '×', label: 'Multiplicar', color: '#fff4cc' },
  { symbol: '÷', label: 'Dividir',     color: '#fce4ec' },
]

const operatorLabel = computed(() => {
  return operators.find(o => o.symbol === activeOperator.value)?.label ?? ''
})

const streakLabel = computed(() => {
  const s = mathStore.streak
  if (s === 0) return 'Empezando...'
  if (s > 0)   return `Racha: ${s} ✓`
  return `${Math.abs(s)} fallos`
})

const streakColor = computed(() => ({
  color: mathStore.streak >= 0 ? '#f57f17' : '#c62828',
}))

// ─── Navigation ──────────────────────────────────────────────────────────────
function selectOperator(op) {
  activeOperator.value = op
  startOperation()
}

function backToSelector() {
  activeOperator.value = null
  feedback.value    = null
  solved.value      = false
  hintCarries.value = []
}

// ─── Level control ────────────────────────────────────────────────────────────
function changeLevel(n) {
  mathStore.setLevel(n)
  startOperation()
}

// Watch for auto-level changes coming from the store
const prevLevel = ref(mathStore.level)
watch(() => mathStore.level, (newLevel) => {
  if (newLevel === prevLevel.value) return
  const up = newLevel > prevLevel.value
  prevLevel.value = newLevel
  clearTimeout(levelNoticeTm)
  levelNotice.value = {
    type: up ? 'success' : 'warning',
    text: up
      ? `¡Subiste al nivel ${newLevel}! ¡Genial! 🎉`
      : `Bajaste al nivel ${newLevel}. ¡Tú puedes! 💪`,
  }
  levelNoticeTm = setTimeout(() => { levelNotice.value = null }, 3000)
})

// ─── Operation flow ───────────────────────────────────────────────────────────
function startOperation() {
  mathStore.generateOperation(activeOperator.value)
  feedback.value    = null
  solved.value      = false
  hintCarries.value = []
}

function showHint() {
  hintCarries.value = mathStore.getHint()
}

function checkAnswer() {
  mathOpRef.value?.emitCheck()
}

function onCheck(userAnswer) {
  const correct = mathStore.checkAnswer(userAnswer)
  feedback.value = correct ? 'correct' : 'wrong'

  if (correct) {
    solved.value = true
  } else {
    setTimeout(() => { feedback.value = null }, 1200)
  }
}

function nextOperation() {
  startOperation()
}
</script>

<style scoped>
/* ─── View wrapper ───────────────────────────────────────────────────────── */
.math-view {
  min-height: calc(100vh - 64px);
}

.gap-3 { gap: 12px; }
.gap-2 { gap: 8px; }

/* ─── Operator selector cards ────────────────────────────────────────────── */
.op-card {
  cursor: pointer;
  min-height: 160px;
  border-radius: 20px !important;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.25s ease !important;
}

.op-card:hover {
  transform: translateY(-6px) scale(1.04);
  box-shadow: 0 16px 40px rgba(69, 39, 160, 0.18) !important;
}

.op-card:active {
  transform: scale(0.95) !important;
}

.op-symbol {
  font-size: 4rem;
  font-weight: 900;
  color: #4527a0;
  line-height: 1;
  font-family: 'Courier New', Courier, monospace;
}

.op-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #5e35b1;
}

/* ─── Stats strip ────────────────────────────────────────────────────────── */
.stats-strip {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #5e35b1;
}

/* ─── Practice wrapper ───────────────────────────────────────────────────── */
.practice-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

/* ─── Level bar ──────────────────────────────────────────────────────────── */
.level-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(255,255,255,0.8);
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

/* ─── Level notice ───────────────────────────────────────────────────────── */
.level-notice {
  text-align: center;
  font-weight: 700;
}

/* ─── Operation card ─────────────────────────────────────────────────────── */
.operation-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  background: #fff !important;
}

/* ─── Action row ─────────────────────────────────────────────────────────── */
.action-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-fade-enter-from { opacity: 0; transform: translateX(24px); }
.slide-fade-leave-to   { opacity: 0; transform: translateX(-24px); }

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

h2, h3 {
  font-family: 'Quicksand', sans-serif !important;
}
</style>
