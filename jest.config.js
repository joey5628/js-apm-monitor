/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
