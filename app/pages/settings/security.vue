<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
  current: z.string().min(8, '至少 8 个字符'),
  new: z.string().min(8, '至少 8 个字符')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: '新密码不能与当前密码相同' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    title="密码"
    description="设置新密码前请确认当前密码。"
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="当前密码"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="新密码"
          class="w-full"
        />
      </UFormField>

      <UButton label="更新" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="账户"
    description="不再使用时可在这里删除账户。此操作不可恢复，账户相关信息会永久删除。"
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="删除账户" color="error" />
    </template>
  </UPageCard>
</template>
