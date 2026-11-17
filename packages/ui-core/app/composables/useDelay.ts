export function useDelay() {
  let timer: NodeJS.Timeout | null = null;
  let resolveFn: (() => void) | null = null;


  function delay(ms: number) {
    return new Promise<void>((resolve) => {
      resolveFn = resolve;
      timer = setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  function cancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (resolveFn !== null) {
      resolveFn();
      resolveFn = null;
    }
  }
  onBeforeUnmount(() => {
    cancel();
  });

  return {
    cancel,
    delay,
  };
}
