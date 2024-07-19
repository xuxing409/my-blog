---
sidebar:
 title: 一篇教你用VitePress + Github Pages搭建博客
 step: 1
title: 🔧 一篇教你用VitePress + Github Pages搭建博客
description: 介绍使用VitePress + Github Pages搭建博客
isTimeLine: true
date: 2024-06-17
tags:
 - VitePress
 - 博客
categories:
 - 技术
---
# 一篇教你用VitePress + Github Pages搭建博客
## 前言
---
这是一期关于`VitePress`搭建博客并将它部署到`Github Pages`的教程文章，起因是把年前给自己立的一个flag实现以及最近打算把之前的学过的知识巩固一下
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406022227393.png)
因此打算搭建一个博客来作为平时写作的地方。


我的博客地址如下:https://xuxing409.github.io/my-blog/

## VitePress是什么
在搭建博客之前,我们先做一下准备工作, 了解一下VitePress是个什么东东。VitePress是由Vue + vite支持的静态站点生成器，我们看到他是由基于Vue框架构建的，因为Vue使用起来不难，所以VitePress使用起来也很简单；并且它还是基于vite的，那么代表我们可以享受到Vite带来的开发体验！VitePress灵感来源于VuePress，现在VuePress2也支持了Vue3和Vite，但是官方由于开发精力有限决定把重心放到VitePress上，所以我们选择VitePress来进行博客搭建。

## 项目搭建
### 1. 创建目录
创建一个新目录，并进入
```shell
mkdir my-blog && cd my-blog
```
### 2. 初始化package.json
使用包管理工具初始化项目package.json文件，我这里以**pnpm**为例
```shell
npm init -y
```
### 3. 准备工作
项目安装`VitePress`为开发依赖
```shell
 pnpm add -D vitepress
```
如果此时你的项目出现`Issues with peer dependencies found`·`这个提示不影响项目运行
如果不想看见它可以在package.json配置如下,作用是忽略对等依赖
```json
  "name": "my-blog",
  "version": "1.0.0",
  ...
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": [
        "@algolia/client-search",
        "search-insights"
      ]
    }
  }
```
### 4. 添加命令
接着在`package.json`文件中scripts添加如下命令
```json
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
```
### 5. 启动服务
在本地运行项目`vitepress`会在`http://localhost:5173/`启动一个热更新的开发服务器
```shell
pnpm dev
```
点开链接即可看到如下我们项目当前的样子,vitepress帮我们默认添加了一个标题与暗黑模式功能
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406162243878.png)
## 基础配置
### 1. 创建配置文件
项目当前只有一个vitepress默认的架子,我们去给他添加一些配置。在项目中创建一个docs目录,并在其中创建一个.vitepress目录与config.js文件。
### 2. 编写基础描述
在其中编写`title`与`description`方便SEO。
```js
// docs/.vitepress/config.js
export default {
  // 站点级选项
  title: "是柠新呀的博客", // 网站标题
  description: "是柠新呀用来写博客的地方", // 网站描述

  themeConfig: {
    // 主题级选项
  },
};

```
### 3. 配置导航栏
它是显示在页面顶部的位置,可以在themeConfig下nav中配置。这里`link`我们仅配置到 **/** 他会自动匹配到目录的 **index.md** 文件,因为index.md是vitepress的默认入口文件,在vuepress中使用的是README.md作为默认的入口文件
```js
export default {
  themeConfig: {
    nav: [
      { text: '关于', link: '/about' },
      {
        text: '大前端',
        items: [
          { text: "html", link: "/bigFrontEnd/html/" },
          { text: "css", link: "/bigFrontEnd/css/" },
          { text: "js", link: "/bigFrontEnd/js/" },
        ]
      }
    ]
  }
}
```
此时我们的界面会呈现如下:
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406162349405.png)
### 4. 配置侧边栏
它是显示在页面左侧的位置。我们配置一个根据页面路径的不同显示不同的侧边栏。
```js
export default {
  themeConfig: {
    sidebar: {
      "/bigFrontEnd/html/": {
        text: "html",
        items: [
          { text: "html", link: "/bigFrontEnd/html/" },
          { text: "html1", link: "/bigFrontEnd/html/html1" },
          { text: "html2", link: "bigFrontEnd/html/html2" },
        ],
      },
      "/bigFrontEnd/css/": {
        text: "css",
        items: [
          { text: "css1", link: "/bigFrontEnd/css/css1" },
          { text: "css2", link: "/bigFrontEnd/css/css2" },
        ],
      },
      "/bigFrontEnd/js/": {
        text: "js",
        items: [
          { text: "js1", link: "/bigFrontEnd/js/js1" },
          { text: "js2", link: "/bigFrontEnd/js/js2" },
        ],
      },
    },
  }
}
```
### 5. 创建索引index文件
我们在bigFrontEnd目录下创建html目录,并在其下面创建inde.md、htm1.md、html2.md。编写index.md文件创建一个目录索引
```md
# html 专题

## 目录

- [html1](./html1.md)
- [html2](./html2.md)

```
这里我们分别为html、css、js配置了不同的侧边栏,当我们点击html时侧边栏会如下显示:
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406170040965.png)

此时我们已经配置完毕侧边栏,并且还创建了一个专题目录,但是我们看到下方的下一篇仍是显示的英语Next page,如果想要修改的话我们再在themeConfig中配置一下docFooter就可以了，具体如下
```js
export default {
  themeConfig: {
    docFooter: {
          prev: "上一篇",
          next: "下一篇",
        },
    }
}

```
### 6. home主页配置
目前为止我们已经完成了大部分配置,但是主页目前还是空白,那么现在我们开始简单配置一下主页, 在docs/index.md中配置**layout: home**即可使用默认主题提供的首页布局,我们使用vitepress文档的样式。
如果想要自定义,那么可以看看官方home具体接口说明<https://vitepress.dev/zh/reference/default-theme-home-page>
```md
---
layout: home

hero:
  name: 是柠新呀的博客
  text: awesome-front-end-world.
  tagline: 前端 知识体系地图
  image:
    src: /logo.jpg
    alt: logo
  actions:
    - theme: brand
      text: Get Started
      link: /bigFrontEnd/html/
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuejs/vitepress
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
```
这里接口配置的静态资源请在**docs目录**下创建**public目录**，并且引入对应的静态资源文件即可。
### 7. 网站logo配置
配置完毕后如果没有显示可以尝试强制刷新缓存
```js
// .vitepress/config.js
export default {
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ["link", { rel: "icon", href: `/favicon.ico` }],
  ],
}
```
此时我们的页面显示如下
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406170120793.png)
至此可以看到我们已经完成了博客的基本配置，那么接下来我们将开始学习如何利用Github Pages部署我们的博客
## 部署Github Pages
### 1. 创建仓库
输入名字后，注意将本项目的base也修改为同名
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406170143080.png)
```js
// .vitepress/config.js
const base = "/blog-demo/"; // [!code ++]
export default {
  base,  // [!code ++]
  // 站点级选项
  title: "是柠新呀的博客",
  description: "是柠新呀用来写博客的地方",
  head: [
     ["link", { rel: "icon", href: `/favicon.ico` }], // [!code --]
    // 配置网站的图标（显示在浏览器的 tab 上）
    ["link", { rel: "icon", href: `${base}favicon.ico` }],  // [!code ++]
  ],
  ...
};

```
### 2. 创建.gitignore
根目录创建.gitignore文件并写入内容
```
node_modules
dist
cache
.temp
.DS_Store
```
### 3. 上传代码到github
根据提示提交代码到github仓库，这里不再赘述
### 4. 开启Github Action
根据下图提示开启Github Action支持
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406170217787.png)
### 5. 配置`.github/workflows/deploy.yml`文件
根目录新建同名文件夹与文件,文件内容参考如下
```yml
name: Deploy Pages

# 触发条件，push到main分支或者pull request到main分支
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

  # 支持手动在工作流上触发
  workflow_dispatch:

# 设置时区
env:
  TZ: Asia/Shanghai

# 权限设置
permissions:
  # 允许读取仓库内容的权限。
  contents: read
  # 允许写入 GitHub Pages 的权限。
  pages: write
  # 允许写入 id-token 的权限。
  id-token: write

# 并发控制配置
concurrency:
  group: pages
  cancel-in-progress: false

# 定义执行任务
jobs:
  # 构建任务
  build:

    runs-on: ubuntu-latest

    # node v20 运行
    strategy:
      matrix:
        node-version: [20]

    steps:
      # 拉取代码
      - name: Checkout
        uses: actions/checkout@v3
        with:
          # 保留 Git 信息
          fetch-depth: 0

      # 设置使用 Node.js 版本
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      # 使用 最新的 PNPM
      # 你也可以指定为具体的版本
      - uses: pnpm/action-setup@v2
        name: Install pnpm
        with:
          version: latest
          # version: 9
          run_install: false

        # 安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

        # 构建项目
      - name: Build blog project
        run: |
          echo ${{ github.workspace }}
          pnpm build

        # 资源拷贝
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./docs/.vitepress/dist
          destination: ./_site

        # 上传 _site 的资源，用于后续部署
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  # 部署任务
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```
我最后生成的地址就是<https://xuxing409.github.io/blog-demo/>

至此,我们已经完成了VitePress的搭建和GitHub Pages的部署了
