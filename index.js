import { Innertube } from 'youtubei.js';
import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }

    try {
      if (url.pathname === '/search') {
        // Buat instance baru untuk setiap request agar tidak ada cache macet
        const youtube = await Innertube.create({ fetch: (input, init) => fetch(input, init) });
        
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
        if (!videoId) return new Response(JSON.stringify({ ok: false, error: 'Video ID missing' }), { status: 400 });

        let streamUrl = '';
        
        // Paling aman: Langsung tembak API Piped untuk stream supaya Cloudflare gak usah decrypt cipher YouTube
        try {
          const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
          if (res.ok) {
            const data = await res.json();
            const fmt = (data.videoStreams || []).find(f => f.quality === '360p' && !f.videoOnly) || data.videoStreams?.[0];
            if (fmt && fmt.url) streamUrl = fmt.url;
          }
        } catch (e) {
           console.log("Piped API gagal:", e);
        }

        if (!streamUrl) {
          return new Response(JSON.stringify({ ok: false, error: 'Stream URL tidak ditemukan (API Piped gagal)' }), {
            status: 500,
            headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        return new Response(JSON.stringify({ ok: true, url: streamUrl }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return new Response(JSON.stringify({ ok: false, error: 'Not Found' }), { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};