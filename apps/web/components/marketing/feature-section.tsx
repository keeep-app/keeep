import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export const FeatureSection: React.FC = () => {
  const t = useTranslations('FeatureSection');
  const keys = [
    'import',
    'contacts',
    'customization',
    'automation',
    'notes',
    'mobile',
  ] as const;
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold">{t('title')}</h2>
        <div className="grid items-start gap-6 md:grid-cols-3 md:grid-rows-2">
          {keys.map(key => (
            <Card key={key} className="h-full">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {t(`featureList.${key}.title`)}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t(`featureList.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
