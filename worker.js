import { Innertube } from 'youtubei.js/cf-worker';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const query = url.searchParams.get('q');

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const youtube = await Innertube.create();

      if (url.pathname === '/stream') {
        if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders });
        const info = await youtube.getBasicInfo(id);
        let format = info.chooseFormat({ type: 'video+audio', quality: (url.searchParams.get('q') || '360') + 'p' });
        if (!format) format = info.chooseFormat({ type: 'video+audio' });
        if (!format) return new Response(JSON.stringify({ error: 'format not found' }), { status: 404, headers: corsHeaders });
        
        return Response.redirect(format.decipher(youtube.session.player), 302);
      }

      if (url.pathname === '/search') {
        const searchResults = await youtube.search(query || 'Nogizaka46');
        return new Response(JSON.stringify(searchResults), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (url.pathname === '/info') {
        if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400, headers: corsHeaders });
        const info = await youtube.getBasicInfo(id);
        return new Response(JSON.stringify(info.basic_info), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ message: 'API MECHA Active!' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (e) {
      return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }
};
