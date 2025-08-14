import throttle from "lodash.throttle";
import { useRef, useEffect, useMemo } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay = 500
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);

  // Always keep the latest callback in ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create the throttled function only once
  const throttled = useMemo(
    () =>
      throttle(
        (...args: any[]) => {
          callbackRef.current(...args);
        },
        delay,
        { trailing: false, leading: true }
      ),
    [delay]
  );

  useEffect(() => {
    return () => {
      throttled.cancel();
    };
  }, [throttled]);

  return throttled;
}

// hook for throttle to prevent button spam and redundancy in the code.
