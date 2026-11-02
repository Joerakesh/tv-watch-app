"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Search, Play, X, Tv, Radio, ChevronRight, Volume2, Maximize, LoaderCircle, AlertCircle } from "lucide-react";

type Channel = { id: string; name: string; url: string; logo?: string; group?: string; language?: string; country?: string };
type Group = { id: string; title: string; subtitle: string; channels: Channel[] };

const fallbackGroups: Group[] = [
  { id: "tamil", title: "Tamil Channels", subtitle: "Tamil entertainment, news and more", channels: [] },
  { id: "india", title: "India • Live TV", subtitle: "Popular Indian channels", channels: [] },
  { id: "movies", title: "Movies & Entertainment", subtitle: "Movie channels and entertainment", channels: [] }
];

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function ChannelCard({ channel, onPlay, featured = false }: { channel: Channel; onPlay: (channel: Channel) => void; featured?: boolean }) {
  return (
    <button className={`channel-card ${featured ? "featured-card" : ""}`} onClick={() => onPlay(channel)} title={`Watch ${channel.name}`}>
      <div className="channel-art">
        {channel.logo ? <img src={channel.logo} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = "none"; }} /> : <span>{initials(channel.name)}</span>}
        <div className="card-play"><Play size={19} fill="currentColor" /></div>
        <span className="live-tag"><i /> LIVE</span>
      </div>
      <div className="channel-meta"><strong>{channel.name}</strong><span>{channel.group || "Live channel"}</span></div>
    </button>
  );
}

function Player({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Connecting to live stream…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    setStatus("Connecting to live stream…");
    setFailed(false);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.play().then(() => setStatus("")).catch(() => setStatus("Press play to start the stream."));
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().then(() => setStatus("")).catch(() => setStatus("Press play to start the stream.")));
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) { setFailed(true); setStatus("This stream is unavailable or cannot be played in this browser."); hls?.destroy(); }
      });
    } else {
      setFailed(true);
      setStatus("This browser does not support HLS playback.");
    }
    return () => { hls?.destroy(); video.pause(); video.removeAttribute("src"); video.load(); };
  }, [channel.url]);

  return (
    <div className="player-backdrop" onClick={onClose}>
      <section className="player-dialog" onClick={event => event.stopPropagation()}>
        <header className="player-header"><div><span className="live-dot" /> NOW PLAYING <strong>{channel.name}</strong></div><button className="icon-button" onClick={onClose} aria-label="Close player"><X /></button></header>
        <div className="video-stage">
          <video ref={videoRef} controls autoPlay playsInline />
          {status && <div className="player-status">{failed ? <AlertCircle /> : <LoaderCircle className="spin" />}<span>{status}</span></div>}
        </div>
        <div className="player-footer"><div>{channel.logo && <img src={channel.logo} alt="" />}<div><strong>{channel.name}</strong><span>Live television</span></div></div><span className="player-note">Stream provided by a third party</span></div>
      </section>
    </div>
  );
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>(fallbackGroups);
  const [selected, setSelected] = useState<Channel | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    fetch("/api/channels").then(async response => {
      if (!response.ok) throw new Error("Channel directory is temporarily unavailable.");
      return response.json();
    }).then(data => setGroups(data.groups || fallbackGroups))
      .catch(err => setError(err.message || "Could not load channels."))
      .finally(() => setLoading(false));
  }, []);

  const filteredGroups = useMemo(() => groups.map(group => ({
    ...group,
    channels: group.channels.filter(channel => channel.name.toLowerCase().includes(query.toLowerCase()))
  })).filter(group => group.channels.length > 0), [groups, query]);

  const allChannels = groups.flatMap(group => group.channels);
  const hero = allChannels.find(channel => /sun tv|vijay tv|star movies|zee tamil/i.test(channel.name)) || allChannels[0];

  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#"><span className="brand-mark"><Tv size={22} /></span>tv<span>watch</span></a>
        <div className="nav-links">{["Home", "Tamil", "Movies", "Discover"].map(tab => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => { setActiveTab(tab); setQuery(tab === "Tamil" ? "" : tab === "Movies" ? "movie" : ""); }}>{tab}</button>)}</div>
        <label className="search-box"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search channels…" /><kbd>⌕</kbd></label>
      </nav>

      <section className="hero">
        <div className="hero-backdrop" />
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot" /> YOUR PERSONAL TV HUB</div>
          <h1>Television.<br /><em>Reimagined.</em></h1>
          <p>All your favourite channels, together in one place. Settle in and watch live.</p>
          <div className="hero-actions">{hero ? <button className="primary-button" onClick={() => setSelected(hero)}><Play size={18} fill="currentColor" /> Watch live</button> : <button className="primary-button" onClick={() => document.getElementById("channels")?.scrollIntoView({ behavior: "smooth" })}><Tv size={18} /> Explore channels</button>}<button className="secondary-button" onClick={() => document.getElementById("channels")?.scrollIntoView({ behavior: "smooth" })}>Browse channels <ChevronRight size={17} /></button></div>
          <div className="hero-foot"><span><Radio size={15} /> LIVE CHANNELS</span><span>•</span><span>NO SUBSCRIPTION REQUIRED BY THIS APP</span></div>
        </div>
        <div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-tv"><Tv size={76} strokeWidth={1} /><span>LIVE</span></div><div className="floating-chip chip-one">TAMIL ENTERTAINMENT</div><div className="floating-chip chip-two">MOVIES & MORE</div></div>
      </section>

      <section className="content" id="channels">
        <div className="section-heading"><div><span className="section-kicker">PICK UP WHERE YOU LEFT OFF</span><h2>{query ? `Results for “${query}”` : "Find something to watch"}</h2><p>Live channels from public IPTV playlists</p></div><span className="channel-count">{allChannels.length} CHANNELS FOUND</span></div>
        {loading && <div className="loading-line"><LoaderCircle className="spin" /> Loading live channels…</div>}
        {error && <div className="error-banner"><AlertCircle size={18} /> {error} <button onClick={() => location.reload()}>Retry</button></div>}
        {!loading && !error && allChannels.length === 0 && <div className="empty-state"><Tv size={32} /><h3>Getting your channels ready</h3><p>The playlist service returned no channels. Try again in a moment.</p><button className="secondary-button" onClick={() => location.reload()}>Refresh</button></div>}
        {filteredGroups.map((group, index) => (
          <section className="channel-section" key={group.id}>
            <div className="row-heading"><div><span className="row-number">0{index + 1}</span><div><h3>{group.title}</h3><p>{group.subtitle}</p></div></div><span>{group.channels.length} CHANNELS</span></div>
            <div className="channel-row">{group.channels.slice(0, 36).map(channel => <ChannelCard key={channel.id + channel.url} channel={channel} onPlay={setSelected} />)}</div>
          </section>
        ))}
        {!loading && filteredGroups.length === 0 && <div className="empty-state"><Search size={30} /><h3>No channels found</h3><p>Try another channel name.</p><button className="secondary-button" onClick={() => setQuery("")}>Clear search</button></div>}
      </section>

      <footer><a className="brand" href="#"><span className="brand-mark"><Tv size={18} /></span>tv<span>watch</span></a><p>Made for your personal viewing experience.</p><span>Channel listings powered by iptv-org · Streams belong to their respective providers.</span></footer>
      {selected && <Player channel={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
