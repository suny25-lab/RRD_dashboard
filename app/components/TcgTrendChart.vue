<script setup lang="ts">
type TrendPoint = {
  week: string
  heat: number
}

type TrendSeries = {
  name: string
  points: TrendPoint[]
}

const props = withDefaults(defineProps<{
  series: TrendSeries[]
  relative?: boolean
  height?: number
}>(), {
  relative: false,
  height: 280
})

const palette = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

const chart = computed(() => {
  const width = 1000
  const height = props.height
  const pad = { top: 18, right: 22, bottom: 38, left: 46 }
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom

  const prepared = props.series.map((item, index) => {
    const points = item.points.slice(-26)
    const base = points.find(point => point.heat > 0)?.heat || 1
    const values = points.map(point => ({
      week: point.week,
      value: props.relative ? (point.heat / base) * 100 : point.heat
    }))

    return {
      name: item.name,
      color: palette[index % palette.length],
      values
    }
  })

  const allValues = prepared.flatMap(item => item.values.map(point => point.value))
  const maxValue = Math.max(...allValues, props.relative ? 120 : 10)
  const minValue = Math.min(...allValues, 0)
  const spread = Math.max(maxValue - minValue, 1)
  const maxLength = Math.max(...prepared.map(item => item.values.length), 1)

  const lineFor = (values: { value: number }[]) => {
    return values.map((point, index) => {
      const x = pad.left + (maxLength === 1 ? 0 : (index / (maxLength - 1)) * innerWidth)
      const y = pad.top + innerHeight - ((point.value - minValue) / spread) * innerHeight
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
  }

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = maxValue - ratio * spread
    const y = pad.top + ratio * innerHeight

    return {
      y,
      label: props.relative ? `${Math.round(value)}` : value.toFixed(value >= 10 ? 0 : 1)
    }
  })

  const labels = prepared[0]?.values || []
  const xLabels = labels.length > 1
    ? [0, Math.floor((labels.length - 1) / 2), labels.length - 1].map(index => ({
        x: pad.left + (index / (labels.length - 1)) * innerWidth,
        label: labels[index]?.week.slice(5) || ''
      }))
    : []

  return { width, height, prepared, ticks, xLabels, lineFor }
})
</script>

<template>
  <div class="min-w-0">
    <svg
      :viewBox="`0 0 ${chart.width} ${chart.height}`"
      class="w-full"
      :style="{ height: `${height}px` }"
      role="img"
      aria-label="TCG 趋势图"
    >
      <g v-for="tick in chart.ticks" :key="tick.y">
        <line
          x1="46"
          x2="978"
          :y1="tick.y"
          :y2="tick.y"
          stroke="currentColor"
          class="text-muted/20"
          stroke-width="1"
        />
        <text x="12" :y="tick.y + 4" class="fill-muted text-[22px]">
          {{ tick.label }}
        </text>
      </g>

      <g v-for="label in chart.xLabels" :key="label.label">
        <text
          :x="label.x"
          :y="chart.height - 10"
          text-anchor="middle"
          class="fill-muted text-[22px]"
        >
          {{ label.label }}
        </text>
      </g>

      <polyline
        v-for="item in chart.prepared"
        :key="item.name"
        :points="chart.lineFor(item.values)"
        fill="none"
        :stroke="item.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
      <div v-for="item in chart.prepared" :key="item.name" class="flex items-center gap-2 text-xs text-muted">
        <span class="size-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
        <span class="truncate">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
