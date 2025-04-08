import { useCallback, useRef } from 'react'

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0)
  const lastCallTimer = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        callback(...args)
      } else {
        clearTimeout(lastCallTimer.current)
        lastCallTimer.current = setTimeout(() => {
          lastCall.current = now
          callback(...args)
        }, delay)
      }
    },
    [callback, delay]
  ) as T
}

