import { HexagramResult, LocalStorageData } from '../types';

const STORAGE_KEY = 'personality_hexagram_data';

const createDefaultData = (): LocalStorageData => ({
  testHistory: [],
  hexagramResults: [],
  userPreferences: {
    theme: 'light',
    language: 'en',
    userSelectedLanguage: false
  }
});

const normalizeHistory = (data: Partial<LocalStorageData>): HexagramResult[] => {
  if (Array.isArray(data.testHistory) && data.testHistory.length > 0) {
    return data.testHistory;
  }

  if (Array.isArray(data.hexagramResults) && data.hexagramResults.length > 0) {
    return data.hexagramResults;
  }

  return [];
};

export const getLocalData = (): LocalStorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultData();
    }

    const parsed = JSON.parse(raw) as Partial<LocalStorageData>;
    const history = normalizeHistory(parsed);

    return {
      testHistory: history,
      hexagramResults: history,
      userPreferences: {
        theme: parsed.userPreferences?.theme || 'light',
        language: parsed.userPreferences?.language || 'en',
        userSelectedLanguage: parsed.userPreferences?.userSelectedLanguage ?? false
      }
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return createDefaultData();
  }
};

export const saveLocalData = (data: LocalStorageData): void => {
  try {
    const history = normalizeHistory(data);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...data,
        testHistory: history,
        hexagramResults: history
      })
    );
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const addTestResult = (result: HexagramResult): void => {
  const data = getLocalData();
  data.testHistory.unshift(result);

  if (data.testHistory.length > 50) {
    data.testHistory = data.testHistory.slice(0, 50);
  }

  data.hexagramResults = [...data.testHistory];
  saveLocalData(data);
};

export const getTestHistory = (): HexagramResult[] => {
  return getLocalData().testHistory;
};

export const getResultById = (id: string): HexagramResult | null => {
  return getTestHistory().find(result => result.id === id) || null;
};

export const getLatestCurrentResult = (): HexagramResult | null => {
  return getTestHistory().find(result => !result.scenario || result.scenario === 'current') || null;
};

export const deleteTestResult = (id: string): void => {
  const data = getLocalData();
  data.testHistory = data.testHistory.filter(result => result.id !== id);
  data.hexagramResults = [...data.testHistory];
  saveLocalData(data);
};

export const clearTestHistory = (): void => {
  const data = getLocalData();
  data.testHistory = [];
  data.hexagramResults = [];
  saveLocalData(data);
};

export const updateUserPreferences = (preferences: Partial<LocalStorageData['userPreferences']>): void => {
  const data = getLocalData();
  data.userPreferences = { ...data.userPreferences, ...preferences };
  saveLocalData(data);
};

export const getUserPreferences = () => {
  return getLocalData().userPreferences;
};

export const exportData = (): string => {
  return JSON.stringify(getLocalData(), null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData) as Partial<LocalStorageData>;
    const data: LocalStorageData = {
      ...createDefaultData(),
      ...parsed,
      testHistory: normalizeHistory(parsed),
      hexagramResults: normalizeHistory(parsed),
      userPreferences: {
        ...createDefaultData().userPreferences,
        ...parsed.userPreferences
      }
    };
    saveLocalData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const saveToLocalStorage = saveLocalData;
export const loadFromLocalStorage = getLocalData;
