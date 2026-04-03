#[derive(Debug, Clone, PartialEq, Eq)]
pub enum McpTransport {
    /// Use stdin/stdout JSON-RPC transport.
    Stdio,
    /// Serve MCP over HTTP.
    Http,
}

#[derive(Debug, Clone)]
pub struct HttpConfig {
    /// Bind address for the HTTP server.
    pub host: String,
    /// Bind port for the HTTP server.
    pub port: u16,
    /// MCP endpoint path (e.g. "/mcp").
    pub mcp_path: String,
}

#[derive(Debug, Clone)]
pub struct McpServerConfig {
    pub server_name: String,
    pub server_version: String,
    pub store_path: String,
    pub transport: McpTransport,
    pub http: HttpConfig,
}

impl McpServerConfig {
    pub fn from_env() -> Self {
        let transport = parse_transport(
            std::env::var("ZERCH_MCP_TRANSPORT")
                .unwrap_or_else(|_| "stdio".to_string())
                .as_str(),
        );

        let host = std::env::var("ZERCH_MCP_HTTP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
        let port = std::env::var("ZERCH_MCP_HTTP_PORT")
            .ok()
            .and_then(|v| v.parse::<u16>().ok())
            .unwrap_or(8787);

        let mcp_path = normalize_http_path(
            &std::env::var("ZERCH_MCP_HTTP_PATH").unwrap_or_else(|_| "/mcp".to_string()),
        );

        Self {
            server_name: std::env::var("ZERCH_MCP_NAME")
                .unwrap_or_else(|_| "zerch-mcp-server".to_string()),
            server_version: std::env::var("ZERCH_MCP_VERSION")
                .unwrap_or_else(|_| env!("CARGO_PKG_VERSION").to_string()),
            store_path: std::env::var("ZERCH_STORE_PATH")
                .unwrap_or_else(|_| "zerch_data.bin".to_string()),
            transport,
            http: HttpConfig {
                host,
                port,
                mcp_path,
            },
        }
    }

    pub fn http_bind_addr(&self) -> String {
        format!("{}:{}", self.http.host, self.http.port)
    }
}

fn parse_transport(raw: &str) -> McpTransport {
    match raw.trim().to_ascii_lowercase().as_str() {
        "http" => McpTransport::Http,
        _ => McpTransport::Stdio,
    }
}

fn normalize_http_path(path: &str) -> String {
    let trimmed = path.trim();
    if trimmed.is_empty() {
        return "/mcp".to_string();
    }
    if trimmed.starts_with('/') {
        trimmed.to_string()
    } else {
        format!("/{trimmed}")
    }
}
