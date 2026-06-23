<script setup lang="ts">
import { tcgdb } from '~/data/tcgdb'

const route = useRoute()
const brandId = computed(() => String(route.params.id))
const brand = computed(() => {
  const found = tcgdb.brands.find(item => item.id === brandId.value)
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'Brand not found' })
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
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatSigned(value: number, suffix = ' pts') {
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
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UBadge :color="stateColor(brand.state)" variant="subtle">
            {{ brand.state }}
          </UBadge>
        </template>
        <template #right>
          <UButton
            to="/customers"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
          >
            Brands
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
              Rank #{{ brand.rank }} - active from {{ brand.brandActiveFrom }}
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
        <UPageCard title="Google Trends heat" icon="i-lucide-search" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ brand.currentHeat.toFixed(1) }}
          </div>
          <p class="text-sm text-muted">
            Current complete week.
          </p>
        </UPageCard>

        <UPageCard title="4-week heat change" icon="i-lucide-trending-up" variant="subtle">
          <div :class="brand.heatChange4w > 0 ? 'text-success' : brand.heatChange4w < 0 ? 'text-error' : 'text-highlighted'" class="text-3xl font-semibold">
            {{ formatSigned(brand.heatChange4w) }}
          </div>
          <p class="text-sm text-muted">
            Google Trends only.
          </p>
        </UPageCard>

        <UPageCard title="Active products" icon="i-lucide-boxes" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(brand.productCount) }}
          </div>
          <p class="text-sm text-muted">
            {{ formatSigned(brand.productChange, '%') }} latest movement.
          </p>
        </UPageCard>

        <UPageCard title="Active series" icon="i-lucide-layers-3" variant="subtle">
          <div class="text-3xl font-semibold text-highlighted">
            {{ formatNumber(brand.seriesCount) }}
          </div>
          <p class="text-sm text-muted">
            {{ formatSigned(brand.seriesChange, '%') }} latest movement.
          </p>
        </UPageCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <UCard>
          <template #header>
            <div>
              <h2 class="font-semibold text-highlighted">
                Brand Heat Trend
              </h2>
              <p class="text-sm text-muted">
                Weekly Google Trends search heat for {{ brand.name }}.
              </p>
            </div>
          </template>

          <TcgTrendChart :series="trendSeries" :height="340" />
        </UCard>

        <UCard :ui="{ body: 'space-y-4' }">
          <template #header>
            <h2 class="font-semibold text-highlighted">
              Brand Information
            </h2>
          </template>

          <dl class="grid gap-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                Market data products
              </dt>
              <dd class="font-medium text-highlighted">
                {{ formatNumber(brand.marketDataProducts) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                Main change source
              </dt>
              <dd class="font-medium text-highlighted">
                {{ brand.latestSignal }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                Rank change
              </dt>
              <dd class="font-medium text-highlighted">
                {{ brand.rankChange }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">
                Google scope
              </dt>
              <dd class="text-right font-medium text-highlighted">
                United States
              </dd>
            </div>
          </dl>
        </UCard>
      </div>

      <UCard :ui="{ body: 'divide-y divide-default p-0!' }">
        <template #header>
          <div>
            <h2 class="font-semibold text-highlighted">
              News and Signals
            </h2>
            <p class="text-sm text-muted">
              Current MVP uses generated alerts from Google Trends and TCGplayer coverage.
            </p>
          </div>
        </template>

        <div v-if="!messages.length" class="p-6 text-sm text-muted">
          No current News or social messages for this brand.
        </div>
        <NuxtLink
          v-for="message in messages"
          :key="message.id"
          to="/inbox"
          class="block p-4 transition hover:bg-elevated/40"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="font-medium text-highlighted">{{ message.title }}</p>
            <UBadge variant="subtle">{{ message.source }}</UBadge>
          </div>
          <p class="mt-1 text-sm text-muted">{{ message.summary }}</p>
        </NuxtLink>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
