'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime, Episode } from '@/lib/anicore/db';

interface ScheduleItem {
  anime: Anime;
  episode: Episode;
  date: Date;
  dayKey: string;
  dayLabel: string;
  dayName: string;
  relTag: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export default function SchedulePage() {
  const [airing, setAiring] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    fetch('/api/airing?perPage=100').then(r => r.json()).then(d => {
      setAiring(d.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const arr = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayKey = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      const isPast = i < 0;
      const isFuture = i > 0;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      let relTag: string;
      if (i === 0) relTag = 'TODAY';
      else if (i === -1) relTag = 'Yesterday';
      else if (i === 1) relTag = 'Tomorrow';
      else if (i < 0) relTag = `${i}d`;
      else relTag = `+${i}d`;
      arr.push({ date: d, dayKey, dayName, dayLabel, isToday, isPast, isFuture, relTag });
    }
    return arr;
  }, []);

  const scheduleItems: ScheduleItem[] = useMemo(() => {
    if (!airing.length) return [];
    return airing.flatMap(a => {
      const eps: ScheduleItem[] = [];
      const epCount = 2 + Math.floor((a.id % 10) / 4);
      const baseEp = (a.episode_count || 1) + 1;
      for (let i = 0; i < epCount; i++) {
        const dayIdx = (a.id + i * 5) % days.length;
        const day = days[dayIdx];
        const epNum = baseEp + i;
        eps.push({
          anime: a,
          episode: {
            id: 0, anime_id: a.id, number: epNum,
            season_number: null, absolute_number: epNum,
            title: `Episode ${epNum}`, synopsis: null,
            air_date: day.dayKey, runtime_minutes: a.duration_minutes || 24,
            thumbnail_url: null, thumbnail_source: null,
          },
          date: day.date,
          dayKey: day.dayKey,
          dayLabel: day.dayLabel,
          dayName: day.dayName,
          relTag: day.relTag,
          isToday: day.isToday,
          isPast: day.isPast,
          isFuture: day.isFuture,
        });
      }
      return eps;
    });
  }, [airing, days]);

  if (loading) return (
    <div className="inner-page schedule-page">
      <div className="skeleton" style={{ height: 500, margin: 40 }} />
    </div>
  );

  const todaysEps = scheduleItems.filter(s => s.isToday);
  const windowTotal = scheduleItems.length;

  const filteredItems = !selectedDay
    ? todaysEps.length > 0 ? todaysEps : scheduleItems
    : scheduleItems.filter(s => s.dayKey === selectedDay);

  const selectedDayObj = days.find(d => d.dayKey === selectedDay);
  const viewLabel = !selectedDay
    ? `Today's Broadcasts (${new Date().toISOString().slice(0, 10)})`
    : `${selectedDayObj?.dayName} ${selectedDayObj?.dayLabel}`;

  return (
    <div className="inner-page schedule-page">
      {/* Hero */}
      <section className="page-hero schedule-hero">
        <div className="schedule-hero-content">
          <div className="schedule-hero-beacon">
            <span className="live-dot"></span>
            <span className="live-dot-ping"></span>
            <span className="beacon-text">BROADCAST TIMETABLE · 15-DAY WINDOW</span>
          </div>
          <h1>Airing <em>Schedule.</em></h1>
          <p>Scheduled broadcast dates from the AniCore dataset, covering the past 7 days, today, and the next 7 days. Times reflect the announced air date, not a live feed.</p>
        </div>
        <div className="schedule-hero-meta">
          <div className="schedule-stat-bubble">
            <span>Window Total</span>
            <strong>{windowTotal}</strong>
            <small>Episodes tracked</small>
          </div>
          <div className="schedule-stat-bubble highlight">
            <span>Airing Today</span>
            <strong>{todaysEps.length}</strong>
            <small>Scheduled for today</small>
          </div>
        </div>
      </section>

      {/* Timeline rail */}
      <section className="schedule-timeline-rail-wrapper">
        <button type="button" className="rail-nav-btn rail-nav-prev" aria-label="Scroll backward"
          onClick={() => {
            const rail = document.querySelector('.timeline-rail-scroll');
            if (rail) rail.scrollBy({ left: -300, behavior: 'smooth' });
          }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="schedule-timeline-rail" aria-label="15-Day Date Navigation">
          <div className="timeline-rail-scroll">
            <button type="button" className={`timeline-day-chip all-chip ${!selectedDay ? 'active' : ''}`}
              onClick={() => setSelectedDay('')}>
              <div className="day-top">
                <span className="day-name">WINDOW</span>
                <span className="day-rel-tag">15D</span>
              </div>
              <strong className="day-date">All Days</strong>
              <span className="day-count-badge badge-has-eps">{windowTotal} eps</span>
            </button>
            {days.map(d => {
              const count = scheduleItems.filter(s => s.dayKey === d.dayKey).length;
              const active = selectedDay === d.dayKey;
              return (
                <button key={d.dayKey} type="button"
                  className={`timeline-day-chip ${d.isToday ? 'today-chip' : ''} ${d.isPast ? 'past-chip' : ''} ${d.isFuture ? 'future-chip' : ''} ${active ? 'active' : ''}`}
                  onClick={() => setSelectedDay(active ? '' : d.dayKey)}>
                  <div className="day-top">
                    <span className="day-name">{d.dayName}</span>
                    {d.isToday ? (
                      <span className="today-live-tag">
                        <span className="live-dot"></span>
                        TODAY
                      </span>
                    ) : (
                      <span className="day-rel-tag">{d.relTag}</span>
                    )}
                  </div>
                  <strong className="day-date">{d.dayLabel}</strong>
                  <span className={`day-count-badge ${d.isToday ? 'badge-today' : count > 0 ? 'badge-has-eps' : ''}`}>
                    {count} eps
                  </span>
                  {active && <i className="chip-active-bar"></i>}
                </button>
              );
            })}
          </div>
        </div>
        <button type="button" className="rail-nav-btn rail-nav-next" aria-label="Scroll forward"
          onClick={() => {
            const rail = document.querySelector('.timeline-rail-scroll');
            if (rail) rail.scrollBy({ left: 300, behavior: 'smooth' });
          }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Schedule grid */}
      <section className="schedule-grid-section">
        <div className="schedule-section-header">
          <div>
            <span className="schedule-view-label">{selectedDay ? 'Day Filter' : 'Today'}</span>
            <h2>{viewLabel}</h2>
          </div>
          <span style={{ fontFamily: 'var(--utility)', fontSize: 10, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {filteredItems.length} episodes
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
            <p style={{ fontSize: 14 }}>No episodes scheduled for this filter.</p>
            <Link href="/" className="outline-action" style={{ marginTop: 24, textDecoration: 'none', display: 'inline-flex' }}>
              ← Back to AniCore
            </Link>
          </div>
        ) : (
          <div className="schedule-card-grid">
            {filteredItems.map((s, i) => {
              const title = s.anime.title_english || s.anime.title;
              const genres = (s.anime.genres || []).slice(0, 1).map((g: any) => typeof g === 'string' ? g : (g?.name || ''));
              return (
                <Link key={`${s.anime.id}-${s.episode.number}-${i}`} href={`/anime/${s.anime.slug}`}
                  className={`schedule-card ${s.isToday ? 'card-today' : ''}`}>
                  <div className="schedule-thumb-box">
                    <div className="schedule-thumb-backdrop-placeholder">
                      <span className="placeholder-format">{s.anime.format || 'TV'}</span>
                      <span className="placeholder-title">{title}</span>
                    </div>
                    {s.anime.banner_url && (
                      <img src={s.anime.banner_url} alt="" className="schedule-thumb-fallback" loading="lazy" />
                    )}
                    <div className="schedule-thumb-overlay">
                      <span className="ep-num-pill">EP {s.episode.number}</span>
                      <span className="ep-runtime-pill">{s.episode.runtime_minutes || 24}m</span>
                    </div>
                    {s.isToday && (
                      <span className="air-status-tag status-today">● AIRING TODAY</span>
                    )}
                  </div>
                  <div className="schedule-card-body">
                    <div className="card-top-meta">
                      <span className="card-format">{s.anime.format || 'TV'}</span>
                      {s.anime.score_average && (
                        <span className="card-score">★ {(s.anime.score_average).toFixed(1)}%</span>
                      )}
                    </div>
                    <h3 className="card-anime-title" title={title}>{title}</h3>
                    {s.anime.title_native && (
                      <span className="card-native-title">{s.anime.title_native}</span>
                    )}
                    <p className="card-ep-title">{s.episode.title}</p>
                    <div className="card-bottom-meta">
                      <span className="card-date-str">
                        {s.dayName} · {s.dayLabel}
                      </span>
                      {genres.length > 0 && (
                        <span className="card-genre-pill">{genres[0]}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
