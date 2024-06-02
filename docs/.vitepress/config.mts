import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/myblog/'
//   : '/'
const base = '/my-blog/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  base,
  lang: 'zh-cn',
  title: '是柠新呀的知识库',
  description: '是柠新呀的博客主题，基于 vitepress 实现',
  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    // ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3]
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.jpg',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      // { text: '首页', link: '/' },
      {
        text: '大前端',
        items: [
          { text: 'javascript', link: '/bigFE/js/' },
          { text: 'vue', link: '/bigFE/vue/' },
          { text: 'electron', link: '/bigFE/electron/' },
          { text: 'node', link: '/bigFE/node/' }
          // { text: 'html', link: '/bigWeb/html/' },
          // { text: 'css', link: '/bigWeb/css/' },
          // { text: '🌏浏览器专题', link: '/bigWeb/browser/' },
          // { text: 'Web性能优化', link: '/bigWeb/performance/' },
          // { text: 'regexp', link: '/bigWeb/regexp/' },
        ]
      },
      {
        text: '关于我',
        link: '/about'
      },
      { text: 'External', link: 'https://google.com' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xuxing409'
      }
    ]
  }
})
