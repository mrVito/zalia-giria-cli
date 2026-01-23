export default {
    tabWidth: 4,
    printWidth: 120,
    bracketSpacing: true,
    bracketSameLine: true,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'avoid',
    overrides: [
        {
            files: '*.md',
            options: {
                printWidth: 70,
                useTabs: false,
                trailingComma: 'none',
                arrowParens: 'avoid',
                proseWrap: 'never',
            },
        },
        {
            files: '*.{json,html}',
            options: {
                tabWidth: 2,
                useTabs: false,
            },
        },
    ],
};
