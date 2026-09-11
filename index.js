import { Innertube } from 'youtubei.js';
import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }

    try {
      const youtube = await Innertube.create({
        fetch: (input, init) => fetch(input, init)
      });

      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        const searchResults = await youtube.search(query);
        
        const items = searchResults.results.map(v => ({
          id: v.id,
          title: v.title?.text,
          channel: v.author?.name,
          thumbnail: v.thumbnails?.[0]?.url,
          duration: v.duration?.text
        })).filter(v => v.id);

        return new Response(JSON.stringify({ ok: true, items }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        if (!videoId) {
          return new Response(JSON.stringify({ ok: false, error: 'Video ID missing' }), {
            status: 400,
            headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const info = await youtube.getBasicInfo(videoId);
        // Coba ambil format muxed mp4 atau format apa saja yang tersedia
        const format = info.chooseFormat({ type: 'video', quality: 'any', format: 'any' });

        return new Response(JSON.stringify({ ok: true, url: format.url }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      return new Response('Not Found', { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};