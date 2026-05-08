type StorageType = 'local' | 'session';

export const storage = {
  /**
   * 设置存储项
   */
  set<T>(key: string, value: T, storageType: StorageType = 'local'): boolean {
    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set error (${storageType}):`, error);
      return false;
    }
  },

  /**
   * 获取存储项
   */
  get<T>(key: string, storageType: StorageType = 'local', defaultValue?: T): T | null {
    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      const item = storage.getItem(key);
      
      if (item === null) {
        return defaultValue ?? null;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Storage get error (${storageType}):`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * 清空所有存储
   */
  clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
};

export default storage;