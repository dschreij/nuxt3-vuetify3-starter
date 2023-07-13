import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Notifications from './Notifications.vue'

describe('Notifications', () => {
  function mountFunc(options = {}) {
    return mount(Notifications, {
      ...options,
    })
  }

  it('should match its snapshot', () => {
    const wrapper = mountFunc()
    expect(wrapper).toMatchSnapshot()
  })
})
