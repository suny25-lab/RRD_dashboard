<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: '通知渠道',
  description: '希望通过哪些渠道通知？',
  fields: [{
    name: 'email',
    label: '邮件',
    description: '接收每日邮件摘要。'
  }, {
    name: 'desktop',
    label: '桌面',
    description: '接收桌面通知。'
  }]
}, {
  title: '账户更新',
  description: '接收账户和系统更新。',
  fields: [{
    name: 'weekly_digest',
    label: '每周摘要',
    description: '接收每周消息摘要。'
  }, {
    name: 'product_updates',
    label: '产品更新',
    description: '接收每月功能更新邮件。'
  }, {
    name: 'important_updates',
    label: '重要更新',
    description: '接收安全修复和维护等重要更新邮件。'
  }]
}]

async function onChange() {
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
