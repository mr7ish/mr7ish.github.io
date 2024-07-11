type AnyFn = (...args: any[]) => any;

/**
 * 在指定时间间隔内, 如果事件多次触发, 只执行最后一次
 * 用于频繁触发场景, 如用户输入, 只在用户输入完一段时间(拿最新值)去执行
 */
export function debounce(fn: AnyFn, wait: number) {
  let timer: NodeJS.Timeout;

  return function (...args: Parameters<AnyFn>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

/**
 * 在指定时间内只执行一次
 * 用于持续触发场景, 如用户频繁点击按钮
 */
export function throttle(fn: AnyFn, limit: number) {
  let timer: NodeJS.Timeout;
  let lastTime: number;

  return function (...args: Parameters<AnyFn>) {
    // 首次执行并记录时间
    if (!lastTime) {
      fn.apply(this, args);
      lastTime = Date.now();
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (Date.now() - lastTime >= limit) {
        fn.apply(this, args);
        lastTime = Date.now();
      }
    }, limit - (Date.now() - lastTime));
  };
}

/**
 * 节流 (依靠定时关锁)
 */
export function throttle2(fn: AnyFn, limit: number) {
  let lock = false;

  return function (...args: Parameters<AnyFn>) {
    if (lock) return;
    lock = true;
    fn.apply(this, args);

    setTimeout(() => {
      lock = false;
    }, limit);
  };
}
