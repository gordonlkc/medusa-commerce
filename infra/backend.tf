# OpenTofu state stored in Supabase Postgres via the pg backend.
#
# Before running tofu init, create the state table in your Supabase state DB:
#
#   CREATE SCHEMA IF NOT EXISTS tofu_state;
#   CREATE TABLE tofu_state.state (
#     id         SERIAL PRIMARY KEY,
#     path       TEXT    NOT NULL,
#     version    INTEGER NOT NULL,
#     serial     INTEGER NOT NULL,
#     lineage    TEXT    NOT NULL,
#     state      JSONB   NOT NULL,
#     created_at TIMESTAMPTZ DEFAULT NOW(),
#     updated_at TIMESTAMPTZ DEFAULT NOW()
#   );
#   CREATE UNIQUE INDEX idx_tofu_state_path ON tofu_state.state(path);

terraform {
  backend "pg" {
    conn_str    = var.supabase_state_conn_str
    schema_name = "tofu_state"
  }
}
