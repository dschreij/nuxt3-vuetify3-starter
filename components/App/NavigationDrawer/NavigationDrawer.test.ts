import { mount, RouterLinkStub } from '@vue/test-utils'
import NavigationDrawer from './NavigationDrawer.vue'

import { describe, it, expect } from 'vitest'

describe('NavigationDrawer', () => {

  function mountFunc (options = {}) {
    return mount(NavigationDrawer, {
      stubs: {
        'nuxt-link': RouterLinkStub
      },
      propsData: {
        rail: false
      },
      ...options
    })
  }

  it('should match its snapshot', () => {
    const wrapper = mountFunc()
    expect(wrapper).toMatchSnapshot()
  })
})
