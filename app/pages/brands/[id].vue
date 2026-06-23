<script setup lang="ts">
const route = useRoute()

await navigateTo(`/customers/${route.params.id}`, { replace: true })
</script>

<template>
  <div />
</template>
