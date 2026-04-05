import { useNavigate } from '../hooks/useNavigate.js';
import './McpPage.css';

function McpPage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('zerch_user') || 'Admin';

  return (
    <div className="mcp-container">
      {/* Navigation */}
      <nav className="mcp-nav">
        <button
          className="nav-brand"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <h1>Zerch</h1>
          <span className="nav-tagline">Vector Search Engine</span>
        </button>
        <div className="nav-links">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#tech" className="nav-link">Technology</a>
          <button onClick={() => navigate('/live-logs')} className="nav-link nav-button">Live Logs</button>
          <button onClick={() => navigate('/mcp')} className="nav-link nav-button nav-button-active">MCP</button>
          <div className="user-menu">
            <span className="user-email">{userEmail}</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mcp-hero">
        <div className="mcp-hero-badge">Model Context Protocol</div>
        <h2 className="mcp-hero-title">Zerch MCP Server</h2>
        <p className="mcp-hero-subtitle">
          Connect any AI agent to your log search engine. Zerch exposes semantic
          vector search as MCP tools — letting autonomous agents query, analyze,
          and reason over your logs in real time.
        </p>
        <div className="mcp-hero-actions">
          <button onClick={() => navigate('/zerch')} className="mcp-cta-primary">Open Dashboard</button>
          <a href="#quickstart" className="mcp-cta-secondary">Quick Start ↓</a>
        </div>
        <div className="mcp-hero-stats">
          <div className="mcp-stat">
            <span className="mcp-stat-value">3</span>
            <span className="mcp-stat-label">MCP Tools</span>
          </div>
          <div className="mcp-stat">
            <span className="mcp-stat-value">384</span>
            <span className="mcp-stat-label">Vector Dims</span>
          </div>
          <div className="mcp-stat">
            <span className="mcp-stat-value">&lt;1ms</span>
            <span className="mcp-stat-label">Search Latency</span>
          </div>
        </div>
      </section>

      {/* What is MCP */}
      <section className="mcp-section" id="what-is-mcp">
        <h3 className="mcp-section-title">What is MCP?</h3>
        <p className="mcp-section-desc">
          Model Context Protocol (MCP) is an open standard introduced by Anthropic that lets AI agents connect to external tools and data sources using a universal interface. Any MCP-compatible agent can discover and call Zerch's search tools — no custom integration needed.
        </p>
        <div className="mcp-arch-diagram">
          <div className="mcp-arch-node mcp-arch-agent">
            <span className="mcp-arch-icon">🤖</span>
            <span className="mcp-arch-label">AI Agent</span>
            <span className="mcp-arch-sub">(OpenClaw / Hermes)</span>
          </div>
          <div className="mcp-arch-arrow">
            <span className="mcp-arch-arrow-line"></span>
            <span className="mcp-arch-arrow-label">MCP Protocol</span>
          </div>
          <div className="mcp-arch-node mcp-arch-server">
            <span className="mcp-arch-icon">⚡</span>
            <span className="mcp-arch-label">Zerch MCP Server</span>
            <span className="mcp-arch-sub">localhost:8080</span>
          </div>
          <div className="mcp-arch-arrow">
            <span className="mcp-arch-arrow-line"></span>
            <span className="mcp-arch-arrow-label">Vector Search</span>
          </div>
          <div className="mcp-arch-node mcp-arch-store">
            <span className="mcp-arch-icon">🗄️</span>
            <span className="mcp-arch-label">Log Vector Store</span>
            <span className="mcp-arch-sub">zerch_data.bin</span>
          </div>
        </div>
      </section>

      {/* Available Tools */}
      <section className="mcp-section mcp-section-alt" id="tools">
        <h3 className="mcp-section-title">Available MCP Tools</h3>
        <p className="mcp-section-desc">
          Zerch exposes the following tools to any connected MCP client. Agents
          discover these automatically at session start.
        </p>
        <div className="mcp-tools-grid">
          <div className="mcp-tool-card">
            <div className="mcp-tool-header">
              <span className="mcp-tool-icon">🔍</span>
              <code className="mcp-tool-name">search_logs</code>
              <span className="mcp-tool-badge">Core</span>
            </div>
            <p className="mcp-tool-desc">
              Perform semantic vector search over indexed log entries. Returns top-N most similar logs with cosine similarity scores.
            </p>
            <div className="mcp-tool-params">
              <div className="mcp-param"><code>query</code><span>string — natural language search text</span></div>
              <div className="mcp-param"><code>limit</code><span>number — max results (default: 5)</span></div>
            </div>
          </div>
          <div className="mcp-tool-card">
            <div className="mcp-tool-header">
              <span className="mcp-tool-icon">📤</span>
              <code className="mcp-tool-name">upload_logs</code>
              <span className="mcp-tool-badge">Ingest</span>
            </div>
            <p className="mcp-tool-desc">
              Index a log file into the vector store. Each line is embedded with all-MiniLM-L6-v2 and stored for future semantic search.
            </p>
            <div className="mcp-tool-params">
              <div className="mcp-param"><code>file_path</code><span>string — path to the .log / .txt file</span></div>
            </div>
          </div>
          <div className="mcp-tool-card">
            <div className="mcp-tool-header">
              <span className="mcp-tool-icon">🧠</span>
              <code className="mcp-tool-name">summarize_log</code>
              <span className="mcp-tool-badge">AI</span>
            </div>
            <p className="mcp-tool-desc">
              Generate an AI-powered summary of a log entry or search result using the Groq LLM API. Returns root cause analysis and suggested fixes.
            </p>
            <div className="mcp-tool-params">
              <div className="mcp-param"><code>text</code><span>string — log text to summarize</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mcp-section" id="quickstart">
        <h3 className="mcp-section-title">Quick Start — Any MCP Client</h3>
        <p className="mcp-section-desc">
          Zerch's API server doubles as an MCP server. Start it and point any MCP-compatible client at it in under a minute.
        </p>
        <div className="mcp-steps">
          <div className="mcp-step">
            <div className="mcp-step-num">1</div>
            <div className="mcp-step-content">
              <h4>Start the Zerch server</h4>
              <p>Run the Rust API server. It starts on port 8080 and is ready for MCP connections.</p>
              <div className="mcp-code-block">
                <div className="mcp-code-header"><span className="mcp-code-lang">bash</span></div>
                <pre><code>{`# From the project root
cargo run -p zerch-api

# ✓ Zerch API listening on http://127.0.0.1:8080
# ✓ Embedding model loaded (all-MiniLM-L6-v2)
# ✓ MCP endpoint ready at /mcp`}</code></pre>
              </div>
            </div>
          </div>

          <div className="mcp-step">
            <div className="mcp-step-num">2</div>
            <div className="mcp-step-content">
              <h4>Add Zerch to your MCP client config</h4>
              <p>Most MCP clients use a JSON config file. Add the Zerch server entry:</p>
              <div className="mcp-code-block">
                <div className="mcp-code-header"><span className="mcp-code-lang">json — mcp.config.json</span></div>
                <pre><code>{`{
  "mcpServers": {
    "zerch": {
      "url": "http://localhost:8080/mcp",
      "name": "Zerch Log Search",
      "description": "Semantic vector search over indexed logs"
    }
  }
}`}</code></pre>
              </div>
            </div>
          </div>

          <div className="mcp-step">
            <div className="mcp-step-num">3</div>
            <div className="mcp-step-content">
              <h4>Your agent discovers the tools</h4>
              <p>On first connection, the agent receives the tool manifest and can immediately call <code>search_logs</code>, <code>upload_logs</code>, and <code>summarize_log</code>.</p>
              <div className="mcp-code-block">
                <div className="mcp-code-header"><span className="mcp-code-lang">Agent tool call example</span></div>
                <pre><code>{`// Agent automatically calls:
{
  "tool": "search_logs",
  "arguments": {
    "query": "authentication failed database connection",
    "limit": 10
  }
}

// Zerch returns:
{
  "results": [
    {
      "text": "[ERROR] auth-service: DB connection timeout...",
      "score": 0.94,
      "level": "error",
      "service": "auth-service"
    }
    // ...
  ]
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OpenClaw Section */}
      <section className="mcp-section mcp-section-alt mcp-agent-section" id="openclaw">
        <div className="mcp-agent-header">
          <div className="mcp-agent-logo openclaw-logo">
            <span className="mcp-agent-logo-emoji">🦞</span>
            <div className="mcp-agent-logo-text">
              <span className="mcp-agent-logo-name">OpenClaw</span>
              <span className="mcp-agent-logo-tagline">Personal AI Agent</span>
            </div>
          </div>
          <div className="mcp-agent-info">
            <span className="mcp-agent-badge mcp-badge-openclaw">Self-Hosted · Open Source · MCP Native</span>
            <h3 className="mcp-agent-title">OpenClaw + Zerch: Log Intelligence on Autopilot</h3>
            <p className="mcp-agent-desc">
              OpenClaw is a free, open-source personal AI assistant you run on your own hardware. With native MCP support, connecting it to Zerch takes a single command — giving your agent permanent access to semantic log search as a first-class tool.
            </p>
          </div>
        </div>

        <div className="mcp-agent-body">
          <div className="mcp-loop-diagram">
            <h4 className="mcp-loop-title">The Agent Loop</h4>
            <div className="mcp-loop-steps">
              <div className="mcp-loop-step">
                <div className="mcp-loop-icon">💬</div>
                <div className="mcp-loop-text">
                  <strong>User Prompt</strong>
                  <span>"Find all DB errors from last night"</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-agent">
                <div className="mcp-loop-icon">🦞</div>
                <div className="mcp-loop-text">
                  <strong>OpenClaw Plans</strong>
                  <span>Decides to call <code>search_logs</code> tool</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-tool">
                <div className="mcp-loop-icon">⚡</div>
                <div className="mcp-loop-text">
                  <strong>Zerch MCP Tool</strong>
                  <span>Returns top-10 similar log entries</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step">
                <div className="mcp-loop-icon">🧠</div>
                <div className="mcp-loop-text">
                  <strong>Agent Analyzes</strong>
                  <span>Calls <code>summarize_log</code> on results</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-done">
                <div className="mcp-loop-icon">✅</div>
                <div className="mcp-loop-text">
                  <strong>Delivers Report</strong>
                  <span>Root cause + fix suggestions via Telegram/Discord</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mcp-agent-setup">
            <h4>Setup in 2 Commands</h4>
            <div className="mcp-code-block">
              <div className="mcp-code-header"><span className="mcp-code-lang">bash</span></div>
              <pre><code>{`# 1. Install OpenClaw (macOS example)
brew install openclaw

# 2. Connect Zerch MCP server
openclaw mcp add zerch --url http://localhost:8080/mcp

# ✓ Server registered: zerch
# ✓ Tools discovered: search_logs, upload_logs, summarize_log`}</code></pre>
            </div>

            <div className="mcp-code-block" style={{marginTop: '16px'}}>
              <div className="mcp-code-header"><span className="mcp-code-lang">bash — Now ask your agent anything</span></div>
              <pre><code>{`# Via terminal
openclaw chat "Search for authentication errors and summarize them"

# Via Telegram (if configured)
# Just message your bot:
# "Show me all critical errors from the payment service"

# OpenClaw will autonomously:
# 1. Call search_logs("payment service critical error", limit=20)
# 2. Call summarize_log() on each result
# 3. Compile and send you a structured incident report`}</code></pre>
            </div>

            <div className="mcp-code-block" style={{marginTop: '16px'}}>
              <div className="mcp-code-header"><span className="mcp-code-lang">json — ~/.openclaw/config.json</span></div>
              <pre><code>{`{
  "mcpServers": {
    "zerch": {
      "url": "http://localhost:8080/mcp",
      "name": "Zerch Log Search",
      "autoConnect": true
    }
  },
  "agent": {
    "loop": {
      "maxIterations": 10,
      "onToolResult": "continue"
    }
  }
}`}</code></pre>
            </div>
          </div>
        </div>

        <div className="mcp-agent-tip">
          <span className="mcp-tip-icon">💡</span>
          <span><strong>Pro tip:</strong> OpenClaw runs 24/7 on a $6/month VPS. Set up a cron skill to automatically scan your logs every hour and alert you on Telegram only when errors exceed a threshold — fully autonomous, zero babysitting.</span>
        </div>
      </section>

      {/* Hermes Agent Section */}
      <section className="mcp-section mcp-agent-section" id="hermes">
        <div className="mcp-agent-header">
          <div className="mcp-agent-logo hermes-logo">
            <span className="mcp-agent-logo-emoji">☤</span>
            <div className="mcp-agent-logo-text">
              <span className="mcp-agent-logo-name">Hermes Agent</span>
              <span className="mcp-agent-logo-tagline">by NousResearch</span>
            </div>
          </div>
          <div className="mcp-agent-info">
            <span className="mcp-agent-badge mcp-badge-hermes">Self-Improving · Persistent Memory · MCP Ready</span>
            <h3 className="mcp-agent-title">Hermes Agent + Zerch: An Agent That Gets Smarter Over Time</h3>
            <p className="mcp-agent-desc">
              Hermes Agent (by NousResearch) is an open-source AI agent with a built-in learning loop — it creates reusable skills from experience and maintains persistent memory across sessions. Paired with Zerch, it doesn't just search your logs once; it learns your infrastructure patterns and gets faster at diagnosing incidents every run.
            </p>
          </div>
        </div>

        <div className="mcp-agent-body">
          <div className="mcp-loop-diagram mcp-loop-hermes">
            <h4 className="mcp-loop-title">The Self-Improving Agent Loop</h4>
            <div className="mcp-loop-steps">
              <div className="mcp-loop-step">
                <div className="mcp-loop-icon">📝</div>
                <div className="mcp-loop-text">
                  <strong>Task Received</strong>
                  <span>"Diagnose why the API is slow"</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-hermes">
                <div className="mcp-loop-icon">☤</div>
                <div className="mcp-loop-text">
                  <strong>Hermes Loads Skills</strong>
                  <span>Checks MEMORY.md for past incidents</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-tool">
                <div className="mcp-loop-icon">⚡</div>
                <div className="mcp-loop-text">
                  <strong>Calls Zerch MCP</strong>
                  <span><code>search_logs("API latency timeout slow response")</code></span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-tool">
                <div className="mcp-loop-icon">🔄</div>
                <div className="mcp-loop-text">
                  <strong>Iterates &amp; Refines</strong>
                  <span>Searches related patterns, correlates timestamps</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-hermes">
                <div className="mcp-loop-icon">🧠</div>
                <div className="mcp-loop-text">
                  <strong>Saves New Skill</strong>
                  <span>Stores "API_latency_diagnosis" for future runs</span>
                </div>
              </div>
              <div className="mcp-loop-connector">↓</div>
              <div className="mcp-loop-step mcp-loop-step-done">
                <div className="mcp-loop-icon">✅</div>
                <div className="mcp-loop-text">
                  <strong>Root Cause Found</strong>
                  <span>Report with fix + skill saved for next time</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mcp-agent-setup">
            <h4>Setup with Hermes Agent</h4>
            <div className="mcp-code-block">
              <div className="mcp-code-header"><span className="mcp-code-lang">bash — Install Hermes Agent</span></div>
              <pre><code>{`# Install via pip
pip install hermes-agent

# Or run from source (NousResearch)
git clone https://github.com/NousResearch/hermes-agent
cd hermes-agent
pip install -e .`}</code></pre>
            </div>

            <div className="mcp-code-block" style={{marginTop: '16px'}}>
              <div className="mcp-code-header"><span className="mcp-code-lang">json — hermes.config.json</span></div>
              <pre><code>{`{
  "mcp_servers": [
    {
      "name": "zerch-logs",
      "url": "http://localhost:8080/mcp",
      "description": "Zerch semantic log search engine",
      "tools": ["search_logs", "upload_logs", "summarize_log"]
    }
  ],
  "memory": {
    "enabled": true,
    "persist_skills": true
  },
  "model": {
    "provider": "anthropic",
    "name": "claude-sonnet-4-5"
  }
}`}</code></pre>
            </div>

            <div className="mcp-code-block" style={{marginTop: '16px'}}>
              <div className="mcp-code-header"><span className="mcp-code-lang">python — Run Hermes with Zerch as a tool</span></div>
              <pre><code>{`from hermes_agent import Agent, MCPToolset

# Initialize Hermes with Zerch MCP
zerch_tools = MCPToolset(url="http://localhost:8080/mcp")
agent = Agent(tools=[zerch_tools])

# Agent runs autonomously in a loop
# Hermes will call search_logs, summarize_log
# and save learned patterns as reusable skills
result = agent.run(
    task="Find all errors from the past hour and identify the root cause",
    max_iterations=15,
    save_skill=True  # Learn from this session
)

print(result.summary)
# → "3 critical errors found in auth-service.
#    Root cause: Redis connection pool exhausted.
#    Skill 'redis_pool_diagnosis' saved for future runs."`}</code></pre>
            </div>
          </div>
        </div>

        <div className="mcp-agent-tip mcp-tip-hermes">
          <span className="mcp-tip-icon">🧠</span>
          <span><strong>What makes this powerful:</strong> After the first diagnosis, Hermes saves a "skill" — a structured procedure for log analysis. Every subsequent run uses that skill, making the agent progressively faster and more accurate at spotting your specific infrastructure patterns.</span>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mcp-section mcp-section-alt" id="comparison">
        <h3 className="mcp-section-title">OpenClaw vs Hermes Agent</h3>
        <p className="mcp-section-desc">Both work great with Zerch MCP. Here's when to use each:</p>
        <div className="mcp-comparison-table">
          <div className="mcp-table-header">
            <div className="mcp-table-col mcp-table-feature">Feature</div>
            <div className="mcp-table-col mcp-table-openclaw">🦞 OpenClaw</div>
            <div className="mcp-table-col mcp-table-hermes">☤ Hermes Agent</div>
          </div>
          {[
            ['Best for', 'Daily log monitoring & alerts', 'Deep incident diagnosis'],
            ['Learning', 'Session-based skills (5,400+ built-in)', 'Persistent self-improving skills'],
            ['Memory', 'MEMORY.md + SQLite history', 'Cross-session user model'],
            ['Interfaces', 'Telegram, Discord, WhatsApp, CLI', 'CLI, API, any LLM provider'],
            ['MCP support', '✅ Native', '✅ Native'],
            ['Self-hosted', '✅ Yes', '✅ Yes'],
            ['Cost', '$0–20/mo (VPS optional)', '$0 (OSS + your LLM API)'],
          ].map(([feature, oc, hermes]) => (
            <div className="mcp-table-row" key={feature}>
              <div className="mcp-table-col mcp-table-feature">{feature}</div>
              <div className="mcp-table-col mcp-table-openclaw">{oc}</div>
              <div className="mcp-table-col mcp-table-hermes">{hermes}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mcp-cta-section">
        <h3>Ready to give your AI agent a brain for logs?</h3>
        <p>Start the Zerch server, connect your agent, and let it search your infrastructure automatically.</p>
        <div className="mcp-cta-buttons">
          <button onClick={() => navigate('/zerch')} className="mcp-cta-primary">Open Dashboard</button>
          <a href="#quickstart" className="mcp-cta-secondary">View Quick Start</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mcp-footer">
        <p>&copy; 2026 Zerch - Vector Search Engine in Rust</p>
        <div className="footer-links">
          <button onClick={() => navigate('/')} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontWeight:600}}>Home</button>
          <button onClick={() => navigate('/live-logs')} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontWeight:600}}>Live Logs</button>
        </div>
      </footer>
    </div>
  );
}

export default McpPage;
