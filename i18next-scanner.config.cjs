module.exports = {
  input: ['src/**/*.{js,jsx,ts,tsx}'], // scan all React/TS files
  output: './public/locales/$LOCALE/$NAMESPACE.json',
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['i18n.t', 't'], // functions to look for
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en'], // your languages
    ns: ['translation'], // your namespace
    defaultLng: 'en',
    defaultNs: 'translation',
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
  },
};
