import love from 'eslint-config-love'

export default [
    {
        ...love,
        files: ['**/*.js', '**/*.ts'],
        rules: {
            semi: ['error', 'never'],
            quotes: ['error', 'single'],
        },
        ignores: ['**/eslint.config.js', 'dist/**', 'node_modules/**'],
    },
]