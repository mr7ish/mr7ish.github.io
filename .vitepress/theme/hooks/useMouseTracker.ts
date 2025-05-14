import { useEventListener } from "@vueuse/core";
import { ref } from "vue";

export function useMouseTracker() {
  const x = ref(0);
  const y = ref(0);

  function onMousemove(e: MouseEvent) {
    requestAnimationFrame(() => {
      x.value = e.clientX;
      y.value = e.clientY;
    });
  }

  useEventListener(document, "mousemove", onMousemove);

  return { x, y };
}
