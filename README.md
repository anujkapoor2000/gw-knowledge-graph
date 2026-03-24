# GW AMS Knowledge Graph
### NTT DATA — Guidewire AMS Accelerator

Institutional memory for your Guidewire AMS delivery team. Connects resolved incidents, Gosu patterns, runbooks and integration documentation into a searchable, navigable knowledge graph.

---

## Quick Start (run locally in 3 minutes)

**Prerequisites:** Node.js 18+ installed ([nodejs.org](https://nodejs.org))

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
http://localhost:3000
```

---

## Deploy to Vercel (free, live URL in 5 minutes)

### Option A — GitHub + Vercel Dashboard (recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gw-knowledge-graph.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up (free)
   - Click **Add New Project**
   - Import your GitHub repository
   - Vercel auto-detects Create React App — click **Deploy**
   - Your app is live at `https://gw-knowledge-graph.vercel.app`

3. **Every `git push` auto-deploys** — no manual steps needed

### Option B — Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from this folder
vercel

# Follow the prompts — done in ~60 seconds
```

---

## Deploy to Netlify (alternative)

```bash
# Build the app
npm run build

# Drag the /build folder to app.netlify.com/drop
# Your app is live instantly
```

---

## Add Your Own Knowledge Nodes

All graph data lives in **`src/data.js`** — no backend needed.

### Add a new resolved incident:
```js
// In src/data.js, add to the NODES array:
{
  id: 'T6', label: 'INC-4826: Your Incident Title', type: 'incident',
  desc: 'Description of what happened, root cause, and how it was fixed.',
  tags: ['keyword1', 'keyword2', 'module-name'],
  resolved: true,
},
```

### Add a new relationship:
```js
// In src/data.js, add to the EDGES array:
{ from: 'T6', to: 'PC', label: 'resolved in' },
{ from: 'T6', to: 'P1', label: 'fixed using' },
```

### Node types available:
| Type | Use for |
|---|---|
| `module` | GW modules (PolicyCenter, BillingCenter, ClaimCenter) |
| `incident` | Resolved ServiceNow / JIRA tickets |
| `pattern` | Gosu coding patterns and anti-patterns |
| `integration` | Third-party integration documentation |
| `runbook` | Step-by-step resolution guides |

---

## Production Roadmap

| Phase | What to build | Tools |
|---|---|---|
| **Phase 1 (PoC — now)** | This app — static data, fully functional UI | React, Vercel |
| **Phase 2 (Alpha)** | Connect Claude API to auto-extract nodes from ServiceNow tickets | Claude Sonnet, Node.js |
| **Phase 3 (Beta)** | Neo4j graph database replacing static data.js | Neo4j Aura, GraphQL |
| **Phase 4 (Production)** | Pinecone vector embeddings for semantic search, nightly ingestion | Pinecone, cron jobs |

---

## Project Structure

```
gw-knowledge-graph/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js            # React entry point
│   ├── App.js              # Main UI component
│   └── data.js             # ALL graph data (nodes + edges) — edit this
├── package.json
└── README.md
```

---

## NTT DATA — Guidewire AMS Accelerators 2025
