import { useState, useCallback } from 'react'

export function useMenuPatch() {
    const [enabled, setEnabled] = useState(true)
    const onMenuReady = useCallback(() => {
        if (!enabled) {
            return
        }

        setTimeout(() => setEnabled(false))
    }, [enabled])

    return [enabled ? 'pre-init-blink-fix' : '', onMenuReady] as [string, () => void]
}
