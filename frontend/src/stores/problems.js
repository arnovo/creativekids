import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const NAMES = ['Lucía', 'Carlos', 'Sofía', 'Miguel', 'Paula', 'Andrés', 'Elena', 'Marcos', 'Alba', 'David']
const NAMES2 = ['su hermana', 'su amigo', 'su prima', 'su vecino', 'su compañera']
const ITEMS_L1 = ['caramelos', 'cromos', 'pegatinas', 'globos', 'lápices', 'figuritas', 'monedas', 'chapas']
const ITEMS_L2 = ['libros', 'bolígrafos', 'galletas', 'naranjas', 'manzanas', 'juguetes', 'cartas']
const PLACES   = ['la biblioteca', 'el colegio', 'el parque', 'la tienda', 'el mercado', 'su casa']

function name() { return pick(NAMES) }
function item(level) { return level <= 2 ? pick(ITEMS_L1) : pick(ITEMS_L2) }

// ─── Level scaling helpers ────────────────────────────────────────────────────
function numRange(level) {
  const ranges = { 1: [5, 99], 2: [20, 499], 3: [50, 999], 4: [100, 4999], 5: [500, 9999] }
  return ranges[level] || [5, 99]
}

function smallNum(level) {
  const [min, max] = numRange(level)
  return rand(min, Math.min(max, 99))
}

function bigNum(level) {
  const [min, max] = numRange(level)
  return rand(Math.max(min, 20), max)
}

function euros(n) {
  return `${n} €`
}

// ─── Template bank ────────────────────────────────────────────────────────────
const TEMPLATES = [

  // ── REPARTO ─────────────────────────────────────────────────────────────────
  {
    levels: [1, 2, 3],
    category: 'reparto',
    generate(level) {
      const parts = rand(2, level >= 2 ? 12 : 8)
      const each  = rand(2, level >= 2 ? 20 : 10)
      const total = parts * each
      return {
        text: `${name()} quiere repartir ${total} ${item(level)} entre ${parts} amigos a partes iguales. ¿Cuántos le tocan a cada amigo?`,
        answer: each,
        hint: `Divide: ${total} ÷ ${parts}`,
      }
    },
  },
  {
    levels: [1, 2],
    category: 'reparto',
    generate(level) {
      const cajas  = rand(3, 10)
      const dentro = rand(2, level === 1 ? 8 : 15)
      const total  = cajas * dentro
      return {
        text: `En ${pick(PLACES)} hay ${cajas} cajas con ${dentro} ${item(level)} cada una. ¿Cuántos ${item(level)} hay en total?`,
        answer: total,
        hint: `Multiplica: ${cajas} × ${dentro}`,
      }
    },
  },
  {
    levels: [3, 4],
    category: 'reparto',
    generate(level) {
      const total  = bigNum(level)
      const partes = rand(3, 12)
      const cada   = Math.floor(total / partes)
      const resto  = total % partes
      const usado  = cada * partes
      return {
        text: `${name()} tiene ${total} ${item(level)}. Los reparte en grupos de ${partes}. ¿Cuántos grupos completos puede hacer? ¿Cuántos le sobran?`,
        answer: `${cada} grupos y sobran ${resto}`,
        hint: `${total} ÷ ${partes} = ${cada} con resto ${resto}`,
        isText: true,
      }
    },
  },

  // ── COMPRAS ──────────────────────────────────────────────────────────────────
  {
    levels: [1, 2],
    category: 'compras',
    generate(level) {
      const precio = rand(1, level === 1 ? 9 : 25)
      const cant   = rand(2, level === 1 ? 8 : 15)
      const total  = precio * cant
      return {
        text: `${name()} compra ${cant} ${item(level)} a ${euros(precio)} cada uno. ¿Cuánto paga en total?`,
        answer: total,
        hint: `Multiplica: ${cant} × ${precio}`,
      }
    },
  },
  {
    levels: [1, 2],
    category: 'compras',
    generate(level) {
      const tenia = rand(10, level === 1 ? 50 : 100)
      const gasto = rand(1, tenia - 1)
      return {
        text: `${name()} tenía ${euros(tenia)}. Gastó ${euros(gasto)} en ${pick(PLACES)}. ¿Cuánto dinero le queda?`,
        answer: tenia - gasto,
        hint: `Resta: ${tenia} − ${gasto}`,
      }
    },
  },
  {
    levels: [2, 3],
    category: 'compras',
    generate(level) {
      const p1 = rand(2, 20), c1 = rand(2, 8)
      const p2 = rand(2, 20), c2 = rand(2, 8)
      const total = p1 * c1 + p2 * c2
      const items = [item(level), item(level)]
      return {
        text: `${name()} compra ${c1} ${items[0]} a ${euros(p1)} cada uno y ${c2} ${items[1]} a ${euros(p2)} cada uno. ¿Cuánto paga en total?`,
        answer: total,
        hint: `(${c1} × ${p1}) + (${c2} × ${p2}) = ${p1 * c1} + ${p2 * c2}`,
      }
    },
  },
  {
    levels: [3, 4],
    category: 'compras',
    generate(level) {
      const precio  = rand(50, level === 3 ? 200 : 800)
      const dto     = pick([10, 20, 25, 50])
      const ahorro  = Math.round(precio * dto / 100)
      const final   = precio - ahorro
      return {
        text: `Un artículo cuesta ${euros(precio)}. Está rebajado un ${dto}%. ¿Cuánto cuesta con el descuento?`,
        answer: final,
        hint: `Ahorro = ${precio} × ${dto}/100 = ${ahorro} €. Precio final = ${precio} − ${ahorro}`,
      }
    },
  },
  {
    levels: [4, 5],
    category: 'compras',
    generate(level) {
      const precio  = rand(200, 2000)
      const pct     = pick([10, 20, 25])
      const entrada = Math.round(precio * pct / 100)
      const resto   = precio - entrada
      const meses   = pick([6, 10, 12])
      const cuota   = Math.round(resto / meses)
      return {
        text: `Una bicicleta cuesta ${euros(precio)}. ${name()} paga el ${pct}% de entrada y el resto en ${meses} plazos iguales. ¿Cuánto paga cada mes?`,
        answer: cuota,
        hint: `Entrada = ${euros(entrada)}. Resto = ${euros(resto)}. Cuota = ${resto} ÷ ${meses}`,
      }
    },
  },

  // ── DISTANCIAS / TIEMPO ──────────────────────────────────────────────────────
  {
    levels: [1, 2],
    category: 'distancias',
    generate(level) {
      const ida = rand(level === 1 ? 1 : 5, level === 1 ? 15 : 50)
      return {
        text: `${name()} vive a ${ida} km del colegio. ¿Cuántos km recorre en total si va y vuelve?`,
        answer: ida * 2,
        hint: `Suma ida y vuelta: ${ida} + ${ida}`,
      }
    },
  },
  {
    levels: [2, 3],
    category: 'distancias',
    generate(level) {
      const vel  = pick([50, 60, 80, 100])
      const horas = rand(2, level === 2 ? 4 : 8)
      const dist = vel * horas
      return {
        text: `Un tren viaja a ${vel} km/h durante ${horas} horas. ¿Cuántos kilómetros recorre en total?`,
        answer: dist,
        hint: `Distancia = velocidad × tiempo = ${vel} × ${horas}`,
      }
    },
  },
  {
    levels: [3, 4],
    category: 'distancias',
    generate(level) {
      const dist = rand(100, level === 3 ? 500 : 1200)
      const vel  = pick([40, 50, 60, 80, 100])
      const h    = Math.floor(dist / vel)
      const real = h * vel
      return {
        text: `La distancia entre dos ciudades es ${real} km. Un coche circula a ${vel} km/h. ¿Cuántas horas tarda en llegar?`,
        answer: h,
        hint: `Tiempo = distancia ÷ velocidad = ${real} ÷ ${vel}`,
      }
    },
  },
  {
    levels: [4, 5],
    category: 'distancias',
    generate() {
      const d1 = rand(3, 15), v1 = pick([40, 50, 60])
      const d2 = rand(3, 15), v2 = pick([40, 50, 60])
      const t1 = Math.round((d1 / v1) * 60)
      const t2 = Math.round((d2 / v2) * 60)
      const total = t1 + t2
      return {
        text: `${name()} hace dos trayectos. El primero de ${d1} km a ${v1} km/h y el segundo de ${d2} km a ${v2} km/h. ¿Cuántos minutos dura el viaje completo? (Redondea al minuto entero)`,
        answer: total,
        hint: `T1 = (${d1}÷${v1})×60 ≈ ${t1} min. T2 = (${d2}÷${v2})×60 ≈ ${t2} min. Total = ${t1}+${t2}`,
      }
    },
  },

  // ── GRUPOS / MULTIPLICACIÓN ──────────────────────────────────────────────────
  {
    levels: [1, 2],
    category: 'grupos',
    generate(level) {
      const filas = rand(2, level === 1 ? 8 : 15)
      const cols  = rand(2, level === 1 ? 8 : 15)
      const total = filas * cols
      return {
        text: `En el colegio hay ${filas} filas de sillas con ${cols} sillas cada una. ¿Cuántas sillas hay en total?`,
        answer: total,
        hint: `Multiplica: ${filas} × ${cols}`,
      }
    },
  },
  {
    levels: [2, 3],
    category: 'grupos',
    generate(level) {
      const grupos = rand(3, 10)
      const por    = rand(3, level === 2 ? 8 : 15)
      const total  = grupos * por
      const resto  = rand(1, 5)
      return {
        text: `En una excursión hay ${grupos} grupos de ${por} alumnos y ${resto} profesores. ¿Cuántas personas hay en total?`,
        answer: total + resto,
        hint: `Alumnos = ${grupos} × ${por} = ${total}. Total = ${total} + ${resto}`,
      }
    },
  },
  {
    levels: [3, 4, 5],
    category: 'grupos',
    generate(level) {
      const sem   = rand(2, level <= 3 ? 6 : 12)
      const dias  = pick([5, 6, 7])
      const horas = rand(1, 4)
      const total = sem * dias * horas
      return {
        text: `${name()} practica deporte ${horas} hora${horas > 1 ? 's' : ''} al día, ${dias} días a la semana durante ${sem} semanas. ¿Cuántas horas en total?`,
        answer: total,
        hint: `${horas} × ${dias} × ${sem} = ${total}`,
      }
    },
  },

  // ── EDADES / TIEMPO ──────────────────────────────────────────────────────────
  {
    levels: [1, 2],
    category: 'edades',
    generate() {
      const n    = name()
      const edad = rand(8, 14)
      const diff = rand(2, 8)
      return {
        text: `${n} tiene ${edad} años. ${pick(NAMES2)} tiene ${diff} años más. ¿Cuántos años tiene ${pick(NAMES2)}?`,
        answer: edad + diff,
        hint: `Suma: ${edad} + ${diff}`,
      }
    },
  },
  {
    levels: [2, 3],
    category: 'edades',
    generate() {
      const n    = name()
      const suma = rand(20, 40)
      const diff = rand(2, 8)
      const mayor = Math.round((suma + diff) / 2)
      const menor = suma - mayor
      return {
        text: `La suma de las edades de ${n} y su hermano es ${suma} años. El hermano tiene ${diff} años más. ¿Cuántos años tiene cada uno?`,
        answer: `${n}: ${menor}, hermano: ${mayor}`,
        hint: `Hermano = (${suma} + ${diff}) ÷ 2 = ${mayor}. ${n} = ${suma} − ${mayor} = ${menor}`,
        isText: true,
      }
    },
  },
  {
    levels: [1, 2, 3],
    category: 'tiempo',
    generate(level) {
      const inicio  = rand(7, 15)
      const durMin  = rand(level === 1 ? 10 : 30, level === 1 ? 60 : 180)
      const finH    = Math.floor((inicio * 60 + durMin) / 60)
      const finM    = (inicio * 60 + durMin) % 60
      return {
        text: `Una película empieza a las ${inicio}:00 h y dura ${durMin} minutos. ¿A qué hora termina?`,
        answer: `${finH}:${finM.toString().padStart(2, '0')}`,
        hint: `${inicio}:00 + ${durMin} min = ${finH}:${finM.toString().padStart(2, '0')}`,
        isText: true,
      }
    },
  },
  {
    levels: [3, 4, 5],
    category: 'tiempo',
    generate(level) {
      const dias  = rand(level === 3 ? 10 : 30, level === 3 ? 60 : 365)
      const sem   = Math.floor(dias / 7)
      const resto = dias % 7
      return {
        text: `Han pasado ${dias} días desde el comienzo del año. ¿Cuántas semanas completas han pasado? ¿Y cuántos días sueltos?`,
        answer: `${sem} semanas y ${resto} días`,
        hint: `${dias} ÷ 7 = ${sem} semanas con resto ${resto}`,
        isText: true,
      }
    },
  },

  // ── PROPORCIONALIDAD / PORCENTAJES ────────────────────────────────────────────
  {
    levels: [3, 4],
    category: 'porcentajes',
    generate(level) {
      const total = rand(level === 3 ? 20 : 100, level === 3 ? 100 : 500)
      const pct   = pick([10, 20, 25, 50])
      const parte = Math.round(total * pct / 100)
      return {
        text: `En una clase hay ${total} alumnos. El ${pct}% lleva gafas. ¿Cuántos alumnos llevan gafas?`,
        answer: parte,
        hint: `${total} × ${pct} ÷ 100 = ${parte}`,
      }
    },
  },
  {
    levels: [4, 5],
    category: 'porcentajes',
    generate() {
      const parte = rand(5, 80)
      const pct   = pick([10, 20, 25, 50])
      const total = Math.round(parte * 100 / pct)
      return {
        text: `${parte} alumnos de una clase van al partido. Eso es el ${pct}% de la clase. ¿Cuántos alumnos tiene la clase en total?`,
        answer: total,
        hint: `Total = ${parte} × 100 ÷ ${pct} = ${total}`,
      }
    },
  },
  {
    levels: [5],
    category: 'porcentajes',
    generate() {
      const precio   = rand(100, 1000)
      const subida   = pick([5, 10, 15, 20])
      const nuevo    = Math.round(precio * (1 + subida / 100))
      return {
        text: `El precio de un producto era ${euros(precio)}. Ha subido un ${subida}%. ¿Cuál es el nuevo precio?`,
        answer: nuevo,
        hint: `Nuevo precio = ${precio} × (1 + ${subida}/100) = ${precio} × ${1 + subida / 100}`,
      }
    },
  },

  // ── PROPORCIONALIDAD DIRECTA ─────────────────────────────────────────────────
  {
    levels: [3, 4, 5],
    category: 'proporcionalidad',
    generate(level) {
      const cant1   = rand(2, level === 3 ? 8 : 20)
      const precio1 = rand(2, level === 3 ? 15 : 50)
      const cant2   = rand(cant1 + 1, level === 3 ? 20 : 60)
      const precio2 = Math.round(cant2 * precio1 / cant1)
      return {
        text: `Si ${cant1} ${item(level)} cuestan ${euros(precio1)}, ¿cuánto costarán ${cant2}?`,
        answer: precio2,
        hint: `Precio por unidad = ${precio1} ÷ ${cant1}. Luego × ${cant2}`,
      }
    },
  },
  {
    levels: [4, 5],
    category: 'proporcionalidad',
    generate() {
      const obreros1 = rand(2, 8)
      const dias1    = rand(3, 12)
      const obreros2 = rand(obreros1 + 1, obreros1 * 3)
      const dias2    = Math.round(obreros1 * dias1 / obreros2)
      return {
        text: `${obreros1} obreros tardan ${dias1} días en construir una pared. ¿Cuántos días tardarán ${obreros2} obreros trabajando al mismo ritmo?`,
        answer: dias2,
        hint: `Proporcionalidad inversa: ${obreros1} × ${dias1} = ${obreros2} × x → x = ${obreros1 * dias1} ÷ ${obreros2}`,
      }
    },
  },
]

// ─── Streak constants ─────────────────────────────────────────────────────────
const STREAK_UP   = 3
const STREAK_DOWN = 3

export const useProblemsStore = defineStore('problems', () => {
  const level        = ref(1)
  const streak       = ref(0)
  const problem      = ref(null)
  const hintShown    = ref(false)
  const totalCorrect = ref(0)
  const totalWrong   = ref(0)

  const levelLabel = computed(() => {
    const labels = { 1: '8 años', 2: '9 años', 3: '10 años', 4: '11 años', 5: '12 años' }
    return labels[level.value]
  })

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

  function generate() {
    hintShown.value = false
    const valid = TEMPLATES.filter(t => t.levels.includes(level.value))
    const tmpl  = pick(valid)
    problem.value = tmpl.generate(level.value)
  }

  function check(userAnswer) {
    if (!problem.value) return false
    let correct = false
    const expected = String(problem.value.answer).trim().toLowerCase()
    const given    = String(userAnswer).trim().toLowerCase()

    if (problem.value.isText) {
      // For text answers, check if key numbers match (flexible)
      const expNums = expected.match(/\d+/g) || []
      const givNums = given.match(/\d+/g) || []
      correct = JSON.stringify(expNums.sort()) === JSON.stringify(givNums.sort())
    } else {
      correct = Number(given) === Number(expected)
    }

    _updateStreak(correct)
    return correct
  }

  function showHint() {
    hintShown.value = true
    return problem.value?.hint ?? ''
  }

  return {
    level,
    streak,
    problem,
    hintShown,
    totalCorrect,
    totalWrong,
    levelLabel,
    setLevel,
    generate,
    check,
    showHint,
  }
})
