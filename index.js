import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }

    try {
      // 1. Endpoint Search menggunakan Piped API
      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        
        const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`);
        if (!res.ok) throw new Error('API Pencarian sedang sibuk, coba sesaat lagi.');
        
        const data = await res.json();
        
        const items = (data.items || []).map(v => {
          const vidId = v.url.split('?v=')[1] || v.url.split('/').pop();
          
          // Format detik ke menit:detik
          const sec = v.duration || 0;
          const mins = Math.floor(sec / 60);
          const secs = sec % 60;
          const durationText = `${mins}:${secs.toString().padStart(2, '0')}`;

          return {
            id: vidId,
            title: v.title,
            channel: v.uploaderName,
            thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
            duration: durationText
          };
        }).filter(v => v.id);

        return new Response(JSON.stringify({ ok: true, items }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // 2. Endpoint Stream menggunakan Piped API
      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        if (!videoId) return new Response(JSON.stringify({ ok: false, error: 'Video ID missing' }), { status: 400 });

        const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        if (!res.ok) throw new Error('API Stream sedang sibuk');
        
        const data = await res.json();
        const fmt = (data.videoStreams || []).find(f => f.quality === '360p' && !f.videoOnly) || data.videoStreams?.[0];
        
        if (!fmt || !fmt.url) {
          throw new Error('Stream URL tidak ditemukan');
        }

        return new Response(JSON.stringify({ ok: true, url: fmt.url }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      return new Response(JSON.stringify({ ok: false, error: 'Endpoint tidak ditemukan' }), { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};