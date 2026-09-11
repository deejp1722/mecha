import { Innertube } from 'youtubei.js';
import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    // Benteng pengaman utama: Pastikan SEMUA error berbuah JSON, bukan HTML Cloudflare!
    try {
      const url = new URL(request.url);

      if (url.pathname === '/') {
        return new Response(html, {
          headers: { 'content-type': 'text/html;charset=UTF-8' },
        });
      }

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

        let streamUrl = '';
        
        // Coba ambil stream via API publik eksternal yang stabil
        try {
          const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
          if (res.ok) {
            const data = await res.json();
            const fmt = (data.videoStreams || []).find(f => f.quality === '360p' && !f.videoOnly) || data.videoStreams?.[0];
            if (fmt && fmt.url) streamUrl = fmt.url;
          }
        } catch (_e) {}

        // Fallback jika API publik gagal: gunakan youtubei.js langsung
        if (!streamUrl) {
          try {
            const info = await youtube.getBasicInfo(videoId);
            const format = info.chooseFormat({ type: 'video', quality: '360p', format: 'any' });
            if (format && format.url) streamUrl = format.url;
          } catch (_e2) {}
        }

        if (!streamUrl) {
          return new Response(JSON.stringify({ ok: false, error: 'Gagal mendapatkan URL stream video' }), {
            status: 500,
            headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        return new Response(JSON.stringify({ ok: true, url: streamUrl }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return new Response(JSON.stringify({ ok: false, error: 'Endpoint tidak ditemukan' }), {
        status: 404,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });

    } catch (err) {
      // Tangkap total semua error dan paksa balas dalam format JSON
      return new Response(JSON.stringify({ ok: false, error: err.message || 'Internal Server Error' }), {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};