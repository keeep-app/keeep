export type LocalePageProps = {
  params: { slug: string; locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type IntlMessages = typeof import('@/messages/en.json');
