import { Food } from "./types";

export function searchFoods(keyword: string, foods: Food[]) {
  const searchFields = ["name", "category"] as const;

  return foods.filter((food) => {
    return searchFields.some((field) => {
      const fieldValue = food[field];
      if (
        fieldValue.zh.includes(keyword) ||
        fieldValue.en.toLowerCase().includes(keyword)
      )
        return true;
      return false;
    });
  });
}
