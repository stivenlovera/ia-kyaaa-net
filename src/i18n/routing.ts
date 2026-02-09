import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/pathnames': {
      es: '/pfadnamen'
    }
  }
});