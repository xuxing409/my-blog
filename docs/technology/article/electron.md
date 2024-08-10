---
sidebar:
 title: 🔥一文带你快速入门Electron开发
 step: 1
title: 🔥一文带你快速入门Electron开发
description: 介绍快速入门Electron
isTimeLine: true
date: 2024-08-10
tags:
 - Electron
 - 跨平台
categories:
 - 技术前言
---

## 介绍

## 什么是 electron？

electron 是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。通过将 Chromium 和 Node.js 嵌入到其二进制文件中，Electron 开发的应用可以跨平台的发布在 Windows、macOS 和 Linux 系统上，使用前端丰富的构建框架可以快速开发出一个高质量 UI 的桌面应用。

简单来说就是Electron的本质是结合了Chromium和Node.js的开发框架，可以让我们熟悉的Web技术构建桌面应用程序。

## Electron模型

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/49e5425b3dfb432585bd4b18d3748662~tplv-73owjymdk6-jj-mark:0:0:0:0:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNTMyNjM1NzMyNDI1MjU2In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1723365708&x-orig-sign=TnZrp7y0%2BHinIZgy1AVMmSMZf54%3D)

通过模型我们可以看到，Electron技术通过Chromium、Node.js结合了渲染进程和主进程，渲染进程专门负责页面的渲染，渲染进程还可以通过IPC和主进程进行通讯，主进程工作在Node.js环境中，因此可以调用系统底层的API能力

## 快速搭建

### 安装

```
pnpm install --save-dev electron
```

### 修改package.json

添加启动命令启动项目

```json
{
  "name": "electron",
  "version": "1.0.0",
  "description": "my first electron app",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
  },
  "author": "Sny",
  "license": "MIT",
  "devDependencies": {
    "electron": "23.1.3"
  }
}
```



## 主进程

在Electron文件中创建主进程文件electron/main.js，在其中编写主进程必要的初始化大小与预加载文件等配置。

```javascript
// 主进程
const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载模块，electron推荐将一些需要在node环境中获取的数据提前放入预加载模块中
    },
  });

  // 区分开发环境加载vite启动地址，打包环境加载本地dist目录
  win.loadURL(
    !app.isPackaged
      ? process.env.VITE_DEV_SERVER_URL
      : `file://${path.join(__dirname, '../dist/index.html')}`

   // 开发环境自动打开开发工具
  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }
};

// whenReady 避免了on的监听问题，处理了边界问题
// 只有在 app 模组的 ready 事件被触发后才能创建 BrowserWindows 实例
app.whenReady().then(() => {
  createWindow();
  // 如果没有窗口打开则打开一个窗口 (macOS)
  // 与前二者相比，即使没有打开任何窗口，macOS 应用通常也会继续运行
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用 (Windows & Linux)
// 在 Windows 和 Linux 上，我们通常希望在关闭一个应用的所有窗口后让它退出。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
```

## 预加载文件

在electron目录下创建electron/preload.js文件，内容写入如下：

```javascript
// preload.js

// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
 // 可暴露在渲染进程的window中，名称即为electronAPI.XXX
})
```

**修改 vite.config.js**

利用 vite-plugin-electron 设置 electron 启动路径以及预加载路径

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import * as path from "path";
import electron from "vite-plugin-electron";
const path = require('path')

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "electron/main.js", // 主进程文件
      },
      preload: {
        input: path.join(__dirname, "./electron-preload/index.js"), // 预加载文件
      },
    }),
    renderer：{}
  ],
});
```

## 主进程与渲染进程通信

因为主进程和渲染进程分担不同的工作，因此项目中遇到主进程和渲染进程之间进行一些操作是很常见的。

### 渲染进程

```javascript
import { ipcRenderer } from "electron";

// 监听渲染进程方法
ipcRenderer.send("window-close");
```

### 主进程

```javascript
import { app, BrowserWindow, ipcMain } from "electron";

// 监听渲染进程方法
ipcMain.on("window-close", (e, data) => {
  win.close();
});
```

除了通过send和on来进行渲染进程和主进程之间的通讯，还可以通过invoke和handle进行通讯交互。

下面我们来演示一下：

**main.js(主进程)**

```js
   ipcMain.handle('get-data', async (event, arg) => {
        // Simulate an async operation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Hello from main process!');
            }, 1000);
        });
    });
```

**preload.js (预加载脚本)**

在预加载脚本中，使用 `contextBridge` 和 `ipcRenderer` 来暴露一个安全的 API 给渲染进程。

```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getData: () => ipcRenderer.invoke('get-data')
});
```

**HTML 文件**

HTML 文件，用来展示数据和触发操作。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electron Demo</title>
</head>
<body>
    <h1>Electron Invoke/Handle Demo</h1>
    <button id="fetchData">Fetch Data</button>
    <p id="result"></p>
    <script src="renderer.js"></script>
</body>
</html>
```

**renderer.js渲染进程**

在渲染进程中，你可以使用 `window.electronAPI` 来调用主进程的方法。

```js
document.getElementById('fetchData').addEventListener('click', async () => {
    const result = await window.electronAPI.getData();
    document.getElementById('result').textContent = result;
});
```

这样就完成了一个使用 `invoke` 和 `handle` 实现主进程和渲染进程交互的基本示例。

## 自定义标题栏

在开发中，我们有时候会希望将windows自带的窗口操作（最小化，最大化，关闭）的这几个功能自定义UI, 那么有什么办法呢，官方给我们提供的一种无边框模式，然后我们再用纯CSS的方式实现一个菜单栏。

### 分析

要实现自定义标题栏，那么我们就需要隐藏windows的窗口操作，即创建无边框

```js
 win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,  // 开启无边框模式
    })
```

### 自定义Menubar

前端封装一个Menubar操作组件, 有关主进程的操作可以使用上节预加载模块暴露的方法

```javascript
const handleClose = ()=> {
  window.electronAPI.setWindowClose()
}

```

### 设置可拖拽区域

因为原生的菜单栏组件是可以拖拽的，这里我们通过CSS3的属性来实现这个特性。注意将该属性仅设置在菜单栏上。

设置css3属性

```css
-webkit-app-region: drag; // 设置可拖动
```

### 设置不可拖拽区域

```css
 -webkit-app-region: no-drag; // 设置不可拖动
```

## 区分前端代码运行环境

开发electron应用时, 我们通常希望将现有的前端代码直接打包发布成桌面应用, 但是有时候我们也希望web环境保留，为客户提供两种使用方式，这是我们可以保留两种环境，但web应用和桌面应用的样式和功能还是有些许区别, 因此我们需要在一些代码中区分运行环境。

```javascript
 function isElectron() {
    // Renderer process
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      window.process.type === 'renderer'
    ) {
      return true
    }

    // Main process
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!process.versions.electron
    ) {
      return true
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0
    ) {
      return true
    }

    return false
 } 
```

## 总结

本篇文章带大家了解了什么是Electron，以及如何快速搭建一个集成了Vue的Electron程序、主进程与渲染进程如何通过预加载（preload）这座桥梁进行主进程预渲染进程之间的通讯，好了今天的分享就到这里了，感谢大家的耐心阅读。