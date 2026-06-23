<script setup lang="ts">
import { format } from 'date-fns'
import { tcgdb } from '~/data/tcgdb'
import { messageSummaryCn, messageTitleCn, messageTypeLabel, sourceLabel } from '~/utils/tcg-i18n'

const typeFilter = ref('all')
const selectedMessageId = ref(tcgdb.messages[0]?.id)

const typeItems = [{
  label: '全部',
  value: 'all'
}, {
  label: '提醒',
  value: 'alert'
}, {
  label: 'TCGplayer',
  value: 'data'
}, {
  label: '新闻',
  value: 'news'
}, {
  label: '社媒',
  value: 'social'
}]

const filteredMessages = computed(() => {
  if (typeFilter.value === 'all') return tcgdb.messages
  return tcgdb.messages.filter(message => message.type === typeFilter.value)
})

const selectedMessage = computed(() => {
  return filteredMessages.value.find(message => message.id === selectedMessageId.value) || filteredMessages.value[0]
})

watch(filteredMessages, () => {
  if (!filteredMessages.value.find(message => message.id === selectedMessageId.value)) {
    selectedMessageId.value = filteredMessages.value[0]?.id
  }
})

function messageIcon(type: string) {
  if (type === 'alert') return 'i-lucide-bell-ring'
  if (type === 'data') return 'i-lucide-database'
  if (type === 'social') return 'i-lucide-message-circle'
  return 'i-lucide-newspaper'
}

function messageColor(type: string) {
  if (type === 'alert') return 'warning'
  if (type === 'data') return 'primary'
  if (type === 'social') return 'success'
  return 'neutral'
}

function formatDate(date: string) {
  return format(new Date(date), 'yyyy-MM-dd')
}
</script>

<template>
  <UDashboardPanel
    id="news-list"
    :default-size="34"
    :min-size="26"
    :max-size="42"
    resizable
  >
    <UDashboardNavbar title="TCG 消息">
      <template #leading>
        <UDashboardSidebarCollapse aria-label="收起侧边栏" />
      </template>
      <template #trailing>
        <UBadge :label="filteredMessages.length" variant="subtle" />
      </template>
      <template #right>
        <USelect v-model="typeFilter" :items="typeItems" class="w-32" />
      </template>
    </UDashboardNavbar>

    <div class="overflow-y-auto divide-y divide-default">
      <button
        v-for="message in filteredMessages"
        :key="message.id"
        type="button"
        class="w-full border-l-2 p-4 text-left transition hover:bg-elevated/40"
        :class="selectedMessage?.id === message.id ? 'border-primary bg-primary/10' : 'border-transparent'"
        @click="selectedMessageId = message.id"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-start gap-3">
            <UIcon :name="messageIcon(message.type)" class="mt-0.5 size-4 shrink-0 text-primary" />
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate font-medium text-highlighted">
                  {{ message.brandName }}
                </p>
                <UChip v-if="message.unread" />
              </div>
              <p class="mt-1 line-clamp-2 text-sm text-toned">
                {{ messageTitleCn(message) }}
              </p>
            </div>
          </div>
          <span class="shrink-0 text-xs text-muted">{{ formatDate(message.publishedAt) }}</span>
        </div>
      </button>
    </div>
  </UDashboardPanel>

  <UDashboardPanel v-if="selectedMessage" id="news-detail">
    <UDashboardNavbar :title="messageTitleCn(selectedMessage)" :toggle="false">
      <template #right>
        <UButton
          :to="`/customers/${selectedMessage.brandId}`"
          icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="ghost"
        >
          品牌详情
        </UButton>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col gap-6 overflow-y-auto p-4 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge :color="messageColor(selectedMessage.type)" variant="subtle">
          {{ messageTypeLabel(selectedMessage.type) }}
        </UBadge>
        <UBadge color="neutral" variant="soft">
          {{ sourceLabel(selectedMessage.source) }}
        </UBadge>
        <UBadge color="neutral" variant="soft">
          {{ formatDate(selectedMessage.publishedAt) }}
        </UBadge>
      </div>

      <div>
        <p class="text-sm text-muted">
          关联品牌
        </p>
        <NuxtLink :to="`/customers/${selectedMessage.brandId}`" class="mt-1 inline-flex items-center gap-2 text-xl font-semibold text-highlighted hover:text-primary">
          {{ selectedMessage.brandName }}
          <UIcon name="i-lucide-arrow-up-right" class="size-4" />
        </NuxtLink>
      </div>

      <div class="max-w-3xl">
        <h2 class="text-2xl font-semibold text-highlighted">
          {{ messageTitleCn(selectedMessage) }}
        </h2>
        <p class="mt-4 text-base leading-7 text-toned">
          {{ messageSummaryCn(selectedMessage) }}
        </p>
      </div>

      <UAlert
        color="neutral"
        variant="subtle"
        icon="i-lucide-info"
        title="MVP 数据说明"
        description="当前 Inbox 使用 Google Trends 与 TCGplayer 覆盖数据生成提醒；官网新闻和社媒源后续可接入同一结构。"
      />
    </div>
  </UDashboardPanel>
</template>
