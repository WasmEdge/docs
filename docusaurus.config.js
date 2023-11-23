// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

require('dotenv').config();

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'WasmEdge Developer Guides',
    tagline: 'Serverless functions anywhere in the cloud, in data / AI pipelines, in SaaS platforms, and on edge devices.',
    url: 'https://wasmedge.org/',
    baseUrl: '/docs/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Second State', // Usually your GitHub org/user name.
    projectName: 'WasmEdge', // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'zh', 'zh-TW'],
        localeConfigs: {
            en: {
                label: 'English'
            },
            "zh": {
                label: '简体中文'
            }
        }
    },

    plugins: [
        [
            '@docusaurus/plugin-google-gtag',
            {
                trackingID: 'G-Q77VSJHYQB',
            },
        ],
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    remarkPlugins: [import('remark-deflist'), require('./env-plugin')],
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    routeBasePath: '/',
                    editUrl:
                        'https://github.com/wasmedge/docs/blob/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                sitemap: {
                    changefreq: 'weekly',
                    priority: 0.5,
                    ignorePatterns: ['/tags/**'],
                    filename: 'sitemap.xml',
                },
            }),
        ],
    ],

    themes: [
        '@docusaurus/theme-mermaid',
        [
            "@easyops-cn/docusaurus-search-local",
            /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
            // @ts-ignore
            {
                docsRouteBasePath: '/',
                hashed: true,
                indexBlog: false,
                indexPages: true,
                language: ["en", "zh"],
                highlightSearchTermsOnTargetPage: true,
                explicitSearchResultPath: true,
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarPosition: "right",
            },
        ],
    ],


    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            metadata: [
                { name: 'keywords', content: 'wasmedge, wasm, web assembly, rust, cncf, edge devices, cloud, serverless' },
                { name: 'description', content: 'WasmEdge is a lightweight, high-performance, and extensible WebAssembly runtime for cloud native, edge, and decentralized applications. It powers serverless apps, embedded functions, microservices, smart contracts, and IoT devices.' },
                { name: 'og:title', content: 'WasmEdge' },
                { name: 'og:description', content: 'WasmEdge is a lightweight, high-performance, and extensible WebAssembly runtime for cloud native, edge, and decentralized applications. It powers serverless apps, embedded functions, microservices, smart contracts, and IoT devices.' },
                { name: 'og:url', content: 'https://wasmedge.org/' },
                { name: 'og:type', content: 'Documentation' },
                { name: 'twitter:card', content: 'summary' },
                { name: 'twitter:image', content: 'summary_large_image' },
                { name: 'twitter:url', content: 'https://wasmedge.org/' },
                { name: 'twitter:site', content: '@realwasmedge' },
                { name: 'twitter:title', content: 'WasmEdge' }
            ],
            image: "./static/img/wasm_logo.png",
            announcementBar: {
                id: "start",
                content:
                    '⭐️ If you like WasmEdge, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/WasmEdge/WasmEdge">GitHub</a>! ⭐️',
            },
            navbar: {
                title: 'WasmEdge',
                logo: {
                    alt: 'WasmEdge Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'start/overview',
                        position: 'left',
                        label: 'Getting Started',
                    }, {
                        type: 'doc',
                        docId: 'develop/overview',
                        position: 'left',
                        label: 'Develop',
                    }, {
                        type: 'doc',
                        docId: 'embed/overview',
                        position: 'left',
                        label: 'Embed',
                    }, {
                        type: 'doc',
                        docId: 'contribute/overview',
                        position: 'left',
                        label: 'Extend',
                    }, {
                        type: 'localeDropdown',
                        position: 'right',
                        dropdownItemsBefore: [],
                        dropdownItemsAfter: [],
                        className: 'icon-link language navbar__item',
                    }, {
                        href: 'https://github.com/WasmEdge/WasmEdge',
                        className: "header-github-link",
                        position: 'right',
                        alt: 'https://github.com/WasmEdge/WasmEdge'
                    },
                ],
            },
            docs: {
                sidebar: {
                    hideable: true,
                },
            },
            footer: {
                logo: {
                    alt: 'WasmEdge logo',
                    src: '/img/wasmedge_logo.svg',
                    href: 'https://wasmedge.org/',
                },
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Getting Started',
                                to: '/start/overview',
                            },
                            {
                                label: 'Develop',
                                to: '/develop/overview',
                            },
                            {
                                label: 'Embeds',
                                to: '/embed/overview',
                            },
                            {
                                label: 'Contribute',
                                to: '/contribute/overview',
                            }
                        ],
                    }, {
                        title: 'Resources',
                        items: [
                            {
                                label: 'Github',
                                href: 'https://github.com/WasmEdge/WasmEdge',
                            },
                            {
                                label: 'Second State',
                                href: 'https://www.secondstate.io/',
                            },
                            {
                                label: 'Articles & Blog',
                                href: 'https://www.secondstate.io/articles/'
                            },
                            {
                                label: 'WasmEdge Talks',
                                to: '/talks'
                            },
                            {
                                label: 'Releases',
                                to: '/releases'
                            },
                            {
                                label: 'Sitemap',
                                href: 'https://wasmedge.org/docs/sitemap.xml'
                            }
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Mailing List',
                                href: 'https://groups.google.com/g/wasmedge/'
                            },
                            {
                                label: 'Discord',
                                href: 'https://discord.gg/U4B5sFTkFc',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/realwasmedge',
                            },
                            {
                                label: 'Slack #WasmEdge',
                                href: 'https://cloud-native.slack.com/archives/C0215BBK248'
                            },
                            {
                                label: 'Community Meeting',
                                href: 'https://docs.google.com/document/d/1iFlVl7R97Lze4RDykzElJGDjjWYDlkI8Rhf8g4dQ5Rk/edit?usp=sharing'
                            }
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} WasmEdge. Built with Docusaurus. <br /> <a href="https://github.com/WasmEdge/docs/blob/main/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a>`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['rust', 'bash', 'typescript', 'csharp', 'lua', 'protobuf', 'powershell', 'toml', 'yaml', 'wasm', 'javascript', 'go'],
            },
        }),
};

// Extending config to inlcude mermaid also
const extendedConfig = {
    ...config,
    markdown: {
        mermaid: true,
    }
};

module.exports = extendedConfig;