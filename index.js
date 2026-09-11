import html from './indddex.html'; // JANGAN SAMPAI TERTINGGAL BARIS INI MANG!

// 4 Server Piped publik gasan backup
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.smnz.de',
  'https://pipedapi.moomoo.me'
];

// Fungsi cerdas: Menyamar jadi browser Chrome supaya kada diblokir
async function fetchPiped(path) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  };

  for (const baseUrl of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${baseUrl}${path}`, requestOptions);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      continue; // Lompat ke server berikutnya amun gagal
    }
  }
  throw new Error('Semua server Piped memblokir koneksi / sedang down.');
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname === '/') {
        return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
      }

      if (url.pathname === '/search') {
        const query = url.searchParams.get('q') || 'Nogizaka46';
        
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
        
        if (!fmt || !fmt.url) throw new Error('Stream URL tidak ketemu');

        return new Response(JSON.stringify({ ok: true, url: fmt.url }), {
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // Jika URL sembarangan (mencegah error HTML)
      return new Response(JSON.stringify({ ok: false, error: 'Endpoint tidak ditemukan' }), { 
        status: 404, 
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      });

    } catch (err) {
      // Penjaga gawang terakhir: Selalu balas pakai JSON apapun rintangannya!
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};