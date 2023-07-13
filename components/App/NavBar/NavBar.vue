<script setup lang="ts">
const props = defineProps<{
  drawer: boolean
}>()

const emit = defineEmits<{
  'update:drawer': [boolean]
}>()

const sync = useSync(props, emit)
const localDrawer = sync('drawer')
</script>

<template>
  <v-app-bar v-bind="$attrs">
    <template #prepend>
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click.stop="localDrawer = !drawer"
      />
    </template>

    <v-app-bar-title>
      <nuxt-link to="/">
        <v-img src="~/assets/img/vuetify-logo.svg" max-width="160" cover />
      </nuxt-link>
    </v-app-bar-title>

    <template v-if="$vuetify.display.smAndUp" #append>
      <v-avatar color="primary">
        JD
      </v-avatar>
    </template>
  </v-app-bar>
</template>
