import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);

/* export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation<typeof locales, Record<string, string>>({
    locales,
    pathnames
  });   */
