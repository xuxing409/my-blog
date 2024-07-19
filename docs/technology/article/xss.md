---
sidebar:
 title: 手摸手带你进行XSS攻击与防御（二）
 step: 1
title: 手摸手带你进行XSS攻击与防御（二）
description: 介绍同源策略
isTimeLine: true
date: 2024-07-20
tags:
 - XSS
 - 浏览器安全
categories:
 - 技术
---

# 手摸手带你进行XSS攻击与防御 浏览器安全（二）

## 前言

当谈到网络安全和信息安全时，跨站脚本攻击（XSS）是一个不可忽视的威胁。现在大家使用邮箱进行用户认证比较多，如果黑客利用XSS攻陷了用户的邮箱，拿到了cookie那么就可以冒充你进行收发邮件，那真就太可怕了，通过邮箱验证进行其他各种网站的登录与高危操作。

那么今天，本文将带大家深入了解XSS攻击与对应的防御措施。

## 如何利用XSS漏洞攻击

根据XSS的攻击方式，我们可以将XSS的攻击分为：反射型、存储型、DOM型三种。

单看名字是不是觉得云里雾里，都是什么玩意，不过不用担心，下面我将带你撕开这三种攻击的神秘面纱。

### 反射型

#### 攻击流程![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407131550047.png)

可以看到，如果服务器如果未做黑客url信息过滤，那么用户就极易受到XSS反射型攻击，关于反射可以这样理解：黑客并未直接攻击用户，而是由用户点击含有浏览器未做过滤的恶意代码的链接，服务器返回含有黑客恶意代码的信息并执行攻击，所以称其为反射型。

#### 实操

下面我们来玩一个XSS反射型攻击小游戏

![image-20240713155709708](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407131557097.png)

我们可以看到这个网站有一个搜索框，是一个具有查询信息的功能。

当我们输入123搜索

![image-20240713155903899](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407200033479.png)

我们发现url上的链接最后query=123带上了刚刚查询的参数, 并且页面上还显示了搜索的字符串，现在我们来对其进行XSS攻击检验。

我们将链接后的query=123更改为query=```<script>alert('xss')</script>```。之后我们进入这个链接页面

![image-20240713160455824](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407131604203.png)

我们看到页面弹出了大大的XSS弹框，说明网站存在反射型XSS漏洞，我们攻击成功。

很显然，该网站的使用query保存了搜索字符串，但是没有对搜索字符串进行过滤。而是直接把他当作html内容渲染到页面上，这就给黑客留下了XSS攻击的漏洞。

这里我们只是弹框测试XSS漏洞，如果黑客在里面编写恶意代码再把链接分享给用户，那么用户点开链接就会受到攻击造成损失。

#### 漏洞场景

常见于在网站的URL上面传递参数，黑客尝尝发送恶意链接给用户，诱导用户点击链接，进而达成攻击手段。

### 存储型

#### 攻击流程

![image-20240718130604016](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407181306044.png)

可以看到存储型的危害性极大，服务器不进行过滤，就会把恶意代码永久保存起来，

因为恶意代码保存在服务器，这意味着每一个访问目标网页的用户都会受到攻击，

#### 实操

下面我们再来玩一个XSS存储型攻击的小游戏

打开网站我们发现这是一个留言评论功能的网站，恰恰这种留言评论功能如果不注意，极易受到XSS存储型攻击

![image-20240718131500490](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407181315560.png)

这次我们换个攻击方式，利用img标签加载src资源失败，自动执行onerror中的代码来进行攻击，我们写下这段代码发送评论。

```html
<img src="xss" onerror="alert('xss')"/>
```

我们发现评论一经发送，页面上显示了img标签加载失败的样式，并且浏览器上方弹出了alert弹框，这代表我们使用XSS存储型方式攻击网站成功。

![image-20240718132152386](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407181321281.png)

![image-20240718132210075](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407200036672.png)

想一想，虽然我们防范意识强，没有打开黑客的恶意链接，但是对于这种存储型XSS攻击，只要点进去的用户，都会在毫不知情的情况下受到黑客的攻击，真的是防不胜防。黑客攻击成功后，假冒用户做出高危操作或者将用户的信息发送给黑客的网站，造成财产损失。

#### 漏洞场景

因为要存在数据库，这种漏洞常见于**评论区**或**私信**。

#### 与反射型的区别

存储型一般是将恶意代码存储在**数据库**，反射型一般将恶意代码存储在**url**中。

### DOM型

#### 攻击流程

![image-20240719210105642](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407192104824.png)

#### 实操

下面我们再再再来玩一个XSS小游戏，这会就有人问了，为什么不去上线的网站试试，我看是真的很刑，我们只是通过这样方式进行攻击实操，了解黑客是如何攻击的，那么才能在编写代码时有针对性地防御。再次强调啊，千万不要去攻击别人的网站，不然会奖励银手镯一对。

打开网站，我们发现这是一个利用了浏览器url路径来达到类似书签的功能，要命就要命在从这个url上取值的方式未进行有效过滤上了。

![image-20240719211800689](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407192118977.png)

当我们输入不存在的书签时，页面上的图片裂了，并且网页上回显了我们输入的6。

![image-20240719212312972](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407192123881.png)

查看网页的源码，我们发现它是由onclick触发了一个chooseTab的函数，并且网页加载完成时触发了该方法。

![image-20240719212526256](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407192125458.png)

注意这里的**self.location.hash.substr(1)**这段要命的代码，未进行任何的过滤。

```js
  window.onload = function() { 
        chooseTab(unescape(self.location.hash.substr(1)) || "1");
  }
```

接下来我们来看chooseTab这个函数,这里直接使用了传递进来的num作为img要显示的图片链接，这样做确实很方便，但是他没有对num值进行过滤，而是直接拼接到html上。

```js
function chooseTab(num) {
        // Dynamically load the appropriate image.
        var html = "Image " + parseInt(num) + "<br>";
        html += "<img src='/static/level3/cloud" + num + ".jpg' />";
        $('#tabContent').html(html);
 
        window.location.hash = num;
 
        // Select the current tab
        var tabs = document.querySelectorAll('.tab');
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].id == "tab" + parseInt(num)) {
            tabs[i].className = "tab active";
            } else {
            tabs[i].className = "tab";
          }
        }
 
        // Tell parent we've changed the tab
        top.postMessage(self.location.toString(), "*");
}
 
```

那么这时我们知道代码漏洞，我们来构建一段特殊的代码拼接到url上，这里我们还是用老方法让img标签报错执行我们的恶意代码。

```
#') onerror=alert('xss') ('
```

此时我们的url长这样，黑客就是利用这样的url发送给用户，达到攻击的目的

```url
https://xss-game.appspot.com/level3/frame#') onerror=alert('xss') ('
```

我们一经拼接，浏览器立马执行了恶意代码，弹出了XSS弹框，说明我们攻击成功了，且恶意代码是保存浏览器本地，未经过服务器，因此我们称其为DOM型XSS。

![image-20240719213658247](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202407192136504.png)

#### 与反射型、存储型的区别

DOM型的XSS攻击恶意代码获取与执行都是在浏览器中进行的，未经过服务器，属于浏览器漏洞；而反射型、存储型通过服务器漏洞返回了恶意代码在浏览器中执行，属于服务器的漏洞。

这里告诉我们，XSS攻击漏洞并不止跟后端开发未过滤漏洞字符有关，也与前端对用户提交的字符进行转义有关。

## 如何防御XSS漏洞

防御XSS攻击的方式有很多，但是我们通过攻击的方式可以总结如下两点：

* 黑客提交恶意代码，服务器未过滤
* 浏览器部分过滤或未过滤的情况下解析执行恶意代码

### 输入过滤

通过这两种方式我们可以简单分为**浏览器过滤**与**服务器过滤**

#### 服务器过滤

对于提交恶意代码的方式，仅仅通过前端过滤的方式是不现实的，因为黑客可以通过任意请求工具如postman构建请求方式进行攻击，绕过前端。那么就需要后端对提交过来的内容进行过滤，再将过滤后的安全内容返回给浏览器。

#### 浏览器过滤

因为浏览器是恶意代码执行的容器，那么我们可以想到让浏览器不执行恶意代码，对要执行的代码进行过滤。那么我们可以对要执行的代码进行充分的转义，特别是一些可以操作的参数，防止执行恶意的javascript代码。

### 反射型XSS和存储型XSS防御

这两种方式都是提交了恶意代码给服务器，且服务器未进行有效过滤，那么就要求我们的后端程序员对输入的参数进行充分的过滤，在nodejs中我们可以使用现成的XSS库来进行防御。

#### 转义

1. **下载：**

```bash
pnpm install xss --save
```

2. **使用：**

   xss库使用起来非常简单，它是一个函数，只需要对要进行过滤的文本调用该函数即可。

```javascript
const xss = require('xss')
const content = xss('<script>alert("xss")</script>');
// 转义后  &lt;script&gt;alert("xss")&lt;/script&gt;
```

#### 纯前端渲染

纯前端渲染比如现在流行的单页面渲染，使用Vue之类的框架来进行纯前端渲染，在这种方式下，浏览器只获取基本的html，数据通过ajax请求获取，最后再由Vue之类的框架将数据和模板结合渲染成最终的HTML。

这样纯前端渲染可以减少一部分XSS攻击的可能性。

### DOM型XSS防御

要防御DOM型XSS,那么就要求前端程序员在使用部分代码时要提交警惕。

* 在使用类似Vue的框架时，尽量不去使用v-html指令方式直接将不受信任的内容渲染成HTML
* **document.write()**、**.innerHTML**、**.outerHTML**时要特别注意XSS漏洞，利用**.textContent**属性代替设置DOM的方式，使用**setAttribute()**方法代替拼接字符串的方式设置标签属性
* 尽量不要直接将不受信任的数据直接当做字符串传递给浏览器中这些可以将字符串转换为代码的api。
  * DOM内联事件：onclick、ondblclick、onerror、onload、onmousedown、onmousemove、onmouseup、onmouseout、onmouseover、onmouseenter、onmouseleave、onkeydown、onkeypress、onkeyup、onfocus、onblur、onchange、oninput、onsubmit、onreset、onselect、onload、onerror、onabort等内联事件
  * 部分标签属性：a标签的herf属性、form标签的action属性、iframe标签的src属性（好在浏览器不允许img的src属性执行JavaScript代码，认为这是不安全的进行阻止）
  * javascript函数：eval()、Function()构造函数、setTimeout()、setInterval()等函数

### Cookie 安全管理

**HttpOnly Cookie**：将敏感信息存储在 HttpOnly Cookie 中，这样 JavaScript 就无法访问它们，从而防止黑客利用 XSS 攻击窃取 Cookie。

**Secure Cookie**：通过设置 Secure 标志，确保 Cookie 只在 HTTPS 连接中传输，防止被中间人劫持和窃取。

### CSP(Content Security Policy) 防止 XSS

* **禁止内联脚本和动态执行**：通过设置合适的 CSP 策略，禁止内联脚本 (`'unsafe-inline'`) 和动态执行 (`'unsafe-eval'`)，这可以防止大部分 XSS 攻击，因为攻击者无法直接在页面中插入执行恶意代码的脚本。

  **将 `script-src` 策略指令设置为不允许使用 `'unsafe-inline'**`

  ```http
  Content-Security-Policy: script-src 'self'; object-src 'none'; default-src 'self';
  ```

* **限制脚本加载来源**：只允许加载来自受信任的来源（如同源和特定 CDN）的脚本，可以有效防止从恶意站点加载恶意脚本的攻击。

  **只允许加载来自指定CDN脚本**

  ```http
  Content-Security-Policy: script-src 'self' cdn.example.com;
  ```

  **只允许加载同源脚本**

  ```http
  Content-Security-Policy: script-src 'self'; object-src 'none'; default-src 'self';
  ```

  

* **限制其他资源的加载来源**：类似地，限制样式表、图片、字体等资源的加载来源，防止从不受信任的来源加载恶意内容。、

  ```
  Content-Security-Policy:  style-src 'self' cdn.example.com;
                            img-src 'self' data:;
                            font-src 'self' fonts.example.com;
                            media-src 'self' media.example.com;
  ```

  * style-src
    * `'self'`：允许从同源加载样式表。
    * `cdn.example.com`：允许从指定的 CDN 加载样式表。
  * img-src
    * `'self'`：允许从同源加载图片。
    * `data:`：允许使用 `data URI` 方式加载图片，例如 `data:image/png;base64,...`。
  * font-src
    * `'self'`：允许从同源加载字体文件。
    * `fonts.example.com`：允许从指定的 CDN 或其他信任来源加载字体文件。

* **设置合适的策略报告**：使用 `Content-Security-Policy-Report-Only` 来测试和调试 CSP 策略，及时发现可能存在的问题和漏洞。

  ```http
  Content-Security-Policy:  report-uri http://reporturl.example.com/csp-violation-report-endpoint;
  ```

  * `report-uri` 指定了报告的接收端点 URL。浏览器会将违规事件报告发送到这个 URL(`http://reporturl.example.com/csp-violation-report-endpoint`)。通常是一个服务器端处理这些报告的端点。

## XSS漏洞检测

我们在编写完代码后，可以通过手动检测和自动检测来测试我们开发的系统是否含有XSS漏洞

#### 手动检测

1. **注入测试**：

   尝试在输入字段中插入特殊字符如 `<`, `>`, `"`, `'`, `&`, 等，看是否能够直接在页面上显示并执行脚本。例如，在输入框中输入 `<script>alert('XSS');</script>` 看看是否能触发弹窗。

2. **URL参数测试**：

   修改URL中的查询参数，尝试插入脚本并查看页面的反应。例如，修改 `?param=value` 为 `?param=<script>alert('XSS');</script>`。

3. **HTML和JavaScript上下文测试**：

   注意在哪些地方（如HTML标签、JavaScript代码段、CSS样式中）输出了用户输入，然后进行相应的XSS测试。

4. **事件处理器测试**：

   在事件处理器中插入恶意脚本，例如 `<img src="x" onerror="alert('XSS')">`。

5. **绕过过滤测试**：

   如果应用有输入过滤，尝试绕过过滤规则，例如通过大小写变换、URL编码、HTML编码等方法来尝试注入有效的XSS脚本。

#### 自动检测

市面上有很多自动化检测工具，通过一些预定义的攻击来覆盖应用，这里不过多进行讲述，有兴趣的话可以自己搜索了解，不过要提醒的是工具再好也需要结合人工手动检测来确保全面和准确。

## XSS小游戏

下面是文章中XSS小游戏网站，它是一个允许进行XSS攻击的攻击网站，总共有六个关卡，大家有兴趣可以把剩下的也挑战了。

[XSS game (xss-game.appspot.com)](https://xss-game.appspot.com/)

## 总结

本篇文章带大家进行了XSS的攻击与防御的实践，下期我将和大家深入讨论CSRF漏洞，我是一个练习时长三年的前端练习生，期待的话，请大家多多关注吧。

## 往期精彩

* [手摸手教你用VitePress + Github Pages搭建博客](https://juejin.cn/post/7380357384777170994)
* [手摸手带你深入了解浏览器缓存机制](https://juejin.cn/post/7383363236680532003)

* [为什么要有同源策略？浏览器安全（一）](https://juejin.cn/post/7389913087472402484)

