mod config;
mod server;
mod tools;
mod transports;

use std::sync::Arc;

use anyhow::Result;
use config::{McpServerConfig, McpTransport};
use server::McpServer;
use tools::AppState;
use zerch_embed::LocalEmbedder;

#[tokio::main]
async fn main() -> Result<()> {
    // Keep protocol output on stdout clean; logs go to stderr.
    tracing_subscriber::fmt()
        .with_env_filter(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "zerch_mcp_server=info".to_string()),
        )
        .with_target(false)
        .with_writer(std::io::stderr)
        .compact()
        .init();

    let config = McpServerConfig::from_env();

    eprintln!("Loading embedding model...");
    let embedder = LocalEmbedder::load()?;

    let state = AppState::new(embedder, config.store_path.clone())?;
    let server = Arc::new(McpServer::new(config.clone(), state));

    match config.transport {
        McpTransport::Stdio => transports::run_stdio(server).await,
        McpTransport::Http => transports::run_http(server).await,
    }
}
