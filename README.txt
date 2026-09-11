MECHA YT V28 — CACHE-SAFE NATIVE PLAYER

Entry File: index.js
Port: 8787

V28 changes:
- Native HTML5 video only; no YouTube IFrame.
- Search/extractor remains local youtubei.js.
- 360p preferred, other muxed MP4 qualities accepted.
- /stream now proxies Range requests through Node and sends no-store/no-cache headers.
- Browser media URL gets a per-play cache-buster.
- Custom play/pause + scrubber overlay reliably reveals on touch/pointer.
- preload=none to avoid prefetching media before Play.

WTA: Force Stop old app first if port 8787 is stale. Entry File=index.js. Custom Extension=empty.
