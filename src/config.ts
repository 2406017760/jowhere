// 全站配置。改动这里即可，不需要翻组件源码。

export const comment = {
  /**
   * Twikoo 服务端地址。
   * 部署好 Twikoo 后把云函数访问地址粘到这里，例如：
   *   'https://jowhere-twikoo.vercel.app'
   *   'https://twikoo.你的域名.workers.dev'
   * 留空时文章页只显示一段部署提示，不会加载评论框。
   */
  envId: '',

  /**
   * Twikoo 前端脚本地址。默认用仓库内自带的副本 public/vendor/twikoo/twikoo.min.js，
   * 不走 CDN，国内访问更稳。想换版本或改用 CDN 时改这里。
   */
  clientPath: '/vendor/twikoo/twikoo.min.js',

  /** 语言 */
  lang: 'zh-CN',
};
