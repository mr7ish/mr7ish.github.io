<template>
  <div class="todo-panel-wrapper">
    <motion.div
      class="main-wrapper"
      :animate="{ y: `${y}vh` }"
      :transition="{ type: 'spring' }"
    >
      <div class="main">
        <div class="list-tab-wrapper">
          <ExclusiveTabs
            :tabs="tabs"
            v-model:activeTab="activeTab"
            style="font-size: 0.75rem"
            :margin="15"
            :padding="0.3"
          >
            <template #tab="{ tabId, tabLabel }">
              <CustomSelect
                v-if="tabId === 'custom-list'"
                v-model="listKey"
                :placeholder="tabLabel"
                :options="todoListOptions"
                :optionsWidth="180"
                valueToLabel
              >
                <template #operates="{ option }">
                  <IconDelete
                    :size="25"
                    color="#ff3b30"
                    @click.stop="onDelete(option)"
                  />
                </template>
              </CustomSelect>
            </template>
          </ExclusiveTabs>
        </div>
        <div class="list-content-wrapper">
          <TodoList
            :todoList="filteredTodoList"
            :activeTab="activeTab"
            :listKey="listKey"
          />
        </div>
      </div>
      <div class="footer">
        <div class="operation-wrapper">
          <div
            class="left-box"
            @click="onCreate('item')"
          >
            <IconAdd
              color="#007aff"
              solid
            />
            <span>New Todo</span>
          </div>
          <span
            style="cursor: pointer"
            @click="onCreate('list')"
          >
            Create List
          </span>
        </div>
      </div>
    </motion.div>
    <!-- <TodoCreate
      v-model:open="openCreate"
      :type="createType"
      :options="todoListOptions"
    /> -->
    <ConfirmDialog
      v-model:visible="confirmDialogVisible"
      :content="`Are you sure you want to delete the list ${removeTodoListItem.label}?`"
      @confirm="onConfirmRemove"
      @cancel="onCancelRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from "vue";
import ExclusiveTabs from "../ExclusiveTabs.vue";
import CustomSelect, { Option } from "../CustomSelect.vue";
import IconAdd from "../svgs/IconAdd.vue";
import TodoCreate from "./TodoCreate.vue";
import { motion } from "motion-v";
import { removeTodoList, todoList } from "./utils/useTodoStorage";
import IconDelete from "../svgs/IconDelete.vue";
import ConfirmDialog from "../ConfirmDialog.vue";
import { notice } from "../../utils/notice";
import TodoList from "./TodoList.vue";
import { useData } from "vitepress";

type Props = {
  open?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const removeTodoListItem = shallowRef<Option>({ label: "", value: "" });

const todoListOptions = computed(() =>
  todoList.value
    .filter((list) => !list.deleted)
    .map((list) => ({ label: list.name, value: list.key }))
);

const filteredTodoList = computed(() =>
  todoList.value.filter((list) => !list.deleted)
);

const tabs = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "completed",
    label: "Completed",
  },
  {
    id: "custom-list",
    label: "My List",
  },
];

const activeTab = shallowRef(tabs[0].id);
const listKey = shallowRef("");
const openCreate = shallowRef(false);
const createType = shallowRef<"list" | "item">("list");
const confirmDialogVisible = shallowRef(false);
const y = computed(() => (openCreate.value ? -100 : 0));

function onCreate(type: "list" | "item") {
  openCreate.value = true;
  createType.value = type;
}

function onDelete(option: Option) {
  confirmDialogVisible.value = true;
  removeTodoListItem.value = option;
}

async function onConfirmRemove() {
  if (await removeTodoList(removeTodoListItem.value.value)) {
    return notice("List deleted successfully");
  }
  return notice("Failed to delete list");
}

function onCancelRemove() {
  removeTodoListItem.value = { label: "", value: "" };
}

const { isDark } = useData();

const bgColor = computed(() => (isDark.value ? "#e3e3e3" : "#2F2F31"));
</script>

<style scoped lang="less">
.todo-panel-wrapper {
  width: 100%;
  height: 50vh;
  position: relative;
  overflow: hidden;

  .main-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 1rem;
    // padding-top: 0;
    // padding-bottom: 0;
    position: relative;

    .main {
      height: 100%;
      display: flex;
      flex-direction: column;

      .list-tab-wrapper {
        margin: 20px 5px 0;
      }

      .list-content-wrapper {
        height: calc(100% - 40px);
        padding: 10px 12px;
      }
    }

    .footer {
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      background-color: v-bind(bgColor);

      .operation-wrapper {
        width: 100%;
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        font-weight: bold;
        color: #007aff;

        .left-box {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
