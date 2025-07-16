<template>
  <div class="todo-list-wrapper">
    <template v-if="todoItems.length > 0">
      <TodoItem
        v-for="todoItem in todoItems"
        :key="todoItem.key"
        :listKey="todoItem.listKey"
        :state="todoItem"
        @change="onChange"
      />
    </template>
    <template v-else>
      <div class="empty-data">
        <span v-if="['all', 'custom-list'].includes(activeTab)">
          Nothing todo🥳
        </span>
        <span v-else>Nothing completed🤪</span>
        <!-- 🤯😮‍💨 -->
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TodoItem from "./TodoItem.vue";
import { TodoList } from "./types";
import { updateTodoItem } from "./utils/useTodoStorage";

type Props = {
  todoList: TodoList[];
  activeTab: string;
  listKey: string;
};

const props = withDefaults(defineProps<Props>(), {
  todoList: () => [],
  activeTab: "all",
  listKey: "",
});

const todoItems = computed(() => {
  return filterTodoList(props.todoList)
    .map((listItem) => {
      return listItem.list.map((item) => {
        return {
          ...item,
          listKey: listItem.key,
        };
      });
    })
    .flat()
    .sort((a, b) => {
      return b.createTime - a.createTime;
    });
});

function filterTodoList(todoList: TodoList[]) {
  return todoList
    .filter((item) => {
      if (props.activeTab === "custom-list" && props.listKey) {
        return item.key === props.listKey;
      }
      return true;
    })
    .map((item) => ({
      ...item,
      list: item.list.filter((todoItem) => {
        if (["all", "custom-list"].includes(props.activeTab)) {
          return !todoItem.completed;
        }
        if (props.activeTab === "completed") {
          return todoItem.completed;
        }
        return true;
      }),
    }));
}

function onChange(listKey: string, itemKey: string, checked: boolean) {
  // console.log("onChange =>", listKey, itemKey, checked);

  updateTodoItem({
    listKey,
    itemKey,
    updateProp: "completed",
    updateValue: checked,
  });
}
</script>

<style scoped lang="less">
.todo-list-wrapper {
  height: 100%;
  padding-bottom: 2rem;
  overflow-y: auto;

  .empty-data {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    font-weight: bold;
  }
}
</style>
