import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const HeroSection: React.FC = () => {
  const t = useTranslations('HeroSection');
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <Image
            alt="Hero"
            className="order-last mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            src="/placeholder.svg"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="mb-8 space-y-8">
              <h1 className="font-accent text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/tight">
                {t('title')}
              </h1>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                {t('description')}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder={t('waitlist.inputLabel')}
                  type="email"
                />
                <Button type="submit">{t('waitlist.submit')}</Button>
              </form>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {t.rich('waitlist.hint', {
                  terms: text => (
                    <Link
                      href="/terms"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {text}
                    </Link>
                  ),
                  privacy: text => (
                    <Link
                      href="/privacy"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {text}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
