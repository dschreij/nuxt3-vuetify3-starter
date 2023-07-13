import { Ref, ref, computed, watch } from 'vue'
import { isEqual, cloneDeep } from 'lodash-es'

/**
 * Create a get/set object for a prop to use as a computed property
 */
export function useSync<Props extends {}, Emit extends Function>(
  props: Props,
  emit: Emit
) {
  return <Key extends keyof Props>(field: Key) =>
    computed({
      get() {
        return props[field]
      },
      set(val): void {
        emit(`update:${String(field)}`, val)
      },
    })
}

/**
 * Create a ref that automatically syncs with the supplied prop. Uses update events to propagate changes up
 * to the parent.
 */
export function useDeepSync<Props extends {}, Emit extends Function>(
  props: Props,
  emit: Emit
) {
  return <Field extends keyof Props>(
    field: Field,
    transformer?: (arg: Props[Field]) => Props[Field]
  ): Ref<Props[Field]> => {
    let copy = cloneDeep(props[field])
    if (typeof transformer === 'function') {
      copy = transformer(copy)
    }
    const localVar = ref(copy) as Ref<Props[Field]>
    watch(
      () => props[field],
      (vals) => {
        if (!isEqual(vals, localVar.value)) {
          let copy = cloneDeep(vals)
          if (typeof transformer === 'function') {
            copy = transformer(copy)
          }
          localVar.value = copy
        }
      },
      { deep: true, immediate: true }
    )
    watch(
      localVar,
      (vals) => {
        if (!isEqual(vals, props[field])) {
          emit(`update:${String(field)}`, cloneDeep(vals))
        }
      },
      { deep: true }
    )
    return localVar
  }
}

/**
 * Create a ref that automatically updates if the supplied prop changes.
 */
export function useDeepWatch<Props extends {}>(props: Props) {
  return <Field extends keyof Props>(field: Field) => {
    const localVar = ref(cloneDeep(props[field])) as Ref<Props[Field]>
    watch(
      () => props[field],
      (vals) => {
        if (!isEqual(vals, localVar.value)) {
          localVar.value = cloneDeep(vals)
        }
      },
      { deep: true, immediate: true }
    )
    return localVar
  }
}
