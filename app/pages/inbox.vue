<script setup lang="ts">
import { format } from 'date-fns'
import { tcgdb } from '~/data/tcgdb'

const typeFilter = ref('all')
const selectedMessageId = ref(tcgdb.messages[0]?.id)

const typeItems = [{
  label: 'All',
  value: 'all'
}, {
  label: 'Alerts',
  value: 'alert'
}, {
  label: 'TCGplayer',
  value: 'data'
}, {
  label: 'News',
  value: 'news'
}, {
  label: 'Social',
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
  return format(new Date(date), 'MMM d, yyyy')
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
    <UDashboardNavbar title="TCG News">
      <template #leading>
        <UDashboardSidebarCollapse />
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
                {{ message.title }}
              </p>
            </div>
          </div>
          <span class="shrink-0 text-xs text-muted">{{ formatDate(message.publishedAt) }}</span>
        </div>
      </button>
    </div>
  </UDashboardPanel>

  <UDashboardPanel v-if="selectedMessage" id="news-detail">
    <UDashboardNavbar :title="selectedMessage.title" :toggle="false">
      <template #right>
        <UButton
          :to="`/customers/${selectedMessage.brandId}`"
          icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="ghost"
        >
          Brand detail
        </UButton>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col gap-6 overflow-y-auto p-4 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <UBadge :color="messageColor(selectedMessage.type)" variant="subtle">
          {{ selectedMessage.type }}
        </UBadge>
        <UBadge color="neutral" variant="soft">
          {{ selectedMessage.source }}
        </UBadge>
        <UBadge color="neutral" variant="soft">
          {{ formatDate(selectedMessage.publishedAt) }}
        </UBadge>
      </div>

      <div>
        <p class="text-sm text-muted">
          Related brand
        </p>
        <NuxtLink :to="`/customers/${selectedMessage.brandId}`" class="mt-1 inline-flex items-center gap-2 text-xl font-semibold text-highlighted hover:text-primary">
          {{ selectedMessage.brandName }}
          <UIcon name="i-lucide-arrow-up-right" class="size-4" />
        </NuxtLink>
      </div>

      <div class="max-w-3xl">
        <h2 class="text-2xl font-semibold text-highlighted">
          {{ selectedMessage.title }}
        </h2>
        <p class="mt-4 text-base leading-7 text-toned">
          {{ selectedMessage.summary }}
        </p>
      </div>

      <UAlert
        color="neutral"
        variant="subtle"
        icon="i-lucide-info"
        title="MVP data note"
        description="This inbox currently uses generated alerts from Google Trends and TCGplayer coverage. Official News and social feeds can attach to the same structure."
      />
    </div>
  </UDashboardPanel>
</template>
