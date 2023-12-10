export type LocalePageProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export type IntlMessages = typeof import('@/messages/en.json');
