// src/lib/localStorageManager.ts

const STORAGE_KEY = 'toolContents';

export function getToolContent(toolSlug: string): string {
  if (typeof window === "undefined") return "";
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return "";
  try {
    const parsed = JSON.parse(data);
    return parsed[toolSlug]?.content || "";
  } catch (e) {
    console.error("Failed to parse tool contents from localStorage", e);
    return "";
  }
}

export function saveToolContent(toolSlug: string, content: string): void {
  if (typeof window === "undefined") return;
  const data = localStorage.getItem(STORAGE_KEY);
  let parsed = {};
  try {
      parsed = data ? JSON.parse(data) : {};
  } catch(e) {
      console.error("Could not parse existing localStorage data, starting fresh.", e);
      parsed = {};
  }
  
  // @ts-ignore
  parsed[toolSlug] = {
    content,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  
  // Dispatch a custom event to notify other parts of the application
  window.dispatchEvent(new Event('storageUpdated'));
}

export function getAllToolContents(): { [key: string]: { content: string, updatedAt: string } } {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse all tool contents from localStorage", e);
    return {};
  }
}
