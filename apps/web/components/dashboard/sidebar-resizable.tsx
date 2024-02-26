'use client';

import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { TooltipProvider } from '../ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { ImperativePanelGroupHandle } from 'react-resizable-panels';

const SIZES = {
  MOBILE: {
    COLLAPSED: 0,
    EXPANDED: 60,
  },
  DESKTOP: {
    COLLAPSED: 5,
    MIN: 10,
    MAX: 20,
  },
} as const;

const LAYOUTS = {
  MOBILE_COLLAPSED: [SIZES.MOBILE.COLLAPSED, 100 - SIZES.MOBILE.COLLAPSED],
  MOBILE_EXPANDED: [SIZES.MOBILE.EXPANDED, 100 - SIZES.MOBILE.EXPANDED],
  DESKTOP_COLLAPSED: [SIZES.DESKTOP.COLLAPSED, 100 - SIZES.DESKTOP.COLLAPSED],
  DESKTOP_MAX: [SIZES.DESKTOP.MAX, 100 - SIZES.DESKTOP.MAX],
};

export function ResizableSidebarGroup({
  children,
  defaultCollapsed = false,
  ...props
}: ComponentProps<typeof ResizablePanelGroup> & {
  defaultCollapsed?: boolean;
}) {
  const resizable = useRef<ImperativePanelGroupHandle>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Using `setLayout` is not reactive, so we keep track of it separately
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    // Resize the sidebar when the window is resized
    const sidebarSize = resizable.current?.getLayout()?.[0] ?? 0;

    if (isMobile && sidebarSize !== 0) {
      resizable.current?.setLayout(LAYOUTS.MOBILE_COLLAPSED);
    }

    if (!isMobile && sidebarSize === 0) {
      resizable.current?.setLayout(LAYOUTS.DESKTOP_MAX);
    }
  }, [isMobile]);

  const context: ResizableContextType = useMemo(
    () => ({
      resizable,
      isCollapsed: () => isCollapsed,
    }),
    [resizable, isCollapsed]
  );

  return (
    <ResizableContext.Provider value={context}>
      <ResizablePanelGroup
        {...props}
        ref={resizable}
        direction="horizontal"
        className="h-full items-stretch"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;

          if (
            sizes[0] === SIZES.MOBILE.COLLAPSED ||
            sizes[0] === SIZES.DESKTOP.COLLAPSED
          ) {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          } else {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }
        }}
      >
        {children}
      </ResizablePanelGroup>
    </ResizableContext.Provider>
  );
}

export function ResizableSidebar({
  children,
  defaultSize = SIZES.DESKTOP.MAX,
  ...props
}: ComponentProps<typeof ResizablePanel> & {
  defaultSize?: number;
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <ResizablePanel
      collapsible={true}
      collapsedSize={
        isMobile ? SIZES.MOBILE.COLLAPSED : SIZES.DESKTOP.COLLAPSED
      }
      minSize={isMobile ? SIZES.MOBILE.EXPANDED : SIZES.DESKTOP.MIN}
      maxSize={isMobile ? SIZES.MOBILE.EXPANDED : SIZES.DESKTOP.MAX}
      defaultSize={defaultSize}
      {...props}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </ResizablePanel>
  );
}

export function ResizableSidebarToggle({ className }: { className?: string }) {
  const { resizable, isCollapsed } = useResizable();

  return (
    <Button
      className={cn('px-0', className)}
      variant="ghost"
      size="icon"
      onClick={() => {
        if (isCollapsed()) {
          resizable.current?.setLayout(LAYOUTS.MOBILE_EXPANDED);
        } else {
          resizable.current?.setLayout(LAYOUTS.MOBILE_COLLAPSED);
        }
      }}
    >
      <VisuallyHidden>Toggle Sidebar</VisuallyHidden>
      <ChevronLeft
        size={16}
        style={{ transform: !isCollapsed() ? 'rotate(180deg)' : undefined }}
      />
    </Button>
  );
}

type ResizableContextType = {
  resizable: React.RefObject<ImperativePanelGroupHandle>;
  isCollapsed: () => boolean;
};

const ResizableContext = createContext<ResizableContextType>({
  resizable: { current: null },
  isCollapsed: () => false,
});

export const useResizable = () => {
  const context = useContext(ResizableContext);
  if (!context)
    throw new Error(`useResizable must be used within a ResizableProvider`);
  return context;
};
