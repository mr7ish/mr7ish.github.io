export interface TodoList {
  key: string;
  // 待办列表名称
  name: string;
  // 待办列表
  list: TodoItem[];
  createTime: number;
  deleted: boolean;
}

export interface TodoItem {
  key: string;
  // 待办事项描述
  desc: string;
  // 是否完成
  completed: boolean;
  // 创建时间
  createTime: number;
  // 更新时间
  updateTime: number;
  // 完成时间
  finishTime: number | null;
  // 通知时间
  noticeTime: number | null;
  // 优先级
  priority: Priority;
  // 是否删除
  deleted: boolean;
}

export type Priority = "None" | "High" | "Medium" | "Low";

export enum PriorityEnum {
  "None" = 0,
  "High" = 1,
  "Medium" = 2,
  "Low" = 3,
}
