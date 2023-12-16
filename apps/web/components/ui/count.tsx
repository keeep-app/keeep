import React from 'react';

export function Count({ count }: { count?: number }) {
  if (count === undefined) return null;

  return (
    <span className="rounded-sm bg-accent p-1 text-xs font-medium tabular-nums text-opacity-50">
      {count}
    </span>
  );
}
