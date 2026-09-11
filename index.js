import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }

    try {
      // 1. Endpoint Pencarian via Piped API
      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        
        const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=all`);
        if (!res.ok) throw new Error('API Pencarian sedang gangguan');
        
        const data = await res.json();
        
        const items = (data.items || [])
          .filter(v => v.type === 'stream') // Ambil video saja
          .map(v => {
            // Format durasi dari detik ke format MM:SS
            const d = Number(v.duration);
            const m = Math.floor(d / 60);
            const s = Math.floor(d % 60).toString().padStart(2, '0');
            
            return {
              id: v.url.replace('/watch?v=', ''),
              title: v.title,
              channel: v.uploaderName,
              thumbnail: v.thumbnail,
              duration: d > 0 ? `${m}:${s}` : ''
            };
          });

        return new Response(JSON.stringify({ ok: true, items }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // 2. Endpoint Stream via Piped API
      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        if (!videoId) return new Response(JSON.stringify({ ok: false, error: 'Video ID missing' }), { status: 400 });

        const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        if (!res.ok) throw new Error('API Stream sedang gangguan');
        
        const data = await res.json();
        const fmt = (data.videoStreams || []).find(f => f.quality === '360p' && !f.videoOnly) || data.videoStreams?.[0];
        
        if (!fmt || !fmt.url) {
          throw new Error('Stream URL tidak ditemukan');
        }

        return new Response(JSON.stringify({ ok: true, url: fmt.url }), {
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