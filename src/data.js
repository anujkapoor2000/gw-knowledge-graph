// ─── GW AMS Knowledge Graph Data ────────────────────────────────────────────
// To add a new node: add an entry to NODES
// To add a new relationship: add an entry to EDGES
// Node types: module | incident | pattern | integration | runbook

export const NODES = [
  // ── GW Modules ──────────────────────────────────────────────────────────
  {
    id: 'PC', label: 'PolicyCenter', type: 'module',
    desc: 'Core policy lifecycle: new business, endorsements, renewals, cancellations. Handles 35% of all L2 ticket volume.',
    tags: ['policycenter', 'policy', 'renewal', 'endorsement'],
  },
  {
    id: 'BC', label: 'BillingCenter', type: 'module',
    desc: 'Billing, invoicing, payments and collections. Accounts for 25% of L2 ticket volume.',
    tags: ['billingcenter', 'billing', 'invoice', 'payment'],
  },
  {
    id: 'CC', label: 'ClaimCenter', type: 'module',
    desc: 'Claims intake (FNOL), adjuster assignment, reserving and payments. 30% of L2 ticket volume.',
    tags: ['claimcenter', 'claim', 'fnol', 'adjuster'],
  },

  // ── Resolved Incidents ──────────────────────────────────────────────────
  {
    id: 'T1', label: 'INC-4821: N+1 Query Fix', type: 'incident',
    desc: 'PolicyCenter: Query.make() was called inside a for-loop in PolicyValidationPlugin. Fixed by extracting the batch query outside the loop. DB load reduced 80%.',
    tags: ['n+1', 'query', 'query.make', 'performance', 'policycenter', 'loop'],
    resolved: true,
  },
  {
    id: 'T2', label: 'INC-4822: ACH Gateway Timeout', type: 'incident',
    desc: 'BillingCenter ACH gateway timing out at 30s. Fixed by setting client timeout to 25s and adding exponential backoff retry (3 attempts).',
    tags: ['ach', 'gateway', 'timeout', 'payment', 'billingcenter', 'retry'],
    resolved: true,
  },
  {
    id: 'T3', label: 'INC-4823: FNOL Stuck Workflow', type: 'incident',
    desc: 'ClaimCenter FNOL auto-assignment stuck in WorkflowEngine. Fixed by calling workflow.reset() on the locked state. Root cause: orphaned transaction after DB restart.',
    tags: ['fnol', 'workflow', 'stuck', 'claimcenter', 'assignment'],
    resolved: true,
  },
  {
    id: 'T4', label: 'INC-4824: Rating Engine Slow', type: 'incident',
    desc: 'HO-3 rating engine timing out on high-exposure properties. Workaround: increase thread pool size. Permanent fix scheduled for next release.',
    tags: ['rating', 'slow', 'timeout', 'policycenter', 'ho3'],
    resolved: false,
  },
  {
    id: 'T5', label: 'INC-4825: Duplicate Charge', type: 'incident',
    desc: 'BillingCenter double-charging when user clicks Pay twice. Fixed by adding an idempotency key on payment submission and disabling the button post-click.',
    tags: ['duplicate', 'charge', 'payment', 'billingcenter', 'idempotent'],
    resolved: true,
  },

  // ── Gosu Patterns ───────────────────────────────────────────────────────
  {
    id: 'P1', label: 'Pattern: Query.make in Loop', type: 'pattern',
    desc: 'ANTI-PATTERN: Calling Query.make() inside a for-loop causes one DB round-trip per iteration. Always extract and batch the query outside the loop. Most common Gosu performance issue.',
    tags: ['n+1', 'query', 'query.make', 'performance', 'gosu', 'loop'],
  },
  {
    id: 'P2', label: 'Pattern: Workflow Reset', type: 'pattern',
    desc: 'RESOLUTION: Use workflow.reset() for stuck WorkflowEngine states. Never update workflow_state directly in DB — always use the GW API to maintain audit trail.',
    tags: ['workflow', 'reset', 'stuck', 'gosu'],
  },
  {
    id: 'P3', label: 'Pattern: Retry with Backoff', type: 'pattern',
    desc: 'PATTERN: All external gateway calls must use RetryHandler with exponential backoff. Max 3 retries. Circuit breaker trips after 5 failures in 60 seconds.',
    tags: ['retry', 'backoff', 'gateway', 'integration', 'gosu'],
  },
  {
    id: 'P4', label: 'Pattern: Idempotency Key', type: 'pattern',
    desc: 'PATTERN: Payment submissions must include an idempotency key (UUID per user action) to prevent duplicate charges on retry or double-submit.',
    tags: ['idempotent', 'payment', 'duplicate', 'gosu'],
  },

  // ── Integrations ────────────────────────────────────────────────────────
  {
    id: 'I1', label: 'Integration: ACH Gateway v1.2', type: 'integration',
    desc: 'ACH direct debit gateway v1.2 API. Client timeout: 25s. Known issue: returns HTTP 200 on some failures — always validate response body. Monitor /health endpoint.',
    tags: ['ach', 'gateway', 'payment', 'integration', 'api'],
  },
  {
    id: 'I2', label: 'Integration: ISO ClaimSearch v14.2', type: 'integration',
    desc: 'ISO ClaimSearch v14.2. Q2 breaking change: ClaimRefType is now mandatory on FNOL submission. All FNOL intake screens must be updated to include this field.',
    tags: ['iso', 'claimsearch', 'fnol', 'integration', 'api', 'v14'],
  },

  // ── Runbooks ────────────────────────────────────────────────────────────
  {
    id: 'R1', label: 'Runbook: Rating Slowdown', type: 'runbook',
    desc: 'Step 1: Check rating job queue depth in GW Admin. Step 2: Restart rating worker. Step 3: Clear rating cache via Admin > Cache Management. Step 4: Escalate to L3 if unresolved in 15 min.',
    tags: ['rating', 'slow', 'runbook', 'cache', 'policycenter'],
  },
  {
    id: 'R2', label: 'Runbook: ACH Failure', type: 'runbook',
    desc: 'Step 1: Check ACH gateway status page. Step 2: Retry manually in BillingCenter Payments. Step 3: Enable manual payment fallback if gateway is down. Step 4: Log affected invoices for batch retry.',
    tags: ['ach', 'gateway', 'runbook', 'payment', 'billingcenter'],
  },
];

export const EDGES = [
  // Incidents resolved in modules
  { from: 'T1', to: 'PC', label: 'resolved in'  },
  { from: 'T4', to: 'PC', label: 'impacts'       },
  { from: 'T2', to: 'BC', label: 'resolved in'  },
  { from: 'T5', to: 'BC', label: 'resolved in'  },
  { from: 'T3', to: 'CC', label: 'resolved in'  },
  // Incidents fixed using patterns
  { from: 'T1', to: 'P1', label: 'fixed using'  },
  { from: 'T2', to: 'P3', label: 'fixed using'  },
  { from: 'T3', to: 'P2', label: 'fixed using'  },
  { from: 'T5', to: 'P4', label: 'fixed using'  },
  // Incidents involving integrations
  { from: 'T2', to: 'I1', label: 'involves'     },
  { from: 'T3', to: 'I2', label: 'involves'     },
  // Patterns apply to modules
  { from: 'P1', to: 'PC', label: 'applies to'   },
  { from: 'P2', to: 'CC', label: 'applies to'   },
  { from: 'P3', to: 'BC', label: 'applies to'   },
  // Integrations used by modules
  { from: 'I1', to: 'BC', label: 'used by'      },
  { from: 'I2', to: 'CC', label: 'used by'      },
  // Incidents reference runbooks
  { from: 'T4', to: 'R1', label: 'see runbook'  },
  { from: 'T2', to: 'R2', label: 'see runbook'  },
];

// ── Theme colours per node type ──────────────────────────────────────────────
export const TYPE_THEME = {
  module:      { bg: '#EBF2FF', border: '#0067B1', text: '#003087',  badge: 'MODULE'      },
  incident:    { bg: '#E3FCEF', border: '#00875A', text: '#00875A',  badge: 'INCIDENT'    },
  pattern:     { bg: '#E8EDF8', border: '#003087', text: '#003087',  badge: 'PATTERN'     },
  integration: { bg: '#E6F7F7', border: '#00A896', text: '#00A896',  badge: 'INTEGRATION' },
  runbook:     { bg: '#FDECEA', border: '#E4002B', text: '#E4002B',  badge: 'RUNBOOK'     },
};

export const TYPE_LABELS = {
  module: 'GW Module', incident: 'Incident', pattern: 'Gosu Pattern',
  integration: 'Integration', runbook: 'Runbook',
};

// ── Keyword search index ─────────────────────────────────────────────────────
export function searchNodes(query) {
  if (!query || !query.trim()) return new Set();
  const key = query.toLowerCase().trim();
  const found = new Set();
  NODES.forEach(function(n) {
    const inLabel = n.label.toLowerCase().indexOf(key) !== -1;
    const inDesc  = n.desc.toLowerCase().indexOf(key) !== -1;
    const inTags  = n.tags && n.tags.some(function(t) {
      return t.indexOf(key) !== -1 || key.indexOf(t) !== -1;
    });
    if (inLabel || inDesc || inTags) found.add(n.id);
  });
  return found;
}

export function getConnections(nodeId) {
  return EDGES
    .filter(function(e) { return e.from === nodeId || e.to === nodeId; })
    .map(function(e) {
      const otherId = e.from === nodeId ? e.to : e.from;
      return {
        edge:   e,
        other:  NODES.find(function(n) { return n.id === otherId; }),
        isOut:  e.from === nodeId,
      };
    });
}
