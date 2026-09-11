import { Innertube } from 'youtubei.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(JSON.stringify({ status: 'Mecha Worker Ready', time: new Date() }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    try {
      const youtube = await Innertube.create();
      return new Response(JSON.stringify({ status: 'YouTubei connected', info: youtube.session.client_name }), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  },
};
