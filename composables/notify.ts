export interface Message {
  message: string
  color: string
  timeout?: number
  closeText?: string
}

export type Notify = (message: Message) => void

export function useNotify() {
  const notify = inject<Notify>('notify')
  if (!notify) {
    throw new Error('Notify not provided')
  }
  return notify
}
