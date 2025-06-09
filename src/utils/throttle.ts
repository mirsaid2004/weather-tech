/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttle<TArgs extends any[]>(
  func: (...args: TArgs) => void,
  limit: number,
) {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | null = null;
  let lastContext: any = null;

  const invoke = () => {
    if (lastArgs) {
      func.apply(lastContext, lastArgs);
      lastCallTime = Date.now();
      lastArgs = null;
      lastContext = null;
    }
  };

  function throttled(this: any, ...args: TArgs) {
    const now = Date.now();
    const remaining = limit - (now - lastCallTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      func.apply(this, args);
      lastCallTime = now;
    } else {
      lastArgs = args;
      lastContext = this;

      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          invoke();
        }, remaining);
      }
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastContext = null;
  };

  return throttled as typeof throttled & { cancel: () => void };
}
