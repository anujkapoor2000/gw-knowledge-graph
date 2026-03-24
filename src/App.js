import React, { useState } from 'react';
import { NODES, EDGES, TYPE_THEME, TYPE_LABELS, searchNodes, getConnections } from './data';

// ─── Colours ─────────────────────────────────────────────────────────────────
var BLUE   = '#003087';
var LBLUE  = '#0067B1';
var RED    = '#E4002B';
var WHITE  = '#FFFFFF';
var G100   = '#F0F2F5';
var G200   = '#E2E6EC';
var G400   = '#9AAABF';
var G600   = '#5A6A82';
var G800   = '#2C3A4F';
var GREEN  = '#00875A';
var AMBER  = '#FF8B00';
var PURPLE = '#6554C0';

var QUICK_QUERIES = ['n+1', 'ach', 'fnol', 'timeout', 'workflow', 'rating', 'duplicate', 'retry'];

// ─── NodeCard ─────────────────────────────────────────────────────────────────
function NodeCard(props) {
  var node       = props.node;
  var isSelected = props.isSelected;
  var onSelect   = props.onSelect;
  var theme      = TYPE_THEME[node.type] || TYPE_THEME.module;
  var conns      = getConnections(node.id);

  return (
    <div
      onClick={function() { onSelect(node); }}
      style={{
        background:  isSelected ? theme.bg : WHITE,
        border:      '2px solid ' + (isSelected ? theme.border : G200),
        borderRadius: 10,
        padding:     '12px 13px',
        cursor:      'pointer',
        boxShadow:   isSelected ? '0 2px 12px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition:  'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: theme.text,
          background: theme.bg, border: '1px solid ' + theme.border,
          borderRadius: 10, padding: '1px 7px',
        }}>
          {node.type === 'module' ? node.label.toUpperCase() : node.id}
        </span>
        <span style={{ fontSize: 9, color: G400 }}>{conns.length} links</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: G800, lineHeight: 1.4, marginBottom: 5 }}>
        {node.label}
      </div>
      <div style={{
        fontSize: 10, color: G600, lineHeight: 1.5,
        overflow: 'hidden', maxHeight: 32,
      }}>
        {node.desc.length > 100 ? node.desc.slice(0, 100) + '...' : node.desc}
      </div>
      {node.resolved === false && (
        <div style={{ marginTop: 5, fontSize: 9, fontWeight: 700, color: AMBER }}>
          OPEN - Workaround active
        </div>
      )}
    </div>
  );
}

// ─── DetailPanel ─────────────────────────────────────────────────────────────
function DetailPanel(props) {
  var selected = props.selected;
  var onSelect = props.onSelect;
  var onClear  = props.onClear;

  if (!selected) {
    return (
      <div style={{ paddingTop: 60, textAlign: 'center', opacity: 0.4 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128202;</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: G800 }}>Click any node</div>
        <div style={{ fontSize: 11, color: G600, marginTop: 6, lineHeight: 1.7 }}>
          Select a node to explore its institutional knowledge and all connected relationships.
        </div>
      </div>
    );
  }

  var theme   = TYPE_THEME[selected.type] || TYPE_THEME.module;
  var conns   = getConnections(selected.id);

  var insightText = '';
  if (selected.type === 'incident')    insightText = 'Resolution captured. Next similar incident will auto-suggest this fix. Estimated MTTR reduction: 60%. Linked pattern prevents recurrence.';
  if (selected.type === 'pattern')     insightText = 'Pattern embedded in AI Ops triage. New incidents matching this pattern surface the fix immediately. Prevents repeat issues.';
  if (selected.type === 'integration') insightText = 'Integration behaviour documented. All related incidents visible. Engineers see full history and known issues on first triage.';
  if (selected.type === 'runbook')     insightText = 'Runbook auto-surfaced when matching keywords detected in a new incident. Reduces lookup time from 20 min to under 30 seconds.';
  if (selected.type === 'module')      insightText = conns.length + ' connected knowledge nodes form the institutional memory for this module. New L2 engineers onboard 60% faster.';

  return (
    <div>
      {/* Node card */}
      <div style={{
        background: theme.bg, border: '2px solid ' + theme.border,
        borderRadius: 12, padding: 14, marginBottom: 14,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: theme.text,
          background: WHITE, border: '1px solid ' + theme.border,
          borderRadius: 10, padding: '1px 8px', display: 'inline-block', marginBottom: 7,
        }}>
          {TYPE_LABELS[selected.type]}
        </span>
        <div style={{ fontSize: 14, fontWeight: 700, color: G800, marginBottom: 8, lineHeight: 1.4 }}>
          {selected.label}
        </div>
        <div style={{ fontSize: 11, color: G600, lineHeight: 1.75 }}>
          {selected.desc}
        </div>
        {selected.resolved === false && (
          <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: AMBER,
            background: '#FFF8EC', border: '1px solid ' + AMBER, borderRadius: 6, padding: '4px 8px' }}>
            Status: OPEN - Workaround active, permanent fix pending
          </div>
        )}
      </div>

      {/* Connections */}
      {conns.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G400, letterSpacing: 2, marginBottom: 8 }}>
            CONNECTIONS ({conns.length})
          </div>
          {conns.map(function(conn, i) {
            var oCfg = TYPE_THEME[conn.other ? conn.other.type : 'module'];
            return (
              <div
                key={i}
                onClick={function() { onSelect(conn.other); }}
                style={{
                  padding: '9px 11px', borderRadius: 8,
                  border: '1px solid ' + G200, background: G100,
                  marginBottom: 6, cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 9, color: G400, marginBottom: 3 }}>
                  {conn.isOut ? ('--[' + conn.edge.label + ']-->') : ('<--[' + conn.edge.label + ']--')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: oCfg ? oCfg.border : G400, flexShrink: 0,
                  }}/>
                  <div style={{ fontSize: 11, fontWeight: 600, color: G800 }}>
                    {conn.other ? conn.other.label : ''}
                  </div>
                </div>
                <div style={{ fontSize: 9, color: G400, marginTop: 2 }}>
                  {conn.other ? TYPE_LABELS[conn.other.type] : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insight */}
      <div style={{
        background: '#EBF2FF', borderRadius: 10,
        border: '1px solid ' + LBLUE, padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, marginBottom: 5 }}>
          KNOWLEDGE GRAPH INSIGHT
        </div>
        <div style={{ fontSize: 11, color: G600, lineHeight: 1.75 }}>{insightText}</div>
      </div>

      <button
        onClick={onClear}
        style={{
          width: '100%', padding: 8, background: G100, border: '1px solid ' + G200,
          borderRadius: 8, fontSize: 11, color: G600, cursor: 'pointer', fontWeight: 500,
        }}
      >
        Clear selection
      </button>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  var [selected,   setSelected]   = useState(null);
  var [query,      setQuery]      = useState('');
  var [hits,       setHits]       = useState(new Set());
  var [filterType, setFilterType] = useState('all');

  function handleSearch(val) {
    setQuery(val);
    setHits(searchNodes(val));
  }

  function handleSelect(node) {
    if (!node) return;
    setSelected(selected && selected.id === node.id ? null : node);
  }

  function handleQuick(q) {
    setQuery(q);
    setHits(searchNodes(q));
    setSelected(null);
  }

  function handleClear() {
    setQuery('');
    setHits(new Set());
    setFilterType('all');
    setSelected(null);
  }

  var visibleNodes = NODES.filter(function(n) {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (hits.size > 0 && !hits.has(n.id)) return false;
    return true;
  });

  var nodeTypes = ['module', 'incident', 'pattern', 'integration', 'runbook'];
  var stats = {
    nodes:     NODES.length,
    links:     EDGES.length,
    incidents: NODES.filter(function(n) { return n.type === 'incident'; }).length,
    patterns:  NODES.filter(function(n) { return n.type === 'pattern'; }).length,
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: G100, minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <header style={{
        background: WHITE, borderBottom: '3px solid ' + BLUE,
        padding: '10px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
      }}>
        {/* NTT Data Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: 'Arial Black, Arial', fontWeight: 900, fontSize: 20, color: BLUE }}>NTT</span>
              <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 16, color: BLUE }}>DATA</span>
            </div>
            <div style={{ height: 2, background: RED, marginTop: 2, borderRadius: 1 }}/>
          </div>
          <div style={{ width: 1, height: 30, background: G200 }}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>GW AMS Knowledge Graph</div>
            <div style={{ fontSize: 10, color: G600 }}>Institutional Memory — Incidents, Patterns, Runbooks, Integrations</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 22 }}>
          {[
            { v: stats.nodes,     l: 'Nodes',     c: BLUE   },
            { v: stats.links,     l: 'Links',     c: PURPLE },
            { v: stats.incidents, l: 'Incidents', c: GREEN  },
            { v: stats.patterns,  l: 'Patterns',  c: AMBER  },
          ].map(function(s) {
            return (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: G400, textTransform: 'uppercase', letterSpacing: 1 }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left sidebar */}
        <aside style={{
          width: 256, background: WHITE, borderRight: '1px solid ' + G200,
          overflowY: 'auto', padding: '14px 12px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>

          {/* Search */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G400, letterSpacing: 2, marginBottom: 6 }}>
              SEARCH KNOWLEDGE
            </div>
            <input
              value={query}
              onChange={function(e) { handleSearch(e.target.value); }}
              placeholder="n+1, ach, fnol, timeout..."
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 8,
                border: '1.5px solid ' + (query ? BLUE : G200),
                fontSize: 12, color: G800, outline: 'none', boxSizing: 'border-box',
              }}
            />
            {hits.size > 0 && (
              <div style={{ marginTop: 4, fontSize: 11, color: BLUE, fontWeight: 600 }}>
                {hits.size} nodes matched
              </div>
            )}
          </div>

          {/* Quick queries */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G400, letterSpacing: 2, marginBottom: 6 }}>
              QUICK QUERIES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {QUICK_QUERIES.map(function(q) {
                return (
                  <button
                    key={q}
                    onClick={function() { handleQuick(q); }}
                    style={{
                      padding: '3px 9px', background: G100, border: '1px solid ' + G200,
                      borderRadius: 12, fontSize: 10, color: BLUE, cursor: 'pointer', fontWeight: 500,
                    }}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter by type */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G400, letterSpacing: 2, marginBottom: 6 }}>
              FILTER BY TYPE
            </div>
            {['all'].concat(nodeTypes).map(function(t) {
              var isActive = filterType === t;
              var theme    = TYPE_THEME[t] || {};
              var count    = t === 'all' ? NODES.length : NODES.filter(function(n) { return n.type === t; }).length;
              return (
                <div
                  key={t}
                  onClick={function() { setFilterType(t); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 6, cursor: 'pointer', marginBottom: 3,
                    background: isActive ? (theme.bg || G100) : 'transparent',
                    border: '1px solid ' + (isActive ? (theme.border || BLUE) : 'transparent'),
                  }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: theme.border || BLUE, flexShrink: 0,
                  }}/>
                  <span style={{
                    fontSize: 11, fontWeight: isActive ? 700 : 400,
                    color: isActive ? (theme.text || BLUE) : G600,
                  }}>
                    {t === 'all' ? 'All Types' : TYPE_LABELS[t]}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: G400 }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Edge legend */}
          <div style={{ background: G100, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: G400, letterSpacing: 2, marginBottom: 8 }}>
              RELATIONSHIPS
            </div>
            {['resolved in', 'fixed using', 'applies to', 'used by', 'involves', 'see runbook'].map(function(rel) {
              return (
                <div key={rel} style={{ fontSize: 10, color: G600, marginBottom: 3 }}>
                  <span style={{ color: G400 }}>&#8594;</span> {rel}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main grid */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>

          {/* Filter banner */}
          {(hits.size > 0 || filterType !== 'all') && (
            <div style={{
              marginBottom: 12, padding: '8px 12px',
              background: '#EBF2FF', border: '1px solid ' + LBLUE,
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 11, color: BLUE, fontWeight: 600 }}>
                {hits.size > 0
                  ? hits.size + ' nodes matching "' + query + '"'
                  : TYPE_LABELS[filterType] + ' filter active'}
              </span>
              <button
                onClick={handleClear}
                style={{
                  marginLeft: 'auto', fontSize: 10, color: BLUE, background: 'transparent',
                  border: '1px solid ' + BLUE, borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Node groups */}
          {nodeTypes.map(function(type) {
            var typeNodes = visibleNodes.filter(function(n) { return n.type === type; });
            if (typeNodes.length === 0) return null;
            var theme = TYPE_THEME[type];
            return (
              <div key={type} style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: theme.text,
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.border }}/>
                  {TYPE_LABELS[type].toUpperCase()}
                  <span style={{ fontWeight: 400, color: G400 }}>({typeNodes.length})</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 8,
                }}>
                  {typeNodes.map(function(node) {
                    return (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selected && selected.id === node.id}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {visibleNodes.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 60, color: G400 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>&#128202;</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No nodes match your search</div>
              <button
                onClick={handleClear}
                style={{
                  marginTop: 10, padding: '6px 14px', background: BLUE,
                  border: 'none', borderRadius: 6, color: WHITE, cursor: 'pointer', fontSize: 12,
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </main>

        {/* Right detail panel */}
        <aside style={{
          width: 290, background: WHITE, borderLeft: '1px solid ' + G200,
          overflowY: 'auto', padding: '16px 14px', flexShrink: 0,
        }}>
          <DetailPanel
            selected={selected}
            onSelect={handleSelect}
            onClear={function() { setSelected(null); }}
          />
        </aside>
      </div>

      {/* Footer */}
      <footer style={{
        background: WHITE, borderTop: '1px solid ' + G200,
        padding: '6px 24px', display: 'flex', alignItems: 'center',
        gap: 10, flexWrap: 'wrap', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }}/>
          <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>Live</span>
        </div>
        {['16 Nodes', '18 Links', 'Gosu Patterns', 'Runbooks', 'Neo4j (Prod)', 'Pinecone RAG (Prod)'].map(function(t) {
          return (
            <span key={t} style={{
              fontSize: 9, color: G600, border: '1px solid ' + G200,
              padding: '2px 7px', borderRadius: 3, background: G100,
            }}>
              {t}
            </span>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: G400 }}>
          NTT DATA — GW AMS Knowledge Graph 2025
        </span>
      </footer>

    </div>
  );
}
