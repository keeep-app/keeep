export type LocalePageProps = {
  params: { slug: string; locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export type IntlMessages = typeof import('@/messages/en.json');
