import { create } from 'zustand';

type StoreType = {
  sidebar: {
    isOpen: boolean;
    close: () => void;
    open: () => void;
  };
};

export const useStore = create<StoreType>(set => ({
  sidebar: {
    isOpen: false,
    close: () =>
      set(({ sidebar }) => ({ sidebar: { ...sidebar, isOpen: false } })),
    open: () =>
      set(({ sidebar }) => ({ sidebar: { ...sidebar, isOpen: true } })),
  },
}));
