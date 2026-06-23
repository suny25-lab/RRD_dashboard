<script setup lang="ts">
const plannedSources = [{
  name: 'Google Trends',
  scope: '51 个 TCG 品牌的美国搜索热度',
  status: '已接入'
}, {
  name: 'TCGplayer',
  scope: '产品、系列、活跃覆盖以及后续官方价格字段',
  status: '计划接入'
}, {
  name: '官网新闻',
  scope: '官网新闻与品牌公告',
  status: '计划接入'
}, {
  name: '社媒',
  scope: '源确认后的官方社媒帖子',
  status: '预留'
}, {
  name: 'eBay',
  scope: '刊登与评级指标',
  status: '预留'
}]
</script>

<template>
  <UDashboardPanel id="settings-home">
    <template #header>
      <UDashboardNavbar title="数据设置">
        <template #leading>
          <UDashboardSidebarCollapse aria-label="收起侧边栏" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-5xl space-y-6">
        <div>
          <h1 class="text-2xl font-semibold text-highlighted">
            预留数据配置
          </h1>
          <p class="mt-2 text-sm text-muted">
            本页保留用于数据源映射和关键词配置；首版 MVP 暂不接入可编辑设置。
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
              <UBadge :color="source.status === '已接入' ? 'success' : 'neutral'" variant="subtle">
                {{ source.status }}
              </UBadge>
            </div>
          </UCard>
        </div>

        <UAlert
          icon="i-lucide-info"
          color="neutral"
          variant="subtle"
          title="价格源口径"
          description="后续加入价格时，使用官方 TCGplayer price 字段；当前没有 eBay 数据，不从 eBay 推断价格。"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
