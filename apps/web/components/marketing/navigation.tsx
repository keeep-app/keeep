import Link from 'next/link';
import { Button } from '../ui/button';
import { KeeepIcon, KeeepLogo } from './brand';

export const Navigation: React.FC = () => {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <div className="flex items-center space-x-10">
        <Link
          className="flex cursor-pointer items-center justify-center gap-1"
          href="#"
        >
          <KeeepIcon width={28} />
          <KeeepLogo width={72} />
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </div>
      <Button asChild className="ml-auto" size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </header>
  );
};
