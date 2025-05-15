import { onUnmounted } from "vue";

export default function useScrollLock() {
  // watch(
  //   () => visible.value,
  //   (_visible) => {
  //     if (_visible) {
  //       document.body.style.overflow = "hidden";
  //       document.body.style.pointerEvents = "none";
  //     } else {
  //       document.body.style.overflow = "auto";
  //       document.body.style.pointerEvents = "auto";
  //     }
  //   }
  // );

  const lock = () => {
    document.addEventListener("wheel", preventDefault, { passive: false });
    document.addEventListener("keydown", preventArrowKeyScroll);
  };

  const unlock = () => {
    document.removeEventListener("wheel", preventDefault);
    document.removeEventListener("keydown", preventArrowKeyScroll);
  };

  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  const preventArrowKeyScroll = (e: Event) => {
    if (["Space", "ArrowUp", "ArrowDown"].includes((e as KeyboardEvent).code)) {
      e.preventDefault();
    }
  };

  onUnmounted(unlock);

  return { lock, unlock };
}
