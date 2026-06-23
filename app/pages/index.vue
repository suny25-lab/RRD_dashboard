<script setup lang="ts">
import { tcgdb } from '~/data/tcgdb'
import { signalLabel, stateLabel } from '~/utils/tcg-i18n'

const { isNotificationsSlideoverOpen } = useDashboard()

const brandMap = computed(() => new Map(tcgdb.brands.map(brand => [brand.id, brand])))

function isBrand<T>(value: T | undefined): value is T {
  return Boolean(value)
}

const currentTop = computed(() => tcgdb.rankings.currentTop10.map(id => brandMap.value.get(id)).filter(isBrand))
const changeWindow = ref(4)
const changeWindowItems = [{
  label: '近4周',
  value: 4
}, {
  label: '近8周',
  value: 8
}, {
  label: '近12周',
  value: 12
}]

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
}

function trendPointsFor(brandId: string) {
  return (tcgdb.brandTrends as Record<string, { week: string, heat: number }[]>)[brandId] || []
}

function heatChangeFor(brandId: string, weeks: number) {
  const points = trendPointsFor(brandId)
  const current = points.slice(-weeks)
  const previous = points.slice(-(weeks * 2), -weeks)
  return average(current.map(point => point.heat)) - average(previous.map(point => point.heat))
}

const risingTop = computed(() => [...tcgdb.brands].sort((a, b) => heatChangeFor(b.id, changeWindow.value) - heatChangeFor(a.id, changeWindow.value)).slice(0, 10))
const fallingTop = computed(() => [...tcgdb.brands].sort((a, b) => heatChangeFor(a.id, changeWindow.value) - heatChangeFor(b.id, changeWindow.value)).slice(0, 10))
const majorChanges = computed(() => [...tcgdb.brands].sort((a, b) => Math.abs(heatChangeFor(b.id, changeWindow.value)) - Math.abs(heatChangeFor(a.id, changeWindow.value))).slice(0, 12))

const comparisonGroups = computed(() => {
  const groups = []
  for (let index = 0; index < tcgdb.brands.length; index += 6) {
    groups.push(tcgdb.brands.slice(index, index + 6))
  }
  return groups
})

const selectedGroup = ref(0)
const relativeMode = ref(false)
const comparisonGroupItems = computed(() => comparisonGroups.value.map((group, index) => ({
  label: `第 ${index + 1} 组`,
  title: `第 ${index + 1} 组：${group[0]?.name} - ${group[group.length - 1]?.name}`,
  value: index
})))

const comparisonSeries = computed(() => {
  return (comparisonGroups.value[selectedGroup.value] || []).map(brand => ({
    name: brand.name,
    points: [...trendPointsFor(brand.id)]
  }))
})

const overallSeries = computed(() => [{
  name: 'Google Trends 市场搜索热度',
  points: [...tcgdb.overallTrend]
}])

function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(Math.round(value))
}

function formatSigned(value: number, suffix = ' 点') {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}${suffix}`
}

function stateColor(state: string) {
  if (state === 'Warming') return 'success' as const
  if (state === 'Cooling') return 'error' as const
  return 'neutral' as const
}

function selectComparisonGroup(value: number) {
  selectedGroup.value = value
}
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="TCGDB 看板" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse aria-label="收起侧边栏" />
        </template>

        <template #trailing>
          <UBadge color="primary" variant="subtle">
            51 个品牌
          </UBadge>
        </template>

        <template #right>
          <UTooltip text="通知" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UBadge variant="soft" color="neutral">
            最新完整周：{{ tcgdb.summary.latestCompleteWeek }}
          </UBadge>
          <UBadge variant="soft" color="neutral">
            美国 Google Trends，英文 cards 搜索词
          </UBadge>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UPageCard title="覆盖品牌数" icon="i-lucide-users" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ tcgdb.summary.brandCount }}
          </div>
          <p class="text-sm text-muted">
            Pokemon Japan 已合并到 Pokemon。
          </p>
        </UPageCard>

        <UPageCard title="最新完整周" icon="i-lucide-calendar-check" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ tcgdb.summary.latestCompleteWeek }}
          </div>
          <p class="text-sm text-muted">
            热度排名仅使用 Google Trends。
          </p>
        </UPageCard>

        <UPageCard title="TCGplayer 产品" icon="i-lucide-boxes" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(tcgdb.summary.activeProducts) }}
          </div>
          <p class="text-sm text-muted">
            产品覆盖数据，不计入热度。
          </p>
        </UPageCard>

        <UPageCard title="活跃系列" icon="i-lucide-layers-3" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(tcgdb.summary.activeSeries) }}
          </div>
          <p class="text-sm text-muted">
            系列覆盖来自 TCGplayer。
          </p>
        </UPageCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <UCard :ui="{ body: 'space-y-4' }">
          <template #header>
            <div>
              <h2 class="font-semibold text-highlighted">
                市场搜索热度
              </h2>
              <p class="text-sm text-muted">
                近26周 Google Trends 汇总，已归一化展示。
              </p>
            </div>
          </template>

          <TcgTrendChart :series="overallSeries" :height="320" />
        </UCard>

        <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
          <template #header>
            <div>
              <h2 class="font-semibold text-highlighted">
                主要变化
              </h2>
              <p class="text-sm text-muted">
                当前周期内 Google Trends 变化最大的品牌。
              </p>
            </div>
          </template>

          <NuxtLink
            v-for="brand in majorChanges.slice(0, 8)"
            :key="brand.id"
            :to="`/customers/${brand.id}`"
            class="flex items-center justify-between gap-3 p-4 transition hover:bg-elevated/40"
          >
            <div class="min-w-0">
              <p class="truncate font-medium text-highlighted">
                {{ brand.name }}
              </p>
              <p class="text-xs text-muted">
                主要信号：{{ signalLabel(brand.latestSignal) }}
              </p>
            </div>
            <div class="text-right">
              <UBadge :color="stateColor(brand.state)" variant="subtle">
                {{ stateLabel(brand.state) }}
              </UBadge>
              <p class="mt-1 text-sm font-medium" :class="heatChangeFor(brand.id, changeWindow) >= 0 ? 'text-success' : 'text-error'">
                {{ formatSigned(heatChangeFor(brand.id, changeWindow)) }}
              </p>
            </div>
          </NuxtLink>
        </UCard>
      </div>

      <section class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-highlighted">
            品牌热度排名
          </h2>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <p class="text-sm text-muted">
              当前热度、上升、下降 Top 10 直接展示。
            </p>
            <USelect v-model="changeWindow" :items="changeWindowItems" class="w-40" />
          </div>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
            <template #header>
              <h3 class="font-semibold text-highlighted">
                当前热度 Top 10
              </h3>
            </template>
            <NuxtLink
              v-for="(brand, index) in currentTop"
              :key="brand.id"
              :to="`/customers/${brand.id}`"
              class="flex items-center justify-between p-3 transition hover:bg-elevated/40"
            >
              <div class="flex min-w-0 items-center gap-3">
                <span class="w-6 text-xs text-muted">{{ index + 1 }}</span>
                <span class="truncate font-medium">{{ brand.name }}</span>
              </div>
              <span class="text-lg font-semibold text-highlighted">{{ brand.currentHeat.toFixed(1) }}</span>
            </NuxtLink>
          </UCard>

          <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
            <template #header>
              <h3 class="font-semibold text-highlighted">
                热度上升 Top 10
              </h3>
            </template>
            <NuxtLink
              v-for="(brand, index) in risingTop"
              :key="brand.id"
              :to="`/customers/${brand.id}`"
              class="flex items-center justify-between p-3 transition hover:bg-elevated/40"
            >
              <div class="flex min-w-0 items-center gap-3">
                <span class="w-6 text-xs text-muted">{{ index + 1 }}</span>
                <span class="truncate font-medium">{{ brand.name }}</span>
              </div>
              <span class="text-success font-semibold">{{ formatSigned(heatChangeFor(brand.id, changeWindow)) }}</span>
            </NuxtLink>
          </UCard>

          <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
            <template #header>
              <h3 class="font-semibold text-highlighted">
                热度下降 Top 10
              </h3>
            </template>
            <NuxtLink
              v-for="(brand, index) in fallingTop"
              :key="brand.id"
              :to="`/customers/${brand.id}`"
              class="flex items-center justify-between p-3 transition hover:bg-elevated/40"
            >
              <div class="flex min-w-0 items-center gap-3">
                <span class="w-6 text-xs text-muted">{{ index + 1 }}</span>
                <span class="truncate font-medium">{{ brand.name }}</span>
              </div>
              <span :class="heatChangeFor(brand.id, changeWindow) < 0 ? 'text-error' : 'text-muted'" class="font-semibold">
                {{ formatSigned(heatChangeFor(brand.id, changeWindow)) }}
              </span>
            </NuxtLink>
          </UCard>
        </div>
      </section>

      <section class="space-y-4 rounded-lg border border-default p-4">
        <div>
          <h2 class="font-semibold text-highlighted">
            六品牌对比组
          </h2>
          <p class="text-sm text-muted">
            51 个品牌按 6 个一组强制对比，避免 Pokemon 把其他品牌压扁。
          </p>
        </div>

        <div class="space-y-4 pt-2">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex max-w-full flex-wrap gap-1" role="group" aria-label="品牌对比组">
              <button
                v-for="item in comparisonGroupItems"
                :key="item.value"
                type="button"
                :title="item.title"
                :aria-pressed="selectedGroup === item.value"
                class="h-6 rounded-md px-2 text-xs font-medium transition"
                :class="selectedGroup === item.value
                  ? 'bg-primary text-inverted'
                  : 'bg-elevated text-default ring ring-inset ring-accented hover:bg-accented'"
                @click="selectComparisonGroup(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
            <USwitch v-model="relativeMode" label="相对指数" />
          </div>

          <TcgTrendChart :series="comparisonSeries" :relative="relativeMode" :height="340" />
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-highlighted">
            市场变化
          </h2>
          <p class="text-sm text-muted">
            热度变化来自 Google Trends；TCGplayer 字段用于解释产品和系列覆盖。
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
            <template #header>
              <h3 class="font-semibold text-highlighted">
                升温最快
              </h3>
            </template>
            <NuxtLink
              v-for="(brand, index) in risingTop"
              :key="brand.id"
              :to="`/customers/${brand.id}`"
              class="grid grid-cols-[2rem_1fr_auto] items-center gap-3 p-4 transition hover:bg-elevated/40"
            >
              <span class="text-xs text-muted">{{ index + 1 }}</span>
              <div class="min-w-0">
                <p class="truncate font-medium text-highlighted">{{ brand.name }}</p>
                <p class="text-xs text-muted">原因：Google Trends 搜索热度</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-success">{{ formatSigned(heatChangeFor(brand.id, changeWindow)) }}</p>
                <p class="text-xs text-muted">热度 {{ brand.currentHeat.toFixed(1) }}</p>
              </div>
            </NuxtLink>
          </UCard>

          <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
            <template #header>
              <h3 class="font-semibold text-highlighted">
                降温最快
              </h3>
            </template>
            <NuxtLink
              v-for="(brand, index) in fallingTop"
              :key="brand.id"
              :to="`/customers/${brand.id}`"
              class="grid grid-cols-[2rem_1fr_auto] items-center gap-3 p-4 transition hover:bg-elevated/40"
            >
              <span class="text-xs text-muted">{{ index + 1 }}</span>
              <div class="min-w-0">
                <p class="truncate font-medium text-highlighted">{{ brand.name }}</p>
                <p class="text-xs text-muted">原因：Google Trends 搜索热度</p>
              </div>
              <div class="text-right">
                <p :class="heatChangeFor(brand.id, changeWindow) < 0 ? 'text-error' : 'text-muted'" class="font-semibold">
                  {{ formatSigned(heatChangeFor(brand.id, changeWindow)) }}
                </p>
                <p class="text-xs text-muted">热度 {{ brand.currentHeat.toFixed(1) }}</p>
              </div>
            </NuxtLink>
          </UCard>
        </div>
      </section>

      <p class="border-t border-default pt-4 text-sm text-muted">
        市场热度反映 Google Trends 搜索关注和 TCGplayer 覆盖，不代表销量、收入或全球市场份额。当前 Google Trends 地区为美国。
      </p>
    </template>
  </UDashboardPanel>
</template>
