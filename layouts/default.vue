<script setup lang="ts">
const drawer = ref(true)
</script>

<template>
  <v-app>
    <AppNavBar v-model:drawer="drawer" absolute />
    <AppNavigationDrawer
      :model-value="drawer || $vuetify.display.lgAndUp"
      width="300"
      @update:model-value="drawer = $event"
    />

    <v-main class="bg-blue-grey-lighten-5 fill-height">
      <ProviderNotifications>
        <slot />
      </ProviderNotifications>
    </v-main>
  </v-app>
</template>