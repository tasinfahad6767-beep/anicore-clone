'use client';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, Loader2 } from 'lucide-react';

interface Props {
  src: string;
  poster?: string;
  title?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export function HlsPlayer({ src, poster, title, onNext, onPrev }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [levels, setLevels] = useState<Hls.Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    setErr(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        setLevels(hls.levels.slice());
        setCurrentLevel(-1);
        setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setErr(`Playback error: ${data.details || data.type}`);
          setLoading(false);
        }
      });
    } else {
      setErr('HLS not supported in this browser');
      setLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else c.requestFullscreen?.();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  };

  const setQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
    }
    setShowSettings(false);
  };

  const fmtTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}:${String(m % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="relative bg-black rounded-xl overflow-hidden group/player">
      <video
        ref={videoRef}
        poster={poster}
        className="w-full aspect-video"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {loading && !err && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
        </div>
      )}

      {err && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
          <div className="text-rose-400 text-sm mb-2">⚠️ {err}</div>
          <div className="text-xs text-zinc-400">Source: {src}</div>
        </div>
      )}

      {/* Title overlay */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity">
          <div className="text-white text-sm font-medium">{title}</div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div className="h-1.5 bg-zinc-700/60 rounded-full cursor-pointer mb-2 relative group/bar"
          onClick={seek}>
          <div className="h-full bg-rose-500 rounded-full relative" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}>
            <div className="absolute -right-1.5 -top-1 w-3 h-3 bg-rose-500 rounded-full opacity-0 group-hover/bar:opacity-100" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          {onPrev && (
            <button onClick={onPrev} className="hover:text-rose-400" title="Previous episode">
              <SkipBack className="w-5 h-5" />
            </button>
          )}
          <button onClick={togglePlay} className="hover:text-rose-400">
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          {onNext && (
            <button onClick={onNext} className="hover:text-rose-400" title="Next episode">
              <SkipForward className="w-5 h-5" />
            </button>
          )}
          <button onClick={toggleMute} className="hover:text-rose-400">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="text-xs font-mono text-zinc-300">
            {fmtTime(progress)} / {fmtTime(duration)}
          </div>
          <div className="flex-1" />
          {levels.length > 0 && (
            <div className="relative">
              <button onClick={() => setShowSettings(s => !s)} className="hover:text-rose-400">
                <Settings className="w-5 h-5" />
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
                  <div className="px-3 py-1.5 text-[10px] uppercase text-zinc-500 font-bold tracking-wider border-b border-zinc-800">Quality</div>
                  <button onClick={() => setQuality(-1)} className={`block w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-800 ${currentLevel === -1 ? 'text-rose-400' : 'text-white'}`}>
                    Auto
                  </button>
                  {levels.map((l, i) => (
                    <button key={i} onClick={() => setQuality(i)} className={`block w-full px-3 py-1.5 text-xs text-left hover:bg-zinc-800 ${currentLevel === i ? 'text-rose-400' : 'text-white'}`}>
                      {l.height}p
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={fullscreen} className="hover:text-rose-400">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
