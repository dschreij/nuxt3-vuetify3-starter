import { mount, RouterLinkStub } from '@vue/test-utils'
import NavBar from './NavBar.vue'
import { describe, it, expect } from 'vitest'

describe('NavBar', () => {

  function mountFunc(options = {}) {
    return mount(NavBar, {
      props: {
        drawer: true,
      },
      stubs: {
        'nuxt-link': RouterLinkStub,
      },
      ...options,
    })
  }

  it('should match its snapshot', () => {
    const wrapper = mountFunc()
    expect(wrapper).toMatchSnapshot()
  })
})
