<template>
  <motion.div
    class="todo-create-wrapper"
    :animate="{ y: `${y}vh` }"
    :transition="{ type: 'spring' }"
  >
    <div class="header">
      <span
        class="operation-label"
        @click="cancel"
      >
        cancel
      </span>
      <span class="title">{{ title }}</span>
      <span
        class="operation-label"
        :class="{ disabled }"
        @click="confirm"
      >
        confirm
      </span>
    </div>
    <div class="main">
      <VanishingInput
        ref="inputRef"
        style="transform: scale(0.8)"
        :placeholders="[
          'Create Todo List',
          `Input The ${type === 'list' ? 'List' : 'Item'} Name`,
          '✨✨✨',
        ]"
        :showSubmitButton="false"
        v-model="inputValue"
        @submit="onSubmit"
        @animated="onAnimated"
      />
      <template v-if="type === 'item'">
        <div class="list-select">
          <CustomSelect
            :noBorder="false"
            :outmostCustomStyle="{
              transform: 'scale(0.8)',
              width: '100%',
              height: '3rem',
              borderRadius: `calc(3rem / 2)`,
              borderBottom: '1px solid #000',
              paddingLeft: '2.5rem',
            }"
            :optionsCustomStyle="{
              transform: 'scale(0.8)',
            }"
            placeholder="Select A List..."
            v-model="listKey"
            :options="options"
            valueToLabel
          />
        </div>
      </template>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import VanishingInput from "../VanishingInput.vue";
import { createTodoItem, createTodoList } from "./utils/useTodoStorage";
import { notice } from "../../utils/notice";
import CustomSelect, { Option } from "../CustomSelect.vue";

type Props = {
  type?: "list" | "item";
  options?: Option[];
};

const props = withDefaults(defineProps<Props>(), {
  type: "list",
  options: undefined,
});

const title = computed(() =>
  props.type === "list" ? "Create List" : "Create Todo"
);
const open = defineModel("open", { default: false });
const y = computed(() => (open.value ? 0 : 100));
const inputRef = useTemplateRef("inputRef");
const inputValue = shallowRef("");
const listKey = shallowRef("");
const animating = shallowRef(false);
const submitted = shallowRef(false);

const disabled = computed(() => {
  if (props.type === "list" && !inputValue.value) return true;
  if (props.type === "item" && (!inputValue.value || !listKey.value))
    return true;
});

watch(
  () => animating.value,
  (_animating) => {
    if (open.value && !_animating) {
      cancel();
    }
  }
);

watch(
  () => submitted.value,
  (_submitted) => {
    if (_submitted) {
      execute();
      return;
    }
  }
);

async function execute() {
  console.log("execute", inputValue.value);
  console.log("execute", listKey.value);

  if (props.type === "list") {
    if (await createTodoList(inputValue.value)) {
      notice(`List ${inputValue.value} created successfully`);
    } else {
      notice("Failed to create list");
    }
  } else {
    if (
      await createTodoItem(listKey.value, {
        desc: inputValue.value,
      })
    ) {
      notice(`Item ${inputValue.value} created successfully`);
    } else {
      notice("Failed to create item");
    }
  }

  submitted.value = false;
}

function onSubmit() {
  submitted.value = true;
}

function confirm() {
  if (disabled.value) return;
  inputRef.value?.handleSubmit();
}

function onAnimated(_animating: boolean) {
  animating.value = _animating;
}

function cancel() {
  open.value = false;
  inputValue.value = "";
  listKey.value = "";
}
</script>

<style scoped lang="less">
.todo-create-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: hsl(var(--todo-island-bg) / 1);
  padding: 1rem;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;

    .title {
      font-size: 0.875rem;
    }

    .operation-label {
      color: #007aff;
      cursor: pointer;
    }

    .disabled {
      color: #8e8e93;
      cursor: not-allowed;
    }
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    // align-items: center;

    .list-select {
      color: #fff;
    }
  }
}
</style>
