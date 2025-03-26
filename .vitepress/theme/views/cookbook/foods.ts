import { nanoid } from "nanoid";
import { Food } from "./types";

const foods: Food[] = [
  {
    uuid: nanoid(),
    icon: "🥦",
    name: {
      zh: "清炒西兰花",
      en: "Stir-Fried Broccoli",
    },
    category: {
      zh: "蔬菜",
      en: "vegetable",
    },
    material: {
      zh: ["西兰花", "油", "盐", "糖"],
      en: ["broccoli", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
  {
    uuid: nanoid(),
    icon: "🥩",
    name: {
      zh: "炒牛肉",
      en: "Stir-Fried Beef",
    },
    category: {
      zh: "肉类",
      en: "meat",
    },
    material: {
      zh: ["牛肉", "油", "盐", "糖"],
      en: ["beef", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
  {
    uuid: nanoid(),
    icon: "🥦",
    name: {
      zh: "清炒西兰花",
      en: "Stir-Fried Broccoli",
    },
    category: {
      zh: "蔬菜",
      en: "vegetable",
    },
    material: {
      zh: ["西兰花", "油", "盐", "糖"],
      en: ["broccoli", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
  {
    uuid: nanoid(),
    icon: "🥩",
    name: {
      zh: "炒牛肉",
      en: "Stir-Fried Beef",
    },
    category: {
      zh: "肉类",
      en: "meat",
    },
    material: {
      zh: ["牛肉", "油", "盐", "糖"],
      en: ["beef", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
  {
    uuid: nanoid(),
    icon: "🥦",
    name: {
      zh: "清炒西兰花",
      en: "Stir-Fried Broccoli",
    },
    category: {
      zh: "蔬菜",
      en: "vegetable",
    },
    material: {
      zh: ["西兰花", "油", "盐", "糖"],
      en: ["broccoli", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
  {
    uuid: nanoid(),
    icon: "🥩",
    name: {
      zh: "炒牛肉",
      en: "Stir-Fried Beef",
    },
    category: {
      zh: "肉类",
      en: "meat",
    },
    material: {
      zh: ["牛肉", "油", "盐", "糖"],
      en: ["beef", "oil", "salt", "sugar"],
    },
    cookingSteps: {
      zh: ["切", "炒", "煮"],
      en: ["cut", "cook", "boil"],
    },
    finalDishImage: "/violet dream.jpg",
  },
];

export default foods;
