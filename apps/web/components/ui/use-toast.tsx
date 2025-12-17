
"use client";
import { useCallback } from 'react';
import { useToastContext } from './toast';
import { toast as globalToast } from './toast';

export function useToast() {
  const ctx = useToastContext();

  const toast = useCallback(
    (options: { title?: string; description?: string; duration?: number; variant?: string }) => {
      ctx.show(options);
    },
    [ctx]
  );

  return { toast };
}

export { globalToast as toast };

export default useToast;
