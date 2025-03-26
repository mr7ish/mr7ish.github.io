type I18n<T = string> = {
  zh: T;
  en: T;
};

export interface Food {
  uuid: string;
  icon: string;
  name: I18n;
  category: I18n;
  material: I18n<string[]>;
  cookingSteps: I18n<string[]>;
  finalDishImage?: string;
}
