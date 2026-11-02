# TV Watch

A personal live-TV discovery and playback web app with a streaming-service-inspired interface. The home experience prioritises Tamil channels and organises additional streams into useful categories.

> This project is for personal experimentation. It does not host, record or own the listed streams.

## Features

- Tamil channels highlighted on the home screen.
- Browse movie, Indian, news, music and international channel collections.
- Search and category filtering.
- HLS playback using hls.js where required and supported by the browser.
- Channel and stream metadata loaded from public playlists maintained by the IPTV-ORG project.

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 |
| UI | React 19 |
| Language | TypeScript |
| Streaming | hls.js |
| Icons | lucide-react |

## Run locally

### Requirements

- Node.js
- npm

### Install and start

```bash
git clone https://github.com/Joerakesh/tv-watch-app.git
cd tv-watch-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Playlist sources

The app currently references public IPTV-ORG playlists, including:

- Tamil-language channels: https://iptv-org.github.io/iptv/languages/tam.m3u
- India channels: https://iptv-org.github.io/iptv/countries/in.m3u
- Movie category: https://iptv-org.github.io/iptv/categories/movies.m3u

Playlist entries and stream URLs are maintained by their respective sources and providers. Availability can change without notice.

## Playback troubleshooting

- A stream may be offline, geo-restricted or removed by its provider.
- Browser support varies by stream format and codec.
- Some streams require authorization or may not permit embedding.
- Try another channel if playback fails; the app cannot guarantee third-party stream uptime.

## Rights and responsible use

A stream appearing in a public playlist is not proof that it is authorised for every viewer or region. Only access content you are legally entitled to watch. Respect broadcaster restrictions, source-project terms and applicable copyright law. The app does not provide or redistribute video content itself.

## Roadmap

- Improve playback error states and loading feedback.
- Add channel logos and better metadata when reliable source data exists.
- Improve keyboard navigation and responsive layouts.
- Add tests for playlist parsing and player state.

## License

No license is specified. Third-party channel metadata, logos and streams remain subject to their respective owners' terms.
