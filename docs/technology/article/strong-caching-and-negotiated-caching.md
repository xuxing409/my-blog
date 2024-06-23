---
sidebar:
 title: 浏览器缓存机制——强缓存和协商缓存
 step: 1
title: 浏览器缓存机制——强缓存和协商缓存
description: 浏览器缓存机制——强缓存和协商缓存
isTimeLine: true
date: 2024-06-17
tags:
 - 技术
 - 文章
categories:
 - 技术
---

# 浏览器缓存机制——强缓存和协商缓存
## 前言
最近面试被这道题问懵逼了，明明自己看过多次原理，却总在回答时表现出来一知半解，作为一个工作多年的前端只了解强缓存和协商缓存一点皮毛多少有点说不过去，痛定思痛下有了这篇文章。

## 什么是浏览器缓存
我们常说的所谓浏览器缓存其实就是HTTP缓存，他的基本原理就是用户通过http请求资源后，它会在本地浏览器专门用来存放缓存规则的表中写入缓存资源的信息，也叫映射表，它的作用是将缓存的资源信息和在用户电脑磁盘中的实际文件路径一一对应起来，当浏览器再次访问资源时，通过浏览器的缓存规则表中的信息，就可以直接从电脑磁盘读取缓存文件了，不用再去请求服务端。
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406221435134.png)
以掘金为例，我们随便点开一篇文章，可以在控制台看到部分文件被缓存在disk cache（磁盘缓存）或memory cache（内存缓存）中。
另外，我们可以看到从缓存在内存中获取资源比从磁盘中获取快的多的多了
## 缓存优点
* 由于不需要从服务端获取资源，缓存保存在客户端上，客户端加载网页的速度会加快。
* 不需要通过http请求已缓存的资源，减少了网络带宽的费用。
* 减少服务器压力，提升网站性能。
## 缓存流程
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406232232298.png)
简单来说，浏览器从web服务器请求资源后，根据http头的缓存规则来决定使用哪种缓存策略在本地缓存或者不缓存。

一旦在本地缓存后，下次浏览器就会先依照缓存策略检查本地的缓存是否可用，可用就使用本地缓存，不可用就从服务器重新获取资源。

这里我们需要记住通过HTTP请求资源时，http返回资源的同时在响应头标注该资源的缓存策略。
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406232240442.png)
### 第一次发起请求
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406232304658.png)
浏览器第一次请求资源时，查找本地缓存发现没有该资源的缓存数据，浏览器随后向服务器请求数据，服务器收到请求返回数据和它的缓存策略，浏览器收到后将数据和缓存规则保存在缓存数据库中。

## HTTP缓存的两个阶段
我们把浏览器缓存分为两类：强缓存和协商缓存，浏览器必然经过强缓存，如果强缓存没有命中，那么进入下一阶段，也就是协商缓存阶段。

**强缓存**

浏览器发送请求前，会先去浏览器缓存中查找是否命中强缓存，如果命中则直接从浏览器缓存读取资源，不会发送请求到服务器。
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406232323862.png)
HTTP状态码200，标识来自磁盘，说明命中强缓存。

否则进入下一步

**协商缓存**
当强缓存没有命中时，浏览器会向服务器发送一个请求，服务器会根据Request Header中的一些字段来判断是否命中协商缓存。如果命中则会返回304响应，但是不会携带响应体，告诉浏览器资源未更新，可以从浏览器缓存中读取该资源。如果没有命中，服务器则会返回该资源，浏览器直接加载返回的资源。

### 强缓存
强缓存主要是看响应头的`Expires`和`Cache-Control`字段
![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406232346320.png)
* Expires:  `HTTP1.0`的特性，表示资源过期的绝对时间点，即在这个时间之前则命中缓存，超过这个时间则缓存的资源过期。由于它是服务器时间与本地时间做对比，本地时间可以随意更改，会导致缓存混乱。
* Cache-Control：`HTTP1.1`的特性，为了解决Expires的缺陷提出的，它主要有**max-age**、no-cache、no-store、private、public这几个字段
  * **max-age** 表示一个相对时间，单位是秒，比如 Cache-Control: max-age=500，代表资源有效期是500秒。
  * **no-cache** 表示不进行强缓存
  * no-store 表示既不进行强缓存，也不进行协商缓存。
  * private 表示只有用户的浏览器可以进行缓存，公共的代理服务器不允许缓存
  * public 表示用户浏览器和代理服务器都可以缓存

优先级：`Cache-Control` 大于 `Expries`，但是为了兼容这两个字段一般会都会设置。

部分浏览器默认行为：就算服务器返回的Response未设置`Expires`和`Cache-Control`，浏览器仍然会缓存部分资源，为了优化性能，不是所有的浏览器都有这样的优化。



![image-20240624002846302](C:%5CUsers%5Cpc%5CAppData%5CRoaming%5CTypora%5Ctypora-user-images%5Cimage-20240624002846302.png)

因此，通过response响应头中的`Cache-Control`的值，如果max-age=XXX秒，且资源未过期，则命中强缓存，浏览器识别到后不发送请求，直接从浏览器缓存中读取资源，否则值为no-cache，又或者资源过期，则说明没有命中，接下来进入协商缓存阶段。



### 协商缓存

当资源没有命中强缓存时，且Cache-Control的值不为no-store，浏览器就会进入协商缓存阶段。协商缓存主要是看Last-Modified  / If-Modified-Since与 ETag /  If-None-Match这两对报文头。

![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406240119387.png)

* Last-Modified  / If-Modified-Since：`HTTP1.0`的特性，这是一对报文头。

  * If-Modified-Since 是一个请求头字段，只存在GET和HEAD请求，该值为之前HTTP请求缓存的Last-Modified。

  * Last-Modified 是一个响应头字段，表示该资源的最后修改时间。

  ![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406240139818.png)

  当进入协商缓存阶段时，HTTP会带着If-Modified-Since请求头请求服务器，服务器会对比Last-Modified与If-Modified-Since，如果If-Modified-Since的时间比Last-Modified的时间晚或者等于，则认为资源未发生变化，返回一个不带响应体的304响应，否则返回资源。

* Etag / If-None-Match：HTTP1.1的特性，这也是一堆报文头。

  *  If-None-Match 等同于Etag，在发送请求时，会将资源上一次的Etag 作为 If-None-Match 进行发送，行为和If-Modified-Since类似。
  * Etag  表示文件在服务器的唯一标识（生成规则由服务器决定），在iis中由FileTimeStamp（时间戳）和ChangeNumber（修改编号），其中FileTimeStamp是类似MD5算法方式计算出来的，微软没有公布算法。

  > Etag 的出现是为了解决 Last-Modified 的一些弊端，它提供了更为严谨的校验，因为 Last-Modified的单位是秒，如果一秒内修改了多次，那么就无法判断，又或者文件只是修改了修改时间，但是文件内容并没有发生变化，此时我们不希望文件被认为修改了导致重新请求，此时Etag就发挥了作用。

![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406240136111.png)

从上图我们可以看到Etag的值未发生变化，服务器返回了304状态码，告诉浏览器资源没有发生改变，直接从浏览器缓存中读取资源。

由此我们可以总结：使用Etag时，服务端会对资源进行一次类似计算hash值获得一个唯一标识返回给客户端，当然计算Etag会消耗服务器资源。客户端再次请求该资源时，请求头会自动带上这一次的Etag，并且字段名更改为If-None-Match，值还是上次的Etag值。服务端拿If-None-Match的值与资源的Etag进行对比，如果命中则返回304响应，否则返回资源。

优先级：`Etag` 大于 `Last-Modified`，都存在时，以Etag为准。

## 项目实践

在vue项目中，我们可以为js、css等文件配置hash值，因此一般情况下我们不用对js、css进行操作，浏览器会帮我们进行强缓存处理。

但是如果我们不处理好index.html缓存就会产生一系列问题

* 为什么界面还是显示的老版本
* 让用户手动刷新一下页面
* 为什么我的界面显示白屏

相信这些问题我们都有遇到过，现在我们可以自信地处理这些问题了。

下面以我司用的IIS为例,  我们在web.config文件的configuration添加如下配置，禁用强缓存，要求index.html每次进行协商缓存，询问服务端文件是否有更改。

```xml
// web.config 文件
<configuration>
    <location path="index.html">
        <system.webServer>
            <httpProtocol>
                <customHeaders>
                    <add name="Cache-Control" value="no-cache" />
                </customHeaders>
            </httpProtocol>
        </system.webServer>
    </location>
</configuration>
```

当我们添加好配置后，我们发现首次请求文件返回了200，并且Cache-Control也被设置为了no-cache，禁止强缓存。

![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406240217254.png)

当我们刷新页面，此时状态码变味了304告诉我们文件并没有被修改，继续使用浏览器缓存。

![](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202406240219912.png)

此时我们就完成index.html的缓存配置

## 总结

此时我们就可以回答一些问题

* 为什么要进行浏览器缓存
* 为什么有了`Expries`不满足还需要`Cache-Control`，为什么有了`Last-Modified`还需要`Etag` 等等。
* 如何对项目进行缓存配置
* 浏览器整个的缓存流程是怎么样的

如果觉得文章写的还不错，请给我一个大大的赞啦！下次文章我这里还有很多想要写的，我看看要写些什么，如果期待的话可以点个关注，嘿嘿溜啦。