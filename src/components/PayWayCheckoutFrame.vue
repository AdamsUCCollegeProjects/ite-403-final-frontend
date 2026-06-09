<script setup lang="ts">
defineProps<{
  checkoutHtml: string
}>()
</script>

<template>
  <iframe
    class="h-[28rem] w-full rounded-lg border border-slate-200 bg-white"
    title="PayWay checkout"
    sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation-by-user-activation"
    :srcdoc="checkoutHtml"
  />
</template>
