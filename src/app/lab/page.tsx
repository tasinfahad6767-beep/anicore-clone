'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Send, Copy, Check, ChevronDown, Terminal } from 'lucide-react';

interface Endpoint {
  method: string;
  path: string;
  name: string;
  desc: string;
  params?: Array<{ name: string; type: string; required?: boolean; desc: string }>;
}

interface Group {
  name: string;
  blurb: string;
  endpoints: Endpoint[];
}

const GROUPS: Group[] = [
  {
    name: 'Discovery',
    blurb: 'Browse and filter the whole index. These are the endpoints a client home page is built from.',
    endpoints: [
      { method: 'GET', path: '/api/anime?sort=trending&perPage=5', name: 'Filter the catalog', desc: 'Paginated list with sort, genre, year, format, status filters. 14 parameters.', params: [
        { name: 'sort', type: 'string', desc: 'trending|popular|score|newest|az|quality' },
        { name: 'page', type: 'number', desc: 'Page number (1-based)' },
        { name: 'perPage', type: 'number', desc: 'Items per page (1-100)' },
        { name: 'genre', type: 'string', desc: 'Genre name filter' },
        { name: 'year', type: 'number', desc: 'Exact season year' },
        { name: 'yearFrom', type: 'number', desc: 'Year >= filter' },
        { name: 'format', type: 'string', desc: 'TV|MOVIE|OVA|ONA|SPECIAL' },
        { name: 'status', type: 'string', desc: 'RELEASING|FINISHED|NOT_YET_RELEASED' },
        { name: 'q', type: 'string', desc: 'Title search query' },
      ]},
      { method: 'GET', path: '/api/search?q=frieren&limit=5', name: 'Quick search', desc: 'Full-text search across title, English title, and native name.', params: [
        { name: 'q', type: 'string', required: true, desc: 'Search query' },
        { name: 'limit', type: 'number', desc: 'Max results (default 20)' },
      ]},
      { method: 'GET', path: '/api/airing', name: 'Airing now', desc: 'Currently releasing series, sorted by popularity.' },
      { method: 'GET', path: '/api/season', name: 'Season list', desc: 'Current season\'s top anime + airing + upcoming.' },
      { method: 'GET', path: '/api/home', name: 'Home bundle', desc: 'Everything the home page needs in one call: trending, popular, top rated, newest, airing, upcoming, stats, genres.' },
      { method: 'GET', path: '/api/random', name: 'Random pick', desc: 'One random anime from the index. Weighted toward highly-rated.' },
    ],
  },
  {
    name: 'A single title',
    blurb: 'Every endpoint returns the same canonical record shape. Drill into episodes, relations, recommendations, and more.',
    endpoints: [
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'By slug', desc: 'Full record: anime + episodes + characters + streaming + external + recommendations + relations.' },
      { method: 'GET', path: '/api/id/7442', name: 'By core ID', desc: 'Same full record, looked up by AniCore ID.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Episode guide', desc: 'All episodes for this title, ordered by number. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Relations', desc: 'Sequels, prequels, side stories, OVAs. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Recommendations', desc: 'Community-driven recommendations. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Streaming links', desc: 'Where to watch. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'External links', desc: 'AniList, MAL, Kitsu, TVDB, TMDB, IMDb. Included in the full record.' },
    ],
  },
  {
    name: 'Media and people',
    blurb: 'Artwork, trailers, characters, and staff records attached to each title.',
    endpoints: [
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Characters', desc: 'Full cast with role (MAIN/SUPPORTING), image, description, favorites. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Artwork', desc: 'Poster, banner, cover, logo URLs from 5 providers. Included in the full record.' },
      { method: 'GET', path: '/api/anime/attack-on-titan', name: 'Trailers', desc: 'YouTube trailer ID and URL. Included in the full record.' },
    ],
  },
  {
    name: 'Identity and taxonomy',
    blurb: 'Look up anime by provider ID, or browse the genre/format taxonomy.',
    endpoints: [
      { method: 'GET', path: '/api/genres', name: 'Genres', desc: 'All distinct genres in the index.' },
      { method: 'GET', path: '/api/filters', name: 'Filters', desc: 'All distinct years + formats for building filter UIs.' },
      { method: 'GET', path: '/api/stats', name: 'Stats', desc: 'Catalog stats + genre distribution + year histogram + format breakdown.' },
    ],
  },
  {
    name: 'Service',
    blurb: 'Health and metadata endpoints for the API itself.',
    endpoints: [
      { method: 'GET', path: '/api/stats', name: 'Service stats', desc: 'Database stats: anime count, episode count, character count, airing count.' },
      { method: 'GET', path: '/api/home', name: 'Service health', desc: 'If this returns 200, the database is connected and responsive.' },
    ],
  },
];

const REFERENCES: Array<{ group: string; items: Array<{ label: string; path: string }> }> = [
  {
    group: 'Discovery',
    items: [
      { label: 'Filter the catalog', path: '/api/anime?sort=trending&perPage=5' },
      { label: 'Quick search', path: '/api/search?q=frieren&limit=5' },
      { label: 'Airing now', path: '/api/airing' },
      { label: 'Season list', path: '/api/season' },
      { label: 'Home bundle', path: '/api/home' },
      { label: 'Random pick', path: '/api/random' },
    ],
  },
  {
    group: 'A single title',
    items: [
      { label: 'By slug', path: '/api/anime/attack-on-titan' },
      { label: 'By core ID', path: '/api/id/7442' },
      { label: 'Episode guide', path: '/api/anime/attack-on-titan' },
      { label: 'Relations', path: '/api/anime/attack-on-titan' },
      { label: 'Recommendations', path: '/api/anime/attack-on-titan' },
      { label: 'Streaming links', path: '/api/anime/attack-on-titan' },
      { label: 'External links', path: '/api/anime/attack-on-titan' },
    ],
  },
  {
    group: 'Media and people',
    items: [
      { label: 'Characters', path: '/api/anime/attack-on-titan' },
      { label: 'Artwork', path: '/api/anime/attack-on-titan' },
      { label: 'Trailers', path: '/api/anime/attack-on-titan' },
    ],
  },
  {
    group: 'Identity and taxonomy',
    items: [
      { label: 'Genres', path: '/api/genres' },
      { label: 'Filters', path: '/api/filters' },
      { label: 'Stats', path: '/api/stats' },
    ],
  },
  {
    group: 'Service',
    items: [
      { label: 'Service stats', path: '/api/stats' },
      { label: 'Service health', path: '/api/home' },
    ],
  },
];

const TOTAL_ENDPOINTS = GROUPS.reduce((sum, g) => sum + g.endpoints.length, 0);

export default function LabPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(GROUPS[0].endpoints[0]);
  const [path, setPath] = useState(GROUPS[0].endpoints[0].path);
  const [response, setResponse] = useState<string>('// Choose an endpoint from the sidebar.\n// Or type a path above and press Send.\n// The response from the live catalog will appear here.');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showParams, setShowParams] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab] = useState<'rest' | 'graphql'>('rest');
  const outputRef = useRef<HTMLPreElement>(null);

  const selectEndpoint = (ep: Endpoint) => {
    setActiveEndpoint(ep);
    setPath(ep.path);
    setShowParams(false);
    setResponse(`// Ready. Click "Send request" to execute.\n// ${ep.name}\n// ${ep.path}`);
    setStatus('idle');
  };

  const sendRequest = async () => {
    setStatus('loading');
    setResponse('// Loading…');
    const startTime = performance.now();
    try {
      const cleanPath = path.replace(/^\/api/, '').replace(/^\//, '');
      const res = await fetch(`/api/${cleanPath.replace(/^v1\//, '')}`);
      const elapsed = Math.round(performance.now() - startTime);
      if (!res.ok) {
        setStatus('error');
        setResponse(`// Error ${res.status} ${res.statusText}\n// ${await res.text()}`);
        return;
      }
      const data = await res.json();
      setStatus('success');
      const json = JSON.stringify(data, null, 2);
      setResponse(`// 200 OK · ${elapsed}ms · ${JSON.stringify(data).length} bytes\n\n${json}`);
    } catch (e: any) {
      setStatus('error');
      setResponse(`// Request failed: ${e.message}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequest();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleGroup = (i: number) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://169.58.120.196:3100';

  return (
    <div className="inner-page api-lab-page">
      {/* Hero */}
      <section className="page-hero lab-hero">
        <div>
          <p className="section-kicker">First-party developer workspace</p>
          <h1>Build with the <em>index.</em></h1>
          <p>Direct, read-only access to the AniCore unified catalog. {TOTAL_ENDPOINTS} endpoints across 5 groups. JSON, no auth, no rate limits. Send live requests and inspect responses in your browser.</p>
        </div>
        <div className="lab-endpoint-card">
          <span style={{ fontFamily: 'var(--utility)', fontSize: 9, color: 'var(--mint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
          <strong style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'white', display: 'block', marginTop: 6 }}>{TOTAL_ENDPOINTS} endpoints</strong>
          <small style={{ fontFamily: 'var(--utility)', fontSize: 10, color: '#abb3c7', display: 'block', marginTop: 4 }}>REST · JSON · No auth</small>
        </div>
      </section>

      {/* Dashboard */}
      <section className="api-dashboard" aria-label="API overview">
        <div><p className="section-kicker">Surface</p><strong>REST</strong></div>
        <div><p className="section-kicker">Format</p><strong>JSON</strong></div>
        <div><p className="section-kicker">Auth</p><strong>None</strong></div>
        <div><p className="section-kicker">Rate limit</p><strong>None</strong></div>
      </section>

      {/* Routes */}
      <section className="api-routes" aria-labelledby="api-routes-title">
        <div className="api-routes-intro">
          <p className="section-kicker">Endpoint surface</p>
          <h2 id="api-routes-title">Five groups, one record.</h2>
          <p>Every endpoint returns the same canonical record shape, just sliced differently. Click a group below to expand its endpoints.</p>
        </div>
        <div className="api-routes-grid">
          {GROUPS.map((g, i) => (
            <button key={i} onClick={() => {
              setOpenGroups(new Set([i]));
              selectEndpoint(g.endpoints[0]);
              document.querySelector('.api-workbench')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span className="tag-rest">REST</span>
              <strong>{g.name}</strong>
              <small>{g.endpoints.length} endpoints · {g.blurb.slice(0, 60)}…</small>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive workbench */}
      <section className="api-workbench">
        <div className="lab-tabs" role="tablist">
          <button className={activeTab === 'rest' ? 'active' : ''} onClick={() => setActiveTab('rest')}>REST</button>
          <button className={activeTab === 'graphql' ? 'active' : ''} onClick={() => setActiveTab('graphql')}>GraphQL</button>
          <div className="lab-status">
            <i className={status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'loading' ? 'loading' : ''}></i>
            <b>{status === 'success' ? '200 OK' : status === 'error' ? 'Error' : status === 'loading' ? 'Loading' : 'Ready'}</b>
          </div>
        </div>

        {activeTab === 'rest' ? (
          <div className="rest-workspace">
            {/* Endpoint library sidebar */}
            <aside className="endpoint-library">
              {GROUPS.map((g, gi) => (
                <div key={gi} className="endpoint-group">
                  <button type="button" className={`endpoint-group-head ${openGroups.has(gi) ? 'open' : ''}`} aria-expanded={openGroups.has(gi)}
                    onClick={() => toggleGroup(gi)}>
                    <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.has(gi) ? '' : '-rotate-90'}`} />
                    <strong>{g.name}</strong>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--utility)', fontSize: 9, color: '#868ea6' }}>{g.endpoints.length}</span>
                  </button>
                  {openGroups.has(gi) && (
                    <>
                      <p className="endpoint-group-blurb">{g.blurb}</p>
                      {g.endpoints.map((ep, ei) => (
                        <button key={ei} type="button"
                          className={`endpoint-item ${activeEndpoint === ep ? 'active' : ''}`}
                          onClick={() => selectEndpoint(ep)}>
                          <span>{ep.method}</span>
                          <div>
                            <strong>{ep.name}</strong>
                            <small>{ep.path.split('?')[0]}</small>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </aside>

            {/* Request workspace */}
            <div className="request-workspace">
              <form className="request-bar" onSubmit={handleSubmit}>
                <span>GET</span>
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  aria-label="REST API path"
                  spellCheck={false}
                  placeholder="/api/anime?sort=trending&perPage=5"
                />
                <button type="submit">
                  <Send className="w-3 h-3" /> Send <b>⌘↵</b>
                </button>
              </form>

              <div className="endpoint-doc">
                <p>{activeEndpoint.desc}</p>
                {activeEndpoint.params && activeEndpoint.params.length > 0 && (
                  <>
                    <button type="button" className="param-toggle" onClick={() => setShowParams(s => !s)}>
                      {showParams ? 'Hide' : 'Show'} {activeEndpoint.params.length} parameters
                    </button>
                    {showParams && (
                      <div className="param-list">
                        {activeEndpoint.params.map(p => (
                          <div key={p.name} className="param-item">
                            <strong>{p.name}</strong>
                            <span>{p.type}{p.required ? ' · required' : ''}</span>
                            <div style={{ color: 'var(--ink-soft)', fontSize: 10, marginTop: 4 }}>{p.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Output terminal */}
              <div className="lab-output">
                <div className="lab-output-bar">
                  <span></span><span></span><span></span>
                  <small>response.json</small>
                  {status === 'success' && <span className="lab-output-status">● 200 OK</span>}
                  {status === 'error' && <span className="lab-output-status" style={{ color: 'var(--signal)' }}>● Error</span>}
                  {status === 'loading' && <span className="lab-output-status" style={{ color: 'var(--yellow)' }}>● Loading…</span>}
                </div>
                <pre ref={outputRef}>
                  {response.split('\n').map((line, i) => (
                    <div key={i} className={line.startsWith('//') ? 'placeholder' : ''}>
                      {highlightJson(line)}
                    </div>
                  ))}
                </pre>
              </div>

              {/* Code snippets */}
              <div className="snippet-row">
                <div className="copy-block">
                  <div className="copy-block-bar">
                    <span>curl</span>
                    <button type="button" onClick={() => copyToClipboard(`curl "${baseUrl}${path}"`, 'curl')}>
                      {copied === 'curl' ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <pre>curl "{baseUrl}{path}"</pre>
                </div>
                <div className="copy-block">
                  <div className="copy-block-bar">
                    <span>JavaScript</span>
                    <button type="button" onClick={() => copyToClipboard(`const response = await fetch("${baseUrl}${path}");\nconst data = await response.json();`, 'js')}>
                      {copied === 'js' ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <pre>const response = await fetch("{baseUrl}{path}");{'\n'}const data = await response.json();</pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rest-workspace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{ textAlign: 'center', color: 'var(--cream-dim)' }}>
              <Terminal className="w-12 h-12" style={{ opacity: 0.3, margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--cream)', margin: '0 0 8px' }}>GraphQL coming soon.</p>
              <p style={{ fontSize: 13, maxWidth: 400, margin: '0 auto' }}>The REST API covers all use cases for now. A GraphQL layer is planned for a future release.</p>
            </div>
          </div>
        )}
      </section>

      {/* Reference recipes */}
      <section className="api-reference" aria-labelledby="api-reference-title">
        <div className="api-reference-head">
          <p className="section-kicker">Full catalog</p>
          <h2 id="api-reference-title">Recipes.</h2>
          <p>Common patterns. Click any recipe to load it into the workbench above.</p>
        </div>

        {REFERENCES.map((ref, i) => (
          <article key={i} className="reference-group">
            <h3>{ref.group}</h3>
            {ref.items.map((item, ii) => (
              <div key={ii}>
                <strong style={{ fontFamily: 'var(--display)', fontSize: 14, color: 'var(--ink)' }}>{item.label}</strong>
                <code style={{ display: 'block', fontFamily: 'var(--utility)', fontSize: 11, color: 'var(--cobalt)', marginTop: 4, wordBreak: 'break-all' }}>{item.path}</code>
                <button type="button" className="reference-run" onClick={() => {
                  selectEndpoint({ method: 'GET', path: item.path, name: item.label, desc: '' });
                  document.querySelector('.api-workbench')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Run query <ArrowRight className="w-3 h-3 inline" />
                </button>
              </div>
            ))}
          </article>
        ))}
      </section>
    </div>
  );
}

function highlightJson(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
    return <span style={{ color: '#566082', fontStyle: 'italic' }}>{line}</span>;
  }
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;
  const regex = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(\b-?\d+\.?\d*\b)|(\btrue\b|\bfalse\b)|(\bnull\b)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) parts.push(<span key={key++} className="json-key">{match[1]}</span>);
    else if (match[2]) parts.push(<span key={key++} className="json-string">{match[2]}</span>);
    else if (match[3]) parts.push(<span key={key++} className="json-number">{match[3]}</span>);
    else if (match[4]) parts.push(<span key={key++} className="json-bool">{match[4]}</span>);
    else if (match[5]) parts.push(<span key={key++} className="json-null">{match[5]}</span>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < remaining.length) {
    parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
  }
  return parts.length ? parts : line;
}
