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
        client: 'ANDROID',
        fetch: (input, init) => fetch(input, init)
      });

      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        const searchResults = await youtube.search(query);
        
        const items = (searchResults.results || []).map(v => ({
          id: v.id,
          title: v.title?.text || v.title,
          channel: v.author?.name || v.author,
          thumbnail: v.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          duration: v.duration?.text || ''
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

        // Coba ambil info video menggunakan youtubei.js dengan aman
        let streamUrl = '';
        try {
          const info = await youtube.getBasicInfo(videoId);
          const format = info.chooseFormat({ type: 'video', quality: '360p', format: 'any' });
          streamUrl = format.url;
        } catch (innerErr) {
          // Fallback cerdas: Jika youtubei.js diblokir, ambil langsung dari redirect publik
          streamUrl = `https://piped.video/latest_version?id=${videoId}&itag=18`;
        }

        if (!streamUrl) {
          return new Response(JSON.stringify({ ok: false, error: 'Stream URL tidak ditemukan' }), {
            status: 500,
            headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const range = request.headers.get('range') || '';
        const fetchHeaders = range ? { Range: range } : {};

        const ytResponse = await fetch(streamUrl, {
          headers: fetchHeaders,
          method: 'GET',
          redirect: 'follow'
        });

        const resHeaders = new Headers(ytResponse.headers);
        resHeaders.set('Access-Control-Allow-Origin', '*');
        resHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        resHeaders.set('Cache-Control', 'no-store');

        return new Response(ytResponse.body, {
          status: ytResponse.status,
          headers: resHeaders
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