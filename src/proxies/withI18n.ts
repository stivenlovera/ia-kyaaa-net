// proxies/withI18n.ts
import createIntlMiddleware from 'next-intl/middleware';

export function withI18n() {
    return createIntlMiddleware({
        locales: ['en', 'es'],
        defaultLocale: 'en'
    });
};