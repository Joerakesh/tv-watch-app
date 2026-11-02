import { NextResponse } from "next/server";

export const revalidate = 1800;

type Channel = {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  language?: string;
  country?: string;
};

const SOURCES = [
  { key: "tamil", url: "https://iptv-org.github.io/iptv/languages/tam.m3u" },
  { key: "india", url: "https://iptv-org.github.io/iptv/countries/in.m3u" },
  { key: "movies", url: "https://iptv-org.github.io/iptv/categories/movies.m3u" }
];

function parseM3U(text: string): Channel[] {
  const lines = text.split(/\r?\n/);
  const channels: Channel[] = [];
  let meta = "";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#EXTINF:")) {
      meta = line;
      continue;
    }
    if (line.startsWith("#") || !/^https?:\/\//i.test(line)) continue;
    const name = meta.split(",").slice(1).join(",").trim() || "Unknown channel";
    const attr = (key: string) => meta.match(new RegExp(key + '="([^"]*)"'))?.[1];
    const logo = attr("tvg-logo");
    const id = attr("tvg-id");
    const group = attr("group-title");
    channels.push({
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + channels.length,
      name, url: line, logo: logo || undefined, group: group || undefined
    });
    meta = "";
  }
  return channels;
}

export async function GET() {
  try {
    const responses = await Promise.all(SOURCES.map(async source => {
      const response = await fetch(source.url, {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "TV-Watch-Personal/1.0" }
      });
      if (!response.ok) throw new Error(`Playlist ${source.key} returned ${response.status}`);
      return { key: source.key, channels: parseM3U(await response.text()) };
    }));

    const tamil = new Map<string, Channel>();
    const india = new Map<string, Channel>();
    const movies = new Map<string, Channel>();
    for (const source of responses) {
      const target = source.key === "tamil" ? tamil : source.key === "india" ? india : movies;
      for (const channel of source.channels) {
        const normalized = { ...channel, language: source.key === "tamil" ? "Tamil" : undefined, country: source.key === "india" ? "India" : undefined };
        const key = channel.url;
        if (!target.has(key)) target.set(key, normalized);
      }
    }

    const tamilChannels = [...tamil.values()];
    const indiaChannels = [...india.values()].filter(channel => !tamilChannels.some(t => t.url === channel.url));
    const movieChannels = [...movies.values()].filter(channel => !tamilChannels.some(t => t.url === channel.url));
    return NextResponse.json({
      groups: [
        { id: "tamil", title: "Tamil Channels", subtitle: "Your favourite Tamil television", channels: tamilChannels },
        { id: "india", title: "India • Live TV", subtitle: "More channels from India", channels: indiaChannels },
        { id: "movies", title: "Movies & Entertainment", subtitle: "Movie channels from public playlists", channels: movieChannels }
      ],
      total: tamilChannels.length + indiaChannels.length + movieChannels.length,
      updatedAt: new Date().toISOString()
    }, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } });
  } catch (error) {
    console.error("Channel playlist error:", error);
    return NextResponse.json({ error: "Unable to load channel playlists right now." }, { status: 502 });
  }
}
