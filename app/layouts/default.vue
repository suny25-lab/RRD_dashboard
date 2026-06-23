<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const toast = useToast()

const open = ref(false)

const links = [[{
  label: '首页',
  icon: 'i-lucide-chart-no-axes-combined',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: '消息',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '16',
  onSelect: () => {
    open.value = false
  }
}, {
  label: '品牌',
  icon: 'i-lucide-users',
  to: '/customers',
  onSelect: () => {
    open.value = false
  }
}, {
  label: '设置',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: '数据源',
    to: '/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: '成员',
    to: '/settings/members',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: '通知',
    to: '/settings/notifications',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: '安全',
    to: '/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}], [{
  label: '数据口径',
  icon: 'i-lucide-info',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/suny25-lab/RRD_dashboard',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: '页面',
  items: links.flat()
}, {
  id: 'code',
  label: '仓库',
  items: [{
    id: 'source',
    label: '查看仓库',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/suny25-lab/RRD_dashboard',
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'TCGDB 会在本浏览器保存显示偏好。',
    duration: 0,
    close: false,
    actions: [{
      label: '接受',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: '不保存',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton label="搜索..." :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
