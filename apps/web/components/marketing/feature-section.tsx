import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  BellRing,
  Layers2,
  LucideIcon,
  RefreshCw,
  StickyNote,
  Tags,
  Waypoints,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const keys = [
  'import',
  'contacts',
  'linkedin',
  'dashboard',
  'automation',
  'notes',
] as const;

const Icons: Record<(typeof keys)[number], LucideIcon> = {
  import: RefreshCw,
  contacts: Tags,
  linkedin: Waypoints,
  automation: BellRing,
  notes: StickyNote,
  dashboard: Layers2,
};

export const FeatureSection: React.FC = () => {
  const t = useTranslations('FeatureSection');

  return (
    <section className="w-full bg-neutral-50">
      <div className="container relative px-4 py-24 md:px-6">
        <h3 className="absolute -top-4 left-4 inline-flex items-center rounded-full bg-[#FFE8A5] p-2 font-semibold tracking-wide text-[#62562d]">
          {t('soon')}
        </h3>
        <div className="grid items-start gap-12 md:grid-cols-3 md:grid-rows-2">
          {keys.map(key => {
            const Icon = Icons[key];
            return (
              <Card
                key={key}
                className="relative h-full border-2 border-gray-300 py-4 shadow-none ring-1 ring-gray-200 ring-offset-2 transition-all duration-500 hover:border-gray-700 hover:ring-gray-400"
              >
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    {t(`featureList.${key}.title`)}
                  </h3>
                  {Icon && (
                    <Icon className="absolute right-3 top-2 h-6 w-6 text-gray-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-500">
                    {t(`featureList.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <span className="mt-16 block text-center text-sm font-medium uppercase tracking-wide text-gray-500">
          {t('more')}
        </span>
      </div>
    </section>
  );
};
