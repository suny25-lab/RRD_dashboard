<script setup lang="ts">
const plannedSources = [{
  name: 'Google Trends',
  scope: 'US search heat for 51 TCG brands',
  status: 'Connected'
}, {
  name: 'TCGplayer',
  scope: 'Products, series, active coverage, and official price fields',
  status: 'Planned'
}, {
  name: 'Official News',
  scope: 'Official site news and brand announcements',
  status: 'Planned'
}, {
  name: 'Social',
  scope: 'Official social posts after source approval',
  status: 'Reserved'
}, {
  name: 'eBay',
  scope: 'Listings and grading metrics',
  status: 'Reserved'
}]
</script>

<template>
  <UDashboardPanel id="settings-home">
    <template #header>
      <UDashboardNavbar title="Data Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-5xl space-y-6">
        <div>
          <h1 class="text-2xl font-semibold text-highlighted">
            Reserved Data Configuration
          </h1>
          <p class="mt-2 text-sm text-muted">
            This page is kept for source mapping and keyword configuration, but the first MVP does not connect editable settings.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <UCard v-for="source in plannedSources" :key="source.name" variant="subtle">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="font-semibold text-highlighted">
                  {{ source.name }}
                </h2>
                <p class="mt-1 text-sm text-muted">
                  {{ source.scope }}
                </p>
              </div>
              <UBadge :color="source.status === 'Connected' ? 'success' : 'neutral'" variant="subtle">
                {{ source.status }}
              </UBadge>
            </div>
          </UCard>
        </div>

        <UAlert
          icon="i-lucide-info"
          color="neutral"
          variant="subtle"
          title="Price source decision"
          description="When price is added, use official TCGplayer price data fields. Do not infer price from unavailable eBay data."
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
