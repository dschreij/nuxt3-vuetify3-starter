<script setup lang="ts">
const navItems = computed(() => [
  {
    props: {
      prependIcon: 'mdi-apps',
      to: '/',
      router: true,
      exact: true
    },
    title: 'Dashboard',
  },
  {
    props: {
      prependIcon: 'mdi-layers-search',
      to: 'inquiries',
      router: true,
      exact: true
    },
    title: 'Inquiries',
  },
  {
    props: {
      prependIcon: 'mdi-package-variant-closed',
      to: 'shipments',
      router: true,
      exact: true
    },
    title: 'Shipments',
  },
])
</script>

<template>
  <v-navigation-drawer
    :rail="$vuetify.display.lgAndUp"
    expand-on-hover
    v-bind="$attrs"
  >
    <v-list nav :items="navItems"/>
  </v-navigation-drawer>
</template>

