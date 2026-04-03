use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use crate::config::McpServerConfig;
use crate::tools::{AppState, EmbedArgs, SearchArgs, embed_text, search_logs};

#[derive(Debug, Deserialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,
    #[serde(default)]
    pub id: Option<Value>,
    pub method: String,
    #[serde(default)]
    pub params: Value,
}

#[derive(Debug, Serialize)]
pub struct JsonRpcResponse {
    pub jsonrpc: &'static str,
    pub id: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<JsonRpcError>,
}

#[derive(Debug, Serialize)]
pub struct JsonRpcError {
    pub code: i64,
    pub message: String,
}

pub struct McpServer {
    config: McpServerConfig,
    state: AppState,
}

impl McpServer {
    pub fn new(config: McpServerConfig, state: AppState) -> Self {
        Self { config, state }
    }

    pub fn config(&self) -> &McpServerConfig {
        &self.config
    }

    /// Parse a raw JSON-RPC line/body and return a JSON-RPC response.
    /// This is transport-agnostic and can be used by stdio and HTTP adapters.
    pub async fn handle_jsonrpc_text(&self, input: &str) -> JsonRpcResponse {
        match serde_json::from_str::<JsonRpcRequest>(input) {
            Ok(req) => self.handle_request(req).await,
            Err(err) => JsonRpcResponse {
                jsonrpc: "2.0",
                id: Value::Null,
                result: None,
                error: Some(JsonRpcError {
                    code: -32700,
                    message: format!("Parse error: {err}"),
                }),
            },
        }
    }

    pub async fn handle_request(&self, req: JsonRpcRequest) -> JsonRpcResponse {
        let id = req.id.unwrap_or(Value::Null);

        if req.jsonrpc != "2.0" {
            return JsonRpcResponse {
                jsonrpc: "2.0",
                id,
                result: None,
                error: Some(JsonRpcError {
                    code: -32600,
                    message: "Invalid Request: jsonrpc must be \"2.0\"".to_string(),
                }),
            };
        }

        let result = match req.method.as_str() {
            "initialize" => Ok(self.handle_initialize()),
            "tools/list" => Ok(self.handle_tools_list()),
            "tools/call" => self.handle_tools_call(req.params).await,
            _ => Err(anyhow!("Method not found: {}", req.method)),
        };

        match result {
            Ok(value) => JsonRpcResponse {
                jsonrpc: "2.0",
                id,
                result: Some(value),
                error: None,
            },
            Err(err) => {
                let (code, message) = map_error_to_jsonrpc(err);
                JsonRpcResponse {
                    jsonrpc: "2.0",
                    id,
                    result: None,
                    error: Some(JsonRpcError { code, message }),
                }
            }
        }
    }

    fn handle_initialize(&self) -> Value {
        json!({
            "protocolVersion": "2024-11-05",
            "serverInfo": {
                "name": self.config.server_name,
                "version": self.config.server_version
            },
            "capabilities": {
                "tools": {}
            }
        })
    }

    fn handle_tools_list(&self) -> Value {
        json!({
            "tools": [
                {
                    "name": "embed_text",
                    "description": "Generate embedding vector for input text.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "text": { "type": "string" }
                        },
                        "required": ["text"],
                        "additionalProperties": false
                    }
                },
                {
                    "name": "search_logs",
                    "description": "Semantic search on indexed logs stored in zerch_data.bin.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": { "type": "string" },
                            "top_k": { "type": "integer", "minimum": 1, "default": 5 }
                        },
                        "required": ["query"],
                        "additionalProperties": false
                    }
                }
            ]
        })
    }

    async fn handle_tools_call(&self, params: Value) -> Result<Value> {
        let name = params
            .get("name")
            .and_then(Value::as_str)
            .ok_or_else(|| anyhow!("Invalid params: missing tools/call 'name'"))?;

        let arguments = params
            .get("arguments")
            .cloned()
            .unwrap_or_else(|| json!({}));

        match name {
            "embed_text" => {
                let args: EmbedArgs = serde_json::from_value(arguments)
                    .map_err(|e| anyhow!("Invalid params for embed_text: {e}"))?;
                let output = embed_text(&self.state, args).await?;
                Ok(json!({
                    "content": [{
                        "type": "text",
                        "text": serde_json::to_string(&output)?
                    }]
                }))
            }
            "search_logs" => {
                let args: SearchArgs = serde_json::from_value(arguments)
                    .map_err(|e| anyhow!("Invalid params for search_logs: {e}"))?;
                let output = search_logs(&self.state, args).await?;
                Ok(json!({
                    "content": [{
                        "type": "text",
                        "text": serde_json::to_string_pretty(&output)?
                    }]
                }))
            }
            _ => Err(anyhow!("Unknown tool: {name}")),
        }
    }
}

fn map_error_to_jsonrpc(err: anyhow::Error) -> (i64, String) {
    let msg = err.to_string();

    if msg.starts_with("Method not found:") {
        (-32601, msg)
    } else if msg.starts_with("Invalid params:") || msg.starts_with("Invalid params for ") {
        (-32602, msg)
    } else {
        (-32603, msg)
    }
}
