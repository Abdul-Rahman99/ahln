import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  directoryPermissions: '755',
  autoReload: true,
  updateFiles: true,
  api: {
    __: 'translate',
    __n: 'translateN',
  },
});

export default i18n;
