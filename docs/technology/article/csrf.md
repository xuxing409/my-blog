---
sidebar:
 title: 🔥这一次带你彻底搞明白CSRF攻击与防御 前端安全（三）
 step: 1
title: 🔥这一次带你彻底搞明白CSRF攻击与防御 前端安全（三）
description: 介绍CSRF攻击与防御
isTimeLine: true
date: 2024-08-08
tags:
 - CSRF
 - 浏览器安全
categories:
 - 技术

---

# 🔥这一次带你彻底搞明白CSRF攻击与防御 前端安全（三）

## 前言

上一期我带大家实践了XSS的攻击与防御（[手摸手带你进行XSS攻击与防御 前端安全（二）](https://juejin.cn/spost/7393311009685520403)），那么这一期我们来关注另一个前端常说的安全漏洞——CSRF漏洞

与XSS攻击相比，利用CSRF漏洞发动攻击会比较困难，这也是在网络上看起来CSRF的人气小于XSS的原因之一。下面我们来利用CSRF漏洞发起攻击，并针对攻击进行防御，彻底弄懂CSRF，话不多说，我们直接开冲🚄。

## 什么是CSRF攻击

> **跨站请求伪造**（英语：Cross-site request forgery），也被称为**one-click attack**或者**session riding**，通常缩写为**CSRF**或者**XSRF**，是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。跟[跨网站脚本](https://zh.wikipedia.org/wiki/跨網站指令碼)（XSS）相比，XSS利用的是用户对指定网站的信任，CSRF利用的是网站对用户网页浏览器的信任。----来自维基百科

简单来说就是黑客冒充你执行一些恶意行为。中文名叫跨站伪造请求，咋一看不明所以🤪，我们拆开来看就明白了：

**跨站：**跨站可以理解为你登录了A网站，然后访问了恶意B网站。

**请求：**HTTP请求。

**伪造：**欺骗A网站认为操作请求是用户发出的。

对比XSS可以影响所有访问被攻击页面的用户，CSRF攻击影响的范围一般局限于用户的账户和应用有哪些功能可以被攻击操作，且依赖用户的登录状态。



## 攻击流程

![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408071123107.png)

CSRF攻击原理与流程如下：

1. 用户登录了A网站（可能是银行🏦、邮箱📪这类极具黑客吸引力的网站）
2. 黑客诱导用户访问含有恶意代码的B网站（一般是美女图片💃、一块钱抽华人牌2060款手机📱等恶意链接，让人忍不住想点哈哈哈）
3. B网站要求浏览器向A网站发送GET、POST等恶意请求
4. 用户没有退出A网站情况下，恶意请求自动携带用户的身份认证信息（Cookie、Session ID等）
5. A网站确认了用户凭证，误以为是用户的请求以用户的名义执行了恶意操作😱。（黑客因此会转走你的钱💲、通过邮箱收发你其他网站的验证码、严重点的还可以让你自动给我的文章点赞、收藏哈哈哈😉）

从流程可以得知，发动CSRF攻击需要如下前提：

* 网站存在黑客有想法的功能请求。（转账、修改密码等）
* 执行操作通过HTTP请求，且网站只依靠会话Cookie来认证用户。
* 请求参数都可以构造的，没有无法提前获知的随机字符串。
* 用户在登录正常网站后，没有退出访问了恶意网站。

## 如何利用CSRF漏洞进行攻击

根据CSRF的攻击类型可以分为：GET型、POST型等。

* **GET类型CSRF**

在GET型CSRF攻击中，恶意请求通过URL参数发送。如果开发者网络安全意识不够，可能会误用GET请求执行敏感操作，这就给黑客留下了可乘之机。先说结论，再生产环境中不要使用使用GET发送敏感操作的请求。

一般黑客会构建一个链接请求然后发送给用户，直接发送链接让用户进入的话会容易被看穿，一般是伪装到网站的图片中，只需要诱导用户访问该伪装过的网站，网站就会自动发起图片src中的HTTP请求，如下该请求会携带bank域名下的Cookie认证信息。

```html
<img src="http://bank.com/transfer?to=hacker&amount=10000000" />
```

* **POST类型CSRF**

在POST类型中，一般是构建一个看不见的POST表单，恶意请求通过表单参数发送。

黑客会构建一个POST表单，然后还是老办法诱导用户访问这个页面，用户访问该页面后，页面的表单自动提交发起一次POST请求。

```html
<form action="http://bank.com/transfer" method="POST" style="display:none;">
   <input type="hidden" name="to" value="hacker">
   <input type="hidden" name="amount" value="10000000">
</form>
<script>
   document.forms[0].submit();
</script>
```

## CSRF攻击实操

下面我们来玩一个CSRF攻击的小实验。以下实验由**portswigger**靶场提供，请不要随意去用CSRF漏洞攻击别人的网站哦。

进入网站，我们发现这个网站是一个BLOG站点，页面上就一个主页、一个登录入口。

![image-20240808103200604](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081032760.png)

依据实验提示给出的账号密码，我们登录这个站点

![image-20240808103238485](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081032726.png)

登录完成后，我们看到他的网站有一个修改邮箱的功能，更改这个邮箱，打开控制台，我们发现他通过一个POST表单请求来实现修改邮箱，黑客就喜欢对这种功能发起CSRF攻击，一旦他绑定了自己的邮箱，基本就拿到账号的最高权限了。

![image-20240808103343588](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081033695.png)

![image-20240808103357912](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081033147.png)

通过上面的学习，我们知道可以通过构造请求来假冒用户执行操作，那么我们可以针对这个功能做点文章，构建一个POST表单，分发给受害人。

通过查看表单的元素结构，我们复制这个表单到一个新建html文件中，并且补齐action的路径（https://0a6a007b041a3cac83ce838d004f0011.web-security-academy.net/my-account/change-email）。

![image-20240808103437417](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081034477.png)

随后删除多余内容，value处填写我们想要的邮箱。（黑客一般会表单给表单设置隐藏，我们这里做实验就把表单显示出来了）

```html
<html>

<body>

<form class="login-form" name="change-email-form" action="https://0a6a007b041a3cac83ce838d004f0011.web-security-academy.net/my-account/change-email" method="POST">
   <input required="" type="email" name="email" value="hacker@normal-user.net">
   <button class="button" type="submit"> sub</button>
</form>

<script>
document.forms[0].submit(); 
</script> 

</body>
</html>
```

点击上方进入漏洞服务器。

![image-20240808105706497](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081057479.png)

将我们刚刚构建好的html复制进body中，点击store保存，随后点击Deliver exploit to victim分发给受害人。                   

![image-20240808105816953](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081058275.png)

页面上方出现Congratulations, you solved the lab!，说明我们攻击成功。

![image-20240808105905960](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081059152.png)

点击预览漏洞，可以查看我们的攻击效果。

预览攻击后，我们发现页面上的邮箱已经被替换成我们想要的邮箱。

![image-20240808110018638](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081100883.png)

至此CSRF攻击实验成功进行，黑客绑定了他的邮箱，拿到了该账号的最高权限，基本上可以为所欲为了（😱害怕）。

我们总结一下攻击流程：

1. 首先，找到想要攻击的网站功能，分析修改邮箱的请求，组装我们的请求表单
2. 将表单分发给blog用户，诱导受害人点击
3. blog用户访问我们的网站，表单携带blog网站下的cookie自动提交
4. 最后，邮箱修改成功

该实验的链接[CSRF攻击实验](https://portswigger.net/web-security/csrf/lab-no-defenses)

该网站还有其他CSRF攻击的实验，知道了CSRF攻击的原理，有兴趣的同学可以尝试着解决，

![image-20240808103051807](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408081030185.png)

## 如何预防CSRF攻击

由上方CSRF的攻击方式，我们可以总结出CSRF攻击的如下特点：

* 依赖于浏览器的自动发送凭据，黑客不能读取凭证，但是可以借用凭证冒充用户，有点伪装的意思了。
* 攻击请求通常从黑客控制的站点发出。
* 攻击非常隐蔽，用户在不知情的情况下触发恶意请求。

那么根据它的特点我们可以做如下防御：

### 验证Referer和Origin头

检查请求的Referer和Origin头，以确保请求来源于受信任的域。

- **Referer头**：包含请求的来源URL。
- **Origin头**：包含请求的来源域。

**在koa中验证Referer和Origin头：**

在koa中可以将验证Referer和Origin头封装成一个中间件，在处理接口的回调之前使用即可：

```js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const trustedOrigins = ['https://trusted-domain.com'];

function checkRefererAndOrigin(ctx, next) {
    const referer = ctx.headers.referer;
    const origin = ctx.headers.origin;

    const isRefererValid = referer && trustedOrigins.some(trustedOrigin => referer.startsWith(trustedOrigin));
    const isOriginValid = origin && trustedOrigins.includes(origin);

    if (isRefererValid || isOriginValid) {
        return next();
    } else {
        ctx.status = 403;
        ctx.body = 'Forbidden: CSRF token validation failed';
    }
}

router.post('/transfer', checkRefererAndOrigin, async (ctx) => {
    // 处理转账请求
    ctx.body = 'Transfer successful';
});

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```



不过这两种方式并不太可靠。

首先**Referer头可能被移除或篡改**，攻击者可以通过工具（如代理服务器）伪造Referer头，从而绕过服务器的验证。根据Referer的转发策略可以设置same-origin限制同源时才转发referer，这里设置策略又给了黑客可乘之机，黑客可以设置no-referrer不转发，这样就无法验证了。

其次**Origin头**只包含域名不包含路径与query，并且由于不同浏览器的实现不同，导致这个表现出来的特性也不一样（IE说的就是你👿）。

###  使用SameSite属性的Cookie

通过将Cookie设置为`SameSite`，可以限制浏览器在跨站请求中发送Cookie，从而防御CSRF攻击。为了从源头解决问题，Google出手了。

- **SameSite=Strict**：最严格的模式，Cookie在任何跨站请求中不会被发送。就是A网站请求B网站时，B网站的Cookie不会被携带。

  ```http
  Set-Cookie: sessionid=abc123; SameSite=Strict
  ```

- **SameSite=Lax**：稍微宽松的模式，Cookie在大多数跨站请求中不会被发送，但在GET请求导航到目标网站时会被发送。( Chrome 80 版本起，Chrome 更新了 SameSite 属性的默认值，由 `None` 改成了 `Lax`)

  ```http
  Set-Cookie: sessionid=abc123; SameSite=Lax
  ```

* **SameSite=None**: 无限制模式，Cookie 在跨站请求时也会发送。为了使用此模式，必须设置 `Secure` 属性（即 Cookie 只能通过 HTTPS 发送）。

  ```http
  Set-Cookie: sessionid=abc123; SameSite=None
  ```

**koa中设置SameSite**

```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
    ctx.cookies.set('example', 'value', {
        maxAge: 1 * 60 * 60 * 1000, // cookie的有效时长, 这里为1小时，单位是毫秒
        httpOnly: true,				// Cookie只通过HTTP(S)传输，客户端JavaScript无法访问
        sameSite: 'Strict', 		// 可以是 'Strict', 'Lax' 或 'None'
        secure: true            	// 设置为 true 时，Cookie 只能通过 HTTPS 传输（SameSite 为 'None' 时必须设置）
    });
    ctx.body = 'Cookie 设置完毕';
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

关于chromium内核SameSite版本策略可以看这里[cookie-legacy-samesite-policies](https://www.chromium.org/administrators/policy-list-3/cookie-legacy-samesite-policies/)

合理设置了SameSite后，可以从源头防范一部分CSRF攻击。当然这也需要浏览器支持Google这个SameSite提案，好消息是各大现代浏览器现在都支持了SameSite属性的Cookie。

但仅仅通过SameSite属性控制第三方网站访问Cookie的一层保护显然是不够的，还需要结合其他方案，下面我们来介绍通过CSRF Token。

### CSRF Token

因为CSRF就是利用了浏览器在发起请求时会自动携带cookie的特性，那我们再在每个用户请求中包含一个唯一且随机生成的令牌，以验证请求的合法性。

具体流程：

1. 在用户登录成功时，返回一个token给到前端，前端将这个token存储在本地localStorage中。
2. 后续每次在发送请求前，从localStorage取出放到请求头中。
3. 后端收到请求后，首先验证token值。正常请求由应用程序附上token值，正常放行。而黑客发起的CSRF攻击不包含这个token值，后端拒绝请求。

这样给每一个请求加上token后，在没有XSS漏洞的情况下, CSRF攻击就可以有效防御了。

### 验证码

因为CSRF攻击的是系统的功能，那么我们在执行敏感操作（如资金转移、用户资料修改）时给用户的设备发送一个验证码，黑客拿不到验证码也就无法发动攻击啦。亦或者用户在执行一些敏感操作时，要求用户再次输入一遍密码，黑客无从得知密码，CSRF攻击也就被防御了。

其实验证码的思想和token的思想差不多，都是增加了一个字段对用户进行认证校验，结合多种防御手段就可以有效地将CSRF攻击拒之门外啦🎉。

## 总结

通过本文章的学习，相信大家都对CSRF的攻击与防御措施有了一个了解，我们简单总结如下：

* 用户打开正常网站时，访问了恶意网站，此时就可能发生CSRF攻击。
* 黑客可以通过图片URL、超链接、提交表单方式发起攻击。
* 可以通过Referer、Origin头、SameSite、CSRF Token、验证码方式防御CSRF攻击。
* 不要通过GET请求去执行一些操作，规范使用GET，仅将其当做获取数据的请求方式，提高CSRF攻击门槛。

另外，作为用户我们可能会实在忍不住想要访问一些美女网站时或者点击未知链接时，建议大家使用一个平时不使用的浏览器去访问，来降低风险。

对于CSRF攻击与防御的内容截止目前就结束了，感谢大家的耐心阅读🧡。

## 参考资料

[别人收到秋天奶茶, 我收到了安全工单 - CSRF](https://juejin.cn/post/6890913788875915277)

[前端安全系列之二：如何防止CSRF攻击？](https://juejin.cn/post/6844903689702866952)

[cookie-legacy-samesite-policies](https://www.chromium.org/administrators/policy-list-3/cookie-legacy-samesite-policies/)

[跨站请求伪造CSRF攻击的原理以及防范措施 蛋老师](https://www.bilibili.com/video/BV1UH4y1M7Dg)

## 往期精彩

*   [手摸手教你用VitePress + Github Pages搭建博客](https://juejin.cn/post/7380357384777170994)
*   [手摸手带你深入了解浏览器缓存机制](https://juejin.cn/post/7383363236680532003)
*   [为什么要有同源策略？前端安全（一）](https://juejin.cn/post/7389913087472402484)
*   [手摸手带你进行XSS攻击与防御 前端安全（二）](https://juejin.cn/post/7393311009685520403)
