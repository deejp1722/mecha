import html from './indddex.html';

// 4 Server Piped publik gasan backup (anti-mati)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.smnz.de',
  'https://pipedapi.moomoo.me'
];

// Fungsi cerdas: Coba satu-satu sampai ada yang berhasil
async function fetchPiped(path) {
  for (const baseUrl of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${baseUrl}${path}`);
      if (res.ok) return await res.json();
    } catch (e) {
      continue; // Lompat ke server berikutnya amun gagal
    }
  }
  throw new Error('Semua server Piped sedang down/sibuk.');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }

    try {
      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        
        // Panggil fungsi cerdas multi-server
        const data = await fetchPiped(`/search?q=${encodeURIComponent(query)}&filter=videos`);
        
        const items = (data.items || []).map(v => {
          const vidId = v.url.split('?v=')[1] || v.url.split('/').pop();
          const sec = v.duration || 0;
          return {
            id: vidId,
            title: v.title,
            channel: v.uploaderName,
            thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
            duration: `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`
          };
        }).filter(v => v.id);

        return new Response(JSON.stringify({ ok: true, items }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        if (!videoId) throw new Error('Video ID missing');

        const data = await fetchPiped(`/streams/${videoId}`);
        const fmt = (data.videoStreams || []).find(f => f.quality === '360p' && !f.videoOnly) || data.videoStreams?.[0];
        
        if (!fmt || !fmt.url) throw new Error('Stream URL tidak ketemu bro');

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