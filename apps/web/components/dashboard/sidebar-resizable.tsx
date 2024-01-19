'use client';

import { ComponentProps, useState } from 'react';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { cn } from '@/lib/utils';

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
  ...props
}: ComponentProps<typeof ResizablePanel>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ResizablePanel
      collapsedSize={4}
      collapsible={true}
      minSize={15}
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
      {children}
    </ResizablePanel>
  );
}
