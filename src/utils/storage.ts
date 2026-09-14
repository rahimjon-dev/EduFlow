/**
 * Utility for persisting data to localStorage
 */

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(`eduflow_${key}`);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`eduflow_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};
