<template>
  <div class="todo-item-wrapper">
    <button
      class="check-btn"
      :style="{
        borderColor: checked ? '#007aff' : '#c5c5c7',
      }"
      @click="changeStatus"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#007aff"
        stroke-width="3"
        class="check-svg"
      >
        <path
          class="check-path"
          d="M4 12L10 18L20 10"
          :stroke-linecap="checked ? 'round' : undefined"
          pathLength="1"
          stroke-dashoffset="0px"
          :stroke-dasharray="`${checked ? '1' : '0'}px 1px`"
        ></path>
      </svg>
    </button>
    <div class="todo-content">
      {{ desc }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { TodoItem } from "./types";
import { watchDebounced } from "@vueuse/core";

type Props = {
  state: TodoItem;
  listKey: string;
};

const { state, listKey } = defineProps<Props>();
const { completed, desc } = state;

const emits = defineEmits<{
  change: [listKey: string, itemKey: string, checked: boolean];
}>();

const checked = shallowRef(completed);

function changeStatus() {
  checked.value = !checked.value;
}

watchDebounced(
  () => checked.value,
  (_checked) => {
    emits("change", listKey, state.key, _checked);
  },
  {
    debounce: 2000,
  }
);
</script>

<style scoped lang="less">
.todo-item-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  .check-btn {
    width: 22px;
    height: 22px;
    border: 2px solid #c5c5c7;
    border-radius: 50%;
    padding: 2px;

    .check-svg {
      transform: rotate(-5deg);

      .check-path {
        transition: stroke-dasharray 0.1s linear;
      }
    }
  }

  .todo-content {
    flex: 1;
    padding: 5px;
    border-bottom: 1px solid #cacacc;
  }
}
</style>
