import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ThankYouGif from '@/public/thank-you.gif';

export default function Component() {
  return (
    <>
      <div className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Thank you for signing up!
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                You've been added to our waitlist. We can't wait for you to try
                Keeep!
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <Image
                alt="Humorous GIF"
                className="rounded-lg shadow-lg"
                height="500"
                src={ThankYouGif}
                style={{
                  aspectRatio: '500/500',
                  objectFit: 'cover',
                }}
                width="500"
              />
              <Button>Share with Friends</Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Spread the word and move up the waitlist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
