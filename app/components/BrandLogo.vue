<script setup lang="ts">
type BrandLike = {
  id: string
  name: string
  logoText: string
}

type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type BrandVisual = {
  icon?: string
  colors: [string, string, string]
  foreground: string
}

const props = withDefaults(defineProps<{
  brand?: BrandLike
  size?: BrandLogoSize
}>(), {
  size: 'md'
})

const sizeClass: Record<BrandLogoSize, string> = {
  xs: 'size-7 text-[10px]',
  sm: 'size-8 text-[11px]',
  md: 'size-10 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-20 text-xl'
}

const brandVisuals: Record<string, BrandVisual> = {
  pokemon: { icon: 'i-simple-icons-pokemon', colors: ['#facc15', '#ef4444', '#0ea5e9'], foreground: '#ffffff' },
  yugioh: { icon: 'i-simple-icons-konami', colors: ['#111827', '#b91c1c', '#ef4444'], foreground: '#ffffff' },
  'magic-the-gathering': { icon: 'i-simple-icons-magic', colors: ['#1e293b', '#ea580c', '#f59e0b'], foreground: '#ffffff' },
  'one-piece-card-game': { colors: ['#dc2626', '#f59e0b', '#111827'], foreground: '#ffffff' },
  'disney-lorcana': { colors: ['#4338ca', '#7c3aed', '#f59e0b'], foreground: '#ffffff' },
  'flesh-and-blood-tcg': { colors: ['#7f1d1d', '#dc2626', '#111827'], foreground: '#ffffff' },
  'digimon-card-game': { colors: ['#f97316', '#0ea5e9', '#1d4ed8'], foreground: '#ffffff' },
  'weiss-schwarz': { colors: ['#020617', '#475569', '#ef4444'], foreground: '#ffffff' },
  'cardfight-vanguard': { colors: ['#14532d', '#16a34a', '#0ea5e9'], foreground: '#ffffff' },
  'force-of-will': { colors: ['#581c87', '#7c3aed', '#fbbf24'], foreground: '#ffffff' },
  'union-arena': { colors: ['#be123c', '#fb923c', '#facc15'], foreground: '#ffffff' },
  universus: { colors: ['#312e81', '#4f46e5', '#22c55e'], foreground: '#ffffff' },
  'dragon-ball-super-card-game': { colors: ['#f97316', '#facc15', '#2563eb'], foreground: '#111827' },
  'star-wars-unlimited': { colors: ['#020617', '#1e293b', '#38bdf8'], foreground: '#ffffff' },
  'final-fantasy-tcg': { colors: ['#0f172a', '#2563eb', '#e0f2fe'], foreground: '#ffffff' },
  'gundam-card-game': { colors: ['#1d4ed8', '#ef4444', '#f8fafc'], foreground: '#ffffff' },
  'my-little-pony-ccg': { colors: ['#ec4899', '#a855f7', '#38bdf8'], foreground: '#ffffff' },
  'warhammer-age-of-sigmar-champions-tcg': { colors: ['#111827', '#dc2626', '#f59e0b'], foreground: '#ffffff' }
}

const fallbackPalettes: [string, string, string][] = [
  ['#0f766e', '#14b8a6', '#67e8f9'],
  ['#7c2d12', '#ea580c', '#fbbf24'],
  ['#1e3a8a', '#2563eb', '#93c5fd'],
  ['#4c1d95', '#8b5cf6', '#f0abfc'],
  ['#064e3b', '#16a34a', '#bef264'],
  ['#881337', '#e11d48', '#fda4af'],
  ['#312e81', '#6366f1', '#a5b4fc'],
  ['#3f3f46', '#71717a', '#e4e4e7']
]

function hashValue(value: string) {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

const visual = computed<BrandVisual>(() => {
  const id = props.brand?.id ?? 'tcg'
  const fallback = fallbackPalettes[hashValue(id) % fallbackPalettes.length] ?? fallbackPalettes[0]!
  return brandVisuals[id] ?? { colors: fallback, foreground: '#ffffff' }
})

const mark = computed(() => {
  const text = props.brand?.logoText || props.brand?.name || 'TCG'
  return text.slice(0, 3).toUpperCase()
})

const label = computed(() => props.brand ? `${props.brand.name} 标识` : 'TCG 标识')

const logoStyle = computed(() => ({
  background: `linear-gradient(135deg, ${visual.value.colors[0]}, ${visual.value.colors[1]} 54%, ${visual.value.colors[2]})`,
  color: visual.value.foreground ?? '#ffffff'
}))
</script>

<template>
  <div
    :class="[
      sizeClass[size],
      'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-default shadow-sm'
    ]"
    :style="logoStyle"
    :aria-label="label"
    :title="brand?.name"
  >
    <div class="absolute inset-px rounded-[7px] bg-white/10 dark:bg-black/10" />
    <UIcon
      v-if="visual.icon"
      :name="visual.icon"
      class="relative z-10 size-[62%]"
    />
    <span
      v-else
      class="relative z-10 max-w-full px-1 text-center font-black leading-none tracking-normal"
    >
      {{ mark }}
    </span>
  </div>
</template>
