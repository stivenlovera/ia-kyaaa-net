import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/pathnames': {
      es: '/pfadnamen'
    }
  }
});