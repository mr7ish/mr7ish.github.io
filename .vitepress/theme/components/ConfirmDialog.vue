<template>
  <teleport to="body">
    <div>
      <AnimatePresence :initial="false">
        <motion.div
          v-if="visible"
          class="overlay"
          :initial="{ opacity: 0, scale: 0 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{
            duration: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }"
          :exit="{ opacity: 0, scale: 0 }"
        >
          <div class="modal-wrapper">
            <div class="modal">
              <div class="header">
                <span>{{ title }}</span>
              </div>
              <div class="content">
                <div>{{ content }}</div>
              </div>
              <div class="footer">
                <button
                  class="cancel"
                  @click="cancel"
                >
                  {{ cancelText }}
                </button>
                <button
                  class="confirm"
                  @click="confirm"
                >
                  {{ confirmText }}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { computed, onMounted } from "vue";
import useScrollLock from "../hooks/useScrollLock";
import { useData } from "vitepress";

type Props = {
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  cancelBackgroundColor?: string;
  confirmBackgroundColor?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: "Confirm",
  content: "Are you sure you want to delete this?",
  cancelText: "Cancel",
  confirmText: "Confirm",
  cancelBackgroundColor: "#1a1e26",
  confirmBackgroundColor: "#ff0088",
});

const emit = defineEmits(["confirm", "cancel"]);

const { isDark } = useData();
const visible = defineModel("visible", { default: false });
const modalBgColor = computed(() => (isDark.value ? "#0b1011" : "#0b1011"));
const cancelBtnBgColor = computed(() => props.cancelBackgroundColor);
const confirmBtnBgColor = computed(() => props.confirmBackgroundColor);

function confirm() {
  emit("confirm");
  close();
}

function cancel() {
  emit("cancel");
  close();
}

function close() {
  visible.value = false;
}

const { lock } = useScrollLock();

onMounted(() => {
  lock();
});
</script>

<style scoped lang="less">
.overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-i-top);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-i-top) + 1);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal {
    min-width: 300px;
    height: 200px;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #1d2628;
    color: #fff;
    background-color: v-bind(modalBgColor);

    .header {
      margin-bottom: 24px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .content {
      font-size: 1rem;
    }

    .footer {
      border-top: 1px solid #1a1e26;
      padding-top: 20px;
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      button {
        font: inherit;
        cursor: pointer;
        outline: inherit;
        color: #fff;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 10px;
      }

      .confirm {
        background-color: v-bind(confirmBtnBgColor);
      }

      .cancel {
        background-color: v-bind(cancelBtnBgColor);
      }
    }
  }
}
</style>
