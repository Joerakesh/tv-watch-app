# TV Watch

A personal live-TV discovery and player app inspired by streaming-service interfaces.

## Features
- Tamil channels prioritized on the home screen
- Movie, Indian, news, music and international channel collections
- Search and category filters
- HLS playback with native browser support where available
- Channel data loaded from public playlists maintained by [iptv-org/iptv](https://github.com/iptv-org/iptv)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Stream and rights notice
This app indexes third-party public stream URLs; it does not host video. A listed URL may stop working, be geo-restricted, or require authorization. Only watch streams you are legally entitled to access. The availability of a URL in a public playlist is not proof of broadcaster permission. Respect the source project's terms and any broadcaster restrictions.

## Data sources
- Tamil language playlist: https://iptv-org.github.io/iptv/languages/tam.m3u
- India playlist: https://iptv-org.github.io/iptv/countries/in.m3u
- Movies category playlist: https://iptv-org.github.io/iptv/categories/movies.m3u

Channel data and stream URLs belong to their respective providers and rights holders.
