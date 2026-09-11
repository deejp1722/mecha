import { Innertube } from 'youtubei.js';
import html from './indddex.html';

let youtubePromise = null;

function getYoutube() {
  if (!youtubePromise) {
    youtubePromise = Innertube.create({
      client: 'ANDROID',
      fetch: (input, init) => fetch(input, init)
    });
  }

  return youtubePromise;
}

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, Content-Type',
    'Access-Control-Expose-Headers':
      'Content-Length, Content-Range, Accept-Ranges, Content-Type',
    ...extra
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // =========================
    // HTML
    // =========================
    if (url.pathname === '/') {
      return new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8'
        }
      });
    }

    try {
      const youtube = await getYoutube();

      // =========================
      // SEARCH
      // =========================
      if (url.pathname === '/search') {
        const query =
          url.searchParams.get('q') || 'Nogizaka46';

        const searchResults = await youtube.search(query);

        const items = (searchResults.results || [])
          .map(v => ({
            id: v.id,
            title: v.title?.text || v.title || '',
            channel:
              v.author?.name ||
              v.author ||
              '',
            thumbnail:
              v.thumbnails?.[0]?.url ||
              `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
            duration:
              v.duration?.text ||
              ''
          }))
          .filter(v => v.id);

        return new Response(
          JSON.stringify({
            ok: true,
            items
          }),
          {
            headers: corsHeaders({
              'content-type': 'application/json;charset=UTF-8'
            })
          }
        );
      }

      // =========================
      // STREAM
      // =========================
      if (url.pathname === '/stream') {
        const videoId =
          url.searchParams.get('id');

        if (!videoId) {
          return new Response(
            'Video ID missing',
            {
              status: 400,
              headers: corsHeaders()
            }
          );
        }

        const info =
          await youtube.getBasicInfo(videoId);

        // =================================
        // LIVE
        // =================================
        if (info.basic_info?.is_live) {
          const hls =
            info.streaming_data?.hls_manifest_url;

          if (hls) {
            return new Response(
              JSON.stringify({
                ok: true,
                live: true,
                type: 'hls',
                url: hls
              }),
              {
                headers: corsHeaders({
                  'content-type':
                    'application/json;charset=UTF-8'
                })
              }
            );
          }

          return new Response(
            JSON.stringify({
              ok: false,
              error: 'Live HLS manifest tidak tersedia'
            }),
            {
              status: 404,
              headers: corsHeaders({
                'content-type':
                  'application/json;charset=UTF-8'
              })
            }
          );
        }

        // =================================
        // VOD
        // =================================

        let format;

        try {
          const streaming =
            await youtube.getStreamingData(
              videoId,
              {
                quality: '360p',
                type: 'videoandaudio',
                format: 'mp4'
              }
            );

          format = streaming;
        } catch (e) {
          // fallback
          format = null;
        }

        if (!format?.url) {
          return new Response(
            JSON.stringify({
              ok: false,
              error:
                'Tidak mendapatkan URL video'
            }),
            {
              status: 500,
              headers: corsHeaders({
                'content-type':
                  'application/json;charset=UTF-8'
              })
            }
          );
        }

        const range =
          request.headers.get('Range') ||
          request.headers.get('range');

        const headers = {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
          'Accept': '*/*'
        };

        if (range) {
          headers.Range = range;
        }

        const ytResponse =
          await fetch(format.url, {
            method: 'GET',
            headers
          });

        if (!ytResponse.ok && ytResponse.status !== 206) {
          return new Response(
            JSON.stringify({
              ok: false,
              error:
                `Google Video HTTP ${ytResponse.status}`
            }),
            {
              status: 502,
              headers: corsHeaders({
                'content-type':
                  'application/json;charset=UTF-8'
              })
            }
          );
        }

        const responseHeaders =
          new Headers();

        const copyHeaders = [
          'Content-Type',
          'Content-Length',
          'Content-Range',
          'Accept-Ranges',
          'Cache-Control'
        ];

        for (const name of copyHeaders) {
          const value =
            ytResponse.headers.get(name);

          if (value) {
            responseHeaders.set(name, value);
          }
        }

        responseHeaders.set(
          'Access-Control-Allow-Origin',
          '*'
        );

        responseHeaders.set(
          'Access-Control-Allow-Methods',
          'GET, OPTIONS'
        );

        responseHeaders.set(
          'Access-Control-Allow-Headers',
          'Range, Content-Type'
        );

        responseHeaders.set(
          'Access-Control-Expose-Headers',
          'Content-Length, Content-Range, Accept-Ranges, Content-Type'
        );

        responseHeaders.set(
          'Cache-Control',
          'no-store'
        );

        return new Response(
          ytResponse.body,
          {
            status: ytResponse.status,
            headers: responseHeaders
          }
        );
      }

      return new Response(
        'Not Found',
        {
          status: 404,
          headers: corsHeaders()
        }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            err?.message ||
            String(err)
        }),
        {
          status: 500,
          headers: corsHeaders({
            'content-type':
              'application/json;charset=UTF-8'
          })
        }
      );
    }
  }
};