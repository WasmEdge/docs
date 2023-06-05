module.exports = {
    parser: '@babel/eslint-parser',
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb',
        'plugin:prettier/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    plugins: [
        'react',
        'jsx-a11y',
        'import',
        'prettier',
        'react-hooks',
        'regexp',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'react/prop-types': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react/jsx-props-no-spreading': 'off',
        'react/destructuring-assignment': ['warn'],
        'import/no-unresolved': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'regexp/no-unused-capturing-group': 'error',
        'regexp/no-useless-backreference': 'error',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json'],
            },
        },
    },
};
