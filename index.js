let ytPromise = null;

async function getYT() {
  if (!ytPromise) {
    ytPromise = (async () => {
      const { Innertube } = await import("youtubei.js");
      const { Platform } = await import("./node_modules/youtubei.js/dist/src/utils/Utils.js");
      Platform.shim.eval = async (data, env) => {
        const fn = new Function("n","sp","s", data.output + "\nreturn process(n, sp, s);");
        return fn(env.n || "", env.sp || "", env.sig || "");
      };
      return Innertube.create({ generate_session_locally: true, lang: "en", location: "US", timezone: "Asia/Tokyo" });
    })();
  }
  return ytPromise;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    }
  });
}

function vid(x) {
  x = String(x || "").trim();
  const m = x.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(x) ? x : "");
}

function qualityNum(f) {
  const m = String(f?.quality_label || f?.quality || "").match(/(\d+)p/);
  return m ? Number(m[1]) : 0;
}

function isMuxedMp4(f) {
  const mime = String(f?.mime_type || f?.mimeType || "");
  return !!f && !f.is_video_only && !f.video_only && mime.startsWith("video/mp4") && !mime.startsWith("audio/");
}

async function decipherFormat(yt, f) {
  if (!f) return null;
  if (f.url) return f;
  try {
    const d = await f.decipher(yt.session.player);
    if (d) f.url = d.url || d;
  } catch (_e) {}
  return f;
}

async function probePlayableUrl(url) {
  if (!url) return false;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 5000);
  try {
    const r = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36", "Accept": "*/*", "Range": "bytes=0-1023" },
      redirect: "follow",
      signal: ac.signal
    });
    const ct = String(r.headers.get("content-type") || "").toLowerCase();
    const ok = (r.status === 200 || r.status === 206) && (!ct || ct.includes("video/") || ct.includes("mp4") || ct.includes("octet-stream"));
    try { await r.body?.cancel() } catch (_e) {}
    return ok;
  } catch (_e) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function getMuxedCandidates(info, target = 360) {
  const yt = await getYT();
  const formats = Array.isArray(info?.streaming_data?.formats) ? info.streaming_data.formats : [];
  const candidates = formats.filter(isMuxedMp4).sort((a, b) => {
    const da = Math.abs(qualityNum(a) - target), db = Math.abs(qualityNum(b) - target);
    if (da !== db) return da - db;
    return qualityNum(a) - qualityNum(b);
  });
  const out = [];
  for (const f of candidates) {
    const d = await decipherFormat(yt, f);
    if (d?.url) out.push(d);
  }
  return out;
}

async function pickMuxed(info, target = 360) {
  const candidates = await getMuxedCandidates(info, target);
  for (const f of candidates) {
    if (await probePlayableUrl(f.url)) return f;
  }
  return null;
}

async function search(q) {
  const yt = await getYT();
  const result = await yt.search(q, { type: "video" });
  const out = [];
  for (const v of (result.videos || [])) {
    const id = v.video_id || v.id;
    if (!id) continue;
    const thumbs = v.thumbnails || [];
    out.push({
      id,
      title: v.title?.toString?.() || String(v.title || ""),
      channel: v.author?.name || v.author?.toString?.() || "",
      duration: v.length_text?.toString?.() || "",
      thumbnail: thumbs.length ? thumbs[thumbs.length - 1].url : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    });
    if (out.length >= 30) break;
  }
  return { ok: true, q, items: out };
}

async function choose(id, q) {
  const yt = await getYT();
  const target = Number.isFinite(Number(q)) && Number(q) > 0 ? Number(q) : 360;
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const info = await yt.getBasicInfo(id);
      const f = await pickMuxed(info, target);
      if (f?.url) return { url: f.url };
      lastErr = Error("Tidak ada jalur MP4 yang bisa diputar");
    } catch (e) {
      lastErr = e;
    }
    if (attempt < 3) await new Promise(r => setTimeout(r, 250 * attempt));
  }
  throw lastErr || Error("Stream tidak tersedia setelah 3 percobaan");
}

export default {
  async fetch(request, env, ctx) {
    try {
      const u = new URL(request.url);

      // Homepage UI (Mengambil dari file indddex.html yang sudah di-import)
      if (u.pathname === "/") {
        return new Response(HTML_CONTENT, {
          headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
      }

      if (u.pathname === "/health") {
        return jsonResponse({ ok: true, version: "29.0.0-cf", package: "youtubei.js" });
      }

      if (u.pathname === "/search") {
        const q = (u.searchParams.get("q") || "").trim();
        if (!q) return jsonResponse({ ok: false, error: "Kata pencarian kosong" }, 400);
        return jsonResponse(await search(q));
      }

      const id = vid(u.searchParams.get("id"));

      if (u.pathname === "/stream") {
        if (!id) return jsonResponse({ ok: false, error: "ID video tidak valid" }, 400);
        const streamData = await choose(id, u.searchParams.get("q") || 360);
        
        // Redirect 302 langsung ke URL video Google (sangat ringan untuk Cloudflare)
        return Response.redirect(streamData.url, 302);
      }

      return jsonResponse({ ok: false, error: "Not found" }, 404);

    } catch (e) {
      return jsonResponse({ ok: false, error: String(e.stack || e) }, 500);
    }
  }
};