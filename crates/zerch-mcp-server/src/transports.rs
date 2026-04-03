use std::sync::Arc;

use anyhow::Result;
use axum::{
    Json, Router,
    extract::State,
    http::{Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use serde_json::{Value, json};
use tokio::io::{self, AsyncBufReadExt, BufReader};

use crate::config::McpServerConfig;
use crate::server::McpServer;

/// Run MCP over stdio (JSON-RPC lines in, JSON-RPC lines out).
pub async fn run_stdio(server: Arc<McpServer>) -> Result<()> {
    eprintln!(
        "Starting {} v{} over stdio",
        server.config().server_name,
        server.config().server_version
    );

    let stdin = io::stdin();
    let mut lines = BufReader::new(stdin).lines();

    while let Some(line) = lines.next_line().await? {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        let response = server.handle_jsonrpc_text(line).await;
        println!("{}", serde_json::to_string(&response)?);
    }

    Ok(())
}

/// Run MCP over HTTP.
/// - Health: GET /healthz
/// - MCP JSON-RPC endpoint: POST {mcp_path}
pub async fn run_http(server: Arc<McpServer>) -> Result<()> {
    let cfg: &McpServerConfig = server.config();
    let bind_addr = cfg.http_bind_addr();
    let mcp_path = cfg.http.mcp_path.clone();

    eprintln!(
        "Starting {} v{} over HTTP on {}{}",
        cfg.server_name, cfg.server_version, bind_addr, mcp_path
    );

    let app = Router::new()
        .route("/healthz", get(healthz))
        .route(&mcp_path, post(mcp_http_handler).options(options_ok))
        .with_state(server);

    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn healthz() -> impl IntoResponse {
    Json(json!({
        "ok": true
    }))
}

async fn options_ok() -> impl IntoResponse {
    (
        StatusCode::NO_CONTENT,
        [
            ("access-control-allow-origin", "*"),
            ("access-control-allow-methods", "POST, OPTIONS"),
            (
                "access-control-allow-headers",
                "content-type, authorization",
            ),
        ],
    )
}

async fn mcp_http_handler(
    State(server): State<Arc<McpServer>>,
    method: Method,
    Json(body): Json<Value>,
) -> Response {
    if method != Method::POST {
        return (
            StatusCode::METHOD_NOT_ALLOWED,
            Json(json!({
                "jsonrpc": "2.0",
                "id": Value::Null,
                "error": { "code": -32600, "message": "Invalid Request: use POST" }
            })),
        )
            .into_response();
    }

    let raw = match serde_json::to_string(&body) {
        Ok(v) => v,
        Err(e) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({
                    "jsonrpc": "2.0",
                    "id": Value::Null,
                    "error": { "code": -32700, "message": format!("Parse error: {e}") }
                })),
            )
                .into_response();
        }
    };

    let response = server.handle_jsonrpc_text(&raw).await;

    (
        StatusCode::OK,
        [
            ("access-control-allow-origin", "*"),
            ("cache-control", "no-store"),
        ],
        Json(response),
    )
        .into_response()
}
