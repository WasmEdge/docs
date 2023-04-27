// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    routeBasePath: '/',
                    editUrl:
                        'https://github.com/wasmedge/docs/blob/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    
    themes : [
        [
            "@easyops-cn/docusaurus-search-local",
            /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
            // @ts-ignore
            {
              docsRouteBasePath: '/',
              hashed: true,
              indexBlog: false,
              language: ["en", "zh"],
              highlightSearchTermsOnTargetPage: true,
              explicitSearchResultPath: true,
            },
          ],
        ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'WasmEdge',
                logo: {
                    alt: 'WasmEdge Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
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
                    },
                    {
                        type: 'localeDropdown',
                        position: 'right',
                        dropdownItemsBefore: [],
                        dropdownItemsAfter: [],
                        className: 'icon-link language navbar__item',
                    },
                    {
                        href: 'https://github.com/WasmEdge/WasmEdge',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            docs: {
                sidebar: {
                  hideable: true,
                },
              },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Develop',
                                to: '/develop/overview',
                            }, {
                                label: 'Embed',
                                to: '/embed/overview',
                            }, {
                                label: 'Extend',
                                to: '/contribute/overview',
                            }
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Discord',
                                href: 'https://discord.gg/U4B5sFTkFc',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/realwasmedge',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} WasmEdge. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
