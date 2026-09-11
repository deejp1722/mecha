import { Innertube } from 'youtubei.js';
import html from './indddex.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Tampilkan UI HTML di halaman depan
    if (url.pathname === '/') {
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }

    try {
      // Inisialisasi YouTubei dengan binding fetch worker aman
      const youtube = await Innertube.create({
        fetch: (input, init) => fetch(input, init)
      });

      // 2. Endpoint Pencarian (/search)
      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        const searchResults = await youtube.search(query);
        
        // Format hasil supaya sesuai dengan format yang diminta frontend
        const items = searchResults.results.map(v => ({
          id: v.id,
          title: v.title?.text,
          channel: v.author?.name,
          thumbnail: v.thumbnails?.[0]?.url,
          duration: v.duration?.text
        }));

        return new Response(JSON.stringify({ ok: true, items }), {
          headers: { 
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          },
        });
      }

      // 3. Endpoint Streaming (/stream) - Kerangka Awal
      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        return new Response(JSON.stringify({ error: "Stream endpoint belum selesai dibuat" }), { 
          status: 501, 
          headers: { 'content-type': 'application/json' } 
        });
      }

      // Jika URL sembarangan diakses
      return new Response('Not Found', { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  },
};