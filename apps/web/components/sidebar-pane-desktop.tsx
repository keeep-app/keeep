export function DesktopSidebarPane({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 bg-white pb-4">
        {children}
      </div>
    </div>
  );
}
