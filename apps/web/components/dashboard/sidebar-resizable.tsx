'use client';

import { ComponentProps, createContext, useContext, useState } from 'react';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '../ui/tooltip';

export function ResizableSidebarGroup({
  children,
  ...props
}: ComponentProps<typeof ResizablePanelGroup>) {
  return (
    <ResizablePanelGroup
      {...props}
      direction="horizontal"
      className="h-full items-stretch"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
    >
      {children}
    </ResizablePanelGroup>
  );
}

export function ResizableSidebar({
  children,
  defaultCollapsed = false,
  ...props
}: ComponentProps<typeof ResizablePanel> & { defaultCollapsed?: boolean }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <ResizablePanel
      collapsedSize={5}
      collapsible={true}
      minSize={10}
      maxSize={20}
      {...props}
      onExpand={() => {
        setIsCollapsed(false);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          false
        )}`;
      }}
      onCollapse={() => {
        setIsCollapsed(true);
        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
          true
        )}`;
      }}
      className={cn(
        isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
      )}
    >
      <TooltipProvider delayDuration={0}>
        <SidebarContext.Provider value={{ collapsed: isCollapsed }}>
          {children}
        </SidebarContext.Provider>
      </TooltipProvider>
    </ResizablePanel>
  );
}

const SidebarContext = createContext<{ collapsed: boolean }>({
  collapsed: false,
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error(`useSidebar must be used within a SidebarProvider`);
  return context;
};
