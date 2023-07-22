module.exports = {
  semi: true,
  trailingComma: 'all',
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  bracketSpacing: true,
  singleQuote: true,
  arrowParens: 'always',
  proseWrap: 'preserve',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.{yaml,yml}',
      options: {
        singleQuote: false,
      },
    },
  ],
};
