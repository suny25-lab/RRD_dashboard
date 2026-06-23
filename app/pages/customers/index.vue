<script setup lang="ts">
import { tcgdb } from '~/data/tcgdb'

const search = ref('')
const stateFilter = ref('all')
const sortKey = ref<'rank' | 'currentHeat' | 'heatChange4w' | 'productCount' | 'seriesCount'>('rank')

const stateItems = [{
  label: 'All states',
  value: 'all'
}, {
  label: 'Warming',
  value: 'Warming'
}, {
  label: 'Stable',
  value: 'Stable'
}, {
  label: 'Cooling',
  value: 'Cooling'
}]

const sortItems = [{
  label: 'Heat rank',
  value: 'rank'
}, {
  label: 'Current heat',
  value: 'currentHeat'
}, {
  label: '4-week heat change',
  value: 'heatChange4w'
}, {
  label: 'Products',
  value: 'productCount'
}, {
  label: 'Series',
  value: 'seriesCount'
}]

const filteredBrands = computed(() => {
  const q = search.value.trim().toLowerCase()

  return [...tcgdb.brands]
    .filter((brand) => {
      const matchesSearch = !q || brand.name.toLowerCase().includes(q) || brand.aliases.some(alias => alias.toLowerCase().includes(q))
      const matchesState = stateFilter.value === 'all' || brand.state === stateFilter.value
      return matchesSearch && matchesState
    })
    .sort((a, b) => {
      if (sortKey.value === 'rank') return a.rank - b.rank
      return Number(b[sortKey.value]) - Number(a[sortKey.value])
    })
})

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatSigned(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} pts`
}

function stateColor(state: string) {
  if (state === 'Warming') return 'success' as const
  if (state === 'Cooling') return 'error' as const
  return 'neutral' as const
}
</script>

<template>
  <UDashboardPanel id="brands">
    <template #header>
      <UDashboardNavbar title="TCG Brands">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UBadge variant="subtle">
            {{ filteredBrands.length }} / {{ tcgdb.summary.brandCount }}
          </UBadge>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search brand..."
            class="w-72"
          />
          <USelect v-model="stateFilter" :items="stateItems" class="w-36" />
          <USelect v-model="sortKey" :items="sortItems" class="w-52" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="overflow-hidden rounded-lg border border-default">
        <div class="grid grid-cols-[minmax(16rem,1.3fr)_8rem_8rem_8rem_8rem_8rem] items-center gap-4 border-b border-default bg-elevated/40 px-4 py-3 text-xs font-medium uppercase text-muted max-xl:hidden">
          <span>Brand</span>
          <span class="text-right">Heat</span>
          <span class="text-right">4W Change</span>
          <span class="text-right">Products</span>
          <span class="text-right">Series</span>
          <span class="text-right">State</span>
        </div>

        <NuxtLink
          v-for="brand in filteredBrands"
          :key="brand.id"
          :to="`/customers/${brand.id}`"
          class="grid grid-cols-1 gap-3 border-b border-default px-4 py-4 transition last:border-b-0 hover:bg-elevated/40 xl:grid-cols-[minmax(16rem,1.3fr)_8rem_8rem_8rem_8rem_8rem] xl:items-center xl:gap-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <UAvatar :alt="brand.name" :text="brand.logoText" size="lg" />
            <div class="min-w-0">
              <p class="truncate font-medium text-highlighted">
                {{ brand.name }}
              </p>
              <p class="truncate text-xs text-muted">
                Rank #{{ brand.rank }} - {{ brand.aliases[1] }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between xl:block xl:text-right">
            <span class="text-xs text-muted xl:hidden">Heat</span>
            <span class="font-semibold text-highlighted">{{ brand.currentHeat.toFixed(1) }}</span>
          </div>

          <div class="flex items-center justify-between xl:block xl:text-right">
            <span class="text-xs text-muted xl:hidden">4W Change</span>
            <span :class="brand.heatChange4w > 0 ? 'text-success' : brand.heatChange4w < 0 ? 'text-error' : 'text-muted'" class="font-semibold">
              {{ formatSigned(brand.heatChange4w) }}
            </span>
          </div>

          <div class="flex items-center justify-between xl:block xl:text-right">
            <span class="text-xs text-muted xl:hidden">Products</span>
            <span>{{ formatNumber(brand.productCount) }}</span>
          </div>

          <div class="flex items-center justify-between xl:block xl:text-right">
            <span class="text-xs text-muted xl:hidden">Series</span>
            <span>{{ formatNumber(brand.seriesCount) }}</span>
          </div>

          <div class="flex items-center justify-between xl:block xl:text-right">
            <span class="text-xs text-muted xl:hidden">State</span>
            <UBadge :color="stateColor(brand.state)" variant="subtle">
              {{ brand.state }}
            </UBadge>
          </div>
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
