'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Send, Copy, Check, ChevronDown } from 'lucide-react';

interface Endpoint {
  method: string;
  path: string;
  name: string;
  desc: string;
  params?: Array<{ name: string; type: string; required?: boolean; desc: string }>;
}

const ENDPOINTS: Endpoint[] = [
  // Catalog
  { method: 'GET', path: '/api/anime?sort=trending&perPage=5', name: 'List anime', desc: 'Main list endpoint with sort + filters', params: [
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
  { method: 'GET', path: '/api/anime/:slug', name: 'Get anime', desc: 'Single anime with episodes, characters, recs, relations' },
  { method: 'GET', path: '/api/id/:id', name: 'Get by ID', desc: 'Single anime by AniCore ID' },
  { method: 'GET', path: '/api/search?q=frieren', name: 'Search', desc: 'Title / synonym / native name search', params: [
    { name: 'q', type: 'string', required: true, desc: 'Search query' },
    { name: 'limit', type: 'number', desc: 'Max results (default 20)' },
  ]},
  { method: 'GET', path: '/api/home', name: 'Home bundle', desc: 'Trending + popular + top + newest + airing + upcoming + stats in one call' },
  { method: 'GET', path: '/api/airing', name: 'Currently airing', desc: 'Anime with status=RELEASING', params: [
    { name: 'perPage', type: 'number', desc: 'Items per page' },
  ]},
  { method: 'GET', path: '/api/season', name: 'Season', desc: 'Current season\'s top anime + airing + upcoming' },
  { method: 'GET', path: '/api/random', name: 'Random', desc: 'Random anime redirect' },

  // Stats
  { method: 'GET', path: '/api/stats', name: 'Stats', desc: 'Catalog stats + genre distribution + year histogram' },
  { method: 'GET', path: '/api/genres', name: 'Genres', desc: 'Distinct genres in the index' },
  { method: 'GET', path: '/api/filters', name: 'Filters', desc: 'Distinct years + formats for filter dropdowns' },
];

const GROUPS: Array<{ name: string; blurb: string; endpoints: Endpoint[] }> = [
  {
    name: 'Catalog',
    blurb: 'Browse and filter the whole index. These are the endpoints a client home page is built from.',
    endpoints: ENDPOINTS.slice(0, 7),
  },
  {
    name: 'Stats',
    blurb: 'Aggregate insights and filter metadata for building discovery UIs.',
    endpoints: ENDPOINTS.slice(7),
  },
];

const REFERENCES: Array<{ group: string; items: Array<{ label: string; path: string }> }> = [
  {
    group: 'Catalog',
    items: [
      { label: 'Filter the catalog', path: '/api/anime?sort=score&perPage=5' },
      { label: 'Quick search', path: '/api/search?q=frieren' },
      { label: 'Airing now', path: '/api/airing' },
      { label: 'Upcoming', path: '/api/anime?status=NOT_YET_RELEASED' },
      { label: 'Broadcast schedule', path: '/api/season' },
      { label: 'Season list', path: '/api/season' },
      { label: 'Season chart', path: '/api/stats' },
    ],
  },
  {
    group: 'Records',
    items: [
      { label: 'Full record', path: '/api/anime/attack-on-titan' },
      { label: 'By core ID', path: '/api/id/7442' },
      { label: 'Episode guide', path: '/api/anime/attack-on-titan' },
      { label: 'Statistics', path: '/api/anime/attack-on-titan' },
      { label: 'Streaming links', path: '/api/anime/attack-on-titan' },
      { label: 'External links', path: '/api/anime/attack-on-titan' },
    ],
  },
];

export default function LabPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [path, setPath] = useState(ENDPOINTS[0].path);
  const [response, setResponse] = useState<string>('// Choose an endpoint and send a request.\n// The response from the live catalog will appear here.');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showParams, setShowParams] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set([0]));
  const outputRef = useRef<HTMLPreElement>(null);

  const selectEndpoint = (ep: Endpoint) => {
    setActiveEndpoint(ep);
    setPath(ep.path);
    setShowParams(false);
    setResponse('// Ready. Click "Send request" to execute.\n// Endpoint: ' + ep.path);
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
          <p>Direct, read-only access to the AniCore unified catalog. JSON, no auth, no rate limits. Send live requests and inspect responses in your browser.</p>
        </div>
        <div className="lab-endpoint-card">
          <span style={{ fontFamily: 'var(--utility)', fontSize: 9, color: 'var(--mint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
          <strong style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'white', display: 'block', marginTop: 6 }}>{ENDPOINTS.length} endpoints</strong>
          <small style={{ fontFamily: 'var(--utility)', fontSize: 10, color: '#abb3c7', display: 'block', marginTop: 4 }}>REST · JSON · No auth</small>
        </div>
      </section>

      {/* API dashboard */}
      <section className="api-dashboard" aria-label="API overview">
        <div>
          <p className="section-kicker">Surface</p>
          <strong>REST</strong>
        </div>
        <div>
          <p className="section-kicker">Format</p>
          <strong>JSON</strong>
        </div>
        <div>
          <p className="section-kicker">Auth</p>
          <strong>None</strong>
        </div>
        <div>
          <p className="section-kicker">Rate limit</p>
          <strong>None</strong>
        </div>
      </section>

      {/* API routes */}
      <section className="api-routes" aria-labelledby="api-routes-title">
        <div className="api-routes-intro">
          <p className="section-kicker">Endpoint surface</p>
          <h2 id="api-routes-title">One record, many doors.</h2>
          <p>Every endpoint returns the same canonical record shape, just sliced differently. Pick a door below or use the workbench to send live requests.</p>
        </div>
        <div className="api-routes-grid">
          <button onClick={() => selectEndpoint(ENDPOINTS[0])}>
            <span className="tag-rest">REST</span>
            <strong>/api/anime</strong>
            <small>Paginated catalog with sort, genre, year, format, status filters.</small>
          </button>
          <button onClick={() => selectEndpoint(ENDPOINTS[1])}>
            <span className="tag-rest">REST</span>
            <strong>/api/anime/:slug</strong>
            <small>Single record with episodes, characters, recommendations, relations.</small>
          </button>
          <button onClick={() => selectEndpoint(ENDPOINTS[3])}>
            <span className="tag-rest">REST</span>
            <strong>/api/search</strong>
            <small>Full-text search across title, English title, and native name.</small>
          </button>
          <button onClick={() => selectEndpoint(ENDPOINTS[8])}>
            <span className="tag-rest">REST</span>
            <strong>/api/stats</strong>
            <small>Catalog stats, genre distribution, year histogram, format breakdown.</small>
          </button>
        </div>
      </section>

      {/* Interactive workbench */}
      <section className="api-workbench">
        <div className="lab-tabs" role="tablist">
          <button className="active">REST</button>
          <button className="">GraphQL</button>
          <div className="lab-status">
            <i className={status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'loading' ? 'loading' : ''}></i>
            <b>{status === 'success' ? '200 OK' : status === 'error' ? 'Error' : status === 'loading' ? 'Loading' : 'Ready'}</b>
          </div>
        </div>

        <div className="rest-workspace">
          {/* Endpoint library sidebar */}
          <aside className="endpoint-library">
            {GROUPS.map((g, gi) => (
              <div key={gi} className="endpoint-group">
                <button type="button" className={`endpoint-group-head ${openGroups.has(gi) ? 'open' : ''}`} aria-expanded={openGroups.has(gi)}
                  onClick={() => toggleGroup(gi)}>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.has(gi) ? '' : '-rotate-90'}`} />
                  <strong>{g.name}</strong>
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
                <Send className="w-3 h-3" /> Send request <b>⌘ ↵</b>
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

            <div className="lab-output">
              <div className="lab-output-bar">
                <span></span><span></span><span></span>
                <small>response.json</small>
                {status === 'success' && (
                  <span className="lab-output-status">● 200 OK</span>
                )}
                {status === 'error' && (
                  <span className="lab-output-status" style={{ color: 'var(--signal)' }}>● Error</span>
                )}
                {status === 'loading' && (
                  <span className="lab-output-status" style={{ color: 'var(--yellow)' }}>● Loading…</span>
                )}
              </div>
              <pre ref={outputRef}>
                {response.split('\n').map((line, i) => (
                  <div key={i} className={line.startsWith('//') ? 'placeholder' : ''}>
                    {highlightJson(line)}
                  </div>
                ))}
              </pre>
            </div>

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
                  const ep = ENDPOINTS.find(e => item.path.startsWith(e.path.split('?')[0].replace(':slug', 'attack-on-titan').replace(':id', '7442'))) || ENDPOINTS[0];
                  selectEndpoint({ ...ep, path: item.path });
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
  // Simple JSON syntax highlighter for display
  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
    return <span style={{ color: '#566082', fontStyle: 'italic' }}>{line}</span>;
  }
  // Colorize strings, numbers, booleans, null, keys
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
