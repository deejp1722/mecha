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

      // Endpoint Proxy Stream sejati (meneruskan Range request ke Google Video)
      if (url.pathname === '/stream') {
        const videoId = url.searchParams.get('id');
        if (!videoId) {
          return new Response('Video ID missing', { status: 400 });
        }

        const info = await youtube.getBasicInfo(videoId);
        let streamUrl = '';
        try {
          const format = info.chooseFormat({ type: 'video', quality: '360p', format: 'any' });
          streamUrl = format.url;
        } catch (_e) {
          const formats = info.streaming_data?.formats || info.streaming_data?.adaptive_formats || [];
          if (formats.length > 0) streamUrl = formats[0].url;
        }

        if (!streamUrl) {
          return new Response('Gagal mendapatkan URL stream', { status: 500 });
        }

        // Ambil header Range dari browser client supaya scrubbing/seek video lancar
        const range = request.headers.get('range') || '';
        const fetchHeaders = range ? { Range: range } : {};

        const ytResponse = await fetch(streamUrl, {
          headers: fetchHeaders,
          method: 'GET'
        });

        // Teruskan respons stream langsung ke frontend browser dengan CORS penuh
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