import { defineComponent, PropType } from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { useSync, useDeepSync } from './propsync'

describe('useSync', () => {
  const emitFunc = vi.fn()
  interface TestProps {
    name: string
    email: string
    age: number
  }

  const props: TestProps = {
    name: 'John Doe',
    email: 'john@doe.com',
    age: 50,
  }

  const sync = useSync(props, emitFunc)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return the value of the specified prop if used as accessor', () => {
    let key: keyof TestProps
    for (key in props) {
      const variable = sync(key)
      expect(variable.value).toEqual(props[key])
    }
  })

  it('should emit an update event if value of prop is changed', () => {
    const variable = sync('name')
    expect(emitFunc).not.toBeCalled()
    const newVal = 'Some other person'
    variable.value = newVal
    expect(emitFunc).toBeCalledWith('update:name', newVal)
  })
})

describe('useDeepSync', () => {
  function mountFunc(component: any, options = {}) {
    return mount(component, {
      ...options,
    })
  }

  interface Person {
    name: string
    email: string
    age: number
  }

  let wrapper: {
    vm: any
    emitted: any
    setProps: any
  }

  const person: Person = {
    name: 'John Doe',
    email: 'john@doe.com',
    age: 33,
  }

  const persons: Person[] = [
    {
      name: 'Agnes Airtable',
      email: 'agnes@example.com',
      age: 24,
    },
    {
      name: 'Willy Wortel',
      email: 'willy@wortel.com',
      age: 63,
    },
  ]

  beforeEach(() => {
    const component = defineComponent({
      props: {
        person: {
          type: Object as PropType<Person>,
          required: true,
        },
        persons: {
          type: Array as PropType<Person[]>,
          required: true,
        },
      },
      setup(props, { emit }) {
        const deepsync = useDeepSync(props, emit)
        const localPerson = deepsync('person')
        const localPersons = deepsync('persons')
        return { localPerson, localPersons }
      },
      template: `
      <div></div>
      `,
    })

    wrapper = mountFunc(component, {
      propsData: { person, persons },
    })
  })

  it('should return the value of the specified prop if used as accessor', () => {
    expect(wrapper.vm.localPerson).toEqual(person)
    expect(wrapper.vm.localPersons).toEqual(persons)
  })

  it('should emit an update event if any of the local values are altered', async () => {
    expect(wrapper.emitted('update:person')).toBeFalsy()
    wrapper.vm.localPerson.name = 'Jane Doe'
    await flushPromises()
    expect(wrapper.emitted('update:person')).toBeTruthy()
    expect(wrapper.emitted('update:person')[0][0]).toEqual({
      ...person,
      name: 'Jane Doe',
    })

    expect(wrapper.emitted('update:persons')).toBeFalsy()
    wrapper.vm.localPersons[0].name = 'Agnes Seatable'
    await flushPromises()
    expect(wrapper.emitted('update:persons')).toBeTruthy()
    expect(wrapper.emitted('update:persons')[0][0]).toEqual(
      wrapper.vm.localPersons
    )
  })

  it('should emit an update event if items are added to local arrays', async () => {
    expect(wrapper.emitted('update:persons')).toBeFalsy()
    const newPerson = {
      name: 'Newt Newton',
      email: 'newton@force.com',
      age: 231,
    }
    wrapper.vm.localPersons.push(newPerson)
    await flushPromises()
    expect(wrapper.emitted('update:persons')).toBeTruthy()
    expect(wrapper.emitted('update:persons')[0][0]).toEqual(
      wrapper.vm.localPersons
    )
  })

  it('should not emit an update event if new local value is equal to current prop value', async () => {
    expect(wrapper.emitted('update:person')).toBeFalsy()
    wrapper.vm.localPerson.name = 'John Doe'
    await flushPromises()
    expect(wrapper.emitted('update:person')).toBeFalsy()
  })

  it('should propagate/copy new props to local values if they are different from each other', async () => {
    // Test for objects
    expect(wrapper.vm.localPerson).toEqual(person)
    const newPerson = {
      name: 'Newt Newton',
      email: 'newton@force.com',
      age: 231,
    }
    await wrapper.setProps({
      person: newPerson,
    })
    expect(wrapper.vm.localPerson).toEqual(newPerson)

    // Test for arrays
    expect(wrapper.vm.localPersons).toEqual(persons)
    const personsPlusOne = [...persons, newPerson]
    await wrapper.setProps({
      persons: personsPlusOne,
    })
    expect(wrapper.vm.localPersons).toEqual(personsPlusOne)
  })

  it('should only emit update events for local values if they are different from props', async () => {
    // Test for objects
    expect(wrapper.vm.localPerson).toEqual(person)
    expect(wrapper.emitted('update:person')).toBeFalsy()
    wrapper.vm.localPerson.name = 'John Doe'
    await flushPromises()
    expect(wrapper.emitted('update:person')).toBeFalsy()
  })
})
