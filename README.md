# 纸上花园：个人博客

原创的 Astro 静态个人博客模板。它借鉴了经典文字博客的阅读节奏与信息结构，但没有复用第三方网站的源码、文章、图片或主题资源。

## 本地运行

需要 Node.js 18.17 或更高版本：

```bash
npm install
npm run dev
```

打开终端输出的本地地址即可预览。发布前执行：

```bash
npm run build
```

搜索功能（Pagefind）读取的是构建产物：`npm run build` 会在构建完成后生成索引，
并同时复制到 `public/pagefind/`，所以 `npm run dev` 也能搜索。首次克隆仓库后请先执行
一次 `npm run build`；之后新增或修改文章时，再跑一次 `npm run build` 刷新索引即可。

## 写文章

在 `src/content/posts/` 新建一个 `.md` 文件，例如：

```md
---
title: 新文章标题
description: 一句简短摘要
pubDate: 2026-09-22
tags: [生活, 随笔]
---

正文从这里开始。
```

提交到 GitHub 后，Cloudflare Pages 会自动构建和发布。设定 `draft: true` 的文章不会公开。

## 在文章里放图片和视频

图片文件放到 `public/images/posts/`，视频放到 `public/media/`，正文里用**以 `/` 开头的站点根路径**引用。
可直接参考示例文章 `src/content/posts/images-and-video.md`（打开 `/posts/images-and-video/` 看效果）。

图片：

```md
![图片说明](/images/posts/weekend-walk-01.jpg)
```

带图注就用一段原生 HTML：

```html
<figure>
  <img src="/images/posts/weekend-walk-01.jpg" alt="图片说明" loading="lazy" />
  <figcaption>图注写在这里。</figcaption>
</figure>
```

想要自动压缩、转 WebP、生成响应式尺寸，就把图片放进 `src/assets/`，用 Astro 的 `Image` 组件：

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
---
<Image src={photo} alt="图片说明" widths={[480, 960]} sizes="(max-width: 800px) 100vw, 800px" />
```

视频用原生 `<video>` 标签（`poster` 是未播放时的封面图）：

```html
<video src="/media/clip.mp4" poster="/media/clip-poster.jpg" controls preload="metadata" playsinline></video>
```

长视频建议传到 B 站 / YouTube，用固定 16:9 容器嵌入：

```html
<figure class="video-embed">
  <iframe src="//player.bilibili.com/player.html?bvid=视频BV号&autoplay=0" title="视频标题" scrolling="no" frameborder="no" allowfullscreen="true"></iframe>
  <figcaption>视频说明。</figcaption>
</figure>
```

注意：路径必须以 `/` 开头，文件名不要用中文和空格，`alt` 一定要写；体积大的视频不要放进仓库。

## 上线到 Cloudflare Pages

1. 将本目录推送到新的 GitHub 仓库。
2. 在 Cloudflare 控制台选择 **Workers & Pages → Create → Pages → Connect to Git**，选择该仓库。
3. 构建命令填写 `npm run build`，输出目录填写 `dist`。
4. 首次上线后，在项目的 **Custom domains** 中添加你的域名；将 `astro.config.mjs` 中的 `https://example.com` 改成实际域名，再提交一次。

域名的 DNS 推荐托管到 Cloudflare。无需购买 VPS 或维护数据库。

## 要改的内容

- 站点名字与基础说明：`src/layouts/BaseLayout.astro`
- 个人介绍与联系方式：`src/pages/about.astro`
- 主题颜色与排版：`src/layouts/BaseLayout.astro` 底部的全局样式
- 示例文章：`src/content/posts/`

## 当前功能

- 首页文章流、文章详情页、归档、标签页、关于页
- RSS：`/rss.xml`
- 响应式阅读排版、SEO 描述和 sitemap
- Pagefind 静态全文搜索：点击导航栏“搜索”（或按 `Ctrl/⌘ + K`）输入关键词，点搜索按钮或回车后进入 `/search?q=…` 结果页；结果页可按日期、标签查看匹配到的文章，并支持关键词高亮
- Markdown 内容管理与草稿开关

## 字体与背景

全站使用开源的 **霞鹜文楷 GB** 字体（SIL Open Font License 1.1）。暖米色方格纸背景是为本项目重新实现的 CSS 效果；它与 Warmpaper 主题的公开视觉方向一致，但没有复制其样式代码。Warmpaper 主题本身以 MIT License 发布，且其说明明确标注了字体与授权信息。
