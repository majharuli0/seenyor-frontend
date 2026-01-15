import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 定义一个存储解决方案，例如 localStorage
const storage = createJSONStorage(() => localStorage);

export const useCountStore = create(
  persist(
    immer((set) => ({
      StoreRole: '',
      setStoreRole: (role) =>
        set((state) => {
          state.StoreRole = role;
        }),
      supportDetil: {},
      setSupportDetil: (role) =>
        set((state) => {
          state.supportDetil = role;
        }),
      user: {},
      setUser: (data) =>
        set((state) => {
          state.user = data;
        }),
      UserDetil: {},
      setUserDetil: (row) =>
        set((state) => {
          state.UserDetil = row;
        }),

      Dailyreport: {},
      setDailyreport: (row) =>
        set((state) => {
          state.Dailyreport = row;
        }),
    })),
    {
      name: 'count-store', // 存储在 localStorage 中的键名
      getStorage: () => storage, // 指定存储解决方案
      // 这里可以添加更多配置项，如部分状态的白名单或黑名单
    }
  )
);
