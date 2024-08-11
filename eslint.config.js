const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');

const compat = new FlatCompat({
  baseDirectory: __dirname, // The base directory to resolve relative paths
});

module.exports = [
  js.configs.recommended, // Add base JavaScript rules

  {
    files: ['{src,apps,libs,test}/**/*.ts', '{src,apps,libs,test}/**/*.tsx'], // Apply to TypeScript files in the specified directories
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['*.js', '*.jsx'], // Apply to JavaScript files
    ignores: ['eslint.config.js'], // Ignore this config file itself
  },

  {
    ignores: ['node_modules/**'], // Ignore node_modules directory
  },
];
