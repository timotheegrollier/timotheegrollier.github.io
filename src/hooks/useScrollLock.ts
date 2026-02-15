import { useEffect } from 'react';

/**
 * Hook to lock body scroll when a condition is met (e.g., modal open)
 */
export function useScrollLock(isLocked: boolean) {
    useEffect(() => {
        if (isLocked) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
        return () => { }; // No-op cleanup if not locked
    }, [isLocked]);
}
