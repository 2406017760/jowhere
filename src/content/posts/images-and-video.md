---
title: 在文章里插图与放视频
description: 三种插图写法、两种视频写法的完整示例，直接复制就能用。
pubDate: 2026-09-24
tags: [技术, 教程]
---

这篇文章本身就是一个可运行的示例：下面出现的每一张图、每一段视频，都来自本仓库里的真实文件。

## 一、图片

### 写法 1：最简单的 Markdown

图片文件放在 `public/images/posts/` 下，正文里用相对于站点根目录的路径引用：

```md
![方格纸上的计划清单](/images/posts/example-checklist.svg)
```

效果如下：

![方格纸上的计划清单](/images/posts/example-checklist.svg)

### 写法 2：带说明文字（推荐）

Markdown 语法没法写图注，用一段原生 HTML 就行。`figure` + `figcaption` 的结构对搜索引擎和读屏软件也更友好：

```html
<figure>
  <img src="/images/posts/example-cover.svg" alt="纸上花园的封面图" loading="lazy" />
  <figcaption>把封面图放在文章开头，读者一眼就知道这篇在讲什么。</figcaption>
</figure>
```

<figure>
  <img src="/images/posts/example-cover.svg" alt="纸上花园的封面图" loading="lazy" />
  <figcaption>把封面图放在文章开头，读者一眼就知道这篇在讲什么。</figcaption>
</figure>

### 写法 3：Astro 图片优化组件

如果想要自动压缩、转 WebP、生成多尺寸响应式图片，就把 GitHub 上的图片下载到 `src/assets/`，然后用 Astro 的 `Image` 组件：

```astro
---
import { Image } from 'astro:assets';
import cover from '../assets/my-photo.jpg';
---
<Image src={cover} alt="我的照片" widths={[480, 960]} sizes="(max-width: 800px) 100vw, 800px" />
```

> 简单记住：**`public/` 里放原图，直接写 URL；`src/assets/` 里放图，交给 `Image` 自动优化。** 本示例用的是前者，因为它复制起来最省事。

## 二、视频

### 写法 1：上传自己的视频文件（推荐）

把 `.mp4` 放进 `public/media/`，然后用原生 `<video>` 标签。关键是三件事：`controls`（显示播放条）、`preload="metadata"`（别一进页面就下载整个视频）、`poster`（封面图，视频没播放时显示）：

```html
<video src="/media/example-clip.mp4" poster="/media/example-clip-poster.jpg" controls preload="metadata" playsinline></video>
```

<video src="/media/example-clip.mp4" poster="/media/example-clip-poster.jpg" controls preload="metadata" playsinline></video>

需要自动循环、静音当背景动图用时，加上 `autoplay muted loop`：

```html
<video src="/media/example-clip.mp4" poster="/media/example-clip-poster.jpg" autoplay muted loop playsinline></video>
```

### 写法 2：嵌入 B 站 / YouTube

长视频建议直接托管到视频平台，用 `iframe` 嵌进来。注意 B 站要用 `//player.bilibili.com/player.html?bvid=...` 这种通用播放器地址，并把高度按 16:9 留足：

```html
<figure class="video-embed">
  <iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&autoplay=0"
          title="视频标题" scrolling="no" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
  <figcaption>视频说明写在这里。</figcaption>
</figure>
```

YouTube 同理，把 `src` 换成 `https://www.youtube.com/embed/视频ID` 即可。

## 三、几个容易踩的坑

- **路径要以 `/` 开头**：`/images/posts/foo.jpg` 是站点根目录；写成 `images/posts/foo.jpg` 在文章页会变成 `/posts/文章名/images/...`，图就裂了。
- **文件名别用中文和空格**：有些服务器或 CDN 会对中文名做转义，写 `weekend-walk-01.jpg` 最稳。
- **`alt` 一定要写**：图片加载失败时会显示这段文字，读屏软件也靠它。
- **视频文件别直接塞进仓库**：超过 10MB 的 `mp4` 建议放对象存储或视频平台，仓库里只留封面图和链接。
- **想省流量就用 `loading="lazy"`**：图片往下滚才加载，首屏更快。
