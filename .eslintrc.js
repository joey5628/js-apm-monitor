module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends:  [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    parserOptions: {
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    // overrides: [
    //     {
    //         files: ['*.js', '*.jsx'],
    //         rules: {
    //             '@typescript-eslint/*': 'off',
    //         }
    //     }
    // ],
    rules: {
        'no-console': 'off',
        'no-trailing-spaces': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
