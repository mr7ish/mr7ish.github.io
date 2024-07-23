import { h, ref, render } from "vue";
import MessageNotice from "../components/MessageNotice.vue";

export type NoticeType = "success" | "warning" | "error" | "info";

const isNoticed = ref(false);

/**
 * 消息提示
 */
export function notice(
  msg = "this is a notice",
  type: NoticeType = "success",
  duration = 2000
) {
  if (isNoticed.value) return;
  isNoticed.value = true;

  const container = document.createElement("div");
  container.classList.add("message-notice-container");
  document.body.appendChild(container);

  render(
    h(MessageNotice, { type: type }, () => msg),
    container
  );

  setTimeout(() => {
    document.body.removeChild(container);
    isNoticed.value = false;
  }, duration);
}
