import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

/**
 * CreativaKids Design System
 * Colores extraídos del stitch.html — Material 3 palette
 */
const creativaKidsTheme = {
  dark: false,
  colors: {
    // ─── Primary ──────────────────────────
    'primary':               '#3a5f94',
    'on-primary':            '#ffffff',
    'primary-container':     '#a0c4ff',
    'on-primary-container':  '#2a5084',

    // ─── Secondary ────────────────────────
    'secondary':               '#2f6a3f',
    'on-secondary':            '#ffffff',
    'secondary-container':     '#b2f2bb',
    'on-secondary-container':  '#357044',

    // ─── Tertiary ─────────────────────────
    'tertiary':               '#80515e',
    'on-tertiary':            '#ffffff',
    'tertiary-container':     '#eeb3c2',
    'on-tertiary-container':  '#70434f',

    // ─── Error ────────────────────────────
    'error':               '#ba1a1a',
    'on-error':            '#ffffff',
    'error-container':     '#ffdad6',
    'on-error-container':  '#93000a',

    // ─── Surface ──────────────────────────
    'surface':                    '#fbf9f8',
    'on-surface':                 '#1b1c1c',
    'surface-variant':            '#e4e2e2',
    'on-surface-variant':         '#43474f',
    'surface-bright':             '#fbf9f8',
    'surface-dim':                '#dbd9d9',
    'surface-container':          '#efeded',
    'surface-container-low':      '#f5f3f3',
    'surface-container-high':     '#eae8e7',
    'surface-container-highest':  '#e4e2e2',
    'surface-container-lowest':   '#ffffff',

    // ─── Outline ──────────────────────────
    'outline':         '#737780',
    'outline-variant': '#c3c6d1',

    // ─── Inverse ──────────────────────────
    'inverse-surface':    '#303030',
    'inverse-on-surface': '#f2f0f0',
    'inverse-primary':    '#a7c8ff',

    // ─── Background ───────────────────────
    'background':    '#fbf9f8',
    'on-background': '#1b1c1c',

    // ─── Module accent colors ─────────────
    'draw-blue':   '#d5e3ff',
    'canvas-green': '#d3f9d8',
    'notes-yellow': '#fff4cc',
    'color-pink':   '#fce4ec',
  },
}

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'creativaKidsTheme',
    themes: {
      creativaKidsTheme,
    },
  },
  defaults: {
    global: {
      ripple: true,
    },
    VBtn: {
      rounded: 'pill',
      elevation: 0,
    },
    VCard: {
      rounded: 'lg',
      elevation: 2,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VBottomNavigation: {
      elevation: 8,
      grow: true,
    },
  },
})
