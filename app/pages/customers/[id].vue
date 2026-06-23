<script setup lang="ts">
import { tcgdb } from '~/data/tcgdb'
import { messageSummaryCn, messageTitleCn, signalLabel, sourceLabel, stateLabel } from '~/utils/tcg-i18n'

const route = useRoute()
const brandId = computed(() => String(route.params.id))
const brand = computed(() => {
  const found = tcgdb.brands.find(item => item.id === brandId.value)
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: '未找到品牌' })
  }
  return found
})
const messages = computed(() => tcgdb.messages.filter(message => message.brandId === brandId.value))
const trendSeries = computed(() => brand.value
  ? [{
      name: brand.value.name,
      points: [...((tcgdb.brandTrends as Record<string, { week: string, heat: number }[]>)[brand.value.id] || [])]
    }]
  : [])

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
</script>

<template>
  <UDashboardPanel id="brand-detail">
    <template #header>
      <UDashboardNavbar :title="brand.name">
        <template #leading>
          <UDashboardSidebarCollapse aria-label="收起侧边栏" />
        </template>
        <template #trailing>
          <UBadge :color="stateColor(brand.state)" variant="subtle">
            {{ stateLabel(brand.state) }}
          </UBadge>
        </template>
        <template #right>
          <UButton
            to="/customers"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
          >
            返回品牌
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex min-w-0 items-center gap-4">
          <UAvatar :alt="brand.name" :text="brand.logoText" size="3xl" />
          <div class="min-w-0">
            <h1 class="truncate text-2xl font-semibold text-highlighted">
              {{ brand.name }}
            </h1>
            <p class="text-sm text-muted">
              排名 #{{ brand.rank }} - 数据起始：{{ brand.brandActiveFrom }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="alias in brand.aliases"
            :key="alias"
            color="neutral"
            variant="soft"
          >
            {{ alias }}
          </UBadge>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UPageCard title="Google Trends 热度" icon="i-lucide-search" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ brand.currentHeat.toFixed(1) }}
          </div>
          <p class="text-sm text-muted">
            当前完整周。
          </p>
        </UPageCard>

        <UPageCard title="近4周热度变化" icon="i-lucide-trending-up" variant="subtle">
          <div :class="brand.heatChange4w > 0 ? 'text-success' : brand.heatChange4w < 0 ? 'text-error' : 'text-highlighted'" class="text-3xl font-semibold">
            {{ formatSigned(brand.heatChange4w) }}
          </div>
          <p class="text-sm text-muted">
            仅 Google Trends。
          </p>
        </UPageCard>

        <UPageCard title="活跃产品" icon="i-lucide-boxes" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(brand.productCount) }}
          </div>
          <p class="text-sm text-muted">
            {{ formatSigned(brand.productChange, '%') }} 最新变化。
          </p>
        </UPageCard>

        <UPageCard title="活跃系列" icon="i-lucide-layers-3" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(brand.seriesCount) }}
          </div>
          <p class="text-sm text-muted">
            {{ formatSigned(brand.seriesChange, '%') }} 最新变化。
          </p>
        </UPageCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <UCard>
          <template #header>
            <div>
              <h2 class="font-semibold text-highlighted">
                品牌热度趋势
              </h2>
              <p class="text-sm text-muted">
                {{ brand.name }} 的周度 Google Trends 搜索热度。
              </p>
            </div>
          </template>

          <TcgTrendChart :series="trendSeries" :height="340" />
        </UCard>

        <UCard :ui="{ body: 'space-y-4' }">
          <template #header>
            <h2 class="font-semibold text-highlighted">
              品牌信息
            </h2>
          </template>

          <dl class="grid gap-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                有公开市场数据的产品
              </dt>
              <dd class="font-medium text-highlighted">
                {{ formatNumber(brand.marketDataProducts) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                主要变化来源
              </dt>
              <dd class="font-medium text-highlighted">
                {{ signalLabel(brand.latestSignal) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                排名变化
              </dt>
              <dd class="font-medium text-highlighted">
                {{ brand.rankChange }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                Google 地区
              </dt>
              <dd class="text-right font-medium text-highlighted">
                美国
              </dd>
            </div>
          </dl>
        </UCard>
      </div>

      <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
        <template #header>
          <div>
            <h2 class="font-semibold text-highlighted">
              消息与信号
            </h2>
            <p class="text-sm text-muted">
              当前 MVP 使用 Google Trends 与 TCGplayer 覆盖数据生成提醒。
            </p>
          </div>
        </template>

        <div v-if="!messages.length" class="p-6 text-sm text-muted">
          当前没有该品牌的消息或社媒提醒。
        </div>
        <NuxtLink
          v-for="message in messages"
          :key="message.id"
          to="/inbox"
          class="block p-4 transition hover:bg-elevated/40"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="font-medium text-highlighted">{{ messageTitleCn(message) }}</p>
            <UBadge variant="subtle">{{ sourceLabel(message.source) }}</UBadge>
          </div>
          <p class="mt-1 text-sm text-muted">{{ messageSummaryCn(message) }}</p>
        </NuxtLink>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
