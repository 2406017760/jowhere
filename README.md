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

## 开启评论（Twikoo）

评论区默认是关闭的，文章页会显示一段配置提示。开启只需两步：

**第 1 步：部署 Twikoo 服务端（Cloudflare Workers + D1）**

服务端代码放在本机的 `twikoo-server/` 目录（已按官方要求裁剪好打包体积，并从 `wrangler.toml` 去掉了用不到的 R2 绑定）。该目录**不纳入博客仓库**，需要单独推送到自己的仓库保存。

```powershell
cd twikoo-server
npm install
node scripts/prune-for-workers.mjs     # 每次 npm install 后都要跑
npx wrangler login                     # 浏览器授权登录 Cloudflare
npx wrangler d1 create twikoo          # 建库，把输出的 database_id 填进 wrangler.toml
npx wrangler d1 execute twikoo --remote --file=./schema.sql --config wrangler.toml
npx wrangler deploy --minify --config wrangler.toml
```

部署完成后会得到一个地址，例如 `https://twikoo-cloudflare.你的用户名.workers.dev`。完整说明和可选配置见 `twikoo-server/DEPLOY.md`。

*（也可以换用 Vercel + MongoDB 方案，见 [Twikoo 官方文档](https://twikoo.js.org/quick-start.html)；Workers 方案的冷启动更快。）*

**第 2 步：把地址填进配置**

编辑 `src/config.ts`：

```ts
export const comment = {
  envId: 'https://twikoo-cloudflare.你的用户名.workers.dev', // ← 粘这里
  ...
};
```

保存后评论区自动出现，无需改其它文件。想临时关闭评论，把 `envId` 清空即可。

**关于前端脚本**：仓库自带一份 Twikoo 浏览器包（`public/vendor/twikoo/twikoo.min.js`，v2.0.8），不走 CDN，国内访问更稳。想升级版本：

```bash
npm pack twikoo && tar -xzf twikoo-*.tgz && cp package/dist/twikoo.min.js public/vendor/twikoo/
```

也可以把 `comment.clientPath` 改成 CDN 地址。

**表单规则**：昵称必填、邮箱必填（不会公开显示）、网址选填。组件会在 Twikoo 渲染出表单后自动打上这些校验。

> ⚠️ Cloudflare Workers 版的 Twikoo **服务端不校验必填字段**（空昵称会存成「匿名」，空邮箱也会保存），所以这几条规则实际由前端把关。如果需要更硬的防护，建议在 Twikoo 管理面板里开启 **Cloudflare Turnstile 验证码**和评论频率限制。

**评论头像是 Gravatar**：读者用邮箱评论时，头像是该邮箱在 [gravatar.com](https://gravatar.com) 注册的图；没注册就显示默认头像。国内访问慢的话，可以在 Twikoo 管理面板把 `GRAVATAR_CDN` 改成 `cravatar.cn`。

## 要改的内容

- 站点名字与基础说明：`src/layouts/BaseLayout.astro`
- 个人介绍与联系方式：`src/pages/about.astro`
- 主题颜色与排版：`src/layouts/BaseLayout.astro` 底部的全局样式
- 示例文章：`src/content/posts/`
- 评论服务地址：`src/config.ts`

## 当前功能

- 首页文章流、文章详情页、归档、标签页、关于页
- RSS：`/rss.xml`
- 响应式阅读排版、SEO 描述和 sitemap
- Pagefind 静态全文搜索：点击导航栏“搜索”（或按 `Ctrl/⌘ + K`）输入关键词，点搜索按钮或回车后进入 `/search?q=…` 结果页；结果页可按日期、标签查看匹配到的文章，并支持关键词高亮
- 文章内插图与视频（Markdown 图片、`<video>`、B 站/YouTube 嵌入）
- Twikoo 评论：昵称、邮箱必填，网址选填（需自行部署 Twikoo 服务端）
- Markdown 内容管理与草稿开关

## 第三方资源

- **Twikoo**（MIT License）：评论前端包内置于 `public/vendor/twikoo/`，版权与许可见同目录 `LICENSE`。

## 字体与背景

全站使用开源的 **霞鹜文楷 GB** 字体（SIL Open Font License 1.1）。暖米色方格纸背景是为本项目重新实现的 CSS 效果；它与 Warmpaper 主题的公开视觉方向一致，但没有复制其样式代码。Warmpaper 主题本身以 MIT License 发布，且其说明明确标注了字体与授权信息。
