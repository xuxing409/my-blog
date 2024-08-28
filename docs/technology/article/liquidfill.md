---
sidebar:
 title: 优雅实现不同形状的水球图
 step: 1
title: 优雅实现不同形状的水球图
description: 优雅实现不同形状的水球图
isTimeLine: true
date: 2024-08-29
tags:
 - svg
 - 水球图
categories:
 - 技术
---
## 前言

翌日

我吃着早餐，划着水。

不一会，领导走了过来。

领导：小伙子，你去XX项目实现一个根据设备能源图，要求能根据剩余能量显示水波高低。

我： 啊？我？这个项目我没看过代码。

领导：任务有点急，你自己安排时间吧，好好搞，给你争取机会。

我：好吧。（谁叫咱只是一个卑微的打工人，只能干咯😎👌😭。）

![你去把唐僧师徒除掉表情有哪些-你去把唐僧师徒除掉表情包大全](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408282033253.png)

## 分析

看到图，类似要实现这样一个立方体形状的东西，然后需要根据剩余电量显示波浪高低。

![image-20240828223431928](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408282305485.png)

我心想，这不简单吗，这不就是一个水球图，恰好之前看过echarts中有一个水球图的插件。

想到这，我立马三下五除二，从echarts官网上下载了这个插件，心想下载好了就算搞定了。

## 波折

哪知，这个需求没有想象中的那么简单，UI设计的图其实是一个伪3D立方体，通过俯视实现立体效果。并且A面和B面都要有波浪。

![image-20240828222621246](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408282305180.png)

这就让我犯了难，因为官方提供的demo没有这样的形状，最相近也就是最后一个图案。

![image-20240829010253125](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290102606.png)

那把两个最后一个图案拼接起来，组成A、B面，不就可以达到我们的效果了吗，然后最后顶上再放一个四边形C面，不就可以完美解决了。

想法是好的，但是具体思考实践方案起来就感觉麻烦了。根据我平时的解决问题的经验：如果方案实践起来，发现很麻烦就说明方法错了，需要换个方向思考。

于是我开始翻阅官方文档，找到了关于形状的定义shape属性。



## 救世主shape

它支持三种方式定义形状

1. 最基础的是，直接编写属性内置的值，支持一些内置的常见形状如： 

   `'circle'`, `'rect'`, `'roundRect'`, `'triangle'`, `'diamond'`, `'pin'`, `'arrow'`

2. 其次，它还支持根据容器形状填充`container`，具体来说就是可以填充满你的渲染容器。比如一个300X300的div，设置完shape:'`container`'后，他的渲染区域就会覆盖这个div大小。此时，你可以调整div的形状实现想要的图案，比如

   我们用两个div演示，我们将第二个div样式设置为` border-radius: 100%;`第一个图形就为方形，第二个就成为了经典圆形水球图。我们可以根据需要自行让div变成我们想要的形状。

   ![image-20240829013340696](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290133968.png)

   

3. 最后，也就是我们这次要说的重点，他支持SVG`path://`路径。

我们可以看到第二种方式实现复杂的图形有局促性，第三种方式告诉我们他支持svg的path路径时，这就给了我们非常多的可能性，我们可以通过路径绘制任意想要的图形。

看到这个属性后，岂不是只需要将UI切的svg文件中的path传入进去就可以实现这个效果了？随后开始了分析。

我们的图形可以由三个四边形构成，每个四边形四个顶点，合计12个顶点。

![image-20240826115244773](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408261152845.png)

从svg文件我们可以得到如下内容

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="362.74609375"
    height="513.7080078125" viewBox="0 0 362.74609375 513.7080078125" fill="none">
    <path d="M128.239 177.367L128.239 512.015L361.056 397.17L361.056 76.6519L128.239 177.367Z" stroke="rgba(0, 0, 0, 1)"
        stroke-width="3.3802816901408472" stroke-linejoin="round" fill="#FFFFFF">
    </path>
    <path d="M1.69043 107.409L128.231 177.364L361.048 76.6482L229.656 1.69043L1.69043 107.409Z"
        stroke="rgba(0, 0, 0, 1)" stroke-width="3.3802816901408472" stroke-linejoin="round" fill="#FFFFFF">
    </path>
    <path d="M1.69043 107.413L1.69043 442.06L128.231 512.015L128.231 177.368L1.69043 107.413Z" stroke="rgba(0, 0, 0, 1)"
        stroke-width="3.3802816901408472" stroke-linejoin="round" fill="#FFFFFF">
    </path>
</svg>
```

我们可以发现，它是由三个path路径构成，而我们的水球图只支持一个path：//开头的path路径字符串。解决这个问题也很简单，我们只需要将三个路径给他合并在一起就可以了，我们就可以实现这种伪3D效果了。

如此，我们便得到了路径。

```
path://M128.239 177.367L128.239 512.015L361.056 397.17L361.056 76.6519L128.239 177.367Z M1.69043 107.409L128.231 177.364L361.048 76.6482L229.656 1.69043L1.69043 107.409Z M1.69043 107.413L1.69043 442.06L128.231 512.015L128.231 177.368L1.69043 107.413Z
```

效果如图：

![image-20240829021808241](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290218250.png)

哇瑟，真不赖，感觉已经实现百分之七八十了，内心已经在幻想，领导看到实现后大悦，说不愧是你呀，然后给我升职加薪，推举升任CTO，赢取白富美，翘着腿坐在库里南里的场景了。

等等！我的线条呢？整个水球图（也不能叫球了，水立方？）只有外轮廓，看不到线条棱角了，其实我觉得现在这种情况还蛮好看的，但是为了忠于UI设计的还原，还是得另寻办法，可不能让人家说菜，这么简单都实现不了。

好在，解决这个问题也很简单，官方提供了边框的配置项。（真是及时雨啊）

```js
   backgroundStyle: {
     	borderColor: "#000",// 边框的颜色
      	borderWidth: 2,     // 边框线条的粗细
     	color: "#fff",      // 背景色
   },
```

配置完边框线的粗细后，啊哈！这不就是我们想要的效果吗？

![image-20240829022825173](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290228504.png)

最后还差一点，再将百分比显示出来，如下图，完美！

![image-20240829023831415](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290238020.png)

## 拓展

然后我们类比别的图案也是类似，也是只需要将多个path组合在一起就可以了。

### 悟空

![image-20240826113244828](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408261132917.png)

### 某支

![image-20240829014215329](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290142374.png)

### 钢铁侠





![image-20240829014710481](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290147682.png)

是不是看起来非常的炫酷，实现方式也是一样，我们只需要将这些图案的path路径传入这个shape属性就行了，然后调整适当的颜色。

注意点：

* 如果图形中包含填充的区域，可以让UI小姐姐，把填充改成线条模拟，用多个线条组成一个面模拟，类似微积分。
* 图形的样式取决于path路径，水球图只支持路径，因此路径上的颜色不能单独设置了，只能通过配置项配置一个整体的颜色。
* 关于svg矢量图标来源，可以上素材网站寻找，如我比较喜欢用的[字节图标库](https://iconpark.oceanengine.com/official)、[阿里图标库](https://www.iconfont.cn/)等等

## 思考

上面实现的水球图有一点让我十分在意，就是图案的是怎么做到根据波浪是否遮挡文字，改变文字的颜色，它做到了即使水球图的波浪漫过了文字，文字会呈现白色，不会因为水漫过后，文字颜色与水球图颜色一致，导致文字不可见。

![image-20240829024748518](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290247476.png)

这个特性也太酷了吧，对于用户体验来说大大增强。

由于强烈的好奇心，我开始研究源码这个是怎么实现的。

看了源码后，恍然大悟，原来是这样的

1. 绘制背景
2. 绘制内层的文本
3. 绘制波浪
4. 设置裁剪区域，将波浪覆盖的内层文本部分裁剪掉，留下没有被裁减的地方。（上半部分绿字）
5. 绘制外层文本，由于设置了裁剪区域，之后的绘图被限制在裁剪区域。（裁剪区域的下半红字部分）

![image-20240829025845365](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290258615.png)

这样，我们就完成了这个神奇的效果。

下面我提供了一个demo，大家可以通过注释draw中的函数，就能很快明白是怎么一回事了。

![image-20240829031657739](https://cdn.jsdelivr.net/gh/xuxing409/MyPictures@main/202408290316951.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wave Text Example</title>
    <style>
      canvas {
        border: 1px solid black;
        background: #f0f0f0; /* 设置背景颜色 */
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="600" height="400"></canvas>
    <script>
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      // 绘制背景颜色
      function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f0f0f0"; // 背景颜色
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 绘制内层文本
      function drawInnerText() {
        ctx.save(); // 保存当前状态
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "green"; // 内层文本颜色
        ctx.fillText("Hello Canvas!", canvas.width / 2, canvas.height / 2);
        ctx.restore(); // 恢复状态
      }

      // 绘制波浪路径
      function drawWaves() {
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.bezierCurveTo(100, 150, 200, 250, 300, 200);
        ctx.bezierCurveTo(400, 150, 500, 250, 600, 200);
        ctx.lineTo(600, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = "blue"; // 波浪颜色
        ctx.fill();
      }

      // 设置裁剪区域
      function setClippingRegion() {
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.bezierCurveTo(100, 150, 200, 250, 300, 200);
        ctx.bezierCurveTo(400, 150, 500, 250, 600, 200);
        ctx.lineTo(600, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.clip();
      }

      // 绘制外层文本
      function drawOuterText() {
        ctx.save(); // 保存当前状态
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "red"; // 外层文本颜色
        ctx.fillText("Hello Canvas!", canvas.width / 2, canvas.height / 2);
        ctx.restore(); // 恢复状态
      }

      // 执行绘制操作
      function draw() {
        drawBackground();
        drawInnerText(); // 绘制内层文本
        drawWaves(); // 绘制波浪
        setClippingRegion(); // 设置裁剪区域
        drawOuterText(); // 绘制外层文本
      }

      draw();
    </script>
  </body>
</html>
```

值得注意的是

* 内层文本与外层文本的位置需要在同一个位置。
* 裁剪区域位置、大小和波浪的位置、大小重合。

## 总结

完成这个需求后，领导果然非常高兴给我升了职、加了薪，就在我得意洋洋幻想当上CTO的时候，中午闹钟响了，原来只是中午做了个梦，想到下午还有任务，就继续搬砖去了🤣。
