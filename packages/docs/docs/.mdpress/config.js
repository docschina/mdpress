const { fs, path } = require('@mdpress/shared-utils');

module.exports = () => ({
  base: '/mdpress/',
  dest: '../../mdpress',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'MdPress',
      description: 'Markdown-powered Site Generator'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'MdPress',
      description: 'Markdown 驱动的网站生成器'
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  theme: '@mdpress/default',
  themeConfig: {
    repo: 'docschina/mdpress',
    editLinks: true,
    docsDir: 'packages/docs/docs',
    // #697 Provided by the official algolia team.
    algolia: null,
    smoothScroll: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: {
          '/api/': getApiSidebar(),
          '/guide/': getGuideSidebar('Guide', 'Advanced'),
          '/plugin/': getPluginSidebar('Plugin', 'Introduction', 'Official Plugins'),
          '/theme/': getThemeSidebar('Theme', 'Introduction')
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: require('./nav/zh'),
        sidebar: {
          '/zh/api/': getApiSidebar(),
          '/zh/guide/': getGuideSidebar('指南', '深入'),
          '/zh/plugin/': getPluginSidebar('插件', '介绍', '官方插件'),
          '/zh/theme/': getThemeSidebar('主题', '介绍')
        }
      }
    }
  },
  plugins: [
    ['@mdpress/back-to-top', true],
    ['@mdpress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }],
    ['@mdpress/medium-zoom', true],
    ['@mdpress/google-analytics', {
      ga: 'UA-128189152-1'
    }],
    ['@mdpress/container',{
      paths: [
        path.resolve(__dirname,'markdown/file-container.js'),
        path.resolve(__dirname,'markdown/upgrade-container.js')
      ]
    } ],
    ['flowchart'],
    [
      'serve',
      {
        removeMainfest: false
      }
    ]
  ],
  extraWatchFiles: [
    '.mdpress/nav/en.js',
    '.mdpress/nav/zh.js'
  ]
});

function getApiSidebar () {
  return [
    'cli',
    'node'
  ];
}

function getGuideSidebar (groupA, groupB) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'directory-structure',
        'basic-config',
        'assets',
        'markdown',
        'using-react',
        'i18n',
        'deploy'
      ]
    },
    {
      title: groupB,
      collapsable: false,
      children: [
        'frontmatter',
        'permalinks',
        'markdown-slot',
        'global-computed'
      ]
    }
  ];
}

const officalPlugins = fs
  .readdirSync(path.resolve(__dirname, '../plugin/official'))
  .map(filename => 'official/' + filename.slice(0, -3))
  .sort();

function getPluginSidebar (pluginTitle, pluginIntro, officialPluginTitle) {
  return [
    {
      title: pluginTitle,
      collapsable: false,
      children: [
        ['', pluginIntro],
        'using-a-plugin',
        'writing-a-plugin',
        'life-cycle',
        'option-api',
        'context-api'
      ]
    },
    {
      title: officialPluginTitle,
      collapsable: false,
      children: officalPlugins
    }
  ];
}

function getThemeSidebar (groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['', introductionA],
        'using-a-theme',
        'writing-a-theme',
        'option-api',
        'default-theme-config',
        'inheritance'
      ]
    }
  ];
}
