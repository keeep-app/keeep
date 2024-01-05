import { cn } from '@/lib/utils';

type SpinnerProps = {
  className?: string;
  size?: 'small' | 'medium' | 'large';
};

export default function Spinner({ className, size = 'medium' }: SpinnerProps) {
  return (
    <div role="status" className={className}>
      <span className="absolute inset-0 flex items-center justify-center">
        <svg
          className={cn('animate-spin text-white', {
            'h-3 w-3': size === 'small',
            'h-5 w-5': size === 'medium',
            'h-8 w-8': size === 'large',
          })}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </span>
    </div>
  );
}
