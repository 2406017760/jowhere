import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a,b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const escape = (text: string) => text.replace(/[<>&'"]/g, char => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[char] ?? char));
  const items = posts.map(post => `<item><title>${escape(post.data.title)}</title><link>${new URL(`/posts/${post.id}`, site)}</link><description>${escape(post.data.description)}</description><pubDate>${post.data.pubDate.toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>纸上花园</title><link>${site}</link><description>记录思考、生活与正在发生的事。</description>${items}</channel></rss>`, { headers: { 'Content-Type':'application/xml; charset=utf-8' } });
}
