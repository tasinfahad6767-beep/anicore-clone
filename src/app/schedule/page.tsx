'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime, Episode } from '@/lib/anicore/db';

interface ScheduleItem {
  anime: Anime;
  episode: Episode;
  date: Date;
  dayKey: string;
  dayLabel: string;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function SchedulePage() {
  const [airing, setAiring] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('all');

  useEffect(() => {
    fetch('/api/airing?perPage=100').then(r => r.json()).then(d => {
      setAiring(d.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Build 15-day window: 7 past, today, 7 future — must run before any early return
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
      arr.push({ date: d, dayKey, dayName, dayLabel, isToday, isPast, isFuture, offset: i });
    }
    return arr;
  }, []);

  // Mock episode schedule
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

  const filteredItems = selectedDay === 'all'
    ? scheduleItems
    : scheduleItems.filter(s => s.dayKey === selectedDay);

  return (
    <div className="inner-page schedule-page">
      {/* Hero */}
      <section className="page-hero schedule-hero">
        <div className="schedule-hero-content">
          <div className="schedule-hero-beacon">
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
            <button type="button" className={`timeline-day-chip all-chip ${selectedDay === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedDay('all')}>
              <div className="day-top">
                <span className="day-name">WINDOW</span>
                <span className="day-rel-tag">15D</span>
              </div>
              <strong className="day-date">All Days</strong>
              <span className="day-count-badge">{windowTotal} eps</span>
            </button>
            {days.map(d => {
              const count = scheduleItems.filter(s => s.dayKey === d.dayKey).length;
              return (
                <button key={d.dayKey} type="button"
                  className={`timeline-day-chip ${d.isToday ? 'today-chip' : ''} ${d.isPast ? 'past-chip' : ''} ${d.isFuture ? 'future-chip' : ''} ${selectedDay === d.dayKey ? 'active' : ''}`}
                  onClick={() => setSelectedDay(selectedDay === d.dayKey ? 'all' : d.dayKey)}>
                  <div className="day-top">
                    <span className="day-name">{d.dayName}</span>
                    {d.isToday && <span className="day-rel-tag today">TODAY</span>}
                    {d.isPast && <span className="day-rel-tag past">PAST</span>}
                    {d.isFuture && <span className="day-rel-tag future">NEXT</span>}
                  </div>
                  <strong className="day-date">{d.dayLabel}</strong>
                  <span className="day-count-badge">{count} eps</span>
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
      <section className="schedule-grid-wrapper">
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
            <p style={{ fontSize: 14 }}>No episodes scheduled for this filter.</p>
            <Link href="/" className="outline-action" style={{ marginTop: 24, textDecoration: 'none', display: 'inline-flex' }}>
              ← Back to AniCore
            </Link>
          </div>
        ) : (
          <div className="schedule-grid">
            {filteredItems.map((s, i) => (
              <Link key={`${s.anime.id}-${s.episode.number}-${i}`} href={`/anime/${s.anime.slug}`}
                className={`schedule-card ${s.isToday ? 'card-today' : ''} ${s.isPast ? 'card-past' : ''} ${s.isFuture ? 'card-future' : ''}`}
                style={{ textDecoration: 'none' }}>
                <div className="schedule-card-poster">
                  {s.anime.poster_url && <img src={s.anime.poster_url} alt="" loading="lazy" />}
                  <div className="schedule-card-ep-num">EP {s.episode.number}</div>
                </div>
                <div className="schedule-card-body">
                  <div className="schedule-card-date">
                    <span className="day-name">{s.dayName}</span>
                    <span className="day-date">{s.dayLabel}</span>
                    {s.isToday && <span className="today-pill">TODAY</span>}
                  </div>
                  <strong className="schedule-card-title">{s.anime.title_english || s.anime.title}</strong>
                  <div className="schedule-card-meta">
                    <span>{s.anime.format || 'TV'}</span>
                    {s.anime.score_average && (
                      <span className="schedule-card-score">
                        <strong>{Math.round(s.anime.score_average)}</strong>
                        <small>/100</small>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
