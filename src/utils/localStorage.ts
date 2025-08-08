import { HexagramResult, LocalStorageData } from '../types';

const STORAGE_KEY = 'personality_hexagram_data';

// 获取本地存储数据
export const getLocalData = (): LocalStorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // 返回默认数据
  return {
    testHistory: [],
    hexagramResults: [],
    userPreferences: {
      theme: 'light',
      language: 'zh'
    }
  };
};

// 保存本地存储数据
export const saveLocalData = (data: LocalStorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// 添加测试结果
export const addTestResult = (result: HexagramResult): void => {
  const data = getLocalData();
  data.testHistory.unshift(result); // 最新的在前面
  
  // 限制历史记录数量（最多保存50条）
  if (data.testHistory.length > 50) {
    data.testHistory = data.testHistory.slice(0, 50);
  }
  
  saveLocalData(data);
};

// 获取测试历史
export const getTestHistory = (): HexagramResult[] => {
  return getLocalData().testHistory;
};

// 删除测试结果
export const deleteTestResult = (id: string): void => {
  const data = getLocalData();
  data.testHistory = data.testHistory.filter(result => result.id !== id);
  saveLocalData(data);
};

// 清空所有测试历史
export const clearTestHistory = (): void => {
  const data = getLocalData();
  data.testHistory = [];
  saveLocalData(data);
};

// 更新用户偏好
export const updateUserPreferences = (preferences: Partial<LocalStorageData['userPreferences']>): void => {
  const data = getLocalData();
  data.userPreferences = { ...data.userPreferences, ...preferences };
  saveLocalData(data);
};

// 获取用户偏好
export const getUserPreferences = () => {
  return getLocalData().userPreferences;
};

// 导出数据（用于备份）
export const exportData = (): string => {
  return JSON.stringify(getLocalData(), null, 2);
};

// 导入数据（用于恢复）
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData) as LocalStorageData;
    saveLocalData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// 兼容性别名
export const saveToLocalStorage = saveLocalData;
export const loadFromLocalStorage = getLocalData;