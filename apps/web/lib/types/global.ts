export type LocalePageProps = {
  params: {
    locale: string;
  };
};

export type IntlMessages = typeof import('@/messages/en.json');
