'use client';

import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  close: () => {},
  open: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(`useSidebar must be used within a SidebarProvider`);
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        close: () => setIsOpen(false),
        open: () => setIsOpen(true),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
