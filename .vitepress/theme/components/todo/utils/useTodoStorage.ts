import { shallowRef } from "vue";
import { OperationParams, useIndexedDB } from "../../../hooks/useIndexedDB";
import { nanoid } from "nanoid";
import { Priority, TodoItem, TodoList } from "../types";
import { notice } from "../../../utils/notice";

export const todoList = shallowRef<TodoList[]>([]);

const { isSupported, connect, disconnect, set, get, remove } = useIndexedDB({
  dbName: "bigfish-records",
  storeName: "todo-store",
  version: 1,
});

export async function connectDB() {
  await connect();
  getTodoList();
}

export function disconnectDB() {
  disconnect();
}

async function getTodoList() {
  const res = await get<TodoList>();
  if (res) {
    todoList.value = res;
    // console.log("init todoList =>", todoList.value);
  }
}

async function modify(todoList: TodoList | TodoList[]) {
  const status = await set(todoList);
  if (status) {
    getTodoList();
  }

  return status;
}

function findTarget(listKey: string): TodoList | null;
function findTarget(listKey: string, itemKey: string): TodoItem | null;
function findTarget(listKey: string, itemKey?: string) {
  function find<T extends OperationParams>(source: T[], key: string) {
    return source.find((i) => i.key === key);
  }

  function isFound<T>(target: T | undefined, who: "todoList" | "todoItem") {
    if (!target) {
      notice(`${who} not find`, "error");
      return null;
    }
    return target;
  }

  const targetTodoList = isFound(find(todoList.value, listKey), "todoList");

  if (!itemKey || !targetTodoList) return targetTodoList;

  return isFound(find(targetTodoList.list, itemKey), "todoItem");
}

interface UpdateTodoItemParams<T, K extends keyof T> {
  listKey: string;
  itemKey: string;
  updateProp: K;
  updateValue: T[K];
}

type OmitKey = "key" | "createTime" | "updateTime" | "finishTime";
type UpdateProp = Omit<TodoItem, OmitKey>;

const batchCache = new Map<string, TodoList>();
let batchTimer: NodeJS.Timeout | null = null;
let pendingPromise: Promise<boolean> | null = null;

export async function updateTodoItem<Prop extends keyof UpdateProp>({
  listKey,
  itemKey,
  updateProp,
  updateValue,
}: UpdateTodoItemParams<TodoItem, Prop>) {
  const targetList = findTarget(listKey);
  const targetItem = findTarget(listKey, itemKey);

  if (!targetList || !targetItem) return Promise.resolve(false);

  targetItem[updateProp] = updateValue;

  if (updateProp === "completed" && updateValue === true) {
    targetItem.finishTime = Date.now();
  }

  targetItem.updateTime = Date.now();

  // 批量处理逻辑
  if (batchCache.has(listKey)) {
    const cachedList = batchCache.get(listKey)!;
    cachedList.list = cachedList.list.map((item) =>
      item.key === itemKey ? targetItem : item
    );
  } else {
    batchCache.set(listKey, { ...targetList });
  }

  // 创建或复用Promise
  if (!pendingPromise) {
    pendingPromise = new Promise((resolve) => {
      batchTimer && clearTimeout(batchTimer);
      batchTimer = setTimeout(async () => {
        const result = await batchModify();
        resolve(result);
        pendingPromise = null;
      }, 2000);
    });
  }

  return pendingPromise;
}

// 批量提交方法
async function batchModify() {
  const listsToUpdate = Array.from(batchCache.values());
  batchCache.clear();

  if (listsToUpdate.length === 0) return false;

  try {
    const status = await modify(listsToUpdate);
    return status;
  } catch (error) {
    console.error("Batch modify failed:", error);
    return false;
  }
}

export async function createTodoItem(
  listKey: string,
  params: {
    desc: string;
    noticeTime?: number | null;
    priority?: Priority;
  }
) {
  const { desc, noticeTime = null, priority = "None" } = params;

  const todoItem: TodoItem = {
    key: nanoid(),
    desc,
    completed: false,
    createTime: Date.now(),
    updateTime: Date.now(),
    finishTime: null,
    noticeTime,
    priority,
    deleted: false,
  };

  const target = findTarget(listKey);
  if (!target) return false;

  target.list.push(todoItem);
  return await modify(target);
}

export async function removeTodoList(key: string) {
  const target = findTarget(key);

  if (!target) return false;
  target.deleted = true;
  return await modify(target);
}

export async function createTodoList(name: string) {
  const todoList: TodoList = {
    key: nanoid(),
    name,
    list: [],
    createTime: Date.now(),
    deleted: false,
  };

  return await modify(todoList);
}
