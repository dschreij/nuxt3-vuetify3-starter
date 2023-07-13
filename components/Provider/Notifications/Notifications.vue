<script setup lang="ts">
import { Message } from '~/composables/notify'

const emptyMessage = {
  message: '',
  color: 'primary',
  timeout: 5000,
  closeText: 'Close',
}

const visible = ref(false)
const current = ref<Message>({ ...emptyMessage })

const notifications = ref<Message[]>([])
const notify = (message: Message) => {
  notifications.value.push(message)
  if (!visible.value) {
    next()
  }
}
provide('notify', notify)

watch(visible, (val) => {
  if (!val) {
    next()
  }
})

const next = () => {
  const message = notifications.value.shift()
  if (message) {
    const pause = visible.value ? 250 : 0
    setTimeout(() => {
      current.value = { ...emptyMessage, ...message }
      visible.value = true
    }, pause)
  }
  visible.value = false
}
</script>

<template>
  <div>
    <slot />
    <v-snackbar
      v-model="visible"
      :color="current.color"
      :timeout="current.timeout"
      location="bottom"
    >
      <template #actions>
        <v-btn type="text" @click="next">
          {{ current.closeText }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
