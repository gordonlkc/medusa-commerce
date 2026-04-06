# Medusa Commerce

Headless commerce stack: MedusaJS v2 + Next.js 15 storefront, deployed on Google Cloud Run with OpenTofu infrastructure and GitHub Actions CI/CD.

## Architecture

```
Cloudflare (CDN, SSL, DDoS)
    ↓
Google Cloud Run (australia-southeast1)
    ├── Nginx (port 8080) — reverse proxy
    │   ├── /store/*, /admin/*, /auth/*, /health, /hooks/* → Medusa (port 9000)
    │   └── /* → Next.js storefront (port 8000)
    ├── MedusaJS 2.13.5 — headless commerce API
    └── Next.js 15.5.14 — storefront
    ↓
Supabase Postgres — application database
```

## Local Development

### Prerequisites

- Docker + Docker Compose
- Node.js 22+ (for local submodule work)

### Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/gordonlkc/medusa-commerce.git
cd medusa-commerce

# Start the full stack (Postgres + Medusa + Next.js + Nginx)
docker compose up -d

# Wait ~2 minutes for migrations and startup
docker compose ps
```

### Endpoints

| Service | URL | Notes |
|---|---|---|
| Storefront | http://localhost:8080 | Redirects to `/au` (region routing) |
| Medusa API | http://localhost:9000 | Direct access |
| Medusa Health | http://localhost:8080/health | Returns 200 |
| Next.js | http://localhost:8000 | Direct access |
| Postgres | localhost:5432 | User: `postgres`, Pass: `postgres` |

### Admin Credentials

- Email: `admin@avereagesoydev.com`
- Password: `admin123456`

### Useful Commands

```bash
# View logs
docker compose logs -f app

# Run health check
docker compose exec app /usr/local/bin/health-check.sh

# Stop and clean up
docker compose down -v

# Rebuild image
docker compose build --no-cache
```

## Project Structure

```
├── apps/
│   ├── backend/           # MedusaJS v2 (git submodule)
│   └── storefront/        # Next.js 15 (git submodule)
├── docker/
│   ├── Dockerfile         # Multi-stage build (Node 22)
│   ├── nginx.conf         # Reverse proxy routing
│   ├── supervisord.conf   # Process manager (medusa, nextjs, nginx)
│   ├── health-check.sh    # Dual health check script
│   └── start.sh           # Medusa startup with migrations
├── infra/
│   ├── providers.tf       # GCP providers
│   ├── backend.tf         # OpenTofu pg backend (Supabase)
│   ├── variables.tf       # Input variables
│   ├── main.tf            # Cloud Run, Artifact Registry, IAM
│   └── outputs.tf         # Output values
├── .github/workflows/
│   └── deploy.yml         # CI/CD pipeline
├── docker-compose.yml     # Local dev stack
└── .dockerignore
```

## Deployment

### GitHub Configuration

#### Secrets (Settings → Secrets and variables → Actions → Secrets)

| Name | Value |
|---|---|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT` | `github-ci-cd@medusa-commerce.iam.gserviceaccount.com` |
| `DATABASE_URL` | Supabase Postgres connection string for Medusa |
| `SUPABASE_STATE_CONN_STR` | Supabase Postgres connection string for OpenTofu state |
| `JWT_SECRET` | `openssl rand -base64 32` |
| `COOKIE_SECRET` | `openssl rand -base64 32` |
| `CLIENT_ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `STRIPE_API_KEY` | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` |

#### Variables (Settings → Secrets and variables → Actions → Variables)

| Name | Value |
|---|---|
| `GCP_PROJECT_ID` | `medusa-commerce` |
| `GCP_REGION` | `australia-southeast1` |
| `DOMAIN_NAME` | `avereagesoydev.com` |

### GCP One-Time Setup

#### 1. Enable APIs

```bash
gcloud services enable artifactregistry.googleapis.com run.googleapis.com iam.googleapis.com cloudbuild.googleapis.com --project=medusa-commerce
```

#### 2. Create Workload Identity Federation

```bash
PROJECT_NUMBER=$(gcloud projects describe medusa-commerce --format="value(projectNumber)")

# Create pool
gcloud iam workload-identity-pools create "github-pool" \
  --project="medusa-commerce" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="medusa-commerce" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create CI/CD service account
gcloud iam service-accounts create "github-ci-cd" \
  --project="medusa-commerce" \
  --display-name="GitHub Actions CI/CD"

# Grant permissions
gcloud projects add-iam-policy-binding medusa-commerce \
  --member="serviceAccount:github-ci-cd@medusa-commerce.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding medusa-commerce \
  --member="serviceAccount:github-ci-cd@medusa-commerce.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding medusa-commerce \
  --member="serviceAccount:github-ci-cd@medusa-commerce.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Link pool to service account
gcloud iam service-accounts add-iam-policy-binding \
  "github-ci-cd@medusa-commerce.iam.gserviceaccount.com" \
  --project="medusa-commerce" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/gordonlkc/medusa-commerce"
```

#### 3. Create Supabase State DB Schema

Run in your state Supabase SQL editor:

```sql
CREATE SCHEMA IF NOT EXISTS tofu_state;
CREATE TABLE tofu_state.state (
  id         SERIAL PRIMARY KEY,
  path       TEXT    NOT NULL,
  version    INTEGER NOT NULL,
  serial     INTEGER NOT NULL,
  lineage    TEXT    NOT NULL,
  state      JSONB   NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_tofu_state_path ON tofu_state.state(path);
```

### Deploy

Push to `main` to trigger the pipeline:

```
Build Docker → Push to Artifact Registry → tofu init/plan/apply → Deploy to Cloud Run
```

Or trigger manually from GitHub Actions → "Build & Deploy to Cloud Run" → Run workflow.

## Cloudflare Setup

1. Add `avereagesoydev.com` to Cloudflare
2. Create CNAME records pointing to the Cloud Run URL (from `tofu output cloud_run_uri`):

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `@` | `<cloud-run-url>.a.run.app` | Proxied |
| CNAME | `www` | `<cloud-run-url>.a.run.app` | Proxied |

3. Set SSL/TLS mode to **Full (strict)**
4. Configure cache rules for static assets and API responses

## Tech Stack

| Component | Version |
|---|---|
| Node.js | 22 |
| MedusaJS | 2.13.5 |
| Next.js | 15.5.14 |
| Postgres | 15 |
| Nginx | 1.28 |
| OpenTofu | 1.8.x |
| Region | australia-southeast1 (Sydney) |
