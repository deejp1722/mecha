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

        // Ambil URL stream publik langsung dari Piped/Invidious API publik agar Cloudflare tidak terblokir
        const streamResp = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const streamData = await streamResp.json();
        
        // Cari format video mp4 kualitas 360p atau yang tersedia
        const formats = streamData.videoStreams || [];
        const selectedFormat = formats.find(f => f.quality === '360p' && f.videoOnly === false) || formats[0];

        if (!selectedFormat || !selectedFormat.url) {
          return new Response(JSON.stringify({ ok: false, error: 'Gagal mengambil stream video' }), {
            status: 500,
            headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // Kirimkan URL stream sebagai JSON ke frontend supaya video player bisa langsung memutarnya
        return new Response(JSON.stringify({ ok: true, url: selectedFormat.url }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
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