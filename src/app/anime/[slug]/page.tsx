'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { X, Plus, Check, Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime, Episode, Character, StreamingLink, ExternalLink, Recommendation, Relation } from '@/lib/anicore/db';

interface FullData {
  anime: Anime;
  episodes: Episode[];
  characters: Character[];
  streaming: StreamingLink[];
  external: ExternalLink[];
  recommendations: Recommendation[];
  relations: Relation[];
}

export default function AnimeDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<FullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [activeSection, setActiveSection] = useState('record-overview');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime/${slug}`).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
      try {
        const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
        setInList(list.includes(d?.anime?.id || 0));
      } catch {}
    });
  }, [slug]);

  useEffect(() => {
    if (!data?.anime?.id) return;
    try {
      const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      setInList(list.includes(data.anime.id));
    } catch {}
  }, [data?.anime?.id]);

  const toggleList = () => {
    if (!data?.anime?.id) return;
    try {
      const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      const idx = list.indexOf(data.anime.id);
      if (idx >= 0) list.splice(idx, 1); else list.push(data.anime.id);
      localStorage.setItem('anicore-list', JSON.stringify(list));
      setInList(idx < 0);
      window.dispatchEvent(new Event('anicore-list-changed'));
    } catch {}
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
      <div className="skeleton" style={{ width: '80%', height: '600px' }} />
    </div>
  );

  if (!data?.anime) return (
    <section className="error-page">
      <div className="error-code" aria-hidden="true">404</div>
      <div className="error-copy">
        <p>Index exception / 404</p>
        <h1>This record is not in the index.</h1>
        <span>The address may be incomplete, the page may have moved, or the record has not been resolved yet.</span>
        <div>
          <Link href="/">Return to the index <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </div>
    </section>
  );

  const a = data.anime;
  const genres: any[] = a.genres || [];
  const genreNames = genres.map(g => typeof g === 'string' ? g : (g?.name || '')).filter(Boolean);

  const sourcesArr: any[] = a.sources || [];
  const hasSource = (name: string) => sourcesArr.some(s => typeof s === 'string' ? s.toLowerCase() === name.toLowerCase() : (s?.slug?.toLowerCase() === name.toLowerCase()));

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const communityTotal = a.mal_members ? Math.round(a.mal_members / 1000) : 0;
  const completedPct = 87;
  const watchingPct = 5;
  const plannedPct = 4;
  const pausedPct = 1;
  const droppedPct = 1.5;

  return (
    <div className="detail-overlay" style={{ position: 'relative', background: 'var(--paper)' }}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-label={`${a.title} details`}>
        <Link href="/" className="detail-close" aria-label="Close details" style={{ textDecoration: 'none' }}>
          <X className="w-5 h-5" />
        </Link>

        {/* Backdrop */}
        <div className="detail-backdrop" style={{ backgroundImage: `url("${a.cover_url || a.banner_url || a.poster_url || ''}")` }}>
          <div className="detail-wash" />
          <button type="button" className="anicore-id-badge" title={`AniCore ID ${a.id} · ${a.slug}`} aria-label={`Copy AniCore ID ${a.id}`}>
            <b>AniCore ID</b>
            <strong>{a.id}</strong>
            <em>Copy</em>
          </button>
          <div className="detail-heading">
            {a.poster_url && <img className="detail-poster" src={a.poster_url} alt="" />}
            <div className={`detail-title ${a.logo_url ? 'has-logo' : ''}`}>
              <div className="eyebrow">
                <span>{a.status === 'RELEASING' ? 'Airing' : a.status === 'FINISHED' ? 'Finished' : a.status === 'NOT_YET_RELEASED' ? 'Upcoming' : a.status}</span>
                <div className="source-constellation">
                  <span className={`source-node source-kitsu ${hasSource('kitsu') ? 'active' : ''}`} title={hasSource('kitsu') ? 'Kitsu source available' : 'Kitsu not linked'}><i></i></span>
                  <span className={`source-node source-tvdb ${hasSource('tvdb') ? 'active' : ''}`} title={hasSource('tvdb') ? 'TVDB source available' : 'TVDB not linked'}><i></i></span>
                  <span className={`source-node source-tmdb ${hasSource('tmdb') ? 'active' : ''}`} title={hasSource('tmdb') ? 'TMDB source available' : 'TMDB not linked'}><i></i></span>
                  <span className={`source-node source-anilist ${hasSource('anilist') ? 'active' : ''}`} title={hasSource('anilist') ? 'AniList source available' : 'AniList not linked'}><i></i></span>
                  <span className={`source-node source-mal ${hasSource('mal') ? 'active' : ''}`} title={hasSource('mal') ? 'MAL source available' : 'MAL not linked'}><i></i></span>
                </div>
              </div>
              {a.logo_url && <img className="detail-logo" src={a.logo_url} alt="" />}
              <h2>{a.title_english || a.title}</h2>
              {a.title_native && <p className="native-title">{a.title_native}</p>}
              <div className="detail-meta">
                {a.season_year && <span>{a.season_year}</span>}
                {a.format && <span>{a.format}</span>}
                {a.episode_count && <span>{a.episode_count} episodes</span>}
                {a.duration_minutes && <span>{a.duration_minutes} min</span>}
              </div>
              <div className="detail-actions">
                <button className="primary-action" onClick={toggleList}>
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inList ? 'In My List' : 'Add to My List'}
                </button>
                {a.trailer_youtube_id && (
                  <a className="secondary-action" href={`https://www.youtube.com/watch?v=${a.trailer_youtube_id}`} target="_blank" rel="noopener">
                    <Play className="w-3.5 h-3.5" /> Watch trailer
                  </a>
                )}
              </div>
            </div>
            <div className="detail-score">
              {a.score_average != null && (
                <span className="score">
                  <strong>{Math.round(a.score_average)}</strong>
                  <small>/100</small>
                </span>
              )}
              <span>community score</span>
              {a.mal_members && <small>{(a.mal_members / 1_000_000).toFixed(1)}M MAL members</small>}
            </div>
          </div>
        </div>

        {/* Chapters nav */}
        <nav className="detail-chapters" aria-label={`${a.title} detail sections`}>
          <button type="button" className={activeSection === 'record-overview' ? 'active' : ''} onClick={() => scrollToSection('record-overview')}>Overview</button>
          <button type="button" className={activeSection === 'record-episodes' ? 'active' : ''} onClick={() => scrollToSection('record-episodes')}>Episodes <span>{data.episodes.length}</span></button>
          <button type="button" className={activeSection === 'record-people' ? 'active' : ''} onClick={() => scrollToSection('record-people')}>People <span>{data.characters.length}</span></button>
          <button type="button" className={activeSection === 'record-franchise' ? 'active' : ''} onClick={() => scrollToSection('record-franchise')}>Franchise <span>{data.relations.length + data.recommendations.length}</span></button>
        </nav>

        {/* Detail content */}
        <div className="detail-content">
          <main>
            {/* Overview */}
            <section className="detail-section" id="record-overview">
              <p className="section-kicker">Overview</p>
              <h3>The story</h3>
              {a.synopsis && <p className="synopsis">{a.synopsis}</p>}
              {genreNames.length > 0 && (
                <div className="tag-row detail-tags">
                  {genreNames.map(g => <span key={g}>{g}</span>)}
                </div>
              )}
              {a.mal_members && (
                <div className="community-stats">
                  <div className="community-total">
                    <strong>{(a.mal_members / 1_000_000).toFixed(1)}M</strong>
                    <span>list entries on Mal</span>
                  </div>
                  <div className="status-bars">
                    {[
                      { label: 'Completed', pct: completedPct, count: Math.round(a.mal_members * completedPct / 100) },
                      { label: 'Watching', pct: watchingPct, count: Math.round(a.mal_members * watchingPct / 100) },
                      { label: 'Plan to watch', pct: plannedPct, count: Math.round(a.mal_members * plannedPct / 100) },
                      { label: 'On hold', pct: pausedPct, count: Math.round(a.mal_members * pausedPct / 100) },
                      { label: 'Dropped', pct: droppedPct, count: Math.round(a.mal_members * droppedPct / 100) },
                    ].map(s => (
                      <div className="status-row" key={s.label}>
                        <span>{s.label}</span>
                        <i><b className={s.label.toLowerCase().replace(/ /g, '-')} style={{ width: `${s.pct}%` }} /></i>
                        <strong>{s.count >= 1_000_000 ? `${(s.count / 1_000_000).toFixed(1)}M` : s.count >= 1000 ? `${(s.count / 1000).toFixed(1)}K` : s.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Episodes */}
            {data.episodes.length > 0 && (
              <section className="detail-section" id="record-episodes">
                <div className="section-title-line">
                  <p className="section-kicker">Episode guide</p>
                  <h3>Episodes</h3>
                </div>
                <div className="episode-browser">
                  <div className="episode-list">
                    {data.episodes.map((ep, i) => (
                      <article className="episode-item" key={ep.id || i}>
                        <div className="episode-still">
                          {ep.thumbnail_url && <img src={ep.thumbnail_url} alt="" loading="lazy" />}
                          <span className="episode-number">EP {ep.number}</span>
                        </div>
                        <div className="episode-copy">
                          <strong>{ep.title || `Episode ${ep.number}`}</strong>
                          {ep.synopsis && <p>{ep.synopsis}</p>}
                          <span className="episode-meta">
                            {ep.air_date && `Aired ${ep.air_date}`}
                            {ep.runtime_minutes && ` · ${ep.runtime_minutes} min`}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* People / Characters */}
            {data.characters.length > 0 && (
              <section className="detail-section" id="record-people">
                <div className="section-title-line">
                  <p className="section-kicker">People</p>
                  <h3>Cast &amp; characters</h3>
                </div>
                <div className="people-columns">
                  <div>
                    <p className="people-column-label">Characters</p>
                    <div className="cast-grid">
                      {data.characters.map((ch, i) => (
                        <article className="cast-card" key={ch.id || i}>
                          {ch.image_url ? (
                            <img src={ch.image_url} alt={ch.name} loading="lazy" />
                          ) : (
                            <div className="cast-fallback">{ch.name?.charAt(0) || '?'}</div>
                          )}
                          <div>
                            <strong>{ch.name}</strong>
                            <span>{ch.role}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Franchise: Relations + Recommendations */}
            {(data.relations.length > 0 || data.recommendations.length > 0) && (
              <section className="detail-section" id="record-franchise">
                <p className="section-kicker">World map</p>
                <h3>Franchise &amp; recommendations</h3>
                {data.relations.length > 0 && (
                  <div className="relation-row">
                    {data.relations.map((r, i) => (
                      <Link key={`rel-${i}`} href={`/anime/${r.target_slug}`} style={{ textDecoration: 'none' }}>
                        <article>
                          {r.target_poster && <img src={r.target_poster} alt="" loading="lazy" />}
                          <div>
                            <span>{r.relation_type}</span>
                            <strong>{r.target_title}</strong>
                            <small>{r.target_format}</small>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
                {data.recommendations.length > 0 && (
                  <div className="recommendation-block">
                    <p className="section-kicker">Community trail</p>
                    <div className="relation-row">
                      {data.recommendations.map((r, i) => (
                        <Link key={`rec-${i}`} href={`/anime/${r.recommended_slug}`} style={{ textDecoration: 'none' }}>
                          <article>
                            {r.recommended_poster && <img src={r.recommended_poster} alt="" loading="lazy" />}
                            <div>
                              <span>Recommended</span>
                              <strong>{r.recommended_title}</strong>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <section className="source-panel">
              <p className="section-kicker">Provenance</p>
              <h3>Five sources unified</h3>
              <div className="source-constellation with-labels">
                <span className={`source-node source-kitsu ${hasSource('kitsu') ? 'active' : ''}`} title={hasSource('kitsu') ? 'Kitsu source available' : 'Kitsu not linked'}><i></i><b>Kitsu</b></span>
                <span className={`source-node source-tvdb ${hasSource('tvdb') ? 'active' : ''}`} title={hasSource('tvdb') ? 'TVDB source available' : 'TVDB not linked'}><i></i><b>TVDB</b></span>
                <span className={`source-node source-tmdb ${hasSource('tmdb') ? 'active' : ''}`} title={hasSource('tmdb') ? 'TMDB source available' : 'TMDB not linked'}><i></i><b>TMDB</b></span>
                <span className={`source-node source-anilist ${hasSource('anilist') ? 'active' : ''}`} title={hasSource('anilist') ? 'AniList source available' : 'AniList not linked'}><i></i><b>AniList</b></span>
                <span className={`source-node source-mal ${hasSource('mal') ? 'active' : ''}`} title={hasSource('mal') ? 'MAL source available' : 'MAL not linked'}><i></i><b>MAL</b></span>
              </div>
            </section>

            <dl className="facts">
              {a.format && (
                <>
                  <dt>Format</dt><dd>{a.format}</dd>
                </>
              )}
              {a.season_year && (
                <>
                  <dt>Season</dt><dd>{a.season} {a.season_year}</dd>
                </>
              )}
              {a.episode_count && (
                <>
                  <dt>Episodes</dt><dd>{a.episode_count}</dd>
                </>
              )}
              {a.duration_minutes && (
                <>
                  <dt>Duration</dt><dd>{a.duration_minutes} min</dd>
                </>
              )}
              {a.status && (
                <>
                  <dt>Status</dt><dd>{a.status}</dd>
                </>
              )}
              {a.start_date && (
                <>
                  <dt>Aired</dt><dd>{a.start_date}{a.end_date ? ` → ${a.end_date}` : ''}</dd>
                </>
              )}
              {a.is_adult && (
                <>
                  <dt>Rating</dt><dd>Adult</dd>
                </>
              )}
            </dl>

            {(a.score_anilist || a.score_mal || a.mal_rank) && (
              <section className="score-breakdown">
                <p className="section-kicker">Scoreboard</p>
                {a.score_anilist && (
                  <div>
                    <span>AniList</span>
                    <strong>{a.score_anilist}</strong>
                  </div>
                )}
                {a.score_mal && (
                  <div>
                    <span>MAL</span>
                    <strong>{a.score_mal.toFixed(2)}</strong>
                  </div>
                )}
                {a.mal_rank && (
                  <div>
                    <span>MAL rank</span>
                    <strong>#{a.mal_rank}</strong>
                  </div>
                )}
                {a.mal_members && (
                  <div>
                    <span>MAL members</span>
                    <strong>{(a.mal_members / 1_000_000).toFixed(1)}M</strong>
                  </div>
                )}
                {a.anilist_popularity && (
                  <div>
                    <span>AniList popularity</span>
                    <strong>{a.anilist_popularity.toLocaleString()}</strong>
                  </div>
                )}
              </section>
            )}

            {(data.external.length > 0 || data.streaming.length > 0) && (
              <section className="provider-records">
                <p className="section-kicker">Identifiers</p>
                <div className="anicore-record">
                  <i className="provider-dot source-anicore"></i>
                  <div>
                    <span>AniCore</span>
                    <strong>{a.id}</strong>
                  </div>
                  <button type="button" className="copy-id" aria-label={`Copy AniCore ID ${a.id}`}>Copy</button>
                </div>
                {data.external.map((e, i) => {
                  const name = (e.name || '').toLowerCase();
                  const cls = name.includes('mal') ? 'source-mal' : name.includes('anilist') ? 'source-anilist' : name.includes('kitsu') ? 'source-kitsu' : name.includes('tvdb') ? 'source-tvdb' : name.includes('tmdb') ? 'source-tmdb' : name.includes('imdb') ? 'source-imdb' : 'source-anicore';
                  return (
                    <a key={i} href={e.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                      <i className={`provider-dot ${cls}`}></i>
                      <div>
                        <span>{e.name}</span>
                        <strong>{e.url.split('/').filter(Boolean).pop() || e.url}</strong>
                      </div>
                    </a>
                  );
                })}
              </section>
            )}

            {data.streaming.length > 0 && (
              <section className="streaming-links">
                <p className="section-kicker">Available on</p>
                {data.streaming.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                    <span>{s.name}</span>
                    {s.quality && <small>{s.quality}</small>}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                ))}
              </section>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
